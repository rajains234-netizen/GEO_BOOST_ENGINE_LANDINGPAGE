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
MODEL = os.getenv("OPENROUTER_MODEL", "qwen/qwen3-235b-a22b:free")
FALLBACK_MODELS = [
    "qwen/qwen3-235b-a22b:free",
    "qwen/qwen3-30b-a3b:free",
    "deepseek/deepseek-chat-v3-0324:free",
    "meta-llama/llama-4-maverick:free",
]

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
    """Call OpenRouter with retry across fallback models."""
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

                if 'choices' in data and data['choices'][0].get('message', {}).get('content'):
                    print(f"✅ Got response from {model}")
                    return data, model, None

                # Model returned but no valid choices — log and try next
                last_error = data
                print(f"⚠️ No choices from {model}: {json.dumps(data, indent=2)[:300]}")
                break  # don't retry same model if it responded but gave no choices

            except requests.exceptions.Timeout:
                print(f"⏱️ Timeout ({timeout}s) on {model}, attempt {attempt+1}")
                last_error = {"error": f"Timeout after {timeout}s"}
            except requests.exceptions.RequestException as e:
                print(f"🌐 Network error on {model}: {e}")
                last_error = {"error": str(e)}
                break  # network issue won't fix with retry

    return None, None, last_error


@app.route('/webhook', methods=['POST'])
def handle_form():
    data = request.json
    biz_name = data.get('business_name', "Lead")
    location = data.get('location', "Memphis TN")
    category = data.get('category', "service")
    is_paid = data.get('is_paid', False)
    client_email = data.get('email', "rajatab234@gmail.com")
    
    # 1. Fetch live verification data
    stats, competitors = get_verified_business_data(biz_name, location, category)
    if not stats: return jsonify({"status": "error", "message": "Business verification failed"}), 500

    # 2. Load logic prompts
    with open(GEO_BOOST_SKILL_PATH, 'r', encoding='utf-8') as f: logic = f.read()
    with open(HTML_SKILL_PATH, 'r', encoding='utf-8') as f: schema = f.read()

    # 3. Construct AI Request
    prompt = f"""Output ONLY RAW JSON. Analysis for {biz_name}. 
    Current Stats: {stats['reviews']} reviews, {stats['rating']} stars. 
    Competitors: {competitors}. 
    Analysis Logic: {logic}
    Output Schema: {schema}"""

    try:
        text = ""
        # 4. Request Analysis from OpenRouter (with retry + fallback)
        ai_data, used_model, ai_err = call_openrouter(prompt)

        if ai_data is None:
            print(f"❌ All models failed. Last error: {ai_err}")
            return jsonify({"status": "error", "message": "All AI models failed to respond", "ai_error": ai_err}), 500

        text = ai_data['choices'][0]['message']['content'].strip()
        print(f"📝 Got {len(text)} chars from {used_model}")
        
        # Robust JSON cleaning
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        # 5. Process and Render Report
        report_data = json.loads(text)
        report_data["is_paid"] = is_paid
        report_data["date"] = datetime.now().strftime("%Y-%m-%d")

        temp_json = os.path.join(DOWNLOADS_PATH, "temp_analysis.json")
        with open(temp_json, "w", encoding='utf-8') as f:
            json.dump(report_data, f, ensure_ascii=False, indent=2)
        
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
