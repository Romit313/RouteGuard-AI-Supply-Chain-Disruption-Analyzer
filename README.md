# RouteGuard AI 🛳️
### Supply Chain Disruption Analyzer
**Powered by Meta Llama 3 via Ollama · Zero cost · No API keys**

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | FastAPI (Python) |
| LLM Runtime | Ollama (local) |
| LLM Model | Meta Llama 3 (free) |
| HTTP Client | Axios (frontend) · httpx (backend) |

---

## How It Works — Agentic Pipeline

This app uses a **3-step agentic LLM pipeline**. Each step is a separate LLM call that builds on the previous:

```
User Input
    │
    ▼
Step 1: Disruption Identification
  └─ LLM identifies top 3 active disruptions on the route
    │
    ▼
Step 2: Risk Scoring + Alternative Routes
  └─ LLM scores each risk dimension, computes on-time probability,
     proposes 2-3 alternative routing strategies
    │
    ▼
Step 3: Executive Summary + Immediate Actions
  └─ LLM synthesizes steps 1+2 into a C-suite briefing
     with specific immediate actions
    │
    ▼
React Dashboard (live results)
    │
    ▼
Chat Follow-up (contextual Q&A with full analysis injected)
```

---

## Setup

### 1. Install & Start Ollama
```bash
# macOS
brew install ollama

# Windows/Linux: download from https://ollama.com

# Pull the model (one-time, ~4GB)
ollama pull llama3

# Start Ollama with CORS enabled
OLLAMA_ORIGINS=* ollama serve
```

### 2. Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App
Navigate to **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Backend health check |
| GET | `/ollama/status` | Check Ollama connection + list models |
| POST | `/analyze` | Run 3-step agentic analysis |
| POST | `/chat` | Follow-up Q&A with analysis context |

Auto-generated API docs: **http://localhost:8000/docs**

---

## Project Structure
```
routeguard/
├── backend/
│   ├── main.py          # FastAPI app — 3-step agentic pipeline
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx                        # Root component + state
        ├── main.jsx                       # React entry point
        ├── index.css                      # Global styles
        ├── components/
        │   ├── Header.jsx                 # Top nav + Ollama status
        │   ├── ShipmentForm.jsx           # Left sidebar form
        │   ├── WelcomeState.jsx           # Initial empty state
        │   ├── LoadingState.jsx           # Agent log animation
        │   ├── ResultsDashboard.jsx       # Main results view
        │   └── ChatPanel.jsx             # Follow-up Q&A
        ├── hooks/
        │   └── useOllamaStatus.js        # Custom hook for Ollama health
        └── utils/
            └── api.js                    # Axios API calls
```

---

## Business Problem Solved

Supply chain managers spend hours manually scanning news feeds, port alerts, and geopolitical updates to assess shipment risks. This process is:
- **Slow**: Takes 2-4 hours per route assessment
- **Inconsistent**: Different analysts reach different conclusions
- **Reactive**: Issues discovered after delays occur

RouteGuard AI automates this with a multi-step AI agent that delivers a scored risk report with alternative routes in under 60 seconds.
