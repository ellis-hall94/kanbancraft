import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { initialBoards } from '../data/initialBoards'
import type { KanbanBoard, KanbanColumn, TaskCard } from '../types/kanban'

function createId(): string {
  return crypto.randomUUID()
}

function updateOrder<T extends { order: number }>(items: T[]): void {
  items.forEach((item, index) => {
    item.order = index
  })
}

function moveOrderedItem<T extends { id: string; order: number }>(
  items: T[],
  itemId: string,
  targetOrder: number,
): boolean {
  const currentIndex = items.findIndex((item) => item.id === itemId)

  if (currentIndex === -1 || !Number.isFinite(targetOrder)) {
    return false
  }

  const [item] = items.splice(currentIndex, 1)

  if (!item) {
    return false
  }

  const destination = Math.max(0, Math.min(Math.trunc(targetOrder), items.length))
  items.splice(destination, 0, item)
  updateOrder(items)

  return true
}

export const useBoardsStore = defineStore('boards', () => {
  const boards = ref<KanbanBoard[]>(structuredClone(initialBoards))
  const activeBoardId = ref(initialBoards[0]?.id ?? '')

  const activeBoard = computed(
    () => boards.value.find((board) => board.id === activeBoardId.value) ?? boards.value[0],
  )

  function createBoard(name: string): string | null {
    const trimmedName = name.trim()

    if (!trimmedName) {
      return null
    }

    const boardId = createId()
    const board: KanbanBoard = {
      id: boardId,
      name: trimmedName,
      order: boards.value.length,
      columns: [],
    }

    boards.value.push(board)
    activeBoardId.value = boardId

    return boardId
  }

  function renameBoard(boardId: string, name: string): boolean {
    const board = boards.value.find((item) => item.id === boardId)
    const trimmedName = name.trim()

    if (!board || !trimmedName) {
      return false
    }

    board.name = trimmedName
    return true
  }

  function deleteBoard(boardId: string): boolean {
    if (boards.value.length <= 1) {
      return false
    }

    const boardIndex = boards.value.findIndex((item) => item.id === boardId)

    if (boardIndex === -1) {
      return false
    }

    boards.value.splice(boardIndex, 1)
    updateOrder(boards.value)

    if (activeBoardId.value === boardId) {
      activeBoardId.value = boards.value[0]?.id ?? ''
    }

    return true
  }

  function addColumn(boardId: string, title: string): string | null {
    const board = boards.value.find((item) => item.id === boardId)
    const trimmedTitle = title.trim()

    if (!board || !trimmedTitle) {
      return null
    }

    const columnId = createId()
    const column: KanbanColumn = {
      id: columnId,
      title: trimmedTitle,
      order: board.columns.length,
      cards: [],
    }

    board.columns.push(column)
    return columnId
  }

  function renameColumn(boardId: string, columnId: string, title: string): boolean {
    const board = boards.value.find((item) => item.id === boardId)
    const column = board?.columns.find((item) => item.id === columnId)
    const trimmedTitle = title.trim()

    if (!column || !trimmedTitle) {
      return false
    }

    column.title = trimmedTitle
    return true
  }

  function moveColumn(boardId: string, columnId: string, targetOrder: number): boolean {
    const board = boards.value.find((item) => item.id === boardId)

    if (!board) {
      return false
    }

    return moveOrderedItem(board.columns, columnId, targetOrder)
  }

  function deleteColumn(boardId: string, columnId: string): boolean {
    const board = boards.value.find((item) => item.id === boardId)

    if (!board) {
      return false
    }

    const columnIndex = board.columns.findIndex((item) => item.id === columnId)

    if (columnIndex === -1) {
      return false
    }

    board.columns.splice(columnIndex, 1)
    updateOrder(board.columns)

    return true
  }

  function addCard(
    boardId: string,
    columnId: string,
    title: string,
    description = '',
  ): string | null {
    const board = boards.value.find((item) => item.id === boardId)
    const column = board?.columns.find((item) => item.id === columnId)
    const trimmedTitle = title.trim()

    if (!column || !trimmedTitle) {
      return null
    }

    const cardId = createId()
    const card: TaskCard = {
      id: cardId,
      title: trimmedTitle,
      description: description.trim(),
      order: column.cards.length,
    }

    column.cards.push(card)
    return cardId
  }

  function updateCard(
    boardId: string,
    columnId: string,
    cardId: string,
    title: string,
    description: string,
  ): boolean {
    const board = boards.value.find((item) => item.id === boardId)
    const column = board?.columns.find((item) => item.id === columnId)
    const card = column?.cards.find((item) => item.id === cardId)
    const trimmedTitle = title.trim()

    if (!card || !trimmedTitle) {
      return false
    }

    card.title = trimmedTitle
    card.description = description.trim()

    return true
  }

  function deleteCard(boardId: string, columnId: string, cardId: string): boolean {
    const board = boards.value.find((item) => item.id === boardId)
    const column = board?.columns.find((item) => item.id === columnId)

    if (!column) {
      return false
    }

    const cardIndex = column.cards.findIndex((item) => item.id === cardId)

    if (cardIndex === -1) {
      return false
    }

    column.cards.splice(cardIndex, 1)
    updateOrder(column.cards)

    return true
  }

  function moveCard(
    boardId: string,
    cardId: string,
    targetColumnId: string,
    targetOrder: number,
  ): boolean {
    const board = boards.value.find((item) => item.id === boardId)
    const targetColumn = board?.columns.find((item) => item.id === targetColumnId)
    const sourceColumn = board?.columns.find((column) =>
      column.cards.some((card) => card.id === cardId),
    )

    if (!sourceColumn || !targetColumn || !Number.isFinite(targetOrder)) {
      return false
    }

    if (sourceColumn.id === targetColumn.id) {
      return moveOrderedItem(sourceColumn.cards, cardId, targetOrder)
    }

    const sourceIndex = sourceColumn.cards.findIndex((card) => card.id === cardId)
    const [card] = sourceColumn.cards.splice(sourceIndex, 1)

    if (!card) {
      return false
    }

    updateOrder(sourceColumn.cards)

    const destination = Math.max(0, Math.min(Math.trunc(targetOrder), targetColumn.cards.length))
    targetColumn.cards.splice(destination, 0, card)
    updateOrder(targetColumn.cards)

    return true
  }

  return {
    boards,
    activeBoardId,
    activeBoard,
    createBoard,
    renameBoard,
    deleteBoard,
    addColumn,
    renameColumn,
    moveColumn,
    deleteColumn,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  }
})