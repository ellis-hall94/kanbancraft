<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardsStore } from '../stores/boards'
import type { TaskCard } from '../types/kanban'
import { VueDraggable, type DraggableEvent } from 'vue-draggable-plus'

const route = useRoute()
const boardsStore = useBoardsStore()

const board = computed(() => {
  const boardId = route.params.boardId

  if (typeof boardId === 'string') {
    return boardsStore.boards.find((item) => item.id === boardId)
  }

  return boardsStore.activeBoard
})

function addColumn(boardId: string) {
  const title = window.prompt('Enter a name for the new column:')

  if (title === null) return

  if (!boardsStore.addColumn(boardId, title)) {
    window.alert('Please enter a column name.')
  }
}

function renameColumn(boardId: string, columnId: string, currentTitle: string) {
  const title = window.prompt('Enter a new column name:', currentTitle)

  if (title === null) return

  if (!boardsStore.renameColumn(boardId, columnId, title)) {
    window.alert('Please enter a column name.')
  }
}

function moveColumn(boardId: string, columnId: string, targetOrder: number) {
  if (!boardsStore.moveColumn(boardId, columnId, targetOrder)) {
      window.alert('The column could not be moved.')
  }
}

function deleteColumn(boardId: string, columnId: string, title: string) {
  if (!window.confirm(`Delete "${title}" and all cards in it?`)) {
    return
  }

  if (!boardsStore.deleteColumn(boardId, columnId)) {
    window.alert('The column could not be deleted.')
  }
}

function addCard(boardId: string, columnId: string) {
  const title = window.prompt('Enter a title for the new card:')

  if (title === null) return

  if (!title.trim()) {
    window.alert('Please enter a card title.')
    return
  }

  const description = window.prompt('Enter a description (optional):', '')

  if (description === null) return

  if (!boardsStore.addCard(boardId, columnId, title, description)) {
    window.alert('The card could not be created.')
  }
}

function editCard(boardId: string, columnId: string, card: TaskCard) {
  const title = window.prompt('Edit card title:', card.title)

  if (title === null) return

  if (!title.trim()) {
    window.alert('Please enter a card title.')
    return
  }

  const description = window.prompt('Edit card description:', card.description)

  if (description === null) return

  if (!boardsStore.updateCard(boardId, columnId, card.id, title, description)) {
    window.alert('The card could not be updated.')
  }
}

function deleteCard(boardId: string, columnId: string, card: TaskCard) {
  if (!window.confirm(`Delete "${card.title}"?`)) return

  if (!boardsStore.deleteCard(boardId, columnId, card.id)) {
    window.alert('The card could not be deleted.')
  }
}

function reorderCard(
  boardId: string,
  cardId: string,
  columnId: string,
  targetOrder: number,
) {
  if (!boardsStore.moveCard(boardId, cardId, columnId, targetOrder)) {
    window.alert('The card could not be moved.')
  }
}

function changeCardColumn(boardId: string, cardId: string, event: Event) {
  const select = event.target
  if(!(select instanceof HTMLSelectElement)) {
    window.alert('The destination column could not be read.')
    return
  }

  const currentBoard = boardsStore.boards.find((item) => item.id === boardId)
  const sourceColumn = currentBoard?.columns.find((column) =>
    column.cards.some((card) => card.id === cardId),
  )
  const targetColumn = currentBoard?.columns.find((column) => column.id === select.value)

  if (!sourceColumn || !targetColumn) {
    window.alert('The source or target column could not be found.')
    return
  }

  if (!boardsStore.moveCard(boardId, cardId, targetColumn.id, targetColumn.cards.length)) {
    select.value = sourceColumn.id
    window.alert('The card could not be moved.')
  }
}

function moveDraggedCard(boardId: string, columnId: string, event: DraggableEvent<TaskCard>) {
  const targetOrder = event.newDraggableIndex

  if (typeof targetOrder !== 'number' || !Number.isInteger(targetOrder)) {
    window.alert('The card drop position could not be determined.')
    return
  }

  if (!boardsStore.moveCard(boardId, event.data.id, columnId, targetOrder)) {
    window.alert('The card could not be moved.')
  }
}

</script>

