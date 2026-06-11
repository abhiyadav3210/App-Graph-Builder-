# NetGraph Canvas Architect

A responsive and interactive **App Graph Builder** UI built with React, TypeScript, ReactFlow, Zustand, and TanStack Query.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

### 3. Build Production Target
```bash
npm run build
```

### 4. Run TypeScript checks
```bash
npm run typecheck
```

### 5. Lint codebase
```bash
npm run lint
```

---

## Key Technical Decisions

### 1. TanStack Query + In-Memory Mock API Integration
Instead of utilizing standard static mock objects, all app configurations and nodes graphs are fetched asynchronously via TanStack Query from an in-memory database (`mockApi.ts`) with custom synthetic delays. Cache mutation updates are directly synced with TanStack Query's cache state using `queryClient.setQueryData`, ensuring immediate visual reactions inside the canvas layout while keeping changes isolated.

### 2. Zustand State Orchestration
Zustand is chosen for application UI state (such as `selectedAppId`, `selectedNodeId`, and mobile view drawer toggles) which doesn't directly map to backend-persisted records. This prevents unnecessary prop drilling and cleanly separates UI visual state from server data caches.

### 3. Responsive Drawer & Premium Styling
- Large Viewports: Layout consists of a left icon rail, center dotted ReactFlow canvas, and a fixed right-sidebar containing the apps selection list and selected node inspector.
- Mobile Viewports: Right side panels automatically convert into a slide-over modal drawer controlled by Zustand.
- The UI features Google Fonts (Plus Jakarta Sans & Outfit), dynamic dark mode color hierarchies, glassmorphic elements, HSL custom color properties, and gradient animations.

---

## Known Limitations

1. **State Persistence**: Changes are persisted in-memory during the current runtime session but do not persist across hard browser refreshes.
2. **Keyboard Shortcuts**: Deletion uses `Delete` or `Backspace`. Fit View can be toggled using the Canvas control panel. Adding other complex global shortcut interceptors could conflict with form typing inside the inspector.
"# App-Graph-Builder-" 
