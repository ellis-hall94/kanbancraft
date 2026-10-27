<script setup lang="ts">
import { useBoardsStore } from './stores/boards'

const boardsStore = useBoardsStore()
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" aria-label="Main navigation">
      <RouterLink class="sidebar__brand" to="/">KanbanCraft</RouterLink>

      <nav aria-label="Boards">
        <h2 class="sidebar__heading">Your boards</h2>
        <ul class="sidebar__boards">
          <li v-for="board in boardsStore.boards" :key="board.id">
            <RouterLink class="sidebar__link" :to="`/boards/${board.id}`">
              {{ board.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
:root {
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #172033;
  background: #fff;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 20rem;
  min-height: 100vh;
  margin: 0;
}

a {
  color: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: 15rem minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  padding: 1.5rem 1rem;
  border-right: 1px solid #dbe2ea;
  background: #f8fafc;
}

.sidebar__brand {
  display: inline-block;
  margin: 0 0 2rem;
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
}

.sidebar__heading {
  margin: 0 0 0.75rem;
  color: #64748b;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sidebar__boards {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar__link {
  display: block;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
}

.sidebar__link:hover,
.sidebar__link.router-link-active {
  background: #e2e8f0;
}

.sidebar__link:focus-visible,
.sidebar__brand:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

.main-content {
  min-width: 0;
  padding: 2rem;
}

@media (max-width:  40rem) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: 0;
    border-bottom: 1px solid #dbe2ea;
  }

  .sidebar__brand {
    margin-bottom: 1rem;
  }

  .main-content {
    padding: 1.25rem;
  }
}
</style>