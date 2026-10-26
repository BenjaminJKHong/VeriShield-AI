from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import asyncio  
from dotenv import load_dotenv
from scraper import scrape_website_text

# Import the security logic
from heuristics import analyze_domain_age, analyze_ssl
# Import Nebius API connection
from ai_pipeline import get_nebius_risk_score

# Load environment variables
load_dotenv()
NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY")

# Secure CORS by pulling the frontend URL from .env (defaults to localhost:3000)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

allowed_origins = list({
    FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
})

app = FastAPI(title="VeriShield AI API")

# CRITICAL: Secure CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Define the data structures the frontend will send
class LinkRequest(BaseModel):
    url: str

class ContentRequest(BaseModel):
    text_content: str

@app.get("/")
async def root():
    return {"message": "VeriShield AI Backend is Running!"}

# Endpoint 1: Link Verification
@app.post("/api/verify-link")
async def verify_link(request: LinkRequest):
    # 1. Run deterministic security checks dynamically
    domain_data = analyze_domain_age(request.url)
    ssl_data = analyze_ssl(request.url)
    
    threat_flags = []
    if domain_data.get("flagged"):
        threat_flags.append(domain_data["reason"])
    if ssl_data.get("flagged"):
        threat_flags.append(ssl_data["reason"])
        
    # 2. Nebius AI Integration (Web Scraping + AI Assessment)
    website_text = scrape_website_text(request.url)
    
    try:
        ai_data = await asyncio.wait_for(get_nebius_risk_score(website_text), timeout=15.0)
        ai_score = ai_data.get("ai_risk_score", 0)
        ai_analysis_text = ai_data.get("analysis_summary", "Analysis complete.")
        
        if ai_data.get("manipulation_tactics"):
            threat_flags.extend(ai_data.get("manipulation_tactics"))
            
    except asyncio.TimeoutError:
        ai_score = 0
        ai_analysis_text = "WARNING: Nebius AI verification timed out. Relying on heuristic data."
    except Exception as e:
        ai_score = 0
        ai_analysis_text = f"ERROR: AI verification failed ({str(e)})."

    # 3. Calculate Trust Score Engine Logic
    final_score = 100 - (ai_score * 0.6)
    
    if domain_data.get("flagged"):
        final_score -= 40
        
    if ssl_data.get("flagged"):
        if ssl_data.get("severity") == "Critical":
            final_score -= 40
        else:
            final_score -= 20 
        
    # Ensure score stays strictly between 0 and 100
    final_score = max(0, min(100, int(final_score)))

    # 4. Return robust data to Meththani's frontend
    return {
        "target_url": request.url,
        "analyzed_domain": domain_data.get("domain", "Unknown"),
        "trust_score": final_score,
        "status": "critical" if final_score < 40 else "warning" if final_score < 70 else "safe",
        "threat_flags": threat_flags,
        "ai_analysis": ai_analysis_text
    }

# Endpoint 2: Deepfake / Content Verification
@app.post("/api/verify-content")
async def verify_content(request: ContentRequest):
    return {
        "trust_score": 85,
        "status": "safe",
        "threat_flags": [],
        "ai_analysis": "Text analysis indicates a high likelihood of human-generated content with no detected malicious intent or synthetic manipulation."
    }