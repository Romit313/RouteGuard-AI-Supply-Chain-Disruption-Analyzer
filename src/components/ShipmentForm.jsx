import React from 'react'

const PRESETS = {
  'shanghai-la':      { origin: 'Shanghai, China',       destination: 'Los Angeles, USA',  mode: 'Ocean Freight', cargo: 'Electronics',            timeline: 'Standard (3-4 weeks)' },
  'rotterdam-ny':     { origin: 'Rotterdam, Netherlands', destination: 'New York, USA',     mode: 'Ocean Freight', cargo: 'Consumer Goods',          timeline: 'Standard (3-4 weeks)' },
  'dubai-london':     { origin: 'Dubai, UAE',             destination: 'London, UK',        mode: 'Air Freight',   cargo: 'Pharmaceuticals',         timeline: 'Urgent (1-2 weeks)'   },
  'shenzhen-seattle': { origin: 'Shenzhen, China',        destination: 'Seattle, USA',      mode: 'Multimodal',    cargo: 'Automotive Parts',        timeline: 'Economy (5-8 weeks)'  },
}

// ─── Cargo types (grouped) ────────────────────────────────────────────────────
const CARGO_GROUPS = [
  {
    group: 'General Merchandise',
    items: [
      'Electronics & Tech Hardware',
      'Consumer Goods & Retail',
      'Textiles & Apparel',
      'Furniture & Fixtures',
      'Toys & Sporting Goods',
      'Books & Printed Media',
    ],
  },
  {
    group: 'High Value / Sensitive',
    items: [
      'Pharmaceuticals & Medicine',
      'Medical Devices & Equipment',
      'Luxury Goods & Jewelry',
      'Artwork & Antiques',
      'Semiconductors & Chips',
      'Currency & Valuables',
    ],
  },
  {
    group: 'Food & Agriculture',
    items: [
      'Perishables / Fresh Produce',
      'Frozen / Cold Chain Food',
      'Bulk Grain & Cereals',
      'Coffee, Tea & Commodities',
      'Seafood & Aquaculture',
      'Live Animals (Livestock)',
      'Live Animals (Pets/Exotic)',
    ],
  },
  {
    group: 'Industrial & Automotive',
    items: [
      'Automotive Parts & Components',
      'Assembled Vehicles',
      'Heavy Machinery & Equipment',
      'Oversized / Out-of-Gauge (OOG)',
      'Steel, Iron & Metal Products',
      'Construction Materials',
      'Mining Equipment',
    ],
  },
  {
    group: 'Energy & Bulk',
    items: [
      'Petroleum / Crude Oil',
      'Refined Petroleum Products',
      'LNG / Liquefied Natural Gas',
      'LPG / Liquefied Petroleum Gas',
      'Bulk Coal',
      'Bulk Iron Ore & Minerals',
      'Bulk Fertilizers',
      'Biofuels & Ethanol',
    ],
  },
  {
    group: 'Chemicals & Hazardous',
    items: [
      'Industrial Chemicals (Non-Hazardous)',
      'Hazardous Chemicals (HAZMAT Class 3)',
      'Explosives (HAZMAT Class 1)',
      'Compressed Gases (HAZMAT Class 2)',
      'Corrosives (HAZMAT Class 8)',
      'Radioactive Materials (Class 7)',
      'Toxic Substances (Class 6)',
      'Infectious Substances (Class 6.2)',
    ],
  },
  {
    group: 'Other',
    items: [
      'Defense & Military Equipment',
      'Waste & Recyclables',
      'Human Remains / Ashes',
      'Project Cargo (Custom)',
    ],
  },
]

const ALL_CARGO = CARGO_GROUPS.flatMap(g => g.items)

// ─── Transport modes ──────────────────────────────────────────────────────────
const ALL_MODES = [
  'Ocean Freight (FCL)',
  'Ocean Freight (LCL)',
  'Air Freight',
  'Rail Freight',
  'Road / Trucking',
  'Pipeline',
  'Multimodal',
]

