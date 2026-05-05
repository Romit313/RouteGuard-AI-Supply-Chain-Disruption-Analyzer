# RouteGuard AI
**Supply Chain Disruption Analyzer | Powered by Meta Llama 3 via Ollama**

## Business Problem
Supply chain managers spend hours manually scanning news feeds, port alerts, and geopolitical updates to assess shipment risks. This process is slow, inconsistent, and reactive. Issues are discovered after delays already occur.

RouteGuard AI automates this with a 3-step agentic AI pipeline that delivers a full risk report with alternative routes in under 60 seconds.

## Features
- **Active Disruptions** - top 3 disruptions specific to the route geography
- **Risk Score** - CRITICAL / HIGH / MEDIUM / LOW with a 0-100 score
- **On-Time Probability** - likelihood of delivery within scheduled timeline
- **Cost Impact** - estimated percentage increase in shipping costs
- **Risk Breakdown** - geopolitical, weather, port congestion, regulatory, capacity
- **Alternative Routes** - 2 alternatives with cost and time tradeoffs
- **Executive Summary** - C-suite briefing with immediate actions
- **Chat Follow-up** - ask follow-up questions with full analysis context
- **Transport Validation** - 30+ IATA/IMDG/IAEA rules block invalid cargo-mode combinations

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | FastAPI (Python) |
| LLM Runtime | Ollama (local) |
| LLM Model | Meta Llama 3 |
| HTTP Client | Axios / httpx |

## How It Works
Three sequential LLM calls where each step feeds into the next:
1. **Disruption Identification** - finds active disruptions on the specific route
2. **Risk Scoring** - scores risk dimensions and proposes alternative routes
3. **Executive Summary** - synthesizes everything into a C-suite briefing

## Setup
1. Install Ollama from https://ollama.com and run `ollama pull llama3`
2. Start Ollama: `$env:OLLAMA_ORIGINS="*"` then `ollama serve`
3. Backend: `cd backend` then `pip install -r requirements.txt` then `uvicorn main:app --reload`
4. Frontend: `cd frontend` then `npm install` then `npm run dev`
5. Open http://localhost:5173

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/ollama/status` | Ollama connection and models |
| POST | `/analyze` | Run 3-step agentic analysis |
| POST | `/chat` | Follow-up Q&A |

API docs available at http://localhost:8000/docs
