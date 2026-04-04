#!/usr/bin/env python3
"""
GEO Boost Engine — Premium Interactive HTML Report Generator
=============================================================
Produces a $5K consulting-grade single-file HTML report with:
- Animated score rings (CSS conic-gradient)
- Sticky sidebar navigation with smooth scrolling
- Dark hero sections for revenue leak callouts
- Responsive card layouts
- Animated progress bars
- Print-ready @media print styles
- Zero external dependencies

Usage:
    python generate_html_report.py <json_data_file> [output_file.html]
    python generate_html_report.py - [output_file.html]   # read from stdin
"""

import sys
import json
import os
import html as html_mod
from datetime import datetime


def score_color(score, max_score=100):
    """3-color status system: green=good, amber=warning, red=critical."""
    pct = (score / max_score * 100) if max_score else 0
    if pct >= 60: return "#0D9488"    # green — good
    elif pct >= 40: return "#D97706"  # amber — warning
    else: return "#DC2626"            # red — critical


def score_label(score):
    if score >= 80: return "Dominating"
    elif score >= 50: return "Competitive but Leaking Revenue"
    else: return "Invisible / At Risk"


def trust_label(score):
    if score >= 8: return "High Trust"
    elif score >= 5: return "Moderate Trust"
    else: return "Low Trust"


def esc(text):
    """Escape HTML but preserve allowed tags."""
    if not text:
        return ""
    # Don't escape if it already contains HTML formatting tags
    allowed = ['<b>', '</b>', '<i>', '</i>', '<em>', '</em>', '<strong>', '</strong>', '<br>', '<br/>']
    has_tags = any(tag in str(text) for tag in allowed)
    if has_tags:
        return str(text)
    return html_mod.escape(str(text))


