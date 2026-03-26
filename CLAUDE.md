# react-flow-stepper

Interactive step-by-step flowchart using React Flow with progressive reveal.

## Project structure

```
src/
  App.jsx          — Root component, project/flow picker, imports PROJECTS from @flows
  Flow.jsx         — Flow engine: step logic, persistence, navigation, imports flowRegistry from @flows
  flows/           — Git submodule (private repo: edespino/react-flow-stepper-flows)
    index.js       — Exports flowRegistry + PROJECTS
    *.jsx          — Flow data files (nodes, edges, revealAt)
  flows-sample/    — Public fallback when submodule is not initialized
    index.js       — Exports sample flowRegistry + PROJECTS
    sample.jsx     — Demo flow
  nodes/
    HandleSet.jsx  — Shared handle component (4 visible source + 4 invisible target handles)
    StepNode.jsx   — Workflow step (orange or gray variant)
    DecisionNode.jsx — Decision/branch point (yellow dashed)
    DoneNode.jsx   — Terminal state (green)
    CodeSnippetNode.jsx — Code reference (purple dashed, no handles)
    AnnotationNode.jsx  — Title or note (no handles)
  App.css          — Edge animation color overrides
  index.css        — Global reset + full-height html/body/#root
vite.config.js     — @flows alias: src/flows if present, else src/flows-sample
```

## Private flows submodule

Flow data is stored in a private git submodule at `src/flows/`.

```bash
# Clone with submodule (requires access to private repo)
git clone --recurse-submodules <this-repo>

# Or initialize after clone
git submodule update --init src/flows

# Without submodule access, the app falls back to src/flows-sample/
```

## Creating a new flow

All flow data lives in `Flow.jsx` (or a new file following the same pattern). To create a new diagram:

### 1. Define nodes

Each node needs `id`, `type`, `position`, `data`, and `revealAt`:

```js
{
  id: '1',
  type: 'step',               // step | decision | done | codeSnippet | annotation
  position: { x: 0, y: 50 },  // canvas coordinates
  data: {
    title: 'Step name',
    subtitle: 'Description',
    variant: 'orange',         // 'orange' (user action) or 'gray' (automated) — step nodes only
  },
  revealAt: 1,                 // which step number reveals this node (1-based)
}
```

**Node type data shapes:**
- `step`: `{ title, subtitle, variant }` — variant is `'orange'` or `'gray'`
- `decision`: `{ title }`
- `done`: `{ title, subtitle }`
- `codeSnippet`: `{ code }` — string, preserves whitespace
- `annotation`: `{ text, subtitle?, isTitle?, isNote? }` — `isTitle` for heading, `isNote` for callout box

### 2. Define edges

Each edge needs `id`, `source`, `target`, handle IDs, and `revealAt`:

```js
{
  id: 'e1-2',
  source: '1',
  target: '2',
  ...edgeDefaults,              // spread the shared edge style
  sourceHandle: 'bottom',       // source handle ID on the source node
  targetHandle: 'top-in',       // target handle ID on the target node
  revealAt: 2,                  // revealed at the same step as the target node
}
```

**Edge labels** (for decision branches):
```js
{
  ...edge,
  label: 'Yes',
  labelStyle: { fontSize: 12, fontWeight: 500, fill: '#555' },
  labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
  labelBgPadding: [4, 8],
  labelBgBorderRadius: 4,
}
```

### 3. Handle naming convention

Each node (except `codeSnippet` and `annotation`) has 8 handles via `HandleSet`:

| Side | Source (visible) | Target (invisible) |
|------|------------------|--------------------|
| Top | `top` | `top-in` |
| Bottom | `bottom` | `bottom-in` |
| Left | `left` | `left-in` |
| Right | `right` | `right-in` |

**Edge direction convention:**
- Vertical flow: `sourceHandle: 'bottom'` → `targetHandle: 'top-in'`
- Horizontal right: `sourceHandle: 'right'` → `targetHandle: 'left-in'`
- Horizontal left: `sourceHandle: 'left'` → `targetHandle: 'right-in'`
- Loop back up: `sourceHandle: 'top'` → `targetHandle: 'bottom-in'`

### 4. Set TOTAL_STEPS

Update the `TOTAL_STEPS` constant to match the highest `revealAt` value.

## Persistence behavior

User modifications persist across step navigation until Reset:
- **Dragged node positions** — saved in `movedNodePositionsRef` on drag stop
- **Reconnected edges** — saved in `modifiedEdgesRef` when endpoint is moved
- **New edges** — saved in `userEdgesRef` when dragged between handles

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```
