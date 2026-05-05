import React from 'react'

const s = {
  header: {
    background: 'var(--bg2)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    height: '56px',
    gap: '12px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: '18px',
    letterSpacing: '-0.5px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    width: '8px',
    height: '8px',
    background: 'var(--accent)',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  sub: { color: 'var(--muted)', fontSize: '12px', marginLeft: '4px' },
  right: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' },
  liveRow: {
    display: 'flex', alignItems: 'center', gap: '5px',
    fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--accent)',
  },
  liveDot: {
    width: '6px', height: '6px', background: 'var(--accent)',
    borderRadius: '50%', animation: 'pulse 2s infinite',
  },
}

export default function Header({ connected }) {
  const pillStyle = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '10px',
    padding: '4px 10px',
    borderRadius: '100px',
    letterSpacing: '0.5px',
    background: connected ? 'rgba(0,229,160,0.1)' : 'rgba(255,68,68,0.1)',
    color: connected ? 'var(--accent)' : '#ff6b6b',
    border: connected ? '1px solid rgba(0,229,160,0.3)' : '1px solid rgba(255,68,68,0.3)',
  }

  return (
    <header style={s.header}>
      <div style={s.logo}>
        <div style={s.dot} />
        RouteGuard AI
      </div>
      <span style={s.sub}>Supply Chain Disruption Analyzer</span>
      <div style={s.right}>
        <div style={s.liveRow}><div style={s.liveDot} /> LOCAL AI</div>
        <span style={pillStyle}>
          {connected ? '● OLLAMA READY' : '● OLLAMA OFFLINE'}
        </span>
      </div>
    </header>
  )
}
