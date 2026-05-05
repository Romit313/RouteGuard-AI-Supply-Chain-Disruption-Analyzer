import React, { useState, useRef, useEffect } from 'react'
import { sendChat } from '../utils/api'

const QUICK = [
  'What insurance coverage do you recommend?',
  'Should I split this shipment into batches?',
  'What lead time buffer should I add?',
  'Which alternative ports can I use?',
  'What contract clauses should I add?',
]

export default function ChatPanel({ analysisContext, model }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (question) => {
    const q = question || input.trim()
    if (!q) return
    setInput('')
    setLoading(true)
    setMessages(m => [...m, { role: 'user', text: q }])

    try {
      const data = await sendChat({ question: q, context: analysisContext, model })
      setMessages(m => [...m, { role: 'ai', text: data.reply }])
    } catch (e) {
      setMessages(m => [...m, { role: 'ai', text: 'Error: ' + (e.response?.data?.detail || e.message) }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--card-r)', overflow: 'hidden' }}>
      <div style={{ padding: '13px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '14px', color: '#fff' }}>Ask RouteGuard AI</span>
        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Follow-up questions about this shipment</span>
      </div>
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Quick chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)} disabled={loading} style={{
              padding: '4px 10px', borderRadius: '100px', fontSize: '11px',
              background: 'var(--bg3)', border: '1px solid var(--border2)',
              color: 'var(--muted)', cursor: 'pointer',
            }}>{q}</button>
          ))}
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto', padding: '4px 0' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', fontSize: '13px', padding: '9px 13px',
                borderRadius: '8px', lineHeight: 1.7,
                background: m.role === 'user' ? 'rgba(0,229,160,0.1)' : 'var(--bg3)',
                border: m.role === 'user' ? '1px solid rgba(0,229,160,0.2)' : '1px solid var(--border)',
                color: 'var(--text)',
              }}>
                {m.role === 'ai' && loading && i === messages.length - 1
                  ? <><span>{m.text}</span><span style={{ display: 'inline-block', width: '2px', height: '13px', background: 'var(--accent)', animation: 'blink 1s infinite', verticalAlign: 'middle', marginLeft: '2px' }} /></>
                  : m.text}
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div style={{ alignSelf: 'flex-start', fontSize: '13px', padding: '9px 13px', borderRadius: '8px', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                Thinking<span style={{ display: 'inline-block', width: '2px', height: '13px', background: 'var(--accent)', animation: 'blink 1s infinite', verticalAlign: 'middle', marginLeft: '2px' }} />
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input row */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask anything about this shipment..."
            style={{
              flex: 1, background: 'var(--bg3)', border: '1px solid var(--border2)',
              borderRadius: '8px', color: 'var(--text)', fontSize: '13px',
              padding: '9px 12px', outline: 'none',
            }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{
            padding: '9px 14px', background: 'var(--accent)', border: 'none',
            borderRadius: '8px', color: '#000', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px', opacity: loading ? 0.5 : 1,
          }}>➤</button>
        </div>
      </div>
    </div>
  )
}
