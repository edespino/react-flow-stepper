/**
 * Sample Flow — Demonstrates the react-flow-stepper pattern
 *
 * This is a placeholder flow shipped with the public repo.
 * To add your own private flows, initialize the git submodule:
 *   git submodule update --init src/flows
 */

import { MarkerType } from '@xyflow/react'

export const TOTAL_STEPS = 5

const edgeDefaults = {
  type: 'default',
  animated: true,
  style: { stroke: '#999', strokeWidth: 1.5, strokeDasharray: '6 4' },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#999', width: 10, height: 10 },
  className: 'animated-edge-gray',
}

const labelProps = {
  labelStyle: { fontSize: 12, fontWeight: 500, fill: '#555' },
  labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
  labelBgPadding: [4, 8],
  labelBgBorderRadius: 4,
}

const COL1 = 0
const COL2 = 380

export const allNodes = [
  {
    id: 'title',
    type: 'annotation',
    position: { x: 180, y: -70 },
    data: {
      text: 'Sample Architecture Flow',
      subtitle: 'Demonstrates step, decision, code snippet, annotation, and done nodes',
      isTitle: true,
    },
    selectable: false,
    revealAt: 1,
  },

  {
    id: 'start',
    type: 'step',
    position: { x: COL1, y: 50 },
    data: { title: 'Define Requirements', subtitle: 'Gather inputs and constraints', variant: 'orange' },
    revealAt: 1,
  },

  {
    id: 'check',
    type: 'decision',
    position: { x: 20, y: 250 },
    data: { title: 'Ready?' },
    revealAt: 2,
  },
  {
    id: 'check-note',
    type: 'annotation',
    position: { x: COL2, y: 240 },
    data: { text: 'Decision nodes branch the flow. Each branch gets a labeled edge.', isNote: true },
    revealAt: 2,
  },

  {
    id: 'build',
    type: 'step',
    position: { x: COL1, y: 450 },
    data: { title: 'Build', subtitle: 'Compile, test, package', variant: 'gray' },
    revealAt: 3,
  },
  {
    id: 'build-code',
    type: 'codeSnippet',
    position: { x: COL2, y: 430 },
    data: {
      code: `Build steps:
├─ Install dependencies
├─ Run linter
├─ Run tests
└─ Package artifact`,
    },
    revealAt: 3,
  },

  {
    id: 'deploy',
    type: 'step',
    position: { x: COL1, y: 650 },
    data: { title: 'Deploy', subtitle: 'Push to production', variant: 'gray' },
    revealAt: 4,
  },

  {
    id: 'done',
    type: 'done',
    position: { x: COL1, y: 850 },
    data: { title: 'Complete', subtitle: 'All steps finished' },
    revealAt: 5,
  },
]

export const allEdges = [
  { id: 'e-start-check', source: 'start', target: 'check', ...edgeDefaults, sourceHandle: 'bottom', targetHandle: 'top-in', revealAt: 2 },
  { id: 'e-check-build', source: 'check', target: 'build', ...edgeDefaults, sourceHandle: 'bottom', targetHandle: 'top-in', label: 'Yes', ...labelProps, revealAt: 3 },
  { id: 'e-build-deploy', source: 'build', target: 'deploy', ...edgeDefaults, sourceHandle: 'bottom', targetHandle: 'top-in', revealAt: 4 },
  { id: 'e-deploy-done', source: 'deploy', target: 'done', ...edgeDefaults, sourceHandle: 'bottom', targetHandle: 'top-in', revealAt: 5 },
]
