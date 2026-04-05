import os
import subprocess
import requests
import googlemaps
import json
from flask import Flask, request, jsonify
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv
from pathlib import Path
import re

# Force IPv4 — EC2 IPv6 causes 10s+ timeouts to OpenRouter/Cloudflare
import requests.packages.urllib3.util.connection as urllib3_cn
urllib3_cn.HAS_IPV6 = False

# Load .env from same directory as this script
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

print(f"DEBUG: OpenRouter Key found: {os.getenv('OPENROUTER_KEY') is not None}")

# Define where the generated reports will be stored temporarily
DOWNLOADS_PATH = Path(__file__).parent / "downloads"
DOWNLOADS_PATH.mkdir(parents=True, exist_ok=True)
print(f"DEBUG: Downloads path set to: {DOWNLOADS_PATH}")

app = Flask(__name__)

# --- 1. CLOUD CONFIGURATION ---
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
OPENROUTER_KEY = os.getenv("OPENROUTER_KEY")

# openrouter/free auto-selects from all available free models and handles rate limits
MODEL = "qwen/qwen3.6-plus:free"

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

# Relative Path Mapping
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SKILLS_DIR = os.path.join(BASE_DIR, "skills")
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")

GEO_BOOST_SKILL_PATH = os.path.join(SKILLS_DIR, "geo_boost_engine.skill.md")
HTML_SKILL_PATH = os.path.join(SKILLS_DIR, "geo_html_schema.skill.md")

FULL_REPORT_EXE = os.path.join(SCRIPTS_DIR, "generate_html_report.py")
TEASER_REPORT_EXE = os.path.join(SCRIPTS_DIR, "generate_html_report.py")

OUTPUT_PATH = os.path.join(BASE_DIR, "output")
if not os.path.exists(OUTPUT_PATH):
    os.makedirs(OUTPUT_PATH)

# --- 2. SYSTEM PROMPT ---
SYSTEM_PROMPT = """
You are the GEO Boost Intelligence Engine. Your goal is to generate a full visibility and revenue intelligence report in RAW JSON format.

STRICT EXECUTION MODE:
1. Follow every component defined in the provided skill files step-by-step.
2. Do NOT skip any section (1-14).
3. Do NOT change section order.
4. Explicitly label all assumptions (search volume, conversion rate, ticket size, etc.).
5. Use realistic ranges, not exact numbers.
6. If data is missing, proceed with industry-based assumptions and label them clearly.
7. Keep tone sharp, direct, consultative, and revenue-focused.

OUTPUT REQUIREMENTS:
- OUTPUT ONLY RAW JSON.
- NO Markdown blocks (no ```json).
- NO introductory or concluding text.
- Match the provided Schema exactly.
"""


def get_verified_business_data(biz_name, location, category):
    """Fetches real-time business stats and competitor data via Google Maps API."""
    try:
        gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
        find_res = gmaps.find_place(input=f"{biz_name} {location}", input_type='textquery', fields=['name', 'place_id'])
        if not find_res.get('candidates'): return None, None
        
        pid = find_res['candidates'][0]['place_id']
        details = gmaps.place(place_id=pid, fields=['name', 'rating', 'user_ratings_total', 'geometry'])
        c_info = details['result']
        
        nearby = gmaps.places_nearby(location=c_info['geometry']['location'], radius=5000, keyword=category)
        comps = []
        for p in nearby.get('results', []):
            if p['place_id'] != pid and len(comps) < 3:
                comps.append(f"{p['name']}: {p.get('user_ratings_total', 0)} reviews, {p.get('rating', 0)} stars.")
        
        return {"reviews": c_info.get('user_ratings_total', 0), "rating": c_info.get('rating', 0)}, "\n".join(comps)
    except Exception as e:
        print(f"❌ Google Maps Error: {e}")
        return None, None

def send_email(to_email, file_path, biz_name, is_paid):
    """Sends the HTML report as an attachment."""
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = to_email
    type_label = "Full Intelligence" if is_paid else "Free Preview"
    msg['Subject'] = f"GEO Boost {type_label} Report: {biz_name}"
    
    body = f"Hello,\n\nAttached is your {type_label.lower()} report. Please download the file and open it in Google Chrome for the best experience."
    msg.attach(MIMEText(body, 'plain'))

    with open(file_path, "rb") as attachment:
        part = MIMEBase("text", "html")
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(file_path)}")
        msg.attach(part)

    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
    print(f"✅ {type_label} Email sent successfully to {to_email}")

