from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Import the security logic you and Mehrunisha are building
from heuristics import analyze_domain_age 

# Load environment variables (your Nebius API Key)
load_dotenv()
NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY")

app = FastAPI(title="VeriShield AI API")

# CRITICAL: CORS configuration so Meththani's frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
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

# Endpoint 1: Link Verification (UPDATED)
@app.post("/api/verify-link")
async def verify_link(request: LinkRequest):
    # 1. Run your deterministic security checks dynamically
    domain_data = analyze_domain_age(request.url)
    
    threat_flags = []
    if domain_data.get("flagged"):
        threat_flags.append(domain_data["reason"])
        
    # TODO: Umair will pass request.url and threat_flags to Nemotron here
    
    # 2. Return the dynamic data to Qais and Meththani
    return {
        "target_url": request.url,
        "analyzed_domain": domain_data.get("domain", "Unknown"),
        "status": "warning" if domain_data.get("flagged") else "safe",
        "threat_flags": threat_flags,
        "ai_analysis": "Waiting for AI integration..."
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