def generate_html(data):
    """Generate the complete HTML report string from audit data."""

    # Extract data with defaults
    brand = data.get("brand_name", "Business")
    url = data.get("url", "")
    
    # --- FIXED: ALWAYS USE CURRENT DATE ---
    date = datetime.now().strftime("%Y-%m-%d")
    
    location = data.get("location", "")
    category = data.get("category", "")
    service_intent = data.get("service_intent", "")
    benchmark_note = data.get("benchmark_note", "")
    _raw_paid = data.get("is_paid", False)
    is_paid = str(_raw_paid).lower().strip() in ("true", "1", "yes") if isinstance(_raw_paid, str) else bool(_raw_paid)

    vis_score = data.get("visibility_score", 0)
    trust_score = data.get("trust_score", 0)
    trust_max = data.get("trust_score_max", 10)
    ai_status = data.get("ai_status", "Unknown")
    rev_range = data.get("revenue_range", "$0")

    breakdown = data.get("score_breakdown", {})
    exec_summary = data.get("executive_summary", "")

    reality = data.get("reality_check", "")
    reality_detail = data.get("reality_check_detail", [])

    journeys = data.get("buyer_journey", [])
    journey_summary = data.get("buyer_journey_summary", "")

    ignore_reasons = data.get("ignore_reasons", [])

    trust_factors = data.get("trust_factors", [])
    trust_expl = data.get("trust_explanation", "")

    ai_statement = data.get("ai_status_statement", "")
    ai_factors = data.get("ai_factors", [])
    ai_platforms = data.get("ai_platforms", {})

    competitors = data.get("competitors", {})
    comp_table = competitors.get("table", [])
    comp_summary = competitors.get("summary", "")

    rev_intro = data.get("revenue_intro", "")
    rev_model = data.get("revenue_model", [])
    rev_statement = data.get("revenue_statement", "")

    quick_wins = data.get("quick_wins", [])
    growth_plan = data.get("growth_plan", [])
    domination_plan = data.get("domination_plan", [])

    # 48-Hour AI Citability Quick-Start (Section 10)
    citability_principle = data.get("citability_principle", "")
    citability_6hr = data.get("citability_6hr", [])
    citability_24hr = data.get("citability_24hr", [])
    citability_48hr = data.get("citability_48hr", [])
    citability_best_in_city = data.get("citability_best_in_city", [])
    citability_expected_impact = data.get("citability_expected_impact", [])

    # Competitor AI Visibility Gap (Section 11)
    competitor_gap_reality = data.get("competitor_gap_reality", "")
    competitor_gap_advantages = data.get("competitor_gap_advantages", [])
    competitor_gap_your_gaps = data.get("competitor_gap_your_gaps", [])
    competitor_gap_no_action = data.get("competitor_gap_no_action", [])
    competitor_gap_opportunity = data.get("competitor_gap_opportunity", "")

    ai_shift = data.get("ai_shift", [])
    ai_shift_warning = data.get("ai_shift_warning", "")

    full_picture = data.get("full_picture", [])
    full_picture_end = data.get("full_picture_conclusion", "")

    next_intro = data.get("next_steps_intro", "")
    next_steps = data.get("next_steps", [])
    final_close = data.get("final_close", "")

    try:
        formatted_date = datetime.strptime(date, "%Y-%m-%d").strftime("%B %d, %Y")
    except:
        formatted_date = date

    vis_color = score_color(vis_score)
    vis_label = score_label(vis_score)
    trust_color = score_color(trust_score, trust_max)
    trust_lbl = trust_label(trust_score)
    ai_color = "#DC2626" if ai_status == "Invisible" else "#D97706" if ai_status == "Partial" else "#0D9488"

    # Build score breakdown HTML
    breakdown_html = ""
    for pillar, info in breakdown.items():
        sc = info.get("score", 0)
        mx = info.get("max", 25)
        st = info.get("status", "")
        pct = (sc / mx * 100) if mx else 0
        clr = score_color(sc, mx)
        breakdown_html += f'''
        <div class="progress-row">
            <div class="progress-label">{esc(pillar)}</div>
            <div class="progress-track">
                <div class="progress-fill" style="--fill-width:{pct}%;--fill-color:{clr}" data-width="{pct}"></div>
            </div>
            <div class="progress-score" style="color:{clr}">{sc}/{mx}</div>
            <div class="progress-status" style="color:{clr}">{esc(st)}</div>
        </div>'''

    # Buyer journey HTML
    journey_html = ""
    for i, j in enumerate(journeys):
        journey_html += f'''
        <div class="journey-card" onclick="this.classList.toggle('open')">
            <div class="journey-header">
                <span class="journey-search">{esc(j.get("search", ""))}</span>
                <span class="journey-toggle">+</span>
            </div>
            <div class="journey-body">{esc(j.get("description", ""))}</div>
        </div>'''

    # Ignore reasons HTML
    ignore_html = ""
    for i, r in enumerate(ignore_reasons, 1):
        ignore_html += f'''
        <div class="ignore-card">
            <div class="ignore-number">{i}</div>
            <div class="ignore-content">
                <div class="ignore-title">{esc(r.get("title", ""))}</div>
                <div class="ignore-desc">{esc(r.get("description", ""))}</div>
            </div>
        </div>'''

    # Trust factors table
    trust_table_html = ""
    if trust_factors:
        trust_table_html = '<table class="data-table"><thead><tr><th>Factor</th><th>Weight</th><th>Assessment</th><th>Rating</th></tr></thead><tbody>'
        for tf in trust_factors:
            rating = tf.get("rating", "")
            rc = "#DC2626" if rating.lower() in ["low", "weak"] else "#D97706" if rating.lower() == "moderate" else "#0D9488"
            trust_table_html += f'<tr><td>{esc(tf.get("factor", ""))}</td><td style="text-align:center">{esc(tf.get("weight", ""))}</td><td>{esc(tf.get("assessment", ""))}</td><td style="color:{rc};font-weight:700;text-align:center">{esc(rating)}</td></tr>'
        trust_table_html += '</tbody></table>'

    # AI factors table
    ai_factors_html = ""
    if ai_factors:
        ai_factors_html = '<table class="data-table"><thead><tr><th>AI Readiness Factor</th><th>Status</th><th>Impact</th></tr></thead><tbody>'
        for af in ai_factors:
            ai_factors_html += f'<tr><td>{esc(af.get("factor", ""))}</td><td>{esc(af.get("status", ""))}</td><td style="color:#DC2626;font-weight:600">{esc(af.get("impact", ""))}</td></tr>'
        ai_factors_html += '</tbody></table>'

    # AI platforms progress bars
    ai_platforms_html = ""
    for name, sc in ai_platforms.items():
        clr = score_color(sc)
        ai_platforms_html += f'''
        <div class="progress-row">
            <div class="progress-label">{esc(name)}</div>
            <div class="progress-track">
                <div class="progress-fill" style="--fill-width:{sc}%;--fill-color:{clr}" data-width="{sc}"></div>
            </div>
            <div class="progress-score" style="color:{clr}">{sc}/100</div>
        </div>'''

    # Competitor table
    comp_html = ""
    if comp_table:
        comp_html = '<div class="table-scroll"><table class="data-table comp-table"><thead><tr>'
        for i, h in enumerate(comp_table[0]):
            cls = ' class="highlight-col"' if i == 1 else ''
            comp_html += f'<th{cls}>{esc(h)}</th>'
        comp_html += '</tr></thead><tbody>'
        for row in comp_table[1:]:
            comp_html += '<tr>'
            for i, cell in enumerate(row):
                cls = ' class="highlight-col"' if i == 1 else ''
                comp_html += f'<td{cls}>{esc(cell)}</td>'
            comp_html += '</tr>'
        comp_html += '</tbody></table></div>'

    # Revenue model table
    rev_table_html = ""
    if rev_model:
        rev_table_html = '<table class="data-table revenue-table"><thead><tr><th>Metric</th><th>Value</th><th>Basis</th></tr></thead><tbody>'
        for rm in rev_model:
            rev_table_html += f'<tr><td>{esc(rm.get("metric", ""))}</td><td style="font-weight:700">{esc(rm.get("value", ""))}</td><td class="muted">{esc(rm.get("basis", ""))}</td></tr>'
        rev_table_html += '</tbody></table>'

    # Action plan items
    def action_list(items):
        h = ""
        for item in items:
            h += f'<div class="action-item"><span class="action-bullet">&bull;</span><span>{item}</span></div>'
        return h

    qw_html = action_list(quick_wins)
    gp_html = action_list(growth_plan)
    dp_html = action_list(domination_plan)

    # AI shift cards
    ai_shift_html = ""
    for i, s in enumerate(ai_shift, 1):
        ai_shift_html += f'''
        <div class="shift-card">
            <div class="shift-number">{i}</div>
            <div class="shift-content">
                <div class="shift-title">{esc(s.get("title", ""))}</div>
                <div class="shift-desc">{esc(s.get("description", ""))}</div>
            </div>
        </div>'''

    # Full picture
    fp_html = ""
    for p in full_picture:
        fp_html += f'<div class="fp-point">{p}</div>'

    # Next steps
    ns_html = ""
    for s in next_steps:
        ns_html += f'<div class="ns-item">{s}</div>'

    # 48-Hour Citability section HTML
    citability_6hr_html = ""
    for item in citability_6hr:
        citability_6hr_html += f'<div class="action-item"><span class="action-bullet">&bull;</span><span>{item}</span></div>'
    citability_24hr_html = ""
    for item in citability_24hr:
        citability_24hr_html += f'<div class="action-item"><span class="action-bullet">&bull;</span><span>{item}</span></div>'
    citability_48hr_html = ""
    for item in citability_48hr:
        citability_48hr_html += f'<div class="action-item"><span class="action-bullet">&bull;</span><span>{item}</span></div>'
    citability_bic_html = ""
    for item in citability_best_in_city:
        citability_bic_html += f'<div class="action-item"><span class="action-bullet">&bull;</span><span>{item}</span></div>'
    citability_impact_html = ""
    for item in citability_expected_impact:
        citability_impact_html += f'<div class="fp-point">{item}</div>'

    # Competitor Gap section HTML
    comp_gap_adv_html = ""
    for item in competitor_gap_advantages:
        comp_gap_adv_html += f'<div class="action-item"><span class="action-bullet" style="color:#DC2626">&bull;</span><span>{item}</span></div>'
    comp_gap_yours_html = ""
    for item in competitor_gap_your_gaps:
        comp_gap_yours_html += f'<div class="action-item"><span class="action-bullet" style="color:#DC2626">&bull;</span><span>{item}</span></div>'
    comp_gap_noaction_html = ""
    for item in competitor_gap_no_action:
        comp_gap_noaction_html += f'<div class="action-item"><span class="action-bullet" style="color:#DC2626">&bull;</span><span>{item}</span></div>'

    # Blur overlay HTML + CSS for gated sections (only when not paid)
    if not is_paid:
        blur_overlay = '''<div class="blur-overlay">
            <div class="lock-icon"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
            <div class="lock-title">Premium Section</div>
            <div class="lock-sub">This section is available in the full report. Unlock to see your personalized action plan and insights.</div>
            <button class="unlock-btn">Unlock Full Report</button>
        </div>'''
        gate_start = '<div class="blur-gate"><div class="blur-content">'
        gate_end = f'</div>{blur_overlay}</div>'
        blur_css = '''/* BLURRED / GATED SECTIONS */
.blur-gate{position:relative;overflow:hidden}
.blur-gate .blur-content{filter:blur(6px);-webkit-filter:blur(6px);pointer-events:none;user-select:none;-webkit-user-select:none}
.blur-gate .blur-overlay{
  position:absolute;inset:0;z-index:10;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:rgba(248,250,252,0.55);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);
}
.blur-overlay .lock-icon{
  width:52px;height:52px;border-radius:50%;background:var(--navy);
  display:flex;align-items:center;justify-content:center;margin-bottom:14px;
  box-shadow:0 4px 16px rgba(15,23,42,0.18);
}
.blur-overlay .lock-icon svg{width:24px;height:24px;fill:none;stroke:var(--white);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.blur-overlay .lock-title{font-size:16px;font-weight:800;color:var(--charcoal);margin-bottom:4px}
.blur-overlay .lock-sub{font-size:13px;color:var(--mid-gray);margin-bottom:18px;text-align:center;max-width:340px;line-height:1.5}
.blur-overlay .unlock-btn{
  display:inline-block;padding:12px 32px;border-radius:8px;
  background:linear-gradient(135deg,#0F172A,#1E3A5F);color:var(--white);
  font-size:13px;font-weight:700;letter-spacing:0.5px;text-decoration:none;
  box-shadow:0 4px 14px rgba(15,23,42,0.25);transition:transform .2s,box-shadow .2s;cursor:pointer;border:none;
}
.blur-overlay .unlock-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(15,23,42,0.35)}'''
        blur_print_css = '''  .blur-gate .blur-content{filter:none !important;-webkit-filter:none !important;pointer-events:auto;user-select:auto}
  .blur-gate .blur-overlay{display:none !important}'''
    else:
        gate_start = ''
        gate_end = ''
        blur_css = ''
        blur_print_css = ''

    # Nav items
    nav_items = [
        ("reality", "Reality Check"),
        ("score", "Visibility Score"),
        ("journey", "Customer View"),
        ("ignored", "Why Ignored"),
        ("trust", "Trust Score"),
        ("ai", "AI Visibility"),
        ("competitors", "Competitors"),
        ("revenue", "Revenue Leak"),
        ("plan", "Action Plan"),
        ("citability", "48-Hour Quick-Start"),
        ("compgap", "AI Visibility Gap"),
        ("shift", "AI Shift Risk"),
        ("matters", "Full Picture"),
        ("next", "Next Steps"),
    ]
    nav_html = ""
    for id_, label in nav_items:
        nav_html += f'<a href="#{id_}" class="nav-link" onclick="closeMobileNav()">{label}</a>'

    # ================================================================
    # THE COMPLETE HTML
    # ================================================================
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GEO Boost Engine Report — {esc(brand)}</title>
<style>
/* ============================================================
   RESET & BASE
   ============================================================ */
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
:root{{
  /* Neutral-first consulting palette — color only for status */
  --navy:#0F172A;--slate:#1E293B;--steel:#334155;
  /* 3 status colors + 1 neutral accent */
  --red:#DC2626;--amber:#D97706;--green:#0D9488;
  --accent:#1E293B;--accent-light:#334155;
  /* Legacy aliases (mapped to neutrals or status) */
  --blue:#334155;--cyan:#64748B;--coral:#DC2626;--emerald:#0D9488;--violet:#475569;
  /* Neutral scale */
  --charcoal:#0F172A;--dark-gray:#334155;--mid-gray:#64748B;
  --light-gray:#E2E8F0;--off-white:#F8FAFC;--white:#FFFFFF;
  /* Tint backgrounds — all neutral except status tints */
  --red-tint:#EEF2FF;--amber-tint:#FFFBEB;--green-tint:#F0FDF4;--blue-tint:#F1F5F9;--slate-tint:#F1F5F9;
  --sidebar-w:230px;
  --font-sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}}
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
html{{scroll-behavior:smooth;font-size:15px}}
body{{font-family:var(--font-sans);color:var(--charcoal);background:var(--off-white);line-height:1.65;overflow-x:hidden;-webkit-font-smoothing:antialiased}}