def call_openrouter(prompt, timeout=300):
    """Call OpenRouter with retry across fallback models. Validates JSON response."""
    import time
    models_to_try = [MODEL] + [m for m in FALLBACK_MODELS if m != MODEL]
    last_error = None

    for model in models_to_try:
        for attempt in range(2):  # 2 attempts per model
            try:
                print(f"🤖 Attempt {attempt+1} with model: {model}")
                resp = requests.post("https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {OPENROUTER_KEY}"},
                    json={"model": model, "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ], "temperature": 0},
                    timeout=timeout)

                print(f"📡 HTTP {resp.status_code} from {model}")
                data = resp.json()

                # Rate limited — wait and retry
                if resp.status_code == 429:
                    wait = 10 * (attempt + 1)
                    print(f"⏳ Rate limited on {model}, waiting {wait}s...")
                    time.sleep(wait)
                    continue

                if 'choices' in data and data['choices'][0].get('message', {}).get('content'):
                    content = data['choices'][0]['message']['content'].strip()
                    
                    # Strip <think> tags before checking
                    clean = re.sub(r'<think>.*?</think>', '', content, flags=re.DOTALL).strip()
                    
                    # Validate response contains JSON (must have { somewhere)
                    if '{' not in clean:
                        print(f"⚠️ {model} returned text, not JSON. Preview: {clean[:200]}")
                        last_error = {"error": f"{model} returned non-JSON text"}
                        break  # this model won't produce JSON, try next
                    
                    print(f"✅ Got JSON response from {model}")
                    return data, model, None

                # Model returned but no valid choices
                last_error = data
                print(f"⚠️ No choices from {model}: {json.dumps(data, indent=2)[:300]}")
                break

            except requests.exceptions.Timeout:
                print(f"⏱️ Timeout ({timeout}s) on {model}, attempt {attempt+1}")
                last_error = {"error": f"Timeout after {timeout}s"}
            except requests.exceptions.RequestException as e:
                print(f"🌐 Network error on {model}: {e}")
                last_error = {"error": str(e)}
                break

    return None, None, last_error


