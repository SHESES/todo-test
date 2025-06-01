const state = {
    showCookiesNotification: localStorage.getItem("cookies_notification") || true,
};

const getters = {
    SHOW_COOKIES_NOTIFICATION: (state) => state.showCookiesNotification || localStorage.getItem("cookies_notification"),
};

const mutations = {
    SET_SHOW_COOKIES_NOTIFICATION: (state, payload) => {
        state.showCookiesNotification = payload;
        localStorage.setItem("cookies_notification", payload);
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