/* ============================================================
   SIDEBAR NAVIGATION
   ============================================================ */
.sidebar{{
  position:fixed;top:0;left:0;width:var(--sidebar-w);height:100vh;
  background:var(--navy);padding:24px 0;z-index:100;
  display:flex;flex-direction:column;overflow-y:auto;
  border-right:1px solid rgba(255,255,255,0.06);
}}
.sidebar-brand{{padding:0 20px 20px;border-bottom:1px solid rgba(255,255,255,0.08)}}
.sidebar-brand h2{{color:var(--white);font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px}}
.sidebar-brand p{{color:var(--mid-gray);font-size:10px;line-height:1.3}}
.sidebar nav{{padding:16px 0;flex:1}}
.nav-link{{
  display:block;padding:9px 20px 9px 24px;color:var(--mid-gray);
  text-decoration:none;font-size:12.5px;font-weight:500;
  border-left:3px solid transparent;transition:all .2s;
}}
.nav-link:hover,.nav-link.active{{color:var(--white);background:rgba(255,255,255,0.04);border-left-color:var(--white)}}
.sidebar-footer{{padding:16px 20px;border-top:1px solid rgba(255,255,255,0.08)}}
.sidebar-footer p{{color:var(--mid-gray);font-size:9px;line-height:1.4}}
.mobile-toggle{{display:none;position:fixed;top:12px;left:12px;z-index:200;background:var(--navy);color:var(--white);border:none;padding:8px 12px;border-radius:6px;font-size:18px;cursor:pointer}}

