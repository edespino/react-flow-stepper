import { Handle, Position } from '@xyflow/react'

const visible = {
  width: 8,
  height: 8,
  background: '#fff',
  border: '2px solid #bbb',
}

const invisible = {
  width: 8,
  height: 8,
  background: 'transparent',
  border: 'none',
  pointerEvents: 'all',
}

const sides = [
  { position: Position.Top, id: 'top' },
  { position: Position.Bottom, id: 'bottom' },
  { position: Position.Left, id: 'left' },
  { position: Position.Right, id: 'right' },
]

export default function HandleSet() {
  return sides.map(({ position, id }) => (
    <span key={id}>
      <Handle type="source" position={position} id={id} style={visible} />
      <Handle type="target" position={position} id={`${id}-in`} style={invisible} />
    </span>
  ))
}