<template>
  <section v-if="board" class="board" :aria-labelledby="`board-${board.id}`">
    <header class="board__header">
      <div>
        <h1 :id="`board-${board.id}`">{{ board.name }}</h1>
        <p>Organize work into columns and cards.</p>
      </div>

      <button class="board__add-column" type="button" @click="addColumn(board.id)">
        Add column
      </button>
    </header>

    <p v-if="board.columns.length === 0">
      This board has no columns yet. Select add column to get started.
    </p>

    <div class="board__columns">
      <section
        v-for="(column, index) in [...board.columns].sort((a, b) => a.order - b.order)"
        :key="column.id"
        class="board-column"
        :aria-labelledby="`column-${column.id}`"
      >
        <header class="board-column__header">
          <h2 :id="`column-${column.id}`">
            {{ column.title }}
            <span class="board-column__count">{{ column.cards.length }}</span>
          </h2>

          <div class="board-column__actions" :aria-label="`${column.title} column actions`">
            <button
              type="button"
              :aria-label="`Move ${column.title} left`"
              :disabled="index === 0"
              @click="moveColumn(board.id, column.id, index - 1)"
            >
              Move left
            </button>
            <button
              type="button"
              :aria-label="`Move ${column.title} right`"
              :disabled="index === board.columns.length - 1"
              @click="moveColumn(board.id, column.id, index + 1)"
            >
              Move right
            </button>
            <button
              type="button"
              :aria-label="`Rename ${column.title}`"
              @click="renameColumn(board.id, column.id, column.title)"
            >
              Rename
            </button>
            <button
              type="button"
              :aria-label="`Delete ${column.title}`"
              @click="deleteColumn(board.id, column.id, column.title)"
            >
              Delete
            </button>
          </div>
        </header>
        <button
          type="button"
          class="board-column__add-card"
          :aria-label="`Add card to ${column.title}`"
          @click="addCard(board.id, column.id)"
        >
          Add card
        </button>

        <VueDraggable
        tag="ul"
        class="board-column__cards"
        :aria-label="`${column.title} cards`"
        :model-value="[...column.cards].sort((a, b) => a.order - b.order)"
        draggable=".task-card"
        handle=".task-card__drag-handle"
        ghost-class="task-card--ghost"
        :animation="0"
        :delay="150"
        :delay-on-touch-only="true"
        :touch-start-threshold="4"
        :group="{ name: 'kanban-cards', pull: true, put: true }"
        @update="moveDraggedCard(board.id, column.id, $event)"
        @add="moveDraggedCard(board.id, column.id, $event)"
        >
          <li
            v-for="(card, cardIndex) in [...column.cards].sort((a, b) => a.order - b.order)"
            :key="card.id"
            class="task-card"
          >
          <span class="task-card__drag-handle" aria-hidden="true">
            Drag to reorder
          </span>
            <h3>{{ card.title }}</h3>
            <p v-if="card.description">{{ card.description }}</p>

            <div class="task-card__actions">
              <button
                type="button"
                :aria-label="`Edit ${card.title}`"
                @click="editCard(board.id, column.id, card)"
              >
                Edit
              </button>
              <button
                type="button"
                :aria-label="`Delete ${card.title}`"
                @click="deleteCard(board.id, column.id, card)"
              >
                Delete
              </button>
              <button
                type="button"
                :aria-label="`Move ${card.title} up`"
                :disabled="cardIndex === 0"
                @click="reorderCard(board.id, card.id, column.id, cardIndex - 1)"
              >
                Move up
              </button>
              <button
                type="button"
                :aria-label="`Move ${card.title} down`"
                :disabled="cardIndex === column.cards.length - 1"
                @click="reorderCard(board.id, card.id, column.id, cardIndex + 1)"
              >
                Move down
              </button>
            </div>

            <label class="task-card__destination" :for="`destination-${card.id}`">
              Move to column
              <select
                :id="`destination-${card.id}`"
                :aria-label="`Move ${card.title} to column`"
                :value="column.id"
                @change="changeCardColumn(board.id, card.id, $event)"
              >
                <option
                  v-for="destination in [...board.columns].sort((a, b) => a.order - b.order)"
                  :key="destination.id"
                  :value="destination.id"
                >
                  {{ destination.title }}
                </option>
              </select>
            </label>
          </li>
        </VueDraggable>
        <p v-if="column.cards.length === 0" class="board-column__empty">No cards yet. Add a card to get started.</p>
      </section>
    </div>
  </section>

  <section v-else class="board-not-found">
    <h1>Board not found</h1>
    <p>Choose a board from the sidebar.</p>
  </section>
</template>

<style scoped>
.board__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.board__header h1 {
  margin-bottom: 0.25rem;
}

.board__header p,
.task-card p,
.board-column__empty {
  color: #64748b;
}

.board__columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
  align-items: start;
}

.board-column {
  min-width: 0;
  padding: 1rem;
  border: 1px solid #dbe2ea;
  border-radius: 0.75rem;
  background: #f8fafc;
}

.board-column__header {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.board-column__header h2 {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 0;
  font-size: 1rem;
}

.board-column__count {
  color: #64748b;
  font-weight: normal;
}

.board-column__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.board-column__actions button,
.board__add-column {
  min-height: 2rem;
  padding: 0.375rem 0.625rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: white;
  color: #172033;
  cursor: pointer;
}

.board-column__actions button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.board-column__actions button:focus-visible,
.board__add-column:focus-visible {
  outline: 3px solid #2563eb;
}

.board-column__cards {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.board-column__cards {
  min-height: 3rem;
}

.task-card {
  padding: 0.875rem;
  border: 1px solid #dbe2ea;
  border-radius: 0.5rem;
  background: white;
}

.task-card h3 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
}

.task-card p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.task-card__drag-handle {
  display: block;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.task-card__drag-handle:active {
  cursor: grabbing;
}

.task-card--ghost {
  opacity: 0.4;
}

@media (max-width: 40rem) {
  .board__header {
    flex-direction: column;
  }
}

.board-column__add-card {
  margin-bottom: 1rem;
}

.task-card__actions {
  display:flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.75rem;
}

.task-card__destination {
  display: grid;
  gap: 0.375rem;
  margin-top: 0.75rem;
  font-size: 0.875rem;
}

.board-column__add-card,
.task-card__actions button,
.task-card__destination select {
  min-height: 2rem;
  padding: 0.375rem 0.625rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: white;
  color: #172033;
  font: inherit;
}

.board-column__add-card,
.task-card__actions button {
  cursor: pointer;
}

.task-card__actions button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.board-column__add-card:focus-visible,
.task-card__actions button:focus-visible,
.task-card__destination select:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

.task-card__destination select {
  width: 100%;
  min-width: 0;
}

.task-card h3,
.task-card p {
  overflow-wrap: anywhere;
}
</style>