/* ============================================================
   MAIN CONTENT AREA
   ============================================================ */
.main{{margin-left:var(--sidebar-w);min-height:100vh}}

/* ============================================================
   COVER / HERO SECTION
   ============================================================ */
.cover{{
  background:linear-gradient(160deg,#0F172A 0%,#1E293B 40%,#1E3A5F 100%);
  color:var(--white);padding:60px 48px 50px;position:relative;overflow:hidden;
}}
.cover::after{{
  content:"";position:absolute;top:0;right:0;width:45%;height:100%;
  background:radial-gradient(ellipse at 80% 20%,rgba(37,99,235,0.08),transparent 70%);pointer-events:none;
}}
.cover-label{{color:var(--mid-gray);font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px}}
.cover h1{{font-size:36px;font-weight:800;line-height:1.15;margin-bottom:6px}}
.cover h1 span{{color:var(--light-gray)}}
.cover-sub{{color:var(--mid-gray);font-size:15px;margin-bottom:32px}}
.cover-details{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px 32px;margin-bottom:36px}}
.cover-detail label{{display:block;color:var(--mid-gray);font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:2px}}
.cover-detail span{{color:var(--white);font-size:14px;font-weight:600}}

/* Score Ring (CSS only) */
.score-ring-wrap{{display:flex;align-items:center;gap:24px;margin-top:8px}}
.score-ring{{
  position:relative;width:140px;height:140px;border-radius:50%;
  background:conic-gradient({vis_color} calc(var(--pct) * 1%),rgba(255,255,255,0.1) 0);
  display:flex;align-items:center;justify-content:center;
  animation:ring-fill 1.5s ease-out forwards;
  --pct:0;
}}
@keyframes ring-fill{{to{{--pct:{vis_score}}}}}
@property --pct{{syntax:"<number>";inherits:false;initial-value:0}}
.score-ring-inner{{
  width:110px;height:110px;border-radius:50%;background:var(--navy);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
}}
.score-ring-value{{font-size:38px;font-weight:800;color:var(--white);line-height:1}}
.score-ring-of{{font-size:13px;color:var(--mid-gray);margin-top:2px}}
.score-ring-label{{color:{vis_color};font-size:13px;font-weight:700;max-width:180px}}
.score-ring-sublabel{{color:var(--mid-gray);font-size:11px;margin-top:2px}}

/* KPI strip */
.kpi-strip{{
  display:grid;grid-template-columns:repeat(4,1fr);gap:1px;
  background:rgba(255,255,255,0.06);margin-top:36px;border-radius:8px;overflow:hidden;
}}
.kpi-card{{background:rgba(255,255,255,0.03);padding:18px 16px;text-align:center}}
.kpi-label{{color:var(--mid-gray);font-size:9px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px}}
.kpi-value{{font-size:22px;font-weight:800;line-height:1.1}}
.kpi-sub{{color:var(--mid-gray);font-size:9.5px;margin-top:4px}}

/* ============================================================
   SECTION WRAPPER
   ============================================================ */
.section{{padding:40px 48px 36px;border-bottom:1px solid var(--light-gray)}}
.section:last-child{{border-bottom:none}}
.section-header{{display:flex;align-items:center;gap:12px;margin-bottom:20px}}
.section-accent{{width:4px;height:28px;border-radius:2px;flex-shrink:0}}
.section-title{{font-size:20px;font-weight:800;color:var(--charcoal)}}
.section-subtitle{{color:var(--mid-gray);font-size:13px;margin-top:-12px;margin-bottom:20px;margin-left:16px}}
.section p,.section .body-text{{font-size:14px;line-height:1.7;color:var(--dark-gray);margin-bottom:12px}}

/* ============================================================
   CALLOUT BOX
   ============================================================ */
.callout{{
  border-left:4px solid #6366F1;background:var(--red-tint);
  padding:16px 20px;border-radius:0 6px 6px 0;margin:16px 0;
  font-size:14px;line-height:1.65;color:var(--charcoal);font-weight:600;
}}
.callout.blue{{border-left-color:var(--blue);background:var(--blue-tint)}}
.callout.amber{{border-left-color:var(--amber);background:var(--amber-tint)}}
.callout.green{{border-left-color:var(--emerald);background:var(--green-tint)}}

/* ============================================================
   PROGRESS BARS
   ============================================================ */
.progress-row{{display:grid;grid-template-columns:180px 1fr 60px 80px;align-items:center;gap:10px;padding:8px 0}}
.progress-label{{font-size:12.5px;font-weight:600;color:var(--dark-gray)}}
.progress-track{{height:10px;background:var(--light-gray);border-radius:5px;overflow:hidden}}
.progress-fill{{height:100%;border-radius:5px;width:0;background:var(--fill-color);animation:fill-bar 1.2s ease-out forwards}}
@keyframes fill-bar{{to{{width:var(--fill-width)}}}}
.progress-score{{font-size:13px;font-weight:700;text-align:right}}
.progress-status{{font-size:11px;font-weight:600;text-align:right}}

