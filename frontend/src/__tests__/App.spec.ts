import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import {createMemoryHistory, createRouter } from 'vue-router'
import App from '../App.vue'
import BoardView from '../views/BoardView.vue'

describe('App', () => {
  it('renders the KanbanCraft shell and example board', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: BoardView },
        { path: '/boards/:boardId', component: BoardView },
      ],
    })

    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    expect(wrapper.text()).toContain('KanbanCraft')
    expect(wrapper.text()).toContain('Product Launch')
    expect(wrapper.text()).toContain('Backlog')
  })
})
  