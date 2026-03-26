---
name: flow-stepper
description: |
  Create a new react-flow stepper diagram from an architecture diagram, design doc,
  or description. Produces a flow data file, registers it, and wires it into the app.
  Use when asked to "create a flow", "add a stepper", "new diagram", or
  "implement a react flow stepper of <source>".
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Agent
  - AskUserQuestion
---

# Flow Stepper — Create a new react-flow step diagram

Generate a progressive-reveal React Flow stepper from an architecture diagram or design document.

## Inputs

Gather these before generating anything:

1. **Source** — path to the design doc, architecture diagram, or description to convert.
2. **Flow ID** — kebab-case identifier (e.g. `onprem-bundled-all`). Used as filename and registry key.
3. **Flow label** — human-readable name shown in the UI (e.g. "On-Prem — All Bundled").
4. **Flow description** — one-line description shown on the card.
5. **Project ID** — which project in `PROJECTS` this flow belongs to. If the project does not exist yet, collect a project label and description too.

If any input is missing, ask the user.

## Step 1 — Read the source document

Read the file at the source path. Identify:
- The architecture components, services, and infrastructure
- The logical deployment/execution order
- Decision points, optional components, loops
- Groupings (what gets revealed together)

## Step 2 — Design the step sequence

Break the architecture into 6–14 reveal steps that tell a story. Each step should reveal one logical concept. Guidelines:

- **Step 1** always reveals the title annotation + the starting node.
- Group tightly-coupled components into the same step.
- Decision nodes (`type: 'decision'`) need branch edges with labels (Pass/Fail, Yes/No, etc).
- Use annotations (`isNote: true`) to explain non-obvious details.
- Use code snippets (`type: 'codeSnippet'`) for lists of subcomponents or config.
- End with a `done` node.

## Step 3 — Generate the flow data file

Create `src/flows/<flow-id>.jsx` following this exact pattern:

```jsx
/**
 * <Title>
 *
 * <Brief description of what this flow depicts>
 */

import { MarkerType } from '@xyflow/react'

export const TOTAL_STEPS = <number>

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

export const allNodes = [
  // ... nodes with revealAt
]

export const allEdges = [
  // ... edges with revealAt
]
```

### Node rules

Each node needs: `id`, `type`, `position`, `data`, `revealAt`.

| Type | data shape | When to use |
|------|-----------|-------------|
| `step` | `{ title, subtitle, variant }` | Workflow steps. `variant: 'orange'` = user action, `'gray'` = automated. |
| `decision` | `{ title }` | Branch points. Always pair with labeled edges. |
| `done` | `{ title, subtitle }` | Terminal state. One per flow. |
| `codeSnippet` | `{ code }` | Multi-line text block (component lists, config). No handles. |
| `annotation` | `{ text, subtitle?, isTitle?, isNote? }` | `isTitle` for the flow heading. `isNote` for callout boxes. No handles. |

Title annotation: `selectable: false`, always `revealAt: 1`.

### Layout conventions

Use layout constants for consistent spacing:

```js
const COL1 = 0       // Main flow column
const COL2 = 380     // Notes / code snippets
const ROW_H = 200    // Vertical spacing between steps
```

Position title at roughly `{ x: 180, y: -70 }`.

### Edge rules

Each edge needs: `id`, `source`, `target`, `sourceHandle`, `targetHandle`, `revealAt`.

Spread `...edgeDefaults` on every edge. For labeled edges (decision branches), also spread `...labelProps` and add `label: 'Yes'` etc.

Handle naming:

| Direction | sourceHandle | targetHandle |
|-----------|-------------|--------------|
| Down | `bottom` | `top-in` |
| Right | `right` | `left-in` |
| Left | `left` | `right-in` |
| Up (loop) | `top` | `bottom-in` |

Edge `revealAt` should match the target node's `revealAt`.

## Step 4 — Register the flow

Edit `src/flows/index.js` (this file lives in the private submodule repo):

1. Add an import at the top:
   ```js
   import * as myFlowId from './<flow-id>'
   ```

2. Add an entry to `flowRegistry`:
   ```js
   '<flow-id>': myFlowId,
   ```

3. Add the flow to the appropriate project in the `PROJECTS` array. If the project is new, append a new project object:
   ```js
   {
     id: '<project-id>',
     label: '<Project Label>',
     description: '<Project description>',
     flows: [
       { id: '<flow-id>', label: '<Flow Label>', description: '<Flow description>' },
     ],
   },
   ```

## Step 5 — Verify

Run `npm run build` to confirm no errors.

## Step 6 — Commit to private submodule

The flow data lives in a private git submodule at `src/flows/` (remote: `git@github.com:edespino/react-flow-stepper-flows.git`).

After adding/editing flows, commit from within the submodule:
```bash
cd src/flows && git add -A && git commit -m "<message>" && git push && cd ../..
```

Then update the submodule reference in the parent repo:
```bash
git add src/flows && git commit -m "Update flows submodule"
```

## Architecture — public/private split

- `src/flows/` — git submodule (private repo). Contains real flow data + `index.js` exporting `flowRegistry` and `PROJECTS`.
- `src/flows-sample/` — committed to public repo. Ships a demo flow so the app works without the submodule.
- `vite.config.js` — alias `@flows` resolves to `src/flows/` if `index.js` exists, else `src/flows-sample/`.
- `src/Flow.jsx` — imports `flowRegistry` from `@flows`.
- `src/App.jsx` — imports `PROJECTS` from `@flows`.

## Reference — existing files

- Flow data files: `src/flows/*.jsx` (private submodule)
- Flow index: `src/flows/index.js` (exports flowRegistry + PROJECTS)
- Sample fallback: `src/flows-sample/` (public repo)
- Flow engine: `src/Flow.jsx` (imports from `@flows`)
- App shell: `src/App.jsx` (imports PROJECTS from `@flows`)
- Vite alias: `vite.config.js` (`@flows` resolution)
- Node components: `src/nodes/*.jsx`
- Project docs: `CLAUDE.md` (full node/edge/handle reference)
