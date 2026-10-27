# KanbanCraft Implementation Plan

## Problem and goal

The README describes a Vue-based Kanban board, but the current frontend is still close to the Vue starter template. The goal is to turn it into a polished, working portfolio project that demonstrates frontend engineering skills and is straightforward for employers to clone and run.

## Proposed approach

Build a local-first Kanban app with Vue 3, TypeScript, and Pinia. Persist boards in the browser so the core experience works without accounts, paid services, or backend setup. Provide example data for a useful first impression, and document simple setup and run instructions.

Treat backend integration, authentication, and cloud synchronization as future enhancements rather than requirements for the initial release. Aim for a free static deployment, such as GitHub Pages, if the existing project setup supports it cleanly.

## Scope and decisions

- **In scope:** Multiple boards, columns, cards, card movement and ordering, local persistence, responsive UI, accessibility, tests, documentation, and free static deployment.
- **State management:** Pinia.
- **Language:** TypeScript.
- **Persistence:** Browser `localStorage`; no server or account required.
- **Out of scope for the initial release:** HabitForge API integration, authentication, cloud storage, and collaborative editing.
- **Implementation note:** Prefer existing dependencies and project conventions. Select a drag-and-drop approach after checking compatibility with the current Vue setup; preserve an accessible non-drag alternative for moving cards.

## Implementation tasks

1. **Inspect and establish the application foundation**
   - Review the existing frontend structure, scripts, dependencies, and project configuration.
   - Replace the Vue starter screen and counter example with the Kanban app shell.
   - Define typed board, column, and card models, including stable IDs and explicit ordering.
   - Set up board navigation and routes if needed.
   - Seed the app with example board data so the demo is understandable on first launch.

2. **Implement board and task management**
   - Create, rename, and delete boards.
   - Create, rename, reorder, and delete columns.
   - Create, edit, and delete cards.
   - Move cards between columns and change their order within a column.
   - Include useful empty states and confirmations for destructive actions.

3. **Implement drag-and-drop interactions**
   - Support moving and reordering cards reliably.
   - Make drag-and-drop usable on touch screens.
   - Provide keyboard-operable controls as an alternative to dragging.
   - Consider column reordering as a follow-up if it is not needed for a coherent MVP.

4. **Persist and restore user data**
   - Save board changes to `localStorage` and restore them on reload.
   - Validate stored data before using it, and handle missing or malformed data clearly.
   - Define how users can restore or reset the example data.
   - Avoid indicating that data was saved when persistence fails.

5. **Polish the responsive and accessible experience**
   - Ensure the board works on desktop and mobile screen sizes.
   - Provide keyboard navigation, visible focus indicators, semantic controls, and adequate contrast.
   - Respect reduced-motion preferences.
   - Review populated, empty, and error states.

6. **Test and verify**
   - Add unit tests for the Pinia store, including board, column, card, ordering, and persistence behavior.
   - Add component tests for key UI interactions.
   - Add end-to-end coverage for the main workflows, including moving a card and restoring data after reload.
   - Run the project’s type check, tests, production build, and lint checks; fix issues introduced by the implementation.

7. **Prepare the repository for portfolio use**
   - Update the README with prerequisites, clone/install/run instructions, feature overview, test commands, screenshots, deployment instructions, and known limitations.
   - Add or update GitHub Actions to run relevant checks and deploy the static app using a free hosting option.
   - Clearly identify backend and cloud capabilities as future work unless they are implemented later.

## Completion criteria

- A new user can clone the repository, follow the README, and run the app without paid services or backend credentials.
- The app supports managing multiple boards, columns, and cards.
- Cards can be moved and reordered using drag-and-drop and an accessible alternative.
- Board data remains available after reloading the browser.
- Core behavior is covered by tests, and type-check, tests, lint, and production build pass.
- The README accurately describes setup, features, deployment, and limitations.