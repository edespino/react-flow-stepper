import { useState, useCallback, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  addEdge,
  reconnectEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import StepNode from './nodes/StepNode'
import CodeSnippetNode from './nodes/CodeSnippetNode'
import DecisionNode from './nodes/DecisionNode'
import DoneNode from './nodes/DoneNode'
import AnnotationNode from './nodes/AnnotationNode'
const nodeTypes = {
  step: StepNode,
  codeSnippet: CodeSnippetNode,
  decision: DecisionNode,
  done: DoneNode,
  annotation: AnnotationNode,
}

const TOTAL_STEPS = 10

// Each node/edge has a `revealAt` step number (1-10)
const allNodes = [
  {
    id: 'title',
    type: 'annotation',
    position: { x: 250, y: -60 },
    data: { text: 'How Ralph Works with Amp', subtitle: 'Autonomous AI agent loop for completing PRDs', isTitle: true },
    selectable: false,
    revealAt: 1,
  },
  // Left column: steps 1-4 going down
  {
    id: '1',
    type: 'step',
    position: { x: 0, y: 50 },
    data: { title: 'You write a PRD', subtitle: 'Define what you want to build', variant: 'orange' },
    revealAt: 1,
  },
  {
    id: '2',
    type: 'step',
    position: { x: 20, y: 180 },
    data: { title: 'Convert to prd.json', subtitle: 'Break into small user stories', variant: 'orange' },
    revealAt: 2,
  },
  {
    id: 'code',
    type: 'codeSnippet',
    position: { x: 300, y: 60 },
    data: {
      code: `{
  "id": "US-003",
  "title": "Add priority field to database",
  "acceptanceCriteria": [
    "Add priority column to tasks table",
    "Generate and run migration",
    "Typecheck passes"
  ],
  "passes": false
}`,
    },
    revealAt: 3,
  },
  {
    id: '3',
    type: 'step',
    position: { x: 20, y: 310 },
    data: { title: 'Run ralph.sh', subtitle: 'Starts the autonomous loop', variant: 'orange' },
    revealAt: 3,
  },
  {
    id: '4',
    type: 'step',
    position: { x: 0, y: 450 },
    data: { title: 'Amp picks a story', subtitle: 'Finds next passes: false', variant: 'orange' },
    revealAt: 4,
  },
  // Right path: 5 → 6 going right, then 7 down, then 8 back left
  {
    id: '5',
    type: 'step',
    position: { x: 340, y: 340 },
    data: { title: 'Implements it', subtitle: 'Writes code, runs tests', variant: 'gray' },
    revealAt: 5,
  },
  {
    id: '6',
    type: 'step',
    position: { x: 600, y: 440 },
    data: { title: 'Commits changes', subtitle: 'If tests pass', variant: 'gray' },
    revealAt: 6,
  },
  {
    id: '7',
    type: 'step',
    position: { x: 600, y: 570 },
    data: { title: 'Updates prd.json', subtitle: 'Sets passes: true', variant: 'gray' },
    revealAt: 7,
  },
  {
    id: '8',
    type: 'step',
    position: { x: 340, y: 660 },
    data: { title: 'Logs to progress.txt', subtitle: 'Saves learnings', variant: 'gray' },
    revealAt: 8,
  },
  {
    id: 'agents-note',
    type: 'annotation',
    position: { x: 580, y: 670 },
    data: { text: 'Also updates AGENTS.md with patterns discovered, so future iterations learn from this one.', isNote: true },
    revealAt: 8,
  },
  // Bottom: decision + done
  {
    id: '9',
    type: 'decision',
    position: { x: 30, y: 670 },
    data: { title: 'More stories?' },
    revealAt: 9,
  },
  {
    id: '10',
    type: 'done',
    position: { x: 350, y: 870 },
    data: { title: 'Done!', subtitle: 'All stories complete' },
    revealAt: 10,
  },
]

const edgeDefaults = {
  type: 'default',
  animated: true,
  style: { stroke: '#999', strokeWidth: 1.5, strokeDasharray: '6 4' },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#999', width: 10, height: 10 },
  className: 'animated-edge-gray',
}

const dashed = {
  type: 'default',
  animated: true,
  style: { stroke: '#999', strokeWidth: 1.5, strokeDasharray: '6 4' },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#999', width: 10, height: 10 },
  className: 'animated-edge-gray',
}

const allEdges = [
  // Vertical: bottom -> top
  { id: 'e1-2', source: '1', target: '2', ...edgeDefaults, sourceHandle: 'bottom', targetHandle: 'top-in', revealAt: 2 },
  { id: 'e2-3', source: '2', target: '3', ...edgeDefaults, sourceHandle: 'bottom', targetHandle: 'top-in', revealAt: 3 },
  { id: 'e3-4', source: '3', target: '4', ...edgeDefaults, sourceHandle: 'bottom', targetHandle: 'top-in', revealAt: 4 },
  // Horizontal right: right -> left
  { id: 'e4-5', source: '4', target: '5', ...dashed, sourceHandle: 'right', targetHandle: 'left-in', revealAt: 5 },
  { id: 'e5-6', source: '5', target: '6', ...dashed, sourceHandle: 'right', targetHandle: 'left-in', revealAt: 6 },
  // Vertical down
  { id: 'e6-7', source: '6', target: '7', ...dashed, sourceHandle: 'bottom', targetHandle: 'top-in', revealAt: 7 },
  // Horizontal left (going back)
  { id: 'e7-8', source: '7', target: '8', ...dashed, sourceHandle: 'left', targetHandle: 'right-in', revealAt: 8 },
  { id: 'e8-9', source: '8', target: '9', ...dashed, sourceHandle: 'left', targetHandle: 'right-in', revealAt: 9 },
  // Loop back: top -> left
  { id: 'e9-4', source: '9', target: '4', ...dashed, sourceHandle: 'top', targetHandle: 'bottom-in', label: 'Yes', labelStyle: { fontSize: 12, fontWeight: 500, fill: '#555' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.9 }, labelBgPadding: [4, 8], labelBgBorderRadius: 4, revealAt: 9 },
  // Down to Done
  { id: 'e9-10', source: '9', target: '10', ...dashed, sourceHandle: 'bottom', targetHandle: 'top-in', label: 'No', labelStyle: { fontSize: 12, fontWeight: 500, fill: '#555' }, labelBgStyle: { fill: '#fff', fillOpacity: 0.9 }, labelBgPadding: [4, 8], labelBgBorderRadius: 4, revealAt: 10 },
]

function FlowInner() {
  const [currentStep, setCurrentStep] = useState(1)
  const { fitView, setCenter } = useReactFlow()

  // Track user-created edges
  const userEdgesRef = useRef([])
  // Track reconnected edges (id -> modified edge object)
  const modifiedEdgesRef = useRef(new Map())
  // Track dragged node positions (id -> {x, y})
  const movedNodePositionsRef = useRef(new Map())

  const getInitialNodes = (step) =>
    allNodes.filter((n) => n.revealAt <= step).map(({ revealAt, ...node }) => node)

  const getInitialEdges = (step) =>
    allEdges.filter((e) => e.revealAt <= step).map(({ revealAt, ...edge }) => edge)

  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes(1))
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges(1))

  useEffect(() => {
    // For nodes: use saved positions for moved nodes, keep existing for others
    setNodes((currentNodes) => {
      const currentNodeMap = new Map(currentNodes.map((n) => [n.id, n]))
      const targetNodes = getInitialNodes(currentStep)

      return targetNodes.map((n) => {
        // If user dragged this node, use saved position
        if (movedNodePositionsRef.current.has(n.id)) {
          return { ...n, position: movedNodePositionsRef.current.get(n.id) }
        }
        // If node already exists in current state, keep it
        if (currentNodeMap.has(n.id)) {
          return currentNodeMap.get(n.id)
        }
        return n
      })
    })

    // For edges: keep existing ones (preserving reconnections), add new ones
    setEdges((currentEdges) => {
      const currentEdgeMap = new Map(currentEdges.map((e) => [e.id, e]))
      const targetInitialEdges = getInitialEdges(currentStep)
      const targetIds = new Set(targetInitialEdges.map((e) => e.id))

      // Build result: for each initial edge at this step, use modified or existing version
      const result = targetInitialEdges.map((e) => {
        if (modifiedEdgesRef.current.has(e.id)) {
          return modifiedEdgesRef.current.get(e.id)
        }
        if (currentEdgeMap.has(e.id)) {
          return currentEdgeMap.get(e.id)
        }
        return e
      })

      // Add user-created edges
      for (const ue of userEdgesRef.current) {
        if (!result.find((e) => e.id === ue.id)) {
          result.push(ue)
        }
      }

      return result
    })

    setTimeout(() => {
      // Use fitView to show all visible nodes, keeping title and newest node in frame
      fitView({ padding: 0.15, duration: 400, maxZoom: 1 })
    }, 50)
  }, [currentStep, setNodes, setEdges, fitView])

  const handleNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }, [])

  const handlePrevious = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }, [])

  const handleReset = useCallback(() => {
    userEdgesRef.current = []
    modifiedEdgesRef.current = new Map()
    movedNodePositionsRef.current = new Map()
    setCurrentStep(0)
    // Force re-render back to step 1
    setTimeout(() => setCurrentStep(1), 0)
  }, [])

  const onNodeDragStop = useCallback((event, node) => {
    movedNodePositionsRef.current.set(node.id, node.position)
  }, [])

  const onConnect = useCallback(
    (connection) => {
      const newEdge = {
        ...connection,
        ...dashed,
        id: `user-${Date.now()}`,
        markerStart: undefined,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#999', width: 10, height: 10 },
      }
      userEdgesRef.current = [...userEdgesRef.current, newEdge]
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges],
  )

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      setEdges((els) => {
        // Manually update the edge, preserving its id and style
        const updatedEdge = {
          ...oldEdge,
          source: newConnection.source,
          target: newConnection.target,
          sourceHandle: newConnection.sourceHandle,
          targetHandle: newConnection.targetHandle,
        }
        modifiedEdgesRef.current.set(oldEdge.id, updatedEdge)
        return els.map((e) => (e.id === oldEdge.id ? updatedEdge : e))
      })
    },
    [setEdges],
  )

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          style={{ background: '#fafaf8' }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e8e8e4" gap={24} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Navigation bar — outside ReactFlow, in its own space */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          padding: '10px 0 8px',
                    background: '#fafaf8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: 'transparent',
              color: currentStep === 1 ? '#bbb' : '#333',
              cursor: currentStep === 1 ? 'default' : 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Previous
          </button>

          <span style={{ fontSize: '13px', color: '#888', minWidth: '80px', textAlign: 'center' }}>
            Step {currentStep} of {TOTAL_STEPS}
          </span>

          <button
            onClick={handleNext}
            disabled={currentStep === TOTAL_STEPS}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: 'transparent',
              color: currentStep === TOTAL_STEPS ? '#bbb' : '#333',
              cursor: currentStep === TOTAL_STEPS ? 'default' : 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Next
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: 'transparent',
              color: '#333',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Reset
          </button>
        </div>

        <span style={{ fontSize: '11px', color: '#bbb' }}>
          Click Next to reveal each step
        </span>
      </div>
    </div>
  )
}

export default function Flow() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  )
}
