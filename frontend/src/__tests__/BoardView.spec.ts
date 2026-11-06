import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import BoardView from '../views/BoardView.vue'
import { useBoardsStore } from '../stores/boards'
import { VueDraggable } from 'vue-draggable-plus'

async function setup() {
    const pinia = createPinia()
    const store = useBoardsStore(pinia)
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/', component: BoardView }]
    })

    await router.push('/')
    await router.isReady()

    const wrapper = mount(BoardView, {
        global: {
            plugins: [pinia, router],
        },
    })

    return { wrapper, store }
}

describe('BoardView management controls', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('shows guidance when a board has no columns', async () => {
        const { wrapper, store } = await setup()

        store.createBoard('Empty board')
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('This board has no columns yet.')
    })

    it('creates a card through the add button', async () => {
        const { wrapper, store } = await setup()

        vi.spyOn(window, 'prompt')
        .mockReturnValueOnce('New task')
        .mockReturnValueOnce('Task details')

        await wrapper.get('button[aria-label="Add card to Backlog"]').trigger('click')

        expect(wrapper.text()).toContain('New task')
        expect(wrapper.text()).toContain('Task details')
    })

    it('leaves a card unchanged when editing is cancelled', async () => {
        const { wrapper, store } = await setup()
        const before = JSON.stringify(store.boards)
        vi.spyOn(window, 'prompt')
        .mockReturnValueOnce('Changed title')
        .mockReturnValueOnce(null)

        await wrapper.get('button[aria-label="Edit Define target audience"]').trigger('click')

        expect(JSON.stringify(store.boards)).toBe(before)
    })

    it('requires confirmation before deleting a card', async () => {
        const { wrapper } = await setup()
        const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
        const selector = 'button[aria-label="Delete Define target audience"]'

        await wrapper.get(selector).trigger('click')
        expect(wrapper.find(selector).exists()).toBe(true)

        confirm.mockReturnValue(true)

        await wrapper.get(selector).trigger('click')
        expect(wrapper.find(selector).exists()).toBe(false)
    })

    it('moves a card between columns using the select control', async () => {
        const { wrapper } = await setup()

        await wrapper
        .get('select[aria-label="Move Define target audience to column"]')
        .setValue('product-in-progress')

        const source = wrapper.get('section[aria-labelledby="column-product-backlog"]')
        const destination = wrapper.get('section[aria-labelledby="column-product-in-progress"]')

        expect(source.text()).not.toContain('Define target audience')
        expect(destination.text()).toContain('Define target audience')
    })

    it('applies dragged card ordering to the store and display', async () => {
        const { wrapper, store } = await setup()
        const board = store.activeBoard

        if (!board) {
            throw new Error('Expected an example board')
        }

        const column = board.columns[0]

        if (!column || column.cards.length < 2) {
            throw new Error('Expected a column containing at least two cards')
        }

        const expectedCards = [...column.cards].reverse()
        const expectedIds = expectedCards.map((card) => card.id)

        wrapper.getComponent(VueDraggable).vm.$emit('update', {
            data: expectedCards[0],
            newDraggableIndex: 0,
        })
        await wrapper.vm.$nextTick()

        expect(column.cards.map((card) => card.id)).toEqual(expectedIds)
        expect(column.cards.map((card) => card.order)).toEqual(
            expectedIds.map((_, index) => index),
        )

        const renderedTitles = wrapper
            .get('.board-column')
            .findAll('.task-card h3')
            .map((heading) => heading.text())

        expect(renderedTitles).toEqual(expectedCards.map((card) => card.title))
    })

    it('moves a dragged card to another column', async () => {
        const { wrapper, store } = await setup()
        const board = store.activeBoard!

        const source = board.columns.find((column) => column.id === 'product-backlog')!
        const destination = board.columns.find((column) => column.id === 'product-in-progress')!
        const movedCard = source.cards[0]!
        const draggableLists = wrapper.findAllComponents(VueDraggable)

        draggableLists[1]!.vm.$emit('add', {
            data: movedCard,
            newDraggableIndex: 0,
        })

        await wrapper.vm.$nextTick()

        expect(source.cards.some((card) => card.id === movedCard.id)).toBe(false)
        expect(destination.cards[0]?.id).toBe(movedCard.id)
        expect(destination.cards.map((card) => card.order)).toEqual(
            destination.cards.map((_, index) => index),
        )
    })

    it('moves a card to the end of the column', async () => {
        const { wrapper, store } = await setup()
        const board = store.activeBoard
        if (!board) {
            throw new Error('Expected an example board')
        }

        const column = board.columns[0]!
        const cards = column.cards
        const movedCard = cards[1]!
        const expectedIds = [movedCard.id, ...cards.filter((card) => card.id !== movedCard.id).map((card) => card.id)]

        wrapper.getComponent(VueDraggable).vm.$emit('update', {
            data: movedCard,
            newDraggableIndex: 0,
        })

        await wrapper.vm.$nextTick()

        expect(cards.map((card) => card.id)).toEqual(expectedIds)
        expect(cards.map((card) => card.order)).toEqual(expectedIds.map((_, index) => index))
    })
})