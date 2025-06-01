const state = {
    data: {
        projects: [
            {
                id: 'p1',
                name: 'Основной проект',
                tasks: [
                    {
                        id: '1',
                        title: 'Разработать главную страницу',
                        status: 'in-progress',
                        tags: ['frontend', 'design'],
                        subtasks: [
                            {
                                id: '1-1',
                                title: 'Сверстать хедер',
                                status: 'done',
                                tags: ['frontend'],
                                createdAt: new Date('2023-05-15'),
                                updatedAt: new Date('2023-05-16')
                            },
                            {
                                id: '1-2',
                                title: 'Сделать адаптив',
                                status: 'todo',
                                tags: ['frontend', 'responsive'],
                                createdAt: new Date('2023-05-15'),
                                updatedAt: new Date('2023-05-16')
                            }
                        ],
                        createdAt: new Date('2023-05-15'),
                        updatedAt: new Date('2023-05-16')
                    },
                    {
                        id: '2',
                        title: 'Написать API для задач',
                        status: 'todo',
                        tags: ['backend', 'nodejs'],
                        subtasks: [],
                        createdAt: new Date('2023-05-10'),
                        updatedAt: new Date('2023-05-10')
                    }
                ]
            },
            {
                id: 'p2',
                name: 'Второстепенный проект',
                tasks: [
                    {
                        id: '3',
                        title: 'Разработать логику для задач',
                        status: 'done',
                        tags: ['frontend', 'logic'],
                        createdAt: new Date('2025-06-01'),
                        updatedAt: new Date('2025-06-01')
                    },
                    {
                        id: '4',
                        title: 'Протестировать API',
                        status: 'in-progress',
                        tags: ['testing', 'backend'],
                        createdAt: new Date('2025-06-02'),
                        updatedAt: new Date('2025-06-02')
                    }
                ]
            },
            {
                id: 'p3',
                name: 'Личный проект',
                tasks: [
                    {
                        id: '5',
                        title: 'Добавить аутентификацию',
                        status: 'todo',
                        tags: ['security', 'backend'],
                        subtasks: [],
                        createdAt: new Date('2025-06-03'),
                        updatedAt: new Date('2025-06-03')
                    }
                ]
            }
        ],
        filters: {
            statuses: [ "todo", "done", "in-progress" ],
            tags: [ "work", "personal" ],
            search: "строка поиска"
        }
    },
    openedProjects: JSON.parse(localStorage.getItem("openedProjects")) || [],
};

const getters = {
    PROJECTS: (state) => state.data.projects,
    FILTERS: (state) => state.data.filters,

    OPENED_PROJECTS: (state) => state.openedProjects || JSON.parse(localStorage.getItem("openedProjects")),
};

const mutations = {
    SET_PROJECTS: (state, payload) => {
        state.data.projects = payload;
        localStorage.setItem("data", JSON.stringify(state.data));
    },
    SET_FILTERS: (state, payload) => {
        state.data.filters = payload;
        localStorage.setItem('data', JSON.stringify(state.data));
    },

    SET_OPENED_PROJECTS: (state, payload) => {
        state.openedProjects = payload;
        localStorage.setItem('openedProjects', JSON.stringify(payload));
    },
};

const actions = {
};

export default {
    state,
    getters,
    mutations,
    actions,
};
