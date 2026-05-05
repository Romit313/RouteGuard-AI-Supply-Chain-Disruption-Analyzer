import React from 'react'

const features = [
  { icon: '🔍', title: 'Step 1 — Disruption Scan', desc: 'LLM identifies active geopolitical, weather & port disruptions on your route' },
  { icon: '⚖️', title: 'Step 2 — Risk Scoring',    desc: 'Second LLM call quantifies delay, cost impact, and on-time probability' },
  { icon: '🗺️', title: 'Step 3 — Alt Routes',      desc: 'Third LLM call proposes 2-3 alternative routing strategies' },
  { icon: '💬', title: 'Chat Follow-up',            desc: 'Ask anything about your shipment — analysis context is injected automatically' },
]

export default function WelcomeState() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', gap: '16px', padding: '60px 20px',
    }}>
      <div style={{
        width: '64px', height: '64px', border: '1px solid var(--border2)',
        borderRadius: '16px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '28px', background: 'var(--bg3)',
      }}>🛳️</div>

      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '22px', color: '#fff' }}>
        Agentic Supply Chain Intelligence
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '360px', lineHeight: 1.7 }}>
        Powered by Llama 3 running locally via Ollama — zero cost, zero API keys.
        Uses a <strong style={{ color: '#fff' }}>3-step agentic pipeline</strong> to analyze route risk and recommend alternatives.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '440px', textAlign: 'left', marginTop: '6px' }}>
        {features.map(f => (
          <div key={f.title} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '14px',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>{f.icon}</div>
            <div style={{ fontWeight: 500, fontSize: '12px', color: '#fff', marginBottom: '3px' }}>{f.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: '10px',
        padding: '14px', maxWidth: '380px', textAlign: 'left', fontSize: '12px', color: 'var(--muted)',
      }}>
        <div style={{ color: '#fff', fontWeight: 500, marginBottom: '8px' }}>One-time setup</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', lineHeight: 2.2 }}>
          <div>1. <span style={{ color: 'var(--accent)' }}>brew install ollama</span></div>
          <div>2. <span style={{ color: 'var(--accent)' }}>ollama pull llama3</span></div>
          <div>3. <span style={{ color: 'var(--accent)' }}>OLLAMA_ORIGINS=* ollama serve</span></div>
          <div>4. <span style={{ color: 'var(--accent)' }}>pip install -r requirements.txt</span></div>
          <div>5. <span style={{ color: 'var(--accent)' }}>uvicorn main:app --reload</span></div>
        </div>
      </div>
    </div>
  )
}
