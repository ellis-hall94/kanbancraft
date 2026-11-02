import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useBoardsStore } from '../stores/boards'

describe('boards store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('creates a board and makes it active', () => {
    const store = useBoardsStore()

    const boardId = store.createBoard('  New board  ')

    expect(boardId).toBeTruthy()
    expect(store.boards[store.boards.length - 1]?.name).toBe('New board')
    expect(store.activeBoardId).toBe(boardId)
    expect(store.activeBoard?.id).toBe(boardId)
  })

  it('rejects a board with a blank name', () => {
    const store = useBoardsStore()

    expect(store.createBoard('   ')).toBeNull()
  })

  it('does not allow deleting the last board', () => {
    const store = useBoardsStore()
    const secondBoardId = store.boards[1]!.id

    expect(store.deleteBoard(store.boards[0]!.id)).toBe(true)
    expect(store.deleteBoard(secondBoardId)).toBe(false)
    expect(store.boards).toHaveLength(1)
  })

  it('adds and reorders columns', () => {
    const store = useBoardsStore()
    const boardId = store.boards[0]!.id

    const columnId = store.addColumn(boardId, 'Review')

    expect(columnId).toBeTruthy()
    expect(store.moveColumn(boardId, columnId!, 0)).toBe(true)
    expect(store.boards[0]!.columns[0]!.id).toBe(columnId)
    expect(store.boards[0]!.columns.map((column) => column.order)).toEqual([0, 1, 2, 3])
  })

  it('adds, edits, and deletes a card', () => {
    const store = useBoardsStore()
    const boardId = store.boards[0]!.id
    const columnId = store.boards[0]!.columns[0]!.id

    const cardId = store.addCard(boardId, columnId, '  New card  ', '  Card details  ')

    expect(cardId).toBeTruthy()
    expect(store.boards[0]!.columns[0]!.cards[store.boards[0]!.columns[0]!.cards.length - 1]).toMatchObject({
      id: cardId,
      title: 'New card',
      description: 'Card details',
    })

    expect(store.updateCard(boardId, columnId, cardId!, 'Updated card', 'Updated details')).toBe(
      true,
    )
    expect(store.boards[0]!.columns[0]!.cards[store.boards[0]!.columns[0]!.cards.length - 1]).toMatchObject({
      title: 'Updated card',
      description: 'Updated details',
    })

    expect(store.deleteCard(boardId, columnId, cardId!)).toBe(true)
    expect(store.boards[0]!.columns[0]!.cards.some((card) => card.id === cardId)).toBe(false)
  })

  it('moves a card to another column and updates ordering', () => {
    const store = useBoardsStore()
    const board = store.boards[0]!
    const sourceColumn = board.columns[0]!
    const targetColumn = board.columns[1]!
    const cardId = sourceColumn.cards[0]!.id

    expect(store.moveCard(board.id, cardId, targetColumn.id, 0)).toBe(true)
    expect(sourceColumn.cards.some((card) => card.id === cardId)).toBe(false)
    expect(targetColumn.cards[0]!.id).toBe(cardId)
    expect(sourceColumn.cards.map((card) => card.order)).toEqual([0])
    expect(targetColumn.cards.map((card) => card.order)).toEqual([0, 1])
  })
})