// ─── Validation rules ─────────────────────────────────────────────────────────
// For each cargo, list modes that are BLOCKED and why
const RESTRICTIONS = {
  // ── Energy / Bulk ──
  'Petroleum / Crude Oil':            { blocked: ['Air Freight', 'Rail Freight', 'Road / Trucking', 'Multimodal'], reason: 'Crude oil must be transported via dedicated tanker vessels or pipelines only due to volume, flammability, and international safety regulations (IMDG/ICAO).' },
  'Refined Petroleum Products':       { blocked: ['Air Freight'], reason: 'Refined petroleum (gasoline, diesel, jet fuel) is strictly prohibited on passenger and cargo aircraft under ICAO regulations due to extreme flammability.' },
  'LNG / Liquefied Natural Gas':      { blocked: ['Air Freight', 'Road / Trucking', 'Rail Freight'], reason: 'LNG requires cryogenic tanker vessels at -162°C and dedicated terminals. Road and rail transport is not permitted for large volumes due to explosion risk.' },
  'LPG / Liquefied Petroleum Gas':    { blocked: ['Air Freight', 'Ocean Freight (LCL)'], reason: 'LPG requires pressurized vessels and is banned from air transport. LCL consolidation is not permitted due to incompatibility with other cargo.' },
  'Bulk Coal':                        { blocked: ['Air Freight', 'Pipeline'], reason: 'Bulk coal is only economically viable via bulk carrier vessels or rail. Air freight is impractical due to weight and pipelines cannot transport solids.' },
  'Bulk Iron Ore & Minerals':         { blocked: ['Air Freight', 'Pipeline', 'Ocean Freight (LCL)'], reason: 'Iron ore requires bulk carrier vessels or heavy rail due to extreme weight and volume. Air and LCL consolidation are not feasible.' },
  'Bulk Fertilizers':                 { blocked: ['Air Freight'], reason: 'Bulk fertilizers (especially ammonium nitrate) are classified as dangerous goods and are prohibited from air transport.' },
  'Biofuels & Ethanol':               { blocked: ['Air Freight'], reason: 'Biofuels and ethanol are flammable liquids (HAZMAT Class 3) and are banned from air cargo under ICAO dangerous goods regulations.' },

  // ── HAZMAT / Chemicals ──
  'Hazardous Chemicals (HAZMAT Class 3)': { blocked: ['Air Freight', 'Ocean Freight (LCL)'], reason: 'Class 3 flammable liquids are banned from air cargo. LCL is prohibited due to risk of contamination with other shipments.' },
  'Explosives (HAZMAT Class 1)':      { blocked: ['Air Freight', 'Ocean Freight (LCL)', 'Multimodal'], reason: 'Explosives require dedicated military or licensed vessels only. Commercial air and consolidated ocean freight are strictly prohibited under IATA/IMDG.' },
  'Compressed Gases (HAZMAT Class 2)':{ blocked: ['Air Freight', 'Ocean Freight (LCL)'], reason: 'Compressed gases pose explosion risk at altitude and in mixed-cargo holds. Dedicated vessels or tanker trucks required.' },
  'Corrosives (HAZMAT Class 8)':      { blocked: ['Air Freight', 'Ocean Freight (LCL)'], reason: 'Corrosives cannot be consolidated with other cargo and are generally prohibited from air unless in very small quantities with special packaging.' },
  'Radioactive Materials (Class 7)':  { blocked: ['Air Freight', 'Ocean Freight (LCL)', 'Multimodal', 'Road / Trucking'], reason: 'Radioactive materials require licensed dedicated transport with radiation shielding. Commercial air and consolidated freight are prohibited under IAEA/IMDG regulations.' },
  'Toxic Substances (Class 6)':       { blocked: ['Air Freight', 'Ocean Freight (LCL)'], reason: 'Toxic substances require dedicated containers and are prohibited from commercial air freight and consolidated LCL shipments.' },
  'Infectious Substances (Class 6.2)':{ blocked: ['Ocean Freight (FCL)', 'Ocean Freight (LCL)', 'Rail Freight', 'Road / Trucking', 'Pipeline', 'Multimodal'], reason: 'Infectious substances (Category A pathogens) are restricted to air freight only using approved UN2814/UN2900 packaging with specialized handling.' },

  // ── Bulk / Heavy ──
  'Assembled Vehicles':               { blocked: ['Air Freight', 'Ocean Freight (LCL)', 'Pipeline'], reason: 'Assembled vehicles require RoRo (Roll-on/Roll-off) vessels or open-top containers. Air freight is impractical due to size and weight.' },
  'Heavy Machinery & Equipment':      { blocked: ['Air Freight', 'Ocean Freight (LCL)', 'Pipeline'], reason: 'Heavy machinery exceeds air freight weight limits and requires flat-rack or open-top containers on dedicated vessels.' },
  'Oversized / Out-of-Gauge (OOG)':   { blocked: ['Air Freight', 'Ocean Freight (LCL)', 'Pipeline'], reason: 'OOG cargo exceeds standard container dimensions and requires specialized flat-rack vessels and heavy-lift equipment.' },
  'Construction Materials':           { blocked: ['Air Freight', 'Pipeline'], reason: 'Construction materials (concrete, timber, steel beams) are too heavy and bulky for air freight and cannot be piped.' },

  // ── Animals ──
  'Live Animals (Livestock)':         { blocked: ['Ocean Freight (LCL)', 'Pipeline', 'Rail Freight'], reason: 'Livestock requires specialized livestock vessels or dedicated road transport with ventilation and feeding systems. LCL and rail are not equipped for animal welfare requirements.' },
  'Live Animals (Pets/Exotic)':       { blocked: ['Ocean Freight (LCL)', 'Ocean Freight (FCL)', 'Pipeline', 'Rail Freight'], reason: 'Pets and exotic animals require climate-controlled air cargo with IATA Live Animals Regulations compliance. Ocean freight poses welfare and mortality risks.' },

  // ── Food ──
  'Perishables / Fresh Produce':      { blocked: ['Ocean Freight (LCL)', 'Pipeline', 'Rail Freight'], reason: 'Fresh produce requires dedicated reefer containers or air freight for short shelf life. LCL risks cross-contamination and rail lacks temperature control.' },
  'Frozen / Cold Chain Food':         { blocked: ['Pipeline', 'Rail Freight'], reason: 'Frozen goods require dedicated reefer containers on vessel or specialized refrigerated trucks. Pipelines and standard rail lack cold chain infrastructure.' },
  'Seafood & Aquaculture':            { blocked: ['Pipeline', 'Rail Freight', 'Ocean Freight (LCL)'], reason: 'Live or fresh seafood requires rapid air freight or dedicated reefer vessels. LCL risks delays that compromise product quality.' },

  // ── High value ──
  'Currency & Valuables':             { blocked: ['Ocean Freight (FCL)', 'Ocean Freight (LCL)', 'Rail Freight', 'Pipeline'], reason: 'Currency and high-value items must travel via secured air cargo with armed escort. Ocean freight provides insufficient security and traceability.' },
  'Artwork & Antiques':               { blocked: ['Ocean Freight (LCL)', 'Pipeline', 'Rail Freight'], reason: 'Artwork requires climate-controlled, vibration-free transport with dedicated handling. LCL consolidation and rail risk damage from movement and humidity.' },

  // ── Other ──
  'Defense & Military Equipment':     { blocked: ['Ocean Freight (LCL)', 'Multimodal'], reason: 'Military equipment requires government-licensed dedicated transport. Consolidated or multimodal shipments are prohibited for security and export control reasons.' },
  'Human Remains / Ashes':            { blocked: ['Ocean Freight (FCL)', 'Ocean Freight (LCL)', 'Rail Freight', 'Pipeline', 'Road / Trucking'], reason: 'Human remains must be transported by air under IATA regulations with a death certificate and embalming certificate. Surface transport is generally not permitted internationally.' },
  'Waste & Recyclables':              { blocked: ['Air Freight', 'Pipeline'], reason: 'Waste and recyclables are banned from air freight under Basel Convention and ICAO regulations. Pipelines are not suitable for solid waste.' },
}

