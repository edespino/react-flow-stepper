import HandleSet from './HandleSet'

const style = {
  background: '#f0fdf8',
  border: '2px solid #86dcc0',
  borderRadius: '10px',
  padding: '16px 32px',
  minWidth: '180px',
  textAlign: 'center',
}

export default function DoneNode({ data }) {
  return (
    <div style={style}>
      <HandleSet />
      <p style={{ fontWeight: 700, fontSize: '18px', color: '#1a1a1a', margin: 0 }}>
        {data.title}
      </p>
      <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0' }}>
        {data.subtitle}
      </p>
    </div>
  )
}
