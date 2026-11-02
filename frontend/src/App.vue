<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useBoardsStore } from './stores/boards'

const boardsStore = useBoardsStore()
const route = useRoute()
const router = useRouter()

function createBoard() {
  const name = window.prompt('Enter a name for the new board:')

  if (name === null) return

  const boardId = boardsStore.createBoard(name)

  if (!boardId) {
    window.alert('Please enter a board name.')
    return
  }

  void router.push(`/boards/${boardId}`)
}

function renameBoard(boardId: string, currentName: string) {
  const name = window.prompt('Enter a new board name:', currentName)

  if (name === null) return

  if (!boardsStore.renameBoard(boardId, name)) {
    window.alert('Please enter a board name.')
  }
}

function deleteBoard(boardId: string, name: string) {
  if (boardsStore.boards.length <= 1) {
    window.alert('You must keep at least one board.')
    return
  }

  if (!window.confirm(`Delete "${name}" and all its columns and cards?`)) {
    return
  }

  const isDisplayedBoard =
  route.params.boardId === boardId ||
  (route.params.boardId === undefined && boardsStore.activeBoardId === boardId)

  if (!boardsStore.deleteBoard(boardId)) {
    window.alert('The board could not be deleted.')
    return
  }

  if (isDisplayedBoard) {
    void router.replace(`/boards/${boardsStore.activeBoardId}`)
  }
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" aria-label="Main navigation">
      <RouterLink class="sidebar__brand" to="/">KanbanCraft</RouterLink>

      <nav aria-label="Boards">
        <h2 class="sidebar__heading">Your boards</h2>

        <ul class="sidebar__boards">
          <li v-for="board in boardsStore.boards" :key="board.id" class="sidebar__board-item">
            <RouterLink class="sidebar__link" :to="`/boards/${board.id}`">
              {{ board.name }}
            </RouterLink>

            <div class="sidebar__board-actions">
              <button
                type="button"
                :aria-label="`Rename ${board.name}`"
                @click="renameBoard(board.id, board.name)"
              >
                Rename
              </button>
              <button
                type="button"
                :aria-label="`Delete ${board.name}`"
                @click="deleteBoard(board.id, board.name)"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>

        <button class="sidebar__create-board" type="button" @click="createBoard">
          Create board
        </button>
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

.sidebar__board-item {
  display: grid;
  gap: 0.25rem;
}

.sidebar__board-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0 0.75rem 0.5rem;
}

.sidebar__board-actions button,
.sidebar__create-board {
  min-height: 2rem;
  padding: 0.375rem 0.625rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: white;
  color: #172033;
  cursor: pointer;
}

.sidebar__board-actions button:focus-visible,
.sidebar__create-board:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

.sidebar__create-board {
  margin-top: 0.75rem;
}
</style>