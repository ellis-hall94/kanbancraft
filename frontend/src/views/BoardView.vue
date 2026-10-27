<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardsStore } from '../stores/boards'

const route = useRoute()
const boardsStore = useBoardsStore()

const board = computed(() => {
  const boardId = route.params.boardId

  if (typeof boardId === 'string') {
    return boardsStore.boards.find((item) => item.id === boardId)
  }

  return boardsStore.activeBoard
})
</script>

<template>
  <section v-if="board" class="board" :aria-labelledby="`board-${board.id}`">
    <header class="board__header">
      <h1 :id="`board-${board.id}`">{{ board.name }}</h1>
      <p>Organize work into columns and cards.</p>
    </header>

    <div class="board__columns">
      <section
        v-for="column in [...board.columns].sort((a, b) => a.order - b.order)"
        :key="column.id"
        class="board-column"
        :aria-labelledby="`column-${column.id}`"
      >
        <h2 :id="`column-${column.id}`">
          {{ column.title }}
          <span class="board-column__count">{{ column.cards.length }}</span>
        </h2>

        <ul v-if="column.cards.length" class="board-column__cards">
          <li
            v-for="card in [...column.cards].sort((a, b) => a.order - b.order)"
            :key="card.id"
            class="task-card"
          >
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </li>
        </ul>
        <p v-else class="board-column__empty">No cards yet</p>
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
  padding: 1rem;
  border: 1px solid #dbe2ea;
  border-radius: 0.75rem;
  background: #f8fafc;
}

.board-column h2 {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0;
  font-size: 1rem;
}

.board-column__count {
  color: #64748b;
  font-weight: normal;
}

.board-column__cards {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
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
</style>