import HandleSet from './HandleSet'

const variants = {
  orange: {
    borderLeft: '4px solid #d4a054',
    background: '#fff',
    border: '1px solid #e5e0d5',
  },
  gray: {
    borderLeft: '1px solid #d0d0d0',
    background: '#f8f8f8',
    border: '1px solid #d0d0d0',
  },
}

export default function StepNode({ data }) {
  const v = variants[data.variant] || variants.orange

  const style = {
    ...v,
    borderRadius: '10px',
    padding: '14px 20px',
    minWidth: '190px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  }

  return (
    <div style={style}>
      <HandleSet />
      <p style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a', margin: 0, textAlign: 'center' }}>
        {data.title}
      </p>
      <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0', textAlign: 'center' }}>
        {data.subtitle}
      </p>
    </div>
  )
}
