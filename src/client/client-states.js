import { createStore } from 'vuex';

import personal_states from 'personal-data/personal-data-states';
import main_states from 'main/main-states';

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        personal_states,
        main_states
    },
});
