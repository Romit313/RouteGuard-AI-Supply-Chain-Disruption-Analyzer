import React, { useEffect, useRef, useState } from 'react'

const STEPS = [
  '→ Step 1: Identifying disruptions on route...',
  '→ Scanning geopolitical risk factors...',
  '→ Checking port congestion data...',
  '→ Step 1 complete. Passing disruptions to Step 2...',
  '→ Step 2: Scoring risks and computing alternatives...',
  '→ Evaluating cargo-specific exposure...',
  '→ Generating alternative routing options...',
  '→ Step 2 complete. Synthesizing executive report...',
  '→ Step 3: Writing executive summary and actions...',
  '→ Finalizing analysis...',
]

export default function LoadingState({ origin, dest }) {
  const [logs, setLogs] = useState([
    `[00:00] Initializing RouteGuard AI agentic pipeline...`,
    `[00:01] Route: ${origin} → ${dest}`,
    `[00:02] Sending to local Ollama model...`,
  ])
  const logRef = useRef(null)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < STEPS.length) {
        const t = String(i + 3).padStart(2, '0')
        setLogs(l => [...l, `[00:${t}] ${STEPS[i]}`])
        i++
      }
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: '16px', padding: '60px 20px', textAlign: 'center',
    }}>
      <div style={{
        width: '36px', height: '36px', border: '2px solid var(--border2)',
        borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '16px', color: '#fff' }}>
        Running Agentic Analysis
      </div>
      <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
        3 sequential LLM reasoning steps in progress...
      </div>

      <div ref={logRef} style={{
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '10px 14px',
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
        color: 'var(--muted)', lineHeight: 2, maxHeight: '180px',
        overflowY: 'auto', width: '100%', maxWidth: '520px', textAlign: 'left',
      }}>
        {logs.map((l, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{l.slice(0, 7)}</span>
            <span>{l.slice(7)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