def normalize_report_data(raw):
    """Map AI's nested JSON structure to the flat format the HTML generator expects.
    Handles both flat format (if AI gets it right) and nested analysis.section_N_ format."""
    
    # If data already has visibility_score at top level, it's already flat
    if "visibility_score" in raw and "reality_check" in raw:
        return raw
    
    a = raw.get("analysis", {})
    out = {}
    
    # Copy any top-level non-analysis fields
    for k, v in raw.items():
        if k != "analysis":
            out[k] = v
    
    # S1: Reality Check
    rc = a.get("section_1_reality_check", "")
    if isinstance(rc, str):
        out["reality_check"] = rc
        out["reality_check_detail"] = []
    elif isinstance(rc, dict):
        out["reality_check"] = rc.get("summary", rc.get("headline", ""))
        out["reality_check_detail"] = rc.get("details", rc.get("detail", []))
    
    # S2: Visibility Score
    s2 = a.get("section_2_visibility_score", {})
    if isinstance(s2, dict):
        out["visibility_score"] = s2.get("total_score", s2.get("score", 0))
        bd = s2.get("breakdown", {})
        out["score_breakdown"] = {
            "Google Maps Visibility": {"score": bd.get("google_maps_visibility", 0), "max": 25, "status": ""},
            "Website GEO + E-E-A-T": {"score": bd.get("website_geo_eeat", 0), "max": 25, "status": ""},
            "AI Search Visibility":  {"score": bd.get("ai_search_visibility", 0), "max": 25, "status": ""},
            "Competitive Position":  {"score": bd.get("competitive_position", 0), "max": 25, "status": ""},
        }
        out["benchmark_note"] = s2.get("label", "")
    
    # S3: Buyer Journey
    s3 = a.get("section_3_buyer_journey_simulation", "")
    if isinstance(s3, str):
        out["buyer_journey"] = [{"search": f"best {out.get('category', 'service')} near me", "description": s3}]
        out["buyer_journey_summary"] = s3[:200] if len(s3) > 200 else s3
    elif isinstance(s3, list):
        out["buyer_journey"] = s3
    
    # S4: Why Ignored / Attention Gap
    s4 = a.get("section_4_attention_gap_analysis", a.get("section_4_why_ignored", []))
    if isinstance(s4, list):
        out["ignore_reasons"] = [{"title": item.split(".")[0] if "." in item else item[:60], "description": item} if isinstance(item, str) else item for item in s4]
    
    # S5: Trust Score
    s5 = a.get("section_5_trust_score", {})
    if isinstance(s5, dict):
        out["trust_score"] = s5.get("score", 0)
        out["trust_score_max"] = s5.get("max_score", 10)
        out["trust_explanation"] = s5.get("interpretation", s5.get("explanation", ""))
        out["trust_factors"] = s5.get("factors", [])
    
    # S6: AI Visibility
    s6 = a.get("section_6_ai_visibility_status", a.get("section_6_ai_visibility", {}))
    if isinstance(s6, dict):
        out["ai_status"] = s6.get("status", "Unknown")
        out["ai_status_statement"] = s6.get("impact_statement", s6.get("statement", ""))
        out["ai_factors"] = s6.get("factors", [])
        out["ai_platforms"] = s6.get("platforms", {})
    
    # S7: Competitors
    s7 = a.get("section_7_competitor_advantage", a.get("section_7_competitors", ""))
    if isinstance(s7, str):
        out.setdefault("competitors", {})["summary"] = s7
    elif isinstance(s7, dict):
        out["competitors"] = s7
    
    # S8: Revenue Leak
    s8 = a.get("section_8_revenue_leak", a.get("section_8_revenue", {}))
    if isinstance(s8, dict):
        model = s8.get("model", s8.get("revenue_model", {}))
        out["revenue_range"] = s8.get("estimated_monthly_loss", s8.get("monthly_loss", model.get("estimated_monthly_loss", "$0")))
        out["revenue_intro"] = s8.get("intro", s8.get("explanation", ""))
        out["revenue_statement"] = s8.get("statement", s8.get("summary", ""))
        if isinstance(model, dict):
            out["revenue_model"] = [{"metric": k.replace("_", " ").title(), "value": str(v), "basis": "Industry estimate"} for k, v in model.items() if k not in ("estimated_monthly_loss",)]
    
    # S9: Action Plan
    s9 = a.get("section_9_action_plan", a.get("section_9_geo_boost_action_plan", {}))
    if isinstance(s9, dict):
        out["quick_wins"] = s9.get("quick_wins", s9.get("7_day", []))
        out["growth_plan"] = s9.get("growth_plan", s9.get("30_day", []))
        out["domination_plan"] = s9.get("domination_plan", s9.get("90_day", []))
    elif isinstance(s9, list):
        out["quick_wins"] = s9
    
    # S10: Citability
    s10 = a.get("section_10_citability_quick_start", a.get("section_10_48hr_citability", {}))
    if isinstance(s10, dict):
        out["citability_principle"] = s10.get("principle", "")
        out["citability_6hr"] = s10.get("6hr", s10.get("first_6_hours", []))
        out["citability_24hr"] = s10.get("24hr", s10.get("within_24_hours", []))
        out["citability_48hr"] = s10.get("48hr", s10.get("within_48_hours", []))
    
    # S11: Competitor Gap
    s11 = a.get("section_11_competitor_gap", a.get("section_11_competitor_ai_visibility_gap", {}))
    if isinstance(s11, dict):
        out["competitor_gap_reality"] = s11.get("reality", "")
        out["competitor_gap_advantages"] = s11.get("advantages", s11.get("competitor_advantages", []))
        out["competitor_gap_your_gaps"] = s11.get("your_gaps", s11.get("gaps", []))
        out["competitor_gap_no_action"] = s11.get("no_action", s11.get("if_no_action", []))
        out["competitor_gap_opportunity"] = s11.get("opportunity", "")
    
    # S12: AI Shift
    s12 = a.get("section_12_ai_shift", a.get("section_12_future_risk", []))
    if isinstance(s12, list):
        out["ai_shift"] = [{"title": item.split(":")[0] if ":" in item else item[:50], "description": item} if isinstance(item, str) else item for item in s12]
    elif isinstance(s12, dict):
        out["ai_shift"] = s12.get("shifts", s12.get("risks", []))
        out["ai_shift_warning"] = s12.get("warning", "")
    
    # S13: Full Picture
    s13 = a.get("section_13_full_picture", a.get("section_13_why_this_matters", []))
    if isinstance(s13, list):
        out["full_picture"] = s13
    elif isinstance(s13, str):
        out["full_picture"] = [s13]
    
    # S14: Next Steps
    s14 = a.get("section_14_next_steps", a.get("section_14_next", {}))
    if isinstance(s14, dict):
        out["next_steps_intro"] = s14.get("intro", "")
        out["next_steps"] = s14.get("steps", s14.get("actions", []))
        out["final_close"] = s14.get("close", s14.get("final_close", ""))
    elif isinstance(s14, list):
        out["next_steps"] = s14
    
    return out


