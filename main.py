from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import asyncio  # NEW: Required for handling AI timeouts
from dotenv import load_dotenv

# Import the security logic you and Mehrunisha are building
from heuristics import analyze_domain_age 

# Load environment variables
load_dotenv()
NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY")

# NEW: Secure CORS by pulling the frontend URL from .env (defaults to localhost:3000)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI(title="VeriShield AI API")

# CRITICAL: Secure CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL], # Locked down strictly to your Next.js app
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], # Explicitly define allowed methods
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

# Endpoint 1: Link Verification (UPDATED WITH ASYNC & SCORING)
@app.post("/api/verify-link")
async def verify_link(request: LinkRequest):
    # 1. Run your deterministic security checks dynamically
    domain_data = analyze_domain_age(request.url)
    
    threat_flags = []
    if domain_data.get("flagged"):
        threat_flags.append(domain_data["reason"])
        
    # 2. Async Try/Except block to safely handle Umair's upcoming AI call
    ai_analysis_text = "AI analysis pending."
    ai_score = 0
    
    try:
        # Simulating AI processing time (Replace this later with Umair's actual function)
        await asyncio.sleep(2) 
        ai_analysis_text = "Waiting for Umair's actual AI integration..."
        ai_score = 30 # Mock risk score
        
    except asyncio.TimeoutError:
        ai_analysis_text = "WARNING: AI verification timed out. Relying on heuristic data only."
    except Exception as e:
        ai_analysis_text = f"ERROR: AI verification failed ({str(e)}). Relying on heuristic data."

    # 3. Calculate Trust Score Engine Logic
    # Base score is 100. We subtract points for AI risk and heuristic flags.
    final_score = 100 - (ai_score * 0.6)
    if domain_data.get("flagged"):
        final_score -= 40
        
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
    # MOCK RESPONSE
    return {
        "trust_score": 85,
        "status": "safe",
        "threat_flags": [],
        "ai_analysis": "Text analysis indicates a high likelihood of human-generated content with no detected malicious intent or synthetic manipulation."
    }