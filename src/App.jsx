import { useState } from 'react'
import Flow from './Flow'
import { PROJECTS } from '@flows'
import './App.css'

const cardStyle = {
  padding: '20px 28px',
  borderRadius: '12px',
  border: '1.5px solid #e5e0d5',
  background: '#fff',
  cursor: 'pointer',
  textAlign: 'left',
  maxWidth: '320px',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
}

function hoverOn(e) {
  e.currentTarget.style.borderColor = '#d4a054'
  e.currentTarget.style.boxShadow = '0 2px 8px rgba(212,160,84,0.15)'
}
function hoverOff(e) {
  e.currentTarget.style.borderColor = '#e5e0d5'
  e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'
}

function CardGrid({ title, subtitle, children }) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafaf8',
        gap: 32,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '14px', color: '#888', margin: '8px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  )
}

function App() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedFlow, setSelectedFlow] = useState(null)

  const project = PROJECTS.find((p) => p.id === selectedProject)

  // ── Level 3: Flow viewer ──────────────────────────────────────
  if (selectedFlow && project) {
    const flow = project.flows.find((f) => f.id === selectedFlow)
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            padding: '8px 16px',
            background: '#fafaf8',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <button
            onClick={() => setSelectedFlow(null)}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: 'transparent',
              color: '#555',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            ← {project.label}
          </button>
          <span style={{ fontSize: '13px', color: '#888' }}>{flow?.label}</span>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <Flow key={selectedFlow} flowId={selectedFlow} />
        </div>
      </div>
    )
  }

  // ── Level 2: Flow picker (within a project) ──────────────────
  if (project) {
    return (
      <CardGrid title={project.label} subtitle={project.description}>
        <button
          onClick={() => setSelectedProject(null)}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
          style={{ ...cardStyle, background: '#fafaf8', maxWidth: '160px', textAlign: 'center' }}
        >
          <p style={{ fontWeight: 500, fontSize: '14px', color: '#888', margin: 0 }}>← Back</p>
        </button>
        {project.flows.map((flow) => (
          <button
            key={flow.id}
            onClick={() => setSelectedFlow(flow.id)}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
            style={cardStyle}
          >
            <p style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a1a', margin: 0 }}>{flow.label}</p>
            <p style={{ fontSize: '12px', color: '#888', margin: '6px 0 0', lineHeight: 1.4 }}>{flow.description}</p>
          </button>
        ))}
      </CardGrid>
    )
  }

  // ── Level 1: Project picker ───────────────────────────────────
  return (
    <CardGrid title="Flow Steppers" subtitle="Select a project to view its architecture flows">
      {PROJECTS.map((p) => (
        <button
          key={p.id}
          onClick={() => setSelectedProject(p.id)}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
          style={cardStyle}
        >
          <p style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a1a', margin: 0 }}>{p.label}</p>
          <p style={{ fontSize: '12px', color: '#888', margin: '6px 0 0', lineHeight: 1.4 }}>{p.description}</p>
          <p style={{ fontSize: '11px', color: '#bbb', margin: '8px 0 0' }}>
            {p.flows.length} flow{p.flows.length !== 1 ? 's' : ''}
          </p>
        </button>
      ))}
    </CardGrid>
  )
}

export default App
