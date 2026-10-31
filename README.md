# VeriShield-AI

> **Advanced AI-Driven Verification & Security System** — Intercept, evaluate, and verify digital content before engagement using deterministic cybersecurity checks combined with multi-step AI reasoning.

VeriShield-AI bridges the gap between traditional security layers and intelligent verification. It detects phishing, deepfakes, and manipulated context across links, articles, and media through an integrated pipeline of automated heuristics and large-language-model analysis.

---

## Key Features

- **Multi-Modal Verification**
  - Link verification (`/api/verify-link`) with domain age analysis, SSL/TLS inspection, and AI assessment.
  - Content verification (`/api/verify-content`) for deepfake and synthetic-text detection.
- **Automated Security Analysis**
  - Deterministic checks via `heuristics.py` (WHOIS domain age, SSL certificate validity, expiration tracking).
  - Dynamic scraping and text extraction (`scraper.py`) for real-time site evaluation.
- **Real-Time AI Detection**
  - Integration with Nebius AI (`nvidia/Llama-3.1-Nemotron-70B-Instruct-HF`) via `ai_pipeline.py`.
  - Structured JSON risk scoring (`ai_risk_score`, `manipulation_tactics`, `analysis_summary`).
- **Developer Integration**
  - FastAPI backend with CORS configuration and Pydantic request models.
  - Next.js frontend with responsive UI components.
  - Docker containerization for consistent deployment.
  - Environment-based configuration (`.env`) for API keys and frontend URLs.

---

## Tech Stack

### Backend & Core
- **Python 3.11+** — FastAPI, Pydantic, Uvicorn
- **Security & Scraping** — `python-whois`, `tldextract`, `beautifulsoup4`, `requests`, `ssl` / `socket`
- **AI / LLM** — `openai>=1.0.0` (Nebius-compatible endpoint), `nvidia/Llama-3.1-Nemotron-70B-Instruct-HF`
- **Utilities** — `python-dotenv`, `tldextract`, `aiohttp`

### Frontend
- **Framework** — Next.js (TypeScript / React)
- **Styling** — Tailwind CSS (via `globals.css`, component library)
- **Deployment** — Dockerized (`frontend/Dockerfile`), Vercel-ready (`next.config.ts`)

### DevOps & Integration
- **Containerization** — Docker (`Dockerfile`, `.dockerignore`)
- **API Integration** — Nebius Studio (`https://api.studio.nebius.ai/v1/`)
- **Environment Management** — `.env` with `NEBIUS_API_KEY` and `FRONTEND_URL`

---

## Getting Started / Installation Guide

### 1. Clone the repository
```bash
git clone https://github.com/your-org/VeriShield-AI.git
cd VeriShield-AI
```

### 2. Install backend dependencies
```bash
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### 3. Configure environment variables
Copy `.env.example` to `.env` (create if needed) and fill in your keys:
```env
NEBIUS_API_KEY=your_nebius_api_key_here
FRONTEND_URL=http://localhost:3000
```
> The backend pulls the allowed CORS origin from `FRONTEND_URL` automatically.

### 4. Start the backend server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`.

### 5. Install and run the frontend (optional)
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:3000` by default.

---

## Usage & Features Showcase

### Verify a Link
Send a POST request to `/api/verify-link`:
```bash
curl -X POST http://localhost:8000/api/verify-link \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```
**Response includes:**
- `target_url` — analyzed URL
- `analyzed_domain` — extracted domain
- `trust_score` (0–100)
- `status` (`safe` / `warning` / `critical`)
- `threat_flags` — array of detected risks
- `ai_analysis` — LLM-generated summary and tactics

### Verify Content
Send a POST request to `/api/verify-content`:
```bash
curl -X POST http://localhost:8000/api/verify-content \
  -H "Content-Type: application/json" \
  -d '{"text_content":"Your text content here..."}'
```

### CLI / Programmatic Access
Import modules directly for custom pipelines:
```python
from heuristics import analyze_domain_age, analyze_ssl
from ai_pipeline import get_nebius_risk_score
from scraper import scrape_website_text
from scoring import calculate_trust_score
```

---

## Architecture Overview

VeriShield-AI operates through a deterministic + intelligent end-to-end pipeline:

```
User / Client
    |
    v
+-------------------+     +-------------------+     +-------------------+
|  Frontend         | --> |  FastAPI Backend  | --> |  Heuristics       |
|  (Next.js)        |     |  (main.py)        |     |  (Domain / SSL)   |
+-------------------+     +-------------------+     +-------------------+
                                  |
                                  v
                         +-------------------+
                         |  Scraper          |
                         |  (BeautifulSoup)  |
                         +-------------------+
                                  |
                                  v
                         +-------------------+
                         |  Nebius AI        |
                         |  (Nemotron 70B)   |
                         +-------------------+
                                  |
                                  v
                         +-------------------+
                         |  Scoring Engine   |
                         |  (heuristics + AI)|
                         +-------------------+
                                  |
                                  v
                         +-------------------+
                         |  Response         |
                         |  (JSON / UI)      |
                         +-------------------+
```

1. **Ingestion** — User submits a URL or text content.
2. **Deterministic Layer** — Domain age (WHOIS) and SSL/TLS certificates are evaluated by `heuristics.py`.
3. **Scraping** — `scraper.py` extracts visible text (max 4000 chars) for AI input.
4. **AI Analysis** — `ai_pipeline.py` sends structured prompts to the Nebius endpoint; returns JSON risk scores.
5. **Score Aggregation** — The backend calculates a composite `trust_score` (0–100) and returns threat flags, status classification, and analysis summaries.

---

## Contributing

We welcome contributions, bug reports, and feature requests.

1. **Fork** the repository and create a feature branch.
2. **Open an Issue** for significant changes or bugs (`https://github.com/your-org/VeriShield-AI/issues`).
3. **Pull Requests** should include:
   - Clear description of the change.
   - Updated documentation (if applicable).
   - Passing tests / verified backend functionality.
4. Follow existing code style and naming conventions (`heuristics.py`, `ai_pipeline.py`, `scoring.py`).

---

## License

VeriShield-AI is released under the **MIT License**.

```text
MIT License

Copyright (c) 2026 VeriShield-AI Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

*Built for verification, security, and intelligent digital defense.*
