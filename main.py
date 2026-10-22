from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

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

# Endpoint 1: Link Verification
@app.get("/")
async def root():
    return {"message": "VeriShield AI Backend is Running!"}

@app.post("/api/verify-link")
async def verify_link(request: LinkRequest):
    # TODO: Benjamin & Mehrunisha will add actual URL heuristics here
    # TODO: Umair will add the Nebius Nemotron API call here
    
    # MOCK RESPONSE for Meththani to start building the UI
    return {
        "target_url": request.url,
        "trust_score": 35,
        "status": "warning",
        "threat_flags": [
            "Domain registered less than 7 days ago",
            "Suspicious redirects detected"
        ],
        "ai_analysis": "This URL exhibits patterns commonly associated with credential-harvesting phishing sites."
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
    