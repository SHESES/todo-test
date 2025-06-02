export const standart_filters = {
    statuses: ["todo", "done", "in-progress"],
    tags: [],
    search: "",
    sort_by: "updatedAt",
    show_completed: true,
};

export const for_test = [
    {
        id: 'p1',
        name: 'Знакомство с проектом',
        tasks: [
            {
                id: '1',
                title: 'Создать задачу',
                status: 'in-progress',
                tags: ['знакомство', 'проект', 'задача'],
                subtasks: [
                    {
                        id: '1-1',
                        title: 'Открыть проект',
                        status: 'done',
                        tags: ['проект'],
                        createdAt: new Date('2025-05-30'),
                        updatedAt: new Date('2025-05-31'),
                    },
                    {
                        id: '1-2',
                        title: 'Нажать на создание задачи',
                        status: 'todo',
                        tags: ['задача'],
                        createdAt: new Date('2025-05-30'),
                        updatedAt: new Date('2025-05-31'),
                    },
                    {
                        id: '1-2',
                        title: 'Заполнить задачу',
                        status: 'todo',
                        tags: ['задача'],
                        createdAt: new Date('2025-05-30'),
                        updatedAt: new Date('2025-05-31'),
                    },
                ],
                createdAt: new Date('2025-05-30'),
                updatedAt: new Date('2025-05-31'),
            },
            {
                id: '2',
                title: 'Создать проект',
                status: 'todo',
                tags: ['знакомство', 'проект'],
                subtasks: [],
                createdAt: new Date('2025-05-29'),
                updatedAt: new Date('2025-05-29'),
            },
        ],
    }
];
