# react-flow-stepper

Step-by-step interactive flowchart built with [React Flow](https://reactflow.dev). Nodes and edges are revealed progressively as the user clicks through steps. Nodes are draggable, edges are reconnectable, and all modifications persist across step navigation until reset.

## Demo

The included example visualizes "How Ralph Works with Amp" — an autonomous AI agent loop for completing PRDs.

## Getting started

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Features

- **Step-by-step reveal** — nodes and edges appear one step at a time via Previous/Next controls
- **Draggable nodes** — reposition any box; positions persist across step changes
- **Reconnectable edges** — drag edge endpoints to different handles
- **New connections** — drag from any handle to create new edges
- **Reset** — restores all positions, edges, and connections to initial state
- **Animated edges** — dashed lines with directional arrows
- **Edge labels** — text centered on edges (used for decision branches)
- **5 node types** — step, decision, done, code snippet, annotation

## Node types

| Type | Purpose | Visual |
|------|---------|--------|
| `step` | Workflow step | Rounded box with orange (user action) or gray (automated) left border |
| `decision` | Branch point | Yellow dashed border |
| `done` | Terminal state | Green border |
| `codeSnippet` | Reference code | Purple dashed border, monospace font, no handles |
| `annotation` | Title or note | Title: large centered text. Note: pink dashed border |

## Origin

The example flow reproduces the "How Ralph Works with Amp" workflow presented by [Ryan Carson](https://x.com/ryancarson) on [Greg Isenberg's](https://x.com/gregisenberg) podcast: ["Ralph Wiggum" AI Agent will 10x Claude Code/Amp](https://www.youtube.com/watch?v=RpvQH0r0ecM). Ralph is an autonomous AI agent loop that picks user stories from a PRD, implements them, runs tests, commits changes, and loops until all stories pass.

Screenshots from the video were provided to [Claude Code](https://claude.ai/code), which reproduced the workflow as an interactive React Flow diagram — extracting the node layout, connections, visual styles, and step-by-step reveal behavior entirely from the images.

## How it was built

1. Screenshots of the Ralph workflow from the podcast were provided as input to Claude Code
2. Claude Code extracted the node types, layout, edge connections, and visual styles from the images
3. The step-by-step reveal system was built based on the navigation UI visible in the screenshots (Previous / Step N of 10 / Next / Reset)
4. Interactive features (drag nodes, reconnect edges, create new connections, persist modifications) were layered on iteratively through conversation
5. The entire project — scaffolding, components, styles, and documentation — was generated in a single Claude Code session

## License

Apache License 2.0 — see [LICENSE](LICENSE)
