import React from 'react'
import ChatPanel from './ChatPanel'

function riskClass(l) {
  if (l === 'CRITICAL') return { bg: 'rgba(255,68,68,0.15)', color: '#ff6b6b', border: '1px solid rgba(255,68,68,0.3)' }
  if (l === 'HIGH')     return { bg: 'rgba(255,176,32,0.15)', color: 'var(--warn)', border: '1px solid rgba(255,176,32,0.3)' }
  if (l === 'MEDIUM')   return { bg: 'rgba(0,102,255,0.15)', color: '#6699ff', border: '1px solid rgba(0,102,255,0.3)' }
  return { bg: 'rgba(0,229,160,0.15)', color: 'var(--accent)', border: '1px solid rgba(0,229,160,0.3)' }
}

function riskColor(l) {
  if (l === 'CRITICAL') return 'var(--danger)'
  if (l === 'HIGH')     return 'var(--warn)'
  if (l === 'MEDIUM')   return '#6699ff'
  return 'var(--accent)'
}

function barColor(v) {
  if (v >= 75) return 'var(--danger)'
  if (v >= 50) return 'var(--warn)'
  if (v >= 30) return '#6699ff'
  return 'var(--accent)'
}

function Badge({ level }) {
  const s = riskClass(level)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
      borderRadius: '100px', fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace",
      background: s.bg, color: s.color, border: s.border,
    }}>{level}</span>
  )
}

function Panel({ title, right, children }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--card-r)', overflow: 'hidden' }}>
      <div style={{ padding: '13px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '14px', color: '#fff' }}>{title}</span>
        {right}
      </div>
      <div style={{ padding: '16px 18px' }}>{children}</div>
    </div>
  )
}

function ScoreBar({ label, value }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>
        <span>{label}</span><span>{value}/100</span>
      </div>
      <div style={{ background: 'var(--bg)', borderRadius: '100px', height: '5px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: '100px', background: barColor(value), transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}

export default function ResultsDashboard({ data, shipment, model }) {
  const bk = data.riskBreakdown || {}
  const onTimeProbColor = data.onTimeProb >= 70 ? 'var(--accent)' : data.onTimeProb >= 40 ? 'var(--warn)' : 'var(--danger)'
  const context = JSON.stringify(data)

  const LiveTag = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--accent)' }}>
      <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
      AI Generated
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="fade-in">

      {/* Route header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 700, color: '#fff' }}>
            {shipment.origin} → {shipment.destination}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '3px' }}>
            {shipment.mode} · {shipment.cargo} · {shipment.timeline}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge level={data.overallRisk} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '30px', fontWeight: 800, color: riskColor(data.overallRisk) }}>
            {data.riskScore}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>/100</span>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
        {[
          { label: 'ON-TIME PROB.', value: `${data.onTimeProb}%`, sub: 'Delivery likelihood', color: onTimeProbColor },
          { label: 'EST. DELAY', value: data.estimatedDelay || '—', sub: 'Beyond scheduled', color: 'var(--warn)', small: true },
          { label: 'COST IMPACT', value: `+${data.costImpactPct}%`, sub: 'Expected increase', color: data.costImpactPct > 20 ? 'var(--danger)' : 'var(--warn)', small: true },
          { label: 'DISRUPTIONS', value: (data.disruptions || []).length, sub: 'Active on route', color: '#fff' },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--card-r)', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.4px', marginBottom: '5px' }}>{m.label}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: m.small ? '18px' : '24px', fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Executive summary */}
      <Panel title="Executive Summary" right={<LiveTag />}>
        <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--text)' }}>{data.executiveSummary}</p>
        {data.cargoSpecificRisks && (
          <div style={{ marginTop: '10px', padding: '9px 13px', background: 'rgba(255,176,32,0.07)', border: '1px solid rgba(255,176,32,0.2)', borderRadius: '8px', fontSize: '12px', color: '#ffcc70' }}>
            <strong>Cargo Risk: </strong>{data.cargoSpecificRisks}
          </div>
        )}
      </Panel>

      {/* Two-col: disruptions + scoring */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Panel title="Active Disruptions">
          <div style={{ padding: '0 0 0 0' }}>
            {(data.disruptions || []).map((d, i) => (
              <div key={i} style={{
                padding: '12px 0', borderBottom: i < data.disruptions.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: '11px', alignItems: 'start',
              }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--bg3)', border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{d.icon || '⚠️'}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '13px', color: '#fff', marginBottom: '2px' }}>{d.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{d.description}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>📍 {d.location} · {d.delayDays}</div>
                </div>
                <Badge level={d.severity} />
              </div>
            ))}
          </div>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Panel title="Risk Breakdown">
            <ScoreBar label="Geopolitical"   value={bk.geopolitical   || 0} />
            <ScoreBar label="Weather"         value={bk.weather         || 0} />
            <ScoreBar label="Port Congestion" value={bk.portCongestion  || 0} />
            <ScoreBar label="Regulatory"      value={bk.regulatory      || 0} />
            <ScoreBar label="Capacity"        value={bk.capacity        || 0} />
          </Panel>
          <Panel title="Immediate Actions">
            <div style={{ position: 'relative', paddingLeft: '18px' }}>
              <div style={{ position: 'absolute', left: '4px', top: '8px', bottom: '8px', width: '1px', background: 'var(--border2)' }} />
              {(data.immediateActions || []).map((a, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '14px', fontSize: '12px' }}>
                  <div style={{ position: 'absolute', left: '-15px', top: '5px', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', border: '1px solid var(--bg)' }} />
                  <div style={{ fontWeight: 500, color: '#fff', marginBottom: '1px' }}>Action {i + 1}</div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.5 }}>{a}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Alternative routes */}
      <Panel title="Alternative Routes">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '10px' }}>
          {(data.alternativeRoutes || []).map((r, i) => (
            <div key={i} style={{
              background: 'var(--bg3)', border: `1px solid ${i === 0 ? 'rgba(0,229,160,0.4)' : 'var(--border2)'}`,
              borderRadius: '10px', padding: '13px',
            }}>
              {i === 0 && <div style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: "'IBM Plex Mono'", marginBottom: '5px', letterSpacing: '0.5px' }}>RECOMMENDED</div>}
              <div style={{ fontWeight: 500, fontSize: '13px', color: '#fff', marginBottom: '5px' }}>{r.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', lineHeight: 1.5 }}>{r.description}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '11px' }}>
                <div style={{ background: 'var(--bg)', borderRadius: '6px', padding: '5px 8px' }}>
                  <div style={{ color: 'var(--muted)' }}>Cost</div>
                  <div style={{ color: r.costChange?.startsWith('+') ? 'var(--danger)' : 'var(--accent)', fontWeight: 500 }}>{r.costChange}</div>
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: '6px', padding: '5px 8px' }}>
                  <div style={{ color: 'var(--muted)' }}>Time</div>
                  <div style={{ color: r.timeChange?.startsWith('+') ? 'var(--warn)' : 'var(--accent)', fontWeight: 500 }}>{r.timeChange}</div>
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: '6px', padding: '5px 8px', gridColumn: 'span 2' }}>
                  <div style={{ color: 'var(--muted)' }}>Risk Reduction</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 500 }}>{r.riskReduction}</div>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic' }}>⚖️ {r.tradeoff}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Chat */}
      <ChatPanel analysisContext={context} model={model} />
    </div>
  )
}
