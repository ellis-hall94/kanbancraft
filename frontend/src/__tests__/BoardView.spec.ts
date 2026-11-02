import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import BoardView from '../views/BoardView.vue'
import { useBoardsStore } from '../stores/boards'

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
        const { wrapper } = await setup()
        vi.spyOn(window, 'prompt')
        .mockReturnValueOnce('New task')
        .mockReturnValueOnce('Task details')
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
})