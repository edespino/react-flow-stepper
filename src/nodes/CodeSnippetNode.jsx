const snippetStyle = {
  background: '#fafaff',
  border: '2px dashed #b8b0d4',
  borderRadius: '8px',
  padding: '16px',
  fontFamily: 'ui-monospace, Consolas, monospace',
  fontSize: '12px',
  color: '#444',
  whiteSpace: 'pre',
  lineHeight: 1.5,
}

export default function CodeSnippetNode({ data }) {
  return (
    <div style={snippetStyle}>
      {data.code}
    </div>
  )
}
