import * as sample from './sample'

export const flowRegistry = {
  sample: sample,
}

export const PROJECTS = [
  {
    id: 'demo',
    label: 'Demo Project',
    description: 'Sample flow demonstrating the react-flow-stepper pattern. Initialize the git submodule for private flows.',
    flows: [
      { id: 'sample', label: 'Sample Flow', description: 'Step, decision, code snippet, annotation, and done nodes' },
    ],
  },
]
