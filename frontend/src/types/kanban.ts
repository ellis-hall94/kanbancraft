export interface TaskCard {
    id: string
    title: string
    description: string
    order: number
}

export interface KanbanColumn {
    id: string
    title: string
    order: number
    cards: TaskCard[]
}

export interface KanbanBoard {
    id: string
    name: string
    order: number
    columns: KanbanColumn[]
}