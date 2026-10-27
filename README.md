# KanbanCraft

KanbanCraft is a portfolio project for building a responsive, local-first Kanban board with Vue 3, TypeScript, and Pinia. The goal is to demonstrate frontend architecture, state management, accessible interactions, testing, and deployment in an app that can be cloned and run without a backend or paid services.

> **Project status:** The app is currently at an early development stage. The planned Kanban features below are not all implemented yet; this README will be updated as they become available.

## Planned features

The initial release is intended to include:

- Multiple boards, with options to create, rename, and delete them
- Columns that can be created, renamed, reordered, and deleted
- Cards that can be created, edited, deleted, moved, and reordered
- Drag-and-drop card interactions, with accessible alternatives to dragging
- Browser `localStorage` persistence, so boards remain after reload
- Responsive layouts for desktop and mobile
- Example board data to make the app easy to explore

## Technology

- Vue 3
- TypeScript
- Pinia
- Vue Router
- Vite
- Vitest and Vue Test Utils
- Playwright

The app is designed to work locally without a server, account, API key, or paid service.

## Getting started

### Prerequisites

- Git
- Node.js `22.18+` or `24.12+`
- npm

### Clone and install

```sh
git clone https://github.com/ellis-hall94/kanbancraft.git
cd kanbancraft/frontend
npm ci
```

### Start the development server

```sh
npm run dev
```

Vite will print a local URL in the terminal. Open that URL in your browser.

## Development commands

Run these commands from the `frontend/` directory.

```sh
# Check TypeScript and Vue types
npm run type-check

# Run unit tests once
npm run test:unit -- --run

# Run end-to-end tests
npm run test:e2e

# Build the app for production
npm run build
```

The configured `npm run lint` script runs the project's lint tasks, which currently include autofix options.

## Project structure

```text
kanbancraft/
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── __tests__/      # Unit tests
│   │   ├── router/         # Vue Router configuration
│   │   ├── stores/         # Pinia stores
│   │   ├── App.vue         # Root Vue component
│   │   └── main.ts         # App entry point
│   ├── index.html
│   └── package.json
├── plan.md                 # Development plan
└── README.md
```

## Data and privacy

The planned MVP stores board data in the browser's `localStorage`. It does not require a user account or send board data to a server. Data is specific to the browser and device where it was created; clearing browser storage will remove it.

## Deployment

Free static hosting, such as GitHub Pages, is the intended deployment approach. Deployment instructions and a live demo link will be added once deployment is configured and verified.

## Roadmap

1. **Foundation:** Replace the starter screen with the app shell, typed data models, and example board.
2. **Board features:** Add board, column, and card management.
3. **Interactions:** Add card movement and ordering, including drag-and-drop and accessible alternatives.
4. **Persistence:** Save and restore boards with `localStorage`, including handling invalid saved data.
5. **Polish:** Improve responsive behavior, accessibility, and error and empty states.
6. **Quality and release:** Expand tests, document verified setup and deployment, and configure free static hosting.

## Future work

These ideas are outside the initial local-first release and may be considered later:

- HabitForge API integration
- User authentication
- Cloud storage and synchronization
- Collaborative editing
- Additional themes and appearance options

## Why KanbanCraft?

KanbanCraft is intended to complement my other portfolio projects by showcasing interactive frontend development, thoughtful state management, accessible UI design, and a straightforward developer setup.

## Related projects

- HabitForge — Full-stack habit tracking app
- InsightWorker — Python analytics microservice
- TaskFlow Engine — C# workflow automation engine
- Project Template — Base structure for full-stack projects