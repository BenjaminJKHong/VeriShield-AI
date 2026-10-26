# VeriShield-AI

**Check before you click.** VeriShield-AI intercepts and evaluates digital content (links, articles, and media) *before* a user engages with it. It combines deterministic cybersecurity checks (the traditional security layer) with multi-step AI reasoning (the verification layer) to detect phishing, deepfakes, and manipulated context, then returns a single, easy-to-read **Trust Score**.

Built for the **Nebius x NVIDIA Global AI Hackathon** (Devpost project: SIPA Signal Forge).

## The Problem

Phishing links and manipulated content look more convincing every day, and most people have no quick way to tell whether something is safe. Security tools catch known-bad URLs but miss new scams. AI alone can hallucinate. VeriShield-AI uses both: hard security signals and AI analysis, merged into one verdict.

## How It Works

```
User pastes URL
      |
      v
Next.js frontend  --->  FastAPI backend (/api/verify-link)
                              |
        +---------------------+----------------------+
        |                                            |
Security heuristics (deterministic)        AI verification layer
- Domain age (WHOIS)                       - Scrape page text (BeautifulSoup)
- SSL/TLS certificate validity             - NVIDIA Nemotron via Nebius Token Factory
- VirusTotal                               - Strict JSON-only output
- Google Safe Browsing
        |                                            |
        +---------------------+----------------------+
                              |
                     Trust Score engine
                              |
                              v
        Verdict Card: Green (safe) / Yellow (warning) / Red (critical)
```

1. The user submits a URL in the web app.
2. The backend runs deterministic heuristics: domain age, SSL/TLS validity, VirusTotal, and Google Safe Browsing.
3. The page text is scraped and sent to NVIDIA Nemotron (hosted on Nebius Token Factory), which returns a structured JSON risk analysis.
4. The Trust Score engine combines the AI risk score with the heuristic flags into a score from 0 to 100.
5. The frontend shows a Verdict Card with the score, status, and the specific threat flags.

### Trust Score

The score starts at 100 and drops with AI-assessed risk and each security flag raised by the heuristics. Status thresholds:

| Score | Status   | Card colour |
|-------|----------|-------------|
| 70-100 | `safe`     | Green  |
| 40-69  | `warning`  | Yellow |
| 0-39   | `critical` | Red    |

If the AI service times out or fails, the backend degrades gracefully and relies on the heuristic data only.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| AI | NVIDIA Nemotron on Nebius Token Factory |
| Scraping | BeautifulSoup |
| Security checks | python-whois, tldextract, Python `ssl`/`socket`, VirusTotal API, Google Safe Browsing API |
| Deployment | Docker, Nebius Cloud |

## Repository Structure

```
VeriShield-AI/
├── main.py            # FastAPI app and API endpoints
├── heuristics.py      # Deterministic security checks (domain age, SSL, VirusTotal, Safe Browsing)
├── scoring.py         # Trust Score logic
├── frontend/          # Next.js web app
├── Dockerfile
├── requirements.txt
└── .env.example       # Environment variable template
```

## API

### `POST /api/verify-link`

Request:
```json
{ "url": "https://example.com" }
```

Response:
```json
{
  "target_url": "https://example.com",
  "analyzed_domain": "example.com",
  "trust_score": 82,
  "status": "safe",
  "threat_flags": [],
  "ai_analysis": "..."
}
```

### `POST /api/verify-content`

Content / deepfake verification for pasted text (`{ "text_content": "..." }`). Returns the same response shape.

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- API keys for Nebius, VirusTotal, and Google Safe Browsing

### Backend
```bash
git clone https://github.com/BenjaminJKHong/VeriShield-AI.git
cd VeriShield-AI
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # then add your keys
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The app runs on `http://localhost:3000` and the API on `http://localhost:8000`.

### Environment Variables

Never commit your `.env` file.

| Variable | Purpose |
|----------|---------|
| `NEBIUS_API_KEY` | Nebius Token Factory (Nemotron) |
| `VIRUSTOTAL_API_KEY` | VirusTotal URL reputation |
| `GOOGLE_SAFE_BROWSING_KEY` | Google Safe Browsing threat lists |
| `FRONTEND_URL` | Allowed CORS origin for the frontend |

### Docker
```bash
docker build -t verishield-ai .
docker run -p 8000:8000 --env-file .env verishield-ai
```

## Team

| Member | Role |
|--------|------|
| Benjamin Hong | Team lead, FastAPI backend, Trust Score engine |
| Qais Ahmad Amro | Frontend architecture (React/Next.js, Tailwind) |
| Meththani Kalubowila | Frontend API integration, state, loading and error UI |
| Umair | AI pipeline: scraper, Nebius API, Nemotron prompt engineering |
| Mehrunisha Applanaidu | Security heuristics (SSL, VirusTotal, Safe Browsing), documentation, demo |

## License

Released under the [MIT License](LICENSE).

## Acknowledgements

Built with NVIDIA Nemotron and Nebius Token Factory for the Nebius x NVIDIA Global AI Hackathon.
