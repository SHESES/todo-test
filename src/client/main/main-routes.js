export default [
    {
        path: "/main",
        name: "mainPage",
        meta: {
            title: "ToDo",
        },
        component: () => import("./views/mainPage.vue"),
    }
];
