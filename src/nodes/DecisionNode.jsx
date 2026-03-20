import HandleSet from './HandleSet'

const style = {
  background: '#fffdf0',
  border: '2px dashed #d4a054',
  borderRadius: '10px',
  padding: '16px 24px',
  minWidth: '160px',
  textAlign: 'center',
}

export default function DecisionNode({ data }) {
  return (
    <div style={style}>
      <HandleSet />
      <p style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a', margin: 0 }}>
        {data.title}
      </p>
    </div>
  )
}
