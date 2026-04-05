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

app = Flask(__name__)
# --- 1. CLOUD CONFIGURATION ---
# Secrets are now loaded from Environment Variables
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
OPENROUTER_KEY = os.getenv("OPENROUTER_KEY")
MODEL = "qwen/qwen3.6-plus:free"

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

# Relative Path Mapping (Works on GitHub/Linux/Windows)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SKILLS_DIR = os.path.join(BASE_DIR, "skills")
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")

# Paths for logic files
GEO_BOOST_SKILL_PATH = os.path.join(SKILLS_DIR, "geo_boost_engine.skill.md")
with open(os.path.join(SKILLS_DIR, "geo_report.skill.md"), 'r', encoding='utf-8') as f: schema = f.read()
HTML_SKILL_PATH = os.path.join(SKILLS_DIR, "geo_html_schema.skill.md")

# Generator Script Paths
FULL_REPORT_EXE = os.path.join(SCRIPTS_DIR, "generate_html_report.py")
TEASER_REPORT_EXE = os.path.join(SCRIPTS_DIR, "generate_html_report.py")

# Output directory (Ensure this exists or use /tmp on cloud providers)
OUTPUT_PATH = os.path.join(BASE_DIR, "output")
if not os.path.exists(OUTPUT_PATH):
    os.makedirs(OUTPUT_PATH)

# --- 2. SYSTEM PROMPT (The "Brain" Instructions) ---
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
    """Sends the HTML report as an attachment with correct MIME types for Chrome."""
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
        # 4. Request Analysis from OpenRouter
        response = requests.post("https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENROUTER_KEY}"},
            json={"model": MODEL, "messages": [{"role": "user", "content": prompt}], "temperature": 0})
        ai_data = response.json()

        if 'choices' not in ai_data:
            print(f"❌ AI Error Details: {json.dumps(ai_data, indent=2)}")
            return jsonify({"status": "error", "message": "AI Engine failed to respond"}), 500

        text = ai_data['choices'][0]['message']['content'].strip()
        
        # Robust JSON cleaning to prevent generator crashes
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        # 5. Process and Render Report
        # Parse AI JSON and inject the is_paid flag so the HTML generator knows
        report_data = json.loads(text)
        report_data["is_paid"] = is_paid
        report_data["date"] = datetime.now().strftime("%Y-%m-%d")

        temp_json = os.path.join(DOWNLOADS_PATH, "temp_analysis.json")
        with open(temp_json, "w", encoding='utf-8') as f:
            json.dump(report_data, f, ensure_ascii=False, indent=2)
        
        script = FULL_REPORT_EXE if is_paid else TEASER_REPORT_EXE
        prefix = "FULL_" if is_paid else "FREE_Teaser_"
        out_html = os.path.join(DOWNLOADS_PATH, f"{prefix}Report_{biz_name.replace(' ', '_')}.html")
        
        # Execute generator with UTF-8 environment enforcement
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        
        print(f"🎨 Rendering {prefix} report...")
        result = subprocess.run(["python", script, temp_json, out_html], capture_output=True, text=True, env=env)
        
        if result.returncode != 0:
            print(f"❌ GENERATOR ERROR: {result.stderr}")
            return jsonify({"status": "error", "message": result.stderr}), 500

        # 6. Dispatch Email
        if client_email:
            send_email(client_email, out_html, biz_name, is_paid)
            
        return jsonify({"status": "success", "message": "Report delivered successfully"})
        
    except Exception as e:
        print(f"❌ SYSTEM CRASH: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    print("🚦 GEO Bridge Server Active on http://0.0.0.0:5000")
    # host='0.0.0.0' tells AWS to allow outside traffic
    app.run(host='0.0.0.0', port=5000, debug=True)