// Pipeline-only cargo
const PIPELINE_ONLY = ['Petroleum / Crude Oil', 'LNG / Liquefied Natural Gas']

const field = {
  label: { display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '5px', fontWeight: 500 },
  input: {
    width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)',
    borderRadius: '8px', color: 'var(--text)', fontSize: '13px', padding: '8px 11px',
    outline: 'none', WebkitAppearance: 'none',
  },
  group: { marginBottom: '12px' },
}

function Field({ label, children }) {
  return (
    <div style={field.group}>
      <label style={field.label}>{label}</label>
      {children}
    </div>
  )
}

function getRestriction(cargo, mode) {
  const r = RESTRICTIONS[cargo]
  if (!r) return null
  if (r.blocked.includes(mode)) return r.reason
  return null
}

function isBlocked(cargo, mode) {
  const r = RESTRICTIONS[cargo]
  return r ? r.blocked.includes(mode) : false
}

export default function ShipmentForm({ form, setForm, onAnalyze, loading, models, selectedModel, setSelectedModel }) {
  const warning = getRestriction(form.cargo, form.mode)

  const set = (k) => (e) => {
    const val = e.target.value
    setForm(f => {
      const updated = { ...f, [k]: val }
      // If cargo changes and current mode becomes blocked, auto-switch to first valid mode
      if (k === 'cargo') {
        const r = RESTRICTIONS[val]
        if (r && r.blocked.includes(updated.mode)) {
          const validMode = ALL_MODES.find(m => !r.blocked.includes(m))
          updated.mode = validMode || 'Ocean Freight (FCL)'
        }
      }
      return updated
    })
  }

  const applyPreset = (key) => setForm(f => ({ ...f, ...PRESETS[key] }))

  return (
    <aside style={{
      background: 'var(--bg2)', borderRight: '1px solid var(--border)',
      padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px',
      width: '370px', flexShrink: 0,
    }}>
      {/* Ollama model selector */}
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '10px', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
          Ollama Model
        </div>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: '10px', padding: '12px' }}>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            style={{ ...field.input, fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px' }}
          >
            {models.length > 0
              ? models.map(m => <option key={m} value={m}>{m}</option>)
              : ['llama3', 'llama3.1', 'llama3.2', 'mistral', 'gemma2', 'phi3', 'qwen2.5'].map(m =>
                  <option key={m} value={m}>{m}</option>)
            }
          </select>
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--muted)', fontFamily: "'IBM Plex Mono'" }}>
            Start: <span style={{ color: 'var(--accent)' }}>ollama serve</span>
            &nbsp;· Pull: <span style={{ color: 'var(--accent)' }}>ollama pull llama3</span>
          </div>
        </div>
      </div>

      {/* Route */}
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '10px', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
          Route Details
        </div>
        <Field label="Origin">
          <input style={field.input} value={form.origin} onChange={set('origin')} placeholder="e.g. Shanghai, China" />
        </Field>
        <Field label="Destination">
          <input style={field.input} value={form.destination} onChange={set('destination')} placeholder="e.g. Los Angeles, USA" />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <Field label="Mode">
            <select
              style={{ ...field.input, borderColor: warning ? 'var(--danger)' : 'var(--border2)' }}
              value={form.mode}
              onChange={set('mode')}
            >
              {ALL_MODES.map(m => {
                const blocked = isBlocked(form.cargo, m)
                return (
                  <option key={m} value={m} disabled={blocked} style={{ color: blocked ? '#555' : 'var(--text)' }}>
                    {blocked ? `🚫 ${m}` : m}
                  </option>
                )
              })}
            </select>
          </Field>
          <Field label="Timeline">
            <select style={field.input} value={form.timeline} onChange={set('timeline')}>
              {['Urgent (1-2 weeks)', 'Standard (3-4 weeks)', 'Economy (5-8 weeks)'].map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Cargo */}
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '10px', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
          Cargo Details
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <Field label="Cargo Type">
            <select style={field.input} value={form.cargo} onChange={set('cargo')}>
              {CARGO_GROUPS.map(g => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map(c => <option key={c} value={c}>{c}</option>)}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Value (USD)">
            <select style={field.input} value={form.value} onChange={set('value')}>
              {['Under $50K', '$50K–$500K', '$500K–$5M', 'Over $5M'].map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Special Requirements">
          <input style={field.input} value={form.special} onChange={set('special')} placeholder="e.g. Temperature controlled, Fragile" />
        </Field>
      </div>

      {/* Restriction warning */}
      {warning && (
        <div style={{
          background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)',
          borderRadius: '8px', padding: '12px 13px', fontSize: '12px', color: '#ff8080', lineHeight: 1.6
        }}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>⚠️ Transport Restriction</div>
          {warning}
        </div>
      )}

      {/* Presets */}
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: '10px', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
          Quick Presets
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {Object.entries({ 'shanghai-la': 'Shanghai → LA', 'rotterdam-ny': 'Rotterdam → NY', 'dubai-london': 'Dubai → London', 'shenzhen-seattle': 'Shenzhen → Seattle' })
            .map(([k, label]) => (
              <button key={k} onClick={() => applyPreset(k)} style={{
                padding: '5px 11px', borderRadius: '100px', fontSize: '11px',
                background: 'var(--bg3)', border: '1px solid var(--border2)',
                color: 'var(--muted)', cursor: 'pointer',
              }}>{label}</button>
            ))}
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={loading || !!warning}
        style={{
          padding: '11px 20px',
          background: (loading || !!warning) ? 'rgba(0,229,160,0.3)' : 'var(--accent)',
          color: '#000', border: 'none', borderRadius: '8px',
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '13px',
          cursor: (loading || !!warning) ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          marginTop: 'auto',
        }}
      >
        {warning ? '⚠️ Fix Transport Mode First' : loading ? '⏳ Analyzing (3 AI steps)...' : '⚡ Analyze Route Risk'}
      </button>
    </aside>
  )
}