/* ============================================================
   DATA TABLES
   ============================================================ */
.table-scroll{{overflow-x:auto;margin:16px 0}}
.data-table{{width:100%;border-collapse:collapse;font-size:13px}}
.data-table th{{background:var(--slate);color:var(--white);padding:10px 12px;text-align:left;font-weight:600;font-size:12px;letter-spacing:0.3px}}
.data-table td{{padding:10px 12px;border-bottom:1px solid var(--light-gray);color:var(--dark-gray);vertical-align:top}}
.data-table tbody tr:nth-child(even){{background:var(--slate-tint)}}
.data-table tbody tr:hover{{background:rgba(46,134,222,0.04)}}
.highlight-col{{font-weight:600}}
.data-table tbody .highlight-col{{background:rgba(37,99,235,0.05)}}
.data-table thead .highlight-col{{background:#334155 !important;color:var(--white) !important;border-bottom:2px solid var(--white)}}
.muted{{color:var(--mid-gray);font-size:12px}}

/* ============================================================
   JOURNEY CARDS (Expandable)
   ============================================================ */
.journey-card{{background:var(--white);border:1px solid var(--light-gray);border-radius:8px;margin:8px 0;overflow:hidden;cursor:pointer;transition:box-shadow .2s}}
.journey-card:hover{{box-shadow:0 2px 8px rgba(0,0,0,0.06)}}
.journey-header{{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;font-weight:600;font-size:13.5px;color:var(--charcoal)}}
.journey-search{{color:var(--charcoal);font-weight:700}}
.journey-toggle{{color:var(--mid-gray);font-size:18px;font-weight:300;transition:transform .2s}}
.journey-card.open .journey-toggle{{transform:rotate(45deg)}}
.journey-body{{max-height:0;overflow:hidden;transition:max-height .35s ease,padding .35s ease;padding:0 18px;font-size:13.5px;line-height:1.65;color:var(--dark-gray)}}
.journey-card.open .journey-body{{max-height:500px;padding:0 18px 16px}}

/* ============================================================
   IGNORE REASON CARDS
   ============================================================ */
.ignore-card{{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--light-gray)}}
.ignore-card:last-child{{border-bottom:none}}
.ignore-number{{
  width:30px;height:30px;border-radius:50%;background:var(--red-tint);color:#4F46E5;
  display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0;
}}
.ignore-title{{font-weight:700;font-size:13.5px;color:var(--charcoal);margin-bottom:4px}}
.ignore-desc{{font-size:13px;line-height:1.6;color:var(--dark-gray)}}

/* ============================================================
   TRUST SCORE DISPLAY
   ============================================================ */
.trust-display{{text-align:center;padding:24px;margin:16px 0;border-radius:10px}}
.trust-display.low{{background:var(--red-tint)}}
.trust-display.moderate{{background:var(--amber-tint)}}
.trust-display.high{{background:var(--green-tint)}}
.trust-big{{font-size:52px;font-weight:800;line-height:1}}
.trust-of{{font-size:16px;font-weight:400;color:var(--mid-gray)}}
.trust-label-text{{font-size:15px;font-weight:700;margin-top:6px}}

/* ============================================================
   REVENUE LEAK HERO
   ============================================================ */
.revenue-hero{{
  background:linear-gradient(160deg,#0F172A,#1E293B 60%,#27171F);
  color:var(--white);padding:44px;border-radius:10px;text-align:center;
  margin:24px 0;border:1px solid rgba(220,38,38,0.3);position:relative;overflow:hidden;
  box-shadow:0 4px 24px rgba(0,0,0,0.15);
}}
.revenue-hero::before{{
  content:"";position:absolute;top:-50%;right:-20%;width:60%;height:200%;
  background:radial-gradient(ellipse,rgba(220,38,38,0.05),transparent 70%);pointer-events:none;
}}
.revenue-hero-label{{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(220,38,38,0.7);margin-bottom:14px}}
.revenue-hero-amount{{font-size:34px;font-weight:800;color:#EF4444;line-height:1.1;margin-bottom:12px}}
.revenue-hero-note{{font-size:11px;color:var(--mid-gray)}}

/* ============================================================
   ACTION PLAN TABS
   ============================================================ */
.plan-tabs{{display:flex;gap:2px;border-radius:8px 8px 0 0;overflow:hidden;margin-top:8px;background:var(--light-gray)}}
.plan-tab{{
  flex:1;padding:12px;text-align:center;font-size:12px;font-weight:600;
  letter-spacing:0.5px;cursor:pointer;transition:all .2s;
  background:var(--slate-tint);color:var(--mid-gray);border-bottom:3px solid transparent;
}}
.plan-tab:hover{{color:var(--charcoal);background:var(--white)}}
.plan-tab.active{{color:var(--white);border-bottom-color:transparent;font-weight:700}}
.plan-tab.t1.active,.plan-tab.t2.active,.plan-tab.t3.active{{background:#0D9488}}
.plan-content{{display:none;padding:16px 0;animation:fadeIn .3s}}
.plan-content.active{{display:block}}
.citability-content{{display:none;padding:16px 0;animation:fadeIn .3s}}
.citability-content.active{{display:block}}
.plan-tab.t4{{background:var(--light-gray);color:var(--dark-gray);cursor:pointer;border:none;font-size:12px;font-weight:700;padding:8px 16px;border-radius:6px}}
.plan-tab.t4.active{{background:#0D9488;color:var(--white)}}
@keyframes fadeIn{{from{{opacity:0;transform:translateY(8px)}}to{{opacity:1;transform:translateY(0)}}}}
.action-item{{
  padding:6px 14px 6px 16px;margin:2px 0;font-size:13.5px;line-height:1.5;
  color:var(--dark-gray);background:transparent;display:flex;align-items:baseline;gap:8px;
}}
.action-bullet{{font-size:14px;flex-shrink:0;margin-top:1px}}

/* ============================================================
   AI SHIFT CARDS
   ============================================================ */
.shift-card{{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--light-gray)}}
.shift-card:last-child{{border-bottom:none}}
.shift-number{{
  width:30px;height:30px;border-radius:50%;background:var(--slate);color:var(--white);
  display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;flex-shrink:0;
}}
.shift-title{{font-weight:700;font-size:13.5px;color:var(--charcoal);margin-bottom:4px}}
.shift-desc{{font-size:13px;line-height:1.6;color:var(--dark-gray)}}

/* Full Picture & Next Steps */
.fp-point,.ns-item{{
  padding:10px 14px 10px 18px;margin:6px 0;font-size:13.5px;line-height:1.65;
  color:var(--dark-gray);border-left:3px solid var(--slate);background:var(--slate-tint);border-radius:0 6px 6px 0;
}}
.ns-item{{border-left-color:var(--steel);background:var(--slate-tint)}}

/* Summary Banner */
.summary-banner{{
  background:var(--navy);color:var(--white);padding:28px 32px;border-radius:10px;
  margin:24px 0 8px;
}}
.summary-banner h3{{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--mid-gray);margin-bottom:14px}}
.summary-kpis{{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;text-align:center}}
.summary-kpi-label{{font-size:9px;color:var(--mid-gray);letter-spacing:1px;text-transform:uppercase}}
.summary-kpi-value{{font-size:18px;font-weight:800;margin-top:4px}}

.footer-note{{text-align:center;padding:20px 48px;color:var(--mid-gray);font-size:11px;line-height:1.6}}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media(max-width:900px){{
  .sidebar{{transform:translateX(-100%);transition:transform .3s}}
  .sidebar.open{{transform:translateX(0)}}
  .mobile-toggle{{display:block}}
  .main{{margin-left:0}}
  .cover,.section{{padding-left:20px;padding-right:20px}}
  .kpi-strip{{grid-template-columns:repeat(2,1fr)}}
  .progress-row{{grid-template-columns:1fr;gap:4px}}
  .progress-label,.progress-score,.progress-status{{text-align:left}}
  .summary-kpis{{grid-template-columns:repeat(2,1fr)}}
  .cover-details{{grid-template-columns:1fr}}
  .score-ring-wrap{{flex-direction:column;align-items:flex-start}}
}}

{blur_css}

/* ============================================================
   PRINT STYLES
   ============================================================ */
@media print{{
  .sidebar,.mobile-toggle{{display:none !important}}
  .main{{margin-left:0 !important}}
  .cover{{break-after:page}}
  .section{{break-inside:avoid;padding:20px 24px}}
  .journey-body{{max-height:none !important;padding:0 18px 12px !important}}
  .plan-content{{display:block !important}}
  .citability-content{{display:block !important}}
  .progress-fill{{width:var(--fill-width) !important}}
  body{{font-size:12px;background:white}}
  .revenue-hero{{break-inside:avoid}}
{blur_print_css}
  @page{{margin:0.7in}}
}}
</style>
</head>
<body>

<button class="mobile-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open')">&#9776;</button>

<aside class="sidebar">
  <div class="sidebar-brand">
    <h2>GEO Boost Engine</h2>
    <p>Revenue Recovery Report</p>
    <p style="color:var(--mid-gray);font-size:9px;margin-top:6px">{esc(brand)}</p>
  </div>
  <nav>{nav_html}</nav>
  <div class="sidebar-footer">
    <p>Generated {formatted_date}<br>Confidential</p>
  </div>
</aside>

<div class="main">

  <section class="cover" id="cover">
    <div class="cover-label">Revenue Recovery Report</div>
    <h1>GEO Boost <span>Engine</span></h1>
    <div class="cover-sub">Full-Stack Visibility &amp; Revenue Intelligence</div>

    <div class="cover-details">
      <div class="cover-detail"><label>Business</label><span>{esc(brand)}</span></div>
      <div class="cover-detail"><label>Website</label><span>{esc(url)}</span></div>
      <div class="cover-detail"><label>Location</label><span>{esc(location)}</span></div>
      <div class="cover-detail"><label>Category</label><span>{esc(category)}</span></div>
      <div class="cover-detail"><label>Service Intent</label><span>{esc(service_intent)}</span></div>
      <div class="cover-detail"><label>Analysis Date</label><span>{formatted_date}</span></div>
    </div>

    <div class="score-ring-wrap">
      <div class="score-ring">
        <div class="score-ring-inner">
          <div class="score-ring-value">{vis_score}</div>
          <div class="score-ring-of">/100</div>
        </div>
      </div>
      <div>
        <div class="score-ring-label">{vis_label}</div>
        <div class="score-ring-sublabel">Overall Visibility Score</div>
      </div>
    </div>

    <div class="kpi-strip">
      <div class="kpi-card">
        <div class="kpi-label">Visibility</div>
        <div class="kpi-value" style="color:{vis_color}">{vis_score}/100</div>
        <div class="kpi-sub">{vis_label}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Trust Score</div>
        <div class="kpi-value" style="color:{trust_color}">{trust_score}/{trust_max}</div>
        <div class="kpi-sub">{trust_lbl}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">AI Status</div>
        <div class="kpi-value" style="color:{ai_color}">{esc(ai_status)}</div>
        <div class="kpi-sub">{"Urgent" if ai_status == "Invisible" else "Needs Work" if ai_status == "Partial" else "Strong"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Revenue Leak</div>
        <div class="kpi-value" style="color:var(--coral);font-size:16px">{esc(rev_range)}</div>
        <div class="kpi-sub">Per Month (Est.)</div>
      </div>
    </div>
  </section>

  <section class="section" id="reality">
    <div class="section-header">
      <div class="section-accent" style="background:#6366F1"></div>
      <h2 class="section-title">Reality Check</h2>
    </div>
    <div class="callout">{esc(reality)}</div>
    {"".join(f'<p>{esc(d)}</p>' for d in reality_detail)}
  </section>

  <section class="section" id="score">
    <div class="section-header">
      <div class="section-accent" style="background:var(--steel)"></div>
      <h2 class="section-title">Visibility Score Breakdown</h2>
    </div>
    {breakdown_html}
    {f'<p class="muted" style="margin-top:12px;font-size:12px">{esc(benchmark_note)}</p>' if benchmark_note else ''}
  </section>

  <section class="section" id="journey">
    <div class="section-header">
      <div class="section-accent" style="background:var(--steel)"></div>
      <h2 class="section-title">What Customers Actually See</h2>
    </div>
    <p class="section-subtitle" style="margin-left:0">Click each search to expand the buyer experience</p>
    {journey_html}
    {f'<div class="callout blue" style="margin-top:16px">{esc(journey_summary)}</div>' if journey_summary else ''}
  </section>

  <section class="section" id="ignored">
    <div class="section-header">
      <div class="section-accent" style="background:#6366F1"></div>
      <h2 class="section-title">Why You're Being Ignored</h2>
    </div>
    {ignore_html}
  </section>

  <section class="section" id="trust">
    <div class="section-header">
      <div class="section-accent" style="background:var(--steel)"></div>
      <h2 class="section-title">Trust Deficit Score</h2>
    </div>
    {trust_table_html}
    <div class="trust-display {"low" if trust_score <= 4 else "moderate" if trust_score <= 7 else "high"}">
      <div class="trust-big" style="color:{trust_color}">{trust_score}<span class="trust-of">/{trust_max}</span></div>
      <div class="trust-label-text" style="color:{trust_color}">{trust_lbl}</div>
    </div>
    {f'<p>{esc(trust_expl)}</p>' if trust_expl else ''}
  </section>

  <section class="section" id="ai">
    <div class="section-header">
      <div class="section-accent" style="background:var(--steel)"></div>
      <h2 class="section-title">AI Search Visibility</h2>
    </div>
    <div class="callout {"" if ai_status == "Invisible" else "amber" if ai_status == "Partial" else "green"}" style="font-size:16px;text-align:center;border-left-width:5px">
      AI VISIBILITY STATUS: <strong>{esc(ai_status).upper()}</strong>
    </div>
    {f'<p>{esc(ai_statement)}</p>' if ai_statement else ''}
    {ai_factors_html}
    <h3 style="font-size:14px;font-weight:700;margin:20px 0 8px;color:var(--charcoal)">AI Platform Readiness</h3>
    {ai_platforms_html}
  </section>

  <section class="section" id="competitors">
    <div class="section-header">
      <div class="section-accent" style="background:var(--steel)"></div>
      <h2 class="section-title">Competitor Advantage</h2>
    </div>
    {comp_html}
    {(''.join(f'<div class="action-item" style="margin-top:4px"><span class="action-bullet">&bull;</span><span>{s}</span></div>' for s in comp_summary) if isinstance(comp_summary, list) else f'<p style="margin-top:14px">{esc(comp_summary)}</p>') if comp_summary else ''}
  </section>

  <section class="section" id="revenue">
    <div class="section-header">
      <div class="section-accent" style="background:var(--steel)"></div>
      <h2 class="section-title">Estimated Revenue Loss</h2>
    </div>
    {f'<p>{esc(rev_intro)}</p>' if rev_intro else ''}
    {rev_table_html}
    <div class="revenue-hero">
      <div class="revenue-hero-label">Estimated Monthly Revenue Leak</div>
      <div class="revenue-hero-amount">{esc(rev_range)}</div>
      <div class="revenue-hero-note">Based on industry benchmarks &bull; Presented as ranges &bull; Conservative estimates</div>
    </div>
    {f'<p style="margin-top:12px">{esc(rev_statement)}</p>' if rev_statement else ''}
  </section>

  <section class="section" id="plan">
    <div class="section-header">
      <div class="section-accent" style="background:var(--steel)"></div>
      <h2 class="section-title">GEO Boost Action Plan</h2>
    </div>
    {gate_start}
    <div class="plan-tabs">
      <div class="plan-tab t1 active" onclick="showPlan(0,this)">7-Day Quick Wins</div>
      <div class="plan-tab t2" onclick="showPlan(1,this)">30-Day Growth</div>
      <div class="plan-tab t3" onclick="showPlan(2,this)">90-Day Domination</div>
    </div>
    <div class="plan-content active" id="plan-0">{qw_html}</div>
    <div class="plan-content" id="plan-1">{gp_html}</div>
    <div class="plan-content" id="plan-2">{dp_html}</div>
    {gate_end}
  </section>

  <section class="section" id="citability">
    <div class="section-header">
      <div class="section-accent" style="background:#D97706"></div>
      <h2 class="section-title">48-Hour AI Citability Quick-Start</h2>
    </div>
    {gate_start}
    <p class="section-subtitle">Immediate actions to make your business citable by AI systems within 48 hours</p>
    {f'<div class="callout" style="margin-bottom:20px">{esc(citability_principle)}</div>' if citability_principle else ''}

    <div class="plan-tabs">
      <div class="plan-tab t1 active" onclick="showCitability(0,this)">First 6 Hours</div>
      <div class="plan-tab t2" onclick="showCitability(1,this)">Within 24 Hours</div>
      <div class="plan-tab t3" onclick="showCitability(2,this)">Within 48 Hours</div>
      <div class="plan-tab t4" onclick="showCitability(3,this)">Best-in-City Page</div>
    </div>
    <div class="citability-content active" id="cit-0">{citability_6hr_html}</div>
    <div class="citability-content" id="cit-1">{citability_24hr_html}</div>
    <div class="citability-content" id="cit-2">{citability_48hr_html}</div>
    <div class="citability-content" id="cit-3">{citability_bic_html}</div>

    {f'<div style="margin-top:20px"><h4 style="font-size:14px;font-weight:700;color:var(--charcoal);margin-bottom:10px">Expected Impact</h4>{citability_impact_html}</div>' if citability_expected_impact else ''}
    {gate_end}
  </section>

  <section class="section" id="compgap">
    <div class="section-header">
      <div class="section-accent" style="background:#DC2626"></div>
      <h2 class="section-title">Competitor AI Visibility Gap</h2>
    </div>
    {gate_start}
    {f'<div class="callout" style="border-color:#DC2626;background:#FEF2F2;margin-bottom:20px">{esc(competitor_gap_reality)}</div>' if competitor_gap_reality else ''}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div>
        <h4 style="font-size:14px;font-weight:700;color:#DC2626;margin-bottom:10px">Competitor Advantages</h4>
        {comp_gap_adv_html}
      </div>
      <div>
        <h4 style="font-size:14px;font-weight:700;color:#DC2626;margin-bottom:10px">Your Gaps</h4>
        {comp_gap_yours_html}
      </div>
    </div>

    <h4 style="font-size:14px;font-weight:700;color:#DC2626;margin-bottom:10px">If No Action Is Taken</h4>
    {comp_gap_noaction_html}

    {f'<div class="callout" style="margin-top:16px;border-color:#0D9488;background:#F0FDFA">{esc(competitor_gap_opportunity)}</div>' if competitor_gap_opportunity else ''}
    {gate_end}
  </section>

  <section class="section" id="shift">
    <div class="section-header">
      <div class="section-accent" style="background:var(--steel)"></div>
      <h2 class="section-title">Future Risk &mdash; The AI Shift</h2>
    </div>
    {gate_start}
    {ai_shift_html}
    {f'<div class="callout" style="margin-top:16px">{esc(ai_shift_warning)}</div>' if ai_shift_warning else ''}
    {gate_end}
  </section>

  <section class="section" id="matters">
    <div class="section-header">
      <div class="section-accent" style="background:var(--slate)"></div>
      <h2 class="section-title">Why This Matters &mdash; The Full Picture</h2>
    </div>
    {fp_html}
    {f'<p style="margin-top:16px">{esc(full_picture_end)}</p>' if full_picture_end else ''}
  </section>

  <section class="section" id="next">
    <div class="section-header">
      <div class="section-accent" style="background:var(--steel)"></div>
      <h2 class="section-title">Next Steps</h2>
    </div>
    {gate_start}
    {f'<p>{esc(next_intro)}</p>' if next_intro else ''}
    {ns_html}
    {f'<div class="callout" style="margin-top:20px;border-color:#DC2626;background:#FEF2F2;font-weight:600;font-size:14px;line-height:1.8">{esc(final_close)}</div>' if final_close else ''}

    <div class="summary-banner">
      <h3>GEO Boost Engine &mdash; Summary</h3>
      <div class="summary-kpis">
        <div><div class="summary-kpi-label">Visibility</div><div class="summary-kpi-value" style="color:{vis_color}">{vis_score}/100</div></div>
        <div><div class="summary-kpi-label">Trust</div><div class="summary-kpi-value" style="color:{trust_color}">{trust_score}/{trust_max}</div></div>
        <div><div class="summary-kpi-label">AI Status</div><div class="summary-kpi-value" style="color:{ai_color}">{esc(ai_status)}</div></div>
        <div><div class="summary-kpi-label">Revenue Leak</div><div class="summary-kpi-value" style="color:var(--coral)">{esc(rev_range)}/mo</div></div>
      </div>
    </div>
    {gate_end}
  </section>

  <div class="footer-note">
    This report was generated by the GEO Boost Engine &mdash; Full-Stack Visibility &amp; Revenue Intelligence System.<br>
    All estimates are based on industry benchmarks and publicly available data. Figures are presented as ranges.<br>
    Generated {formatted_date} &bull; Confidential
  </div>

</div>

<script>
function showPlan(idx,el){{
  document.querySelectorAll('.plan-content').forEach(c=>c.classList.remove('active'));
  document.querySelectorAll('.plan-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('plan-'+idx).classList.add('active');
  el.classList.add('active');
}}
function showCitability(idx,el){{
  document.querySelectorAll('.citability-content').forEach(c=>c.classList.remove('active'));
  el.parentNode.querySelectorAll('.plan-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('cit-'+idx).classList.add('active');
  el.classList.add('active');
}}
function closeMobileNav(){{document.querySelector('.sidebar').classList.remove('open')}}
// Highlight active nav on scroll
const sections=document.querySelectorAll('.section[id]');
const navLinks=document.querySelectorAll('.nav-link');
const observer=new IntersectionObserver(entries=>{{
  entries.forEach(e=>{{
    if(e.isIntersecting){{
      navLinks.forEach(l=>l.classList.remove('active'));
      const active=document.querySelector('.nav-link[href="#'+e.target.id+'"]');
      if(active)active.classList.add('active');
    }}
  }});
}},{{rootMargin:'-20% 0px -70% 0px'}});
sections.forEach(s=>observer.observe(s));
</script>
</body>
</html>'''


# ============================================================
# CLI ENTRY POINT
# ============================================================
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_html_report.py <json_data_file> [output.html]")
        print("       python generate_html_report.py - [output.html]  (read from stdin)")
        sys.exit(1)

    input_path = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "GEO-BOOST-REPORT.html"

    if input_path == "-":
        data = json.loads(sys.stdin.read())
    else:
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

    html_content = generate_html(data)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

    file_size = os.path.getsize(output_file)
    print(f"HTML report generated: {output_file}")
    print(f"File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
 i am attaching the script that needs to fixed above , the analysis date is showing may 20, 2024 ... update the script above i attached and fix it  ..  dont change anything else
