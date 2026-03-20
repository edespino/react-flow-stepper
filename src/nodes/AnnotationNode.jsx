export default function AnnotationNode({ data }) {
  if (data.isTitle) {
    return (
      <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
          {data.text}
        </h1>
        {data.subtitle && (
          <p style={{ fontSize: '13px', color: '#999', margin: '4px 0 0' }}>
            {data.subtitle}
          </p>
        )}
      </div>
    )
  }

  if (data.isNote) {
    return (
      <div
        style={{
          background: '#fff5f0',
          border: '1.5px dashed #e8a090',
          borderRadius: '8px',
          padding: '12px 16px',
          maxWidth: '220px',
          fontSize: '12px',
          color: '#666',
          lineHeight: 1.5,
          fontFamily: 'ui-monospace, Consolas, monospace',
        }}
      >
        {data.text}
      </div>
    )
  }

  return null
}
