const standart_filters = {
    statuses: ["todo", "done", "in-progress"],
    tags: [],
    search: "",
    sort_by: "updatedAt",
    show_completed: true
};

const for_test = [
    {
        id: 'p1',
        name: 'Домашние дела',
        tasks: [
            {
                id: '1',
                title: 'Убраться в комнате',
                status: 'in-progress',
                tags: ['уборка', 'дом'],
                subtasks: [
                    {
                        id: '1-1',
                        title: 'Пропылесосить ковёр',
                        status: 'done',
                        tags: ['уборка'],
                        createdAt: new Date('2025-05-30'),
                        updatedAt: new Date('2025-05-31')
                    },
                    {
                        id: '1-2',
                        title: 'Протереть пыль',
                        status: 'todo',
                        tags: ['уборка'],
                        createdAt: new Date('2025-05-30'),
                        updatedAt: new Date('2025-05-31')
                    }
                ],
                createdAt: new Date('2025-05-30'),
                updatedAt: new Date('2025-05-31')
            },
            {
                id: '2',
                title: 'Постирать одежду',
                status: 'todo',
                tags: ['дом', 'прачечная'],
                subtasks: [],
                createdAt: new Date('2025-05-29'),
                updatedAt: new Date('2025-05-29')
            }
        ]
    },
    {
        id: 'p2',
        name: 'Работа',
        tasks: [
            {
                id: '3',
                title: 'Подготовить презентацию для встречи',
                status: 'todo',
                tags: ['работа', 'презентация'],
                subtasks: [
                    {
                        id: '3-1',
                        title: 'Собрать данные',
                        status: 'done',
                        tags: ['исследование'],
                        createdAt: new Date('2025-05-28'),
                        updatedAt: new Date('2025-05-29')
                    },
                    {
                        id: '3-2',
                        title: 'Сделать слайды',
                        status: 'todo',
                        tags: ['презентация', 'дизайн'],
                        createdAt: new Date('2025-05-30'),
                        updatedAt: new Date('2025-05-30')
                    }
                ],
                createdAt: new Date('2025-05-28'),
                updatedAt: new Date('2025-05-30')
            },
            {
                id: '4',
                title: 'Отправить отчёт руководителю',
                status: 'done',
                tags: ['работа', 'отчёт'],
                subtasks: [],
                createdAt: new Date('2025-05-27'),
                updatedAt: new Date('2025-05-27')
            }
        ]
    },
    {
        id: 'p3',
        name: 'Личное развитие',
        tasks: [
            {
                id: '5',
                title: 'Прочитать книгу "Война и мир" для нагрузочного тестирования',
                status: 'in-progress',
                tags: ['чтение', 'саморазвитие', 'тестирование'],
                subtasks: [],
                createdAt: new Date('2025-05-20'),
                updatedAt: new Date('2025-05-31')
            },
            {
                id: '6',
                title: 'Выучить базовые команды Git',
                status: 'todo',
                tags: ['обучение', 'программирование'],
                subtasks: [],
                createdAt: new Date('2025-05-22'),
                updatedAt: new Date('2025-05-22')
            }
        ]
    }
];

const STORAGE_KEY = 'data';
const savedData = localStorage.getItem(STORAGE_KEY);

const initialData = savedData
    ? JSON.parse(savedData)
    : { projects: for_test, filters: standart_filters };
console.log(initialData);

const state = {
    data: initialData,
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
        console.log('Список проектов обновился');
    },
    SET_FILTERS: (state, payload) => {
        state.data.filters = { ...payload };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    },

    SET_OPENED_PROJECTS: (state, payload) => {
        state.openedProjects = payload;
        localStorage.setItem('openedProjects', JSON.stringify(payload));
    },
};

const actions = {
    RESET_FILTERS: (context) => {
        return new Promise((resolve) => {
            let standart = {
                statuses: ["todo", "done", "in-progress"],
                tags: [],
                search: "",
                sort_by: "updatedAt",
                show_completed: true
            };
            context.commit('SET_FILTERS', standart);
            resolve();
        });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
