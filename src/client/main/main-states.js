import { standart_filters, for_test } from './defaultData.js';

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