@app.route('/webhook', methods=['POST'])
def handle_form():
    data = request.json
    biz_name = data.get('business_name', "Lead")
    location = data.get('location', "Memphis TN")
    category = data.get('category', "service")
    website = data.get('website', "")
    is_paid = data.get('is_paid', False)
    client_email = data.get('email', "rajatab234@gmail.com")
    
    # 1. Fetch live verification data
    stats, competitors = get_verified_business_data(biz_name, location, category)
    if not stats: return jsonify({"status": "error", "message": "Business verification failed"}), 500

    # 2. Load logic prompts
    with open(GEO_BOOST_SKILL_PATH, 'r', encoding='utf-8') as f: logic = f.read()
    with open(HTML_SKILL_PATH, 'r', encoding='utf-8') as f: schema = f.read()

    # 3. Construct AI Request
    prompt = f"""Output ONLY RAW JSON. Full GEO Boost analysis for:
    Business Name: {biz_name}
    Website: {website}
    Location: {location}
    Category: {category}
    Service Intent: best {category} in {location}
    Current Google Stats: {stats['reviews']} reviews, {stats['rating']} star rating
    Top Competitors Found:
    {competitors}
    
    Analysis Logic & Scoring Rules:
    {logic}
    
    Required Output JSON Schema:
    {schema}"""

    try:
        text = ""
        # 4. Request Analysis from OpenRouter (with retry + fallback)
        ai_data, used_model, ai_err = call_openrouter(prompt)

        if ai_data is None:
            print(f"❌ All models failed. Last error: {ai_err}")
            return jsonify({"status": "error", "message": "All AI models failed to respond", "ai_error": ai_err}), 500

        text = ai_data['choices'][0]['message']['content'].strip()
        print(f"📝 Got {len(text)} chars from {used_model}")
        
        # Strip <think>...</think> reasoning blocks (Qwen3 models)
        text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL).strip()

        # Robust JSON cleaning
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        
        # Last resort: extract first { to last }
        if not text.startswith("{"):
            start = text.find("{")
            if start != -1:
                text = text[start:]

        # 5. Process and Render Report
        # raw_decode stops at the end of the first valid JSON object
        # (ignores any trailing text the AI appended after the JSON)
        decoder = json.JSONDecoder()
        report_data, _ = decoder.raw_decode(text)
        
        # Normalize AI output to the flat format the HTML generator expects
        report_data = normalize_report_data(report_data)
        print(f"📊 Normalized. Keys: {len(report_data)}")
        
        # Force-inject metadata from webhook (AI may miss or hallucinate these)
        report_data["brand_name"] = biz_name
        report_data["url"] = website
        report_data["location"] = location
        report_data["category"] = category
        report_data["service_intent"] = f"best {category} in {location}"
        report_data["is_paid"] = is_paid
        report_data["date"] = datetime.now().strftime("%Y-%m-%d")

        # Debug: log which keys the AI actually populated
        scored_keys = ["visibility_score", "trust_score", "ai_status", "revenue_range",
                       "executive_summary", "reality_check", "score_breakdown"]
        for k in scored_keys:
            val = report_data.get(k)
            status = "✅" if val and val != 0 else "⚠️ MISSING/ZERO"
            print(f"  {status} {k}: {str(val)[:80]}")

        temp_json = os.path.join(DOWNLOADS_PATH, "temp_analysis.json")
        with open(temp_json, "w", encoding='utf-8') as f:
            json.dump(report_data, f, ensure_ascii=False, indent=2)
        
        # Save raw AI response for debugging
        debug_file = os.path.join(DOWNLOADS_PATH, "debug_raw_ai_response.txt")
        with open(debug_file, "w", encoding='utf-8') as f:
            f.write(f"Model: {used_model}\nTimestamp: {datetime.now()}\nChars: {len(text)}\n\n{text}")
        
        script = FULL_REPORT_EXE if is_paid else TEASER_REPORT_EXE
        prefix = "FULL_" if is_paid else "FREE_Teaser_"
        out_html = os.path.join(DOWNLOADS_PATH, f"{prefix}Report_{biz_name.replace(' ', '_')}.html")
        
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        
        print(f"🎨 Rendering {prefix} report...")
        result = subprocess.run(["python3", script, temp_json, out_html], capture_output=True, text=True, env=env)
        
        if result.returncode != 0:
            print(f"❌ GENERATOR ERROR: {result.stderr}")
            return jsonify({"status": "error", "message": result.stderr}), 500

        # 6. Dispatch Email
        if client_email:
            send_email(client_email, out_html, biz_name, is_paid)
            
        return jsonify({"status": "success", "message": "Report delivered successfully"})
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON PARSE ERROR: {e}\nRaw AI text: {text[:500]}")
        return jsonify({"status": "error", "message": f"AI returned invalid JSON: {str(e)}", "raw_preview": text[:300]}), 500
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print(f"❌ SYSTEM CRASH: {tb}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    print("🚦 GEO Bridge Server Active on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
