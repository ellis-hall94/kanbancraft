import type { KanbanBoard } from '../types/kanban'

    export const initialBoards: KanbanBoard[] = [
        {
            id: 'product-launch',
            name: 'Product Launch',
            order: 0,
            columns: [
            {
                id: 'product-backlog',
                title: 'Backlog',
                order: 0,
                cards: [
                    {
                        id: 'define-audence',
                        title: 'Define target audience',
                        description: 'Document the primary users for the first release.',
                        order: 0,                    
                    },
                    {
                        id: 'write-launch-copy',
                        title: 'Draft launch announcement',
                        description: 'Prepare a first version of the product announcement.',
                        order: 1,
                    },
                ],
            },
            {
                id: 'product-in-progress',
                title: 'In Progress',
                order: 1,
                cards: [
                    {
                        id: 'design-landing-page',
                        title: 'Design landing page',
                        description: 'Create a responsive layout for the product landing page.',
                        order: 0,
                    },
                ],
            },
            {
                id: 'product-done',
                title: 'Done',
                order: 2,
                cards: [
                    {
                        id: 'create-project',
                        title: 'Create project repository',
                        description: ' Set up the initial application repository.',
                        order: 0,
                    },
                ],
            },
        ],
    },
    {
        id: 'personal-projects',
        name: 'Personal Projects',
        order: 1,
        columns: [
            {
                id: 'personal-backlog',
                title: 'Ideas',
                order: 0,
                cards: [
                    {
                        id: 'learn-testing',
                        title: 'Explore component testing',
                        description: 'Review testing patterns for Vue components.',
                        order: 0,
                    },
                ],
            }, 
            {
                id: 'personal-in-progress',
                title: 'Working on',
                order: 1,
                cards: [],
            },
            {
                id: 'personal-done',
                title: 'Completed',
                order: 2,
                cards: [],
            },
        ],
    },
]