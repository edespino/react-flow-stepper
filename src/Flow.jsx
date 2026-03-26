import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
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

import { flowRegistry } from '@flows'

const nodeTypes = {
  step: StepNode,
  codeSnippet: CodeSnippetNode,
  decision: DecisionNode,
  done: DoneNode,
  annotation: AnnotationNode,
}

const dashed = {
  type: 'default',
  animated: true,
  style: { stroke: '#999', strokeWidth: 1.5, strokeDasharray: '6 4' },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#999', width: 10, height: 10 },
  className: 'animated-edge-gray',
}

function FlowInner({ flowId }) {
  const flowData = flowRegistry[flowId]
  const TOTAL_STEPS = flowData.TOTAL_STEPS
  const allNodes = flowData.allNodes
  const allEdges = flowData.allEdges

  const [currentStep, setCurrentStep] = useState(1)
  const { fitView, getZoom, setCenter } = useReactFlow()

  const userEdgesRef = useRef([])
  const modifiedEdgesRef = useRef(new Map())
  const movedNodePositionsRef = useRef(new Map())

  const getInitialNodes = (step) =>
    allNodes.filter((n) => n.revealAt <= step).map(({ revealAt, ...node }) => node)

  const getInitialEdges = (step) =>
    allEdges.filter((e) => e.revealAt <= step).map(({ revealAt, ...edge }) => edge)

  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes(1))
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges(1))

  useEffect(() => {
    setNodes((currentNodes) => {
      const currentNodeMap = new Map(currentNodes.map((n) => [n.id, n]))
      const targetNodes = getInitialNodes(currentStep)

      return targetNodes.map((n) => {
        if (movedNodePositionsRef.current.has(n.id)) {
          return { ...n, position: movedNodePositionsRef.current.get(n.id) }
        }
        if (currentNodeMap.has(n.id)) {
          return currentNodeMap.get(n.id)
        }
        return n
      })
    })

    setEdges((currentEdges) => {
      const currentEdgeMap = new Map(currentEdges.map((e) => [e.id, e]))
      const targetInitialEdges = getInitialEdges(currentStep)

      const result = targetInitialEdges.map((e) => {
        if (modifiedEdgesRef.current.has(e.id)) {
          return modifiedEdgesRef.current.get(e.id)
        }
        if (currentEdgeMap.has(e.id)) {
          return currentEdgeMap.get(e.id)
        }
        return e
      })

      for (const ue of userEdgesRef.current) {
        if (!result.find((e) => e.id === ue.id)) {
          result.push(ue)
        }
      }

      return result
    })

    setTimeout(() => {
      if (currentStep === 1) {
        fitView({ padding: 0.3, duration: 400, maxZoom: 1 })
      } else {
        // Find the newest primary node (step/decision/done) at this step
        const revealedNodes = allNodes.filter((n) => n.revealAt === currentStep)
        const primary = revealedNodes.find((n) => ['step', 'decision', 'done'].includes(n.type)) || revealedNodes[0]
        if (primary) {
          const pos = movedNodePositionsRef.current.get(primary.id) || primary.position
          // Use title X for horizontal center, newest node Y for vertical
          const titleNode = allNodes.find((n) => n.id === 'title')
          const titlePos = movedNodePositionsRef.current.get('title') || titleNode?.position || { x: 0, y: -60 }
          const centerX = titlePos.x + 120
          const centerY = pos.y + 40
          const zoom = getZoom()
          setCenter(centerX, centerY, { zoom, duration: 400 })
        }
      }
    }, 50)
  }, [currentStep, setNodes, setEdges, fitView, getZoom, setCenter])

  const handleNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }, [TOTAL_STEPS])

  const handlePrevious = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }, [])

  const handleReset = useCallback(() => {
    userEdgesRef.current = []
    modifiedEdgesRef.current = new Map()
    movedNodePositionsRef.current = new Map()
    setCurrentStep(0)
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

export default function Flow({ flowId }) {
  return (
    <ReactFlowProvider>
      <FlowInner flowId={flowId} />
    </ReactFlowProvider>
  )
}
