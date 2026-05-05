from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
import re
from typing import Optional
 
app = FastAPI(title="RouteGuard AI", version="1.0.0")
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
OLLAMA_URL = "http://localhost:11434"
 
 
class ShipmentRequest(BaseModel):
    origin: str
    destination: str
    mode: str
    cargo: str
    timeline: str
    value: str
    special: Optional[str] = ""
    model: Optional[str] = "llama3"
 
class ChatRequest(BaseModel):
    question: str
    context: str
    model: Optional[str] = "llama3"
 
 
def extract_json(text: str):
    text = re.sub(r"```json|```", "", text).strip()
    match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
    if not match:
        raise ValueError(f"No JSON found. Got: {text[:200]}")
    raw = match.group()
    raw = re.sub(r",\s*([}\]])", r"\1", raw)
    return json.loads(raw)
 
 
async def ollama_generate(prompt: str, model: str) -> str:
    async with httpx.AsyncClient(timeout=180.0) as client:
        resp = await client.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
                "format": "json",
                "options": {"temperature": 0.1}
            },
        )
        resp.raise_for_status()
        return resp.json()["response"]
 
 
async def step1_disruptions(s: ShipmentRequest) -> list:
    prompt = f"""You are a supply chain risk analyst. Identify 3 active disruptions for this shipment in 2024-2025.
 
Route: {s.origin} to {s.destination}
Transport Mode: {s.mode}
Cargo: {s.cargo}
 
Return a JSON object with a disruptions array. Each disruption must be specific to this route's geography:
{{
  "disruptions": [
    {{
      "icon": "🚢",
      "title": "disruption name",
      "severity": "HIGH",
      "description": "Two sentences about this disruption specific to this route.",
      "location": "specific place on this route",
      "delayDays": "5-10 days",
      "type": "geopolitical"
    }},
    {{
      "icon": "⚓",
      "title": "disruption name",
      "severity": "MEDIUM",
      "description": "Two sentences about this disruption specific to this route.",
      "location": "specific place",
      "delayDays": "3-5 days",
      "type": "port"
    }},
    {{
      "icon": "📋",
      "title": "disruption name",
      "severity": "MEDIUM",
      "description": "Two sentences about this disruption specific to this route.",
      "location": "specific place",
      "delayDays": "2-4 days",
      "type": "regulatory"
    }}
  ]
}}"""
    raw = await ollama_generate(prompt, s.model)
    result = extract_json(raw)
    if isinstance(result, list):
        return result
    return result.get("disruptions", [])
 
 
async def step2_scoring(s: ShipmentRequest, disruptions: list) -> dict:
    prompt = f"""You are a supply chain risk scoring expert.
 
Route: {s.origin} to {s.destination}
Mode: {s.mode}, Cargo: {s.cargo}, Value: {s.value}, Timeline: {s.timeline}
 
Return a JSON object with risk scores and 2 alternative routes:
{{
  "overallRisk": "HIGH",
  "riskScore": 72,
  "estimatedDelay": "7-14 days",
  "costImpactPct": 18,
  "onTimeProb": 45,
  "riskBreakdown": {{
    "geopolitical": 75,
    "weather": 20,
    "portCongestion": 60,
    "regulatory": 40,
    "capacity": 30
  }},
  "alternativeRoutes": [
    {{
      "name": "name of first alternative route",
      "description": "description of first alternative",
      "costChange": "+15%",
      "timeChange": "+5 days",
      "riskReduction": "35%",
      "tradeoff": "tradeoff description"
    }},
    {{
      "name": "name of second alternative route",
      "description": "description of second alternative",
      "costChange": "+25%",
      "timeChange": "-2 days",
      "riskReduction": "50%",
      "tradeoff": "tradeoff description"
    }}
  ]
}}"""
    raw = await ollama_generate(prompt, s.model)
    return extract_json(raw)
 
 
async def step3_summary(s: ShipmentRequest, disruptions: list, scoring: dict) -> dict:
    prompt = f"""You are a supply chain VP writing an executive briefing.
 
Route: {s.origin} to {s.destination}
Transport Mode: {s.mode}
Cargo: {s.cargo}, Value: {s.value}, Timeline: {s.timeline}
Risk Level: {scoring.get("overallRisk")}, Score: {scoring.get("riskScore")}/100
Estimated Delay: {scoring.get("estimatedDelay")}, Cost Impact: +{scoring.get("costImpactPct")}%
 
Return a JSON object:
{{
  "executiveSummary": "Three sentences about risk for this shipment via {s.mode} from {s.origin} to {s.destination}.",
  "cargoSpecificRisks": "One sentence about risks for {s.cargo} on this route.",
  "immediateActions": [
    "action 1 for this shipment",
    "action 2 for this shipment",
    "action 3 for this shipment"
  ]
}}"""
    raw = await ollama_generate(prompt, s.model)
    return extract_json(raw)
 
 
@app.get("/health")
async def health():
    return {"status": "ok"}
 
 
@app.get("/ollama/status")
async def ollama_status():
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{OLLAMA_URL}/api/tags")
            resp.raise_for_status()
            models = [m["name"] for m in resp.json().get("models", [])]
            return {"connected": True, "models": models}
    except Exception:
        return {"connected": False, "models": []}
 
 
@app.post("/analyze")
async def analyze(req: ShipmentRequest):
    try:
        disruptions = await step1_disruptions(req)
    except Exception as e:
        raise HTTPException(500, f"Step 1 (disruption identification) failed: {e}")
    try:
        scoring = await step2_scoring(req, disruptions)
    except Exception as e:
        raise HTTPException(500, f"Step 2 (risk scoring) failed: {e}")
    try:
        summary = await step3_summary(req, disruptions, scoring)
    except Exception as e:
        raise HTTPException(500, f"Step 3 (executive summary) failed: {e}")
 
    return {"disruptions": disruptions, **scoring, **summary}
 
 
@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        try:
            ctx = json.loads(req.context)
            origin      = ctx.get("origin", "unknown")
            destination = ctx.get("destination", "unknown")
            cargo       = ctx.get("cargo", "general cargo")
            risk        = ctx.get("overallRisk", "MEDIUM")
            score       = ctx.get("riskScore", "50")
            delays      = ctx.get("estimatedDelay", "unknown")
        except Exception:
            origin = destination = cargo = risk = score = delays = ""
 
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{OLLAMA_URL}/api/chat",
                json={
                    "model": req.model,
                    "stream": False,
                    "options": {"temperature": 0.4},
                    "messages": [
                        {"role": "system", "content": f"You are RouteGuard AI, a supply chain expert. Shipment: {cargo} from {origin} to {destination}. Risk: {risk} ({score}/100). Delay: {delays}. Answer in 3-4 sentences, plain text only."},
                        {"role": "user", "content": req.question}
                    ]
                },
            )
            resp.raise_for_status()
            reply = resp.json().get("message", {}).get("content", "").strip()
            if not reply:
                raise ValueError("Empty response")
            return {"reply": reply}
    except Exception as e:
        raise HTTPException(500, f"Chat error: {str(e)}")