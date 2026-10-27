import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { initialBoards } from '../data/initialBoards'
import type { KanbanBoard } from '../types/kanban'

export const useBoardsStore = defineStore('boards', () => {
    const boards =ref<KanbanBoard[]>(structuredClone(initialBoards))
    const activeBoardId = ref(initialBoards[0]?.id ?? '')

    const activeBoard = computed(
        () => boards.value.find((board) => board.id === activeBoardId.value) ?? boards.value[0], 
    )

    return { boards, activeBoardId, activeBoard }
})