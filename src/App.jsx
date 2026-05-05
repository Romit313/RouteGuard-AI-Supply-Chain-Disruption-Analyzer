import React, { useState } from 'react'
import Header from './components/Header'
import ShipmentForm from './components/ShipmentForm'
import WelcomeState from './components/WelcomeState'
import LoadingState from './components/LoadingState'
import ResultsDashboard from './components/ResultsDashboard'
import { analyzeShipment } from './utils/api'
import { useOllamaStatus } from './hooks/useOllamaStatus'

const DEFAULT_FORM = {
  origin: 'Shanghai, China',
  destination: 'Los Angeles, USA',
  mode: 'Ocean Freight',
  cargo: 'Electronics',
  timeline: 'Standard (3-4 weeks)',
  value: '$50K–$500K',
  special: '',
}

export default function App() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [selectedModel, setSelectedModel] = useState('llama3')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [lastShipment, setLastShipment] = useState(null)

  const { status } = useOllamaStatus()

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setLastShipment({ ...form })

    try {
      const data = await analyzeShipment({ ...form, model: selectedModel })
      setResult(data)
    } catch (e) {
      const msg = e.response?.data?.detail || e.message || 'Unknown error'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    if (loading) return <LoadingState origin={form.origin} dest={form.destination} />
    if (error) return (
      <div style={{ padding: '24px' }}>
        <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '8px', padding: '16px', color: '#ff8080', fontSize: '13px' }}>
          <div style={{ fontWeight: 600, marginBottom: '6px' }}>Analysis Failed</div>
          <div>{error}</div>
          <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.7 }}>
            Make sure Ollama is running: <code>OLLAMA_ORIGINS=* ollama serve</code>
          </div>
        </div>
      </div>
    )
    if (result) return (
      <div style={{ padding: '24px', overflowY: 'auto' }}>
        <ResultsDashboard data={result} shipment={lastShipment} model={selectedModel} />
      </div>
    )
    return <WelcomeState />
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: '56px 1fr', minHeight: '100vh' }}>
      <Header connected={status.connected} />
      <div style={{ display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        <ShipmentForm
          form={form}
          setForm={setForm}
          onAnalyze={handleAnalyze}
          loading={loading}
          models={status.models}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
