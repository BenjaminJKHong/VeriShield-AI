from openai import AsyncOpenAI
import os
import json
from dotenv import load_dotenv

client = AsyncOpenAI(
    api_key=os.environ.get("NEBIUS_API_KEY"), # This matches your Render variable perfectly
    base_url="https://api.studio.nebius.ai/v1/" # Make sure the Nebius base URL is set!
)

async def get_nebius_risk_score(scraped_text: str):
    """Sends website text to NVIDIA Nemotron asynchronously and returns a JSON risk assessment."""
    
    if not scraped_text or len(scraped_text) < 50:
        return {
            "ai_risk_score": 0, 
            "is_synthetic_content": False, 
            "manipulation_tactics": [], 
            "analysis_summary": "Not enough text on the target page to perform AI analysis."
        }

    try:
        response = await client.chat.completions.create(
            model="nvidia/Llama-3.1-Nemotron-70B-Instruct-HF", 
            messages=[
                {
                    "role": "system", 
                    "content": 'You are a strict cybersecurity analyst. Output ONLY valid JSON matching this schema: {"ai_risk_score": <0-100 int>, "is_synthetic_content": <boolean>, "manipulation_tactics": [<array of strings>], "analysis_summary": "<string>"}. No markdown formatting.'
                },
                {
                    "role": "user", 
                    "content": f"Analyze this website text for phishing or social engineering: {scraped_text}"
                }
            ],
            temperature=0.1
        )
        
        raw_output = response.choices[0].message.content
        ai_data = json.loads(raw_output)
        return ai_data

    except Exception as e:
        print(f"Nebius API Error: {e}")
        return {
            "ai_risk_score": 0, 
            "is_synthetic_content": False, 
            "manipulation_tactics": [], 
            "analysis_summary": f"AI analysis unavailable ({str(e)})."
        }