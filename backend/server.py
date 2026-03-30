from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="GEO Boost Engine API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ MODELS ============

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Business Lead Model
class BusinessLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_name: str
    website: str
    location: str
    owner_name: str
    email: str
    phone: str
    business_type: str
    payment_status: str = "pending"
    payment_session_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BusinessLeadCreate(BaseModel):
    business_name: str
    website: str
    location: str
    owner_name: str
    email: EmailStr
    phone: str
    business_type: str

# Free Lead Model (for free report opt-in)
class FreeLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_name: str
    email: str
    location: str
    report_sent: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FreeLeadCreate(BaseModel):
    business_name: str
    email: EmailStr
    location: str

# Payment Models
class PaymentSessionCreate(BaseModel):
    lead_id: str
    success_url: str
    cancel_url: str

class PaymentSessionResponse(BaseModel):
    checkout_url: str
    session_id: str

class PaymentWebhook(BaseModel):
    event_type: str
    session_id: str
    lead_id: Optional[str] = None

# ============ EMAIL SERVICE ============

def send_report_email(to_email: str, owner_name: str, business_name: str):
    """Send report delivery email via SendGrid"""
    sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
    sender_email = os.environ.get('SENDER_EMAIL', 'noreply@geoboost.com')
    
    if not sendgrid_api_key or sendgrid_api_key == 'YOUR_SENDGRID_API_KEY_HERE':
        logger.warning("SendGrid API key not configured. Email not sent.")
        return False
    
    subject = f"Your AI Visibility Report is Ready - {business_name}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #059669 0%, #10B981 100%); padding: 40px 30px; text-align: center; }}
            .header h1 {{ color: white; margin: 0; font-size: 28px; }}
            .content {{ padding: 40px 30px; }}
            .content h2 {{ color: #1f2937; margin-top: 0; }}
            .content p {{ color: #4b5563; line-height: 1.7; }}
            .highlight-box {{ background: #f0fdf4; border-left: 4px solid #10B981; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }}
            .cta-button {{ display: inline-block; background: #10B981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }}
            .footer {{ background: #1f2937; padding: 30px; text-align: center; color: #9ca3af; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>GEO Boost Engine</h1>
            </div>
            <div class="content">
                <h2>Hi {owner_name},</h2>
                <p>Great news! Your AI Visibility Report for <strong>{business_name}</strong> is now ready.</p>
                
                <div class="highlight-box">
                    <strong>What's inside your report:</strong>
                    <ul style="color: #4b5563; margin: 10px 0;">
                        <li>Complete AI Visibility Audit across 30+ signals</li>
                        <li>Competitor Breakdown Analysis</li>
                        <li>Custom Fix Plan with prioritized actions</li>
                        <li>AI Signal Checklist for ongoing optimization</li>
                    </ul>
                </div>
                
                <p>Our team has analyzed your business presence across ChatGPT, Google AI, Perplexity, and Bing Copilot. You'll find specific, actionable recommendations to improve your AI visibility and start getting recommended to more customers.</p>
                
                <p>Your report will be delivered to this email within the next 24-48 hours.</p>
                
                <p>If you have any questions, simply reply to this email.</p>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>The GEO Boost Team</strong>
                </p>
            </div>
            <div class="footer">
                <p>© 2026 GEO Boost Engine. All rights reserved.</p>
                <p>You're receiving this because you purchased an AI Visibility Report.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        message = Mail(
            from_email=Email(sender_email, "GEO Boost Engine"),
            to_emails=To(to_email),
            subject=subject,
            html_content=Content("text/html", html_content)
        )
        
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        logger.info(f"Email sent to {to_email}, status: {response.status_code}")
        return response.status_code == 202
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

# ============ ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "GEO Boost Engine API", "version": "1.0.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# ============ BUSINESS LEAD ENDPOINTS ============

@api_router.post("/leads", response_model=BusinessLead)
async def create_lead(lead_data: BusinessLeadCreate):
    """Create a new business lead"""
    lead = BusinessLead(**lead_data.model_dump())
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.leads.insert_one(doc)
    logger.info(f"New lead created: {lead.id} - {lead.business_name}")
    return lead

@api_router.get("/leads/{lead_id}", response_model=BusinessLead)
async def get_lead(lead_id: str):
    """Get a lead by ID"""
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    if isinstance(lead['created_at'], str):
        lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return lead

# ============ FREE LEAD ENDPOINTS ============

def send_free_report_email(to_email: str, business_name: str):
    """Send free report email via SendGrid"""
    sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
    sender_email = os.environ.get('SENDER_EMAIL', 'noreply@geoboost.com')
    
    if not sendgrid_api_key or sendgrid_api_key == 'YOUR_SENDGRID_API_KEY_HERE':
        logger.warning("SendGrid API key not configured. Free report email not sent.")
        return False
    
    subject = f"Your Free AI Visibility Snapshot - {business_name}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #059669 0%, #10B981 100%); padding: 40px 30px; text-align: center; }}
            .header h1 {{ color: white; margin: 0; font-size: 24px; }}
            .header p {{ color: rgba(255,255,255,0.8); margin-top: 8px; font-size: 14px; }}
            .content {{ padding: 40px 30px; }}
            .content h2 {{ color: #1f2937; margin-top: 0; font-size: 20px; }}
            .content p {{ color: #4b5563; line-height: 1.7; }}
            .snapshot-box {{ background: #f0fdf4; border: 2px solid #10B981; padding: 24px; margin: 24px 0; border-radius: 12px; }}
            .snapshot-title {{ color: #059669; font-weight: bold; font-size: 18px; margin-bottom: 16px; }}
            .insight {{ background: white; border-left: 4px solid #10B981; padding: 16px; margin: 12px 0; border-radius: 0 8px 8px 0; }}
            .insight-title {{ font-weight: bold; color: #1f2937; margin-bottom: 4px; }}
            .insight-text {{ color: #6b7280; font-size: 14px; }}
            .cta-box {{ background: #1f2937; border-radius: 12px; padding: 24px; text-align: center; margin-top: 24px; }}
            .cta-box h3 {{ color: white; margin: 0 0 8px 0; }}
            .cta-box p {{ color: #9ca3af; font-size: 14px; margin: 0 0 16px 0; }}
            .cta-button {{ display: inline-block; background: #10B981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; }}
            .footer {{ background: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 13px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>GEO Boost Engine</h1>
                <p>Free AI Visibility Snapshot</p>
            </div>
            <div class="content">
                <h2>Your Free Snapshot for {business_name}</h2>
                <p>Thank you for requesting your free AI visibility snapshot! Here's a quick overview of how businesses like yours typically appear across AI platforms.</p>
                
                <div class="snapshot-box">
                    <div class="snapshot-title">📊 Quick Visibility Overview</div>
                    
                    <div class="insight">
                        <div class="insight-title">1. AI Platform Coverage</div>
                        <div class="insight-text">Most local businesses are only visible on 1-2 AI platforms out of 4+ major ones. ChatGPT, Google AI, Perplexity, and Bing Copilot all use different signals to recommend businesses.</div>
                    </div>
                    
                    <div class="insight">
                        <div class="insight-title">2. Common Visibility Gap</div>
                        <div class="insight-text">Over 70% of local businesses we analyze have inconsistent business information across the web, which confuses AI systems and reduces recommendations.</div>
                    </div>
                    
                    <div class="insight">
                        <div class="insight-title">3. Quick Win Opportunity</div>
                        <div class="insight-text">Businesses that optimize their Google Business Profile and get mentioned on local directories see an average 40% improvement in AI recommendations within 30 days.</div>
                    </div>
                </div>
                
                <p>This snapshot gives you a general overview. For a <strong>complete, personalized audit</strong> of your specific business — including competitor analysis, your exact visibility score, and a step-by-step fix plan — consider our full AI Visibility Report.</p>
                
                <div class="cta-box">
                    <h3>Want the Full Picture?</h3>
                    <p>Get your complete AI Visibility Report with 30+ analyzed signals, competitor breakdown, and exact fixes.</p>
                    <a href="https://citacy.com" class="cta-button">Get Full Report – $199</a>
                </div>
            </div>
            <div class="footer">
                <p>© 2026 GEO Boost Engine. All rights reserved.</p>
                <p>You're receiving this because you requested a free AI visibility snapshot.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        message = Mail(
            from_email=Email(sender_email, "GEO Boost Engine"),
            to_emails=To(to_email),
            subject=subject,
            html_content=Content("text/html", html_content)
        )
        
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        logger.info(f"Free report email sent to {to_email}, status: {response.status_code}")
        return response.status_code == 202
    except Exception as e:
        logger.error(f"Failed to send free report email: {str(e)}")
        return False

@api_router.post("/free-leads", response_model=FreeLead)
async def create_free_lead(lead_data: FreeLeadCreate, background_tasks: BackgroundTasks):
    """Create a new free lead and send free report email"""
    lead = FreeLead(**lead_data.model_dump())
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.free_leads.insert_one(doc)
    logger.info(f"New free lead created: {lead.id} - {lead.business_name}")
    
    # Send free report email in background
    background_tasks.add_task(
        send_free_report_email,
        lead.email,
        lead.business_name
    )
    
    # Update report_sent status
    await db.free_leads.update_one(
        {"id": lead.id},
        {"$set": {"report_sent": True}}
    )
    
    return lead

# ============ PAYMENT ENDPOINTS ============

@api_router.post("/payments/create-session", response_model=PaymentSessionResponse)
async def create_payment_session(data: PaymentSessionCreate):
    """
    Create a payment checkout session.
    This is a flexible endpoint that can work with different payment providers.
    Configure PAYMENT_PROVIDER in .env (stripe, paypal, razorpay, etc.)
    """
    payment_provider = os.environ.get('PAYMENT_PROVIDER', 'demo')
    
    # Verify lead exists
    lead = await db.leads.find_one({"id": data.lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    session_id = str(uuid.uuid4())
    
    if payment_provider == 'stripe':
        # Stripe integration (when API key is available)
        stripe_key = os.environ.get('STRIPE_SECRET_KEY')
        if stripe_key and stripe_key != 'YOUR_STRIPE_SECRET_KEY_HERE':
            try:
                import stripe
                stripe.api_key = stripe_key
                
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[{
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                                'name': 'AI Visibility Report',
                                'description': 'Complete AI visibility audit with actionable fixes',
                            },
                            'unit_amount': 19900,  # $199.00 in cents
                        },
                        'quantity': 1,
                    }],
                    mode='payment',
                    success_url=data.success_url + f"?session_id={session_id}&lead_id={data.lead_id}",
                    cancel_url=data.cancel_url,
                    metadata={
                        'lead_id': data.lead_id,
                        'session_id': session_id
                    }
                )
                
                # Update lead with session ID
                await db.leads.update_one(
                    {"id": data.lead_id},
                    {"$set": {"payment_session_id": checkout_session.id}}
                )
                
                return PaymentSessionResponse(
                    checkout_url=checkout_session.url,
                    session_id=checkout_session.id
                )
            except Exception as e:
                logger.error(f"Stripe error: {str(e)}")
                raise HTTPException(status_code=500, detail="Payment provider error")
    
    # Demo mode - simulate payment flow
    # In production, replace with your payment provider
    demo_checkout_url = f"{data.success_url}?session_id={session_id}&lead_id={data.lead_id}&demo=true"
    
    await db.leads.update_one(
        {"id": data.lead_id},
        {"$set": {"payment_session_id": session_id}}
    )
    
    logger.info(f"Demo payment session created for lead {data.lead_id}")
    
    return PaymentSessionResponse(
        checkout_url=demo_checkout_url,
        session_id=session_id
    )

@api_router.post("/payments/confirm")
async def confirm_payment(lead_id: str, session_id: str, background_tasks: BackgroundTasks):
    """
    Confirm payment and trigger email delivery.
    Called after successful payment redirect.
    """
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Update payment status
    await db.leads.update_one(
        {"id": lead_id},
        {"$set": {"payment_status": "completed"}}
    )
    
    # Send confirmation email in background
    background_tasks.add_task(
        send_report_email,
        lead['email'],
        lead['owner_name'],
        lead['business_name']
    )
    
    logger.info(f"Payment confirmed for lead {lead_id}")
    
    return {
        "status": "success",
        "message": "Payment confirmed. Report delivery email sent.",
        "lead_id": lead_id
    }

@api_router.post("/payments/webhook")
async def payment_webhook(webhook: PaymentWebhook, background_tasks: BackgroundTasks):
    """
    Handle payment provider webhooks.
    Configure webhook URL in your payment provider dashboard.
    """
    logger.info(f"Webhook received: {webhook.event_type}")
    
    if webhook.event_type == "payment.completed":
        if webhook.lead_id:
            lead = await db.leads.find_one({"id": webhook.lead_id}, {"_id": 0})
            if lead:
                await db.leads.update_one(
                    {"id": webhook.lead_id},
                    {"$set": {"payment_status": "completed"}}
                )
                background_tasks.add_task(
                    send_report_email,
                    lead['email'],
                    lead['owner_name'],
                    lead['business_name']
                )
    
    return {"status": "received"}

# ============ ANALYTICS TRACKING ENDPOINT ============

class TrackingEvent(BaseModel):
    event_name: str
    event_data: dict = {}
    page_url: Optional[str] = None
    user_agent: Optional[str] = None

@api_router.post("/track")
async def track_event(event: TrackingEvent):
    """Track conversion events for analytics"""
    doc = {
        "id": str(uuid.uuid4()),
        "event_name": event.event_name,
        "event_data": event.event_data,
        "page_url": event.page_url,
        "user_agent": event.user_agent,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.analytics_events.insert_one(doc)
    logger.info(f"Tracked event: {event.event_name}")
    return {"status": "tracked"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
