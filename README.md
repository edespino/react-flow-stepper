# react-flow-stepper

Interactive step-by-step architecture diagrams using [React Flow](https://reactflow.dev/) with progressive reveal. Turn architecture diagrams and design docs into navigable flowcharts where each step reveals the next piece of the system.

## Quick start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/` with a sample demo flow.

### Private flows

Flow data can be stored in a private git submodule. If you have access:

```bash
git submodule update --init src/flows
```

Without the submodule, the app falls back to a built-in sample flow.

## Features

- **Multi-project support** — organize flows into projects, navigate projects > flows > stepper
- **Step-by-step reveal** — nodes and edges appear one step at a time via Previous/Next controls
- **Draggable nodes** — reposition any box; positions persist across step changes
- **Reconnectable edges** — drag edge endpoints to different handles
- **New connections** — drag from any handle to create new edges
- **Reset** — restores all positions, edges, and connections to initial state
- **Animated edges** — dashed lines with directional arrows
- **Edge labels** — text centered on edges (used for decision branches)
- **Public/private split** — framework is open source, flow data can be private

## Node types

| Type | Purpose | Visual |
|------|---------|--------|
| `step` | Workflow step | Rounded box with orange (user action) or gray (automated) left border |
| `decision` | Branch point | Yellow dashed border |
| `done` | Terminal state | Green border |
| `codeSnippet` | Reference code | Purple dashed border, monospace font, no handles |
| `annotation` | Title or note | Title: large centered text. Note: pink dashed border |

## Adding flows

Use the `/flow-stepper` skill in Claude Code, or manually:

1. Create a `.jsx` file exporting `TOTAL_STEPS`, `allNodes`, `allEdges`
2. Register in the project's `index.js`
3. `npm run build` to verify

See `CLAUDE.md` for the full node, edge, and handle reference.

## Architecture

```
src/
  App.jsx            — Project/flow picker, navigation
  Flow.jsx           — Flow engine: step logic, persistence
  flows/             — Git submodule (private flow data)
  flows-sample/      — Public fallback (demo flow)
  nodes/             — React Flow node components
vite.config.js       — @flows alias (private or sample)
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Origin

The original example flow reproduces the "How Ralph Works with Amp" workflow presented by [Ryan Carson](https://x.com/ryancarson) on [Greg Isenberg's](https://x.com/gregisenberg) podcast: ["Ralph Wiggum" AI Agent will 10x Claude Code/Amp](https://www.youtube.com/watch?v=RpvQH0r0ecM). Screenshots from the video were provided to [Claude Code](https://claude.ai/code), which reproduced the workflow as an interactive React Flow diagram entirely from the images.

## License

Apache License 2.0 — see [LICENSE](LICENSE)
