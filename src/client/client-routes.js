import { createRouter, createWebHistory } from 'vue-router';

import {
    PageNotFound
} from '../components';

import personalRoutes from 'personal-data/personal-data-routes';
import mainRoutes from 'main/main-routes';

const baseRoutes = [
    {
        path: '/',
        redirect: '/main',
    },
    {
        path: "/404",
        name: "Page404",
        meta: {
            title: "Страница не найдена",
        },
        component: PageNotFound,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...baseRoutes,
        ...personalRoutes,
        ...mainRoutes,
        {
            path: '/:pathMatch(.*)*',
            redirect: '/404',
        },
    ],
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Default Title'; // Добавлено fallback значение
    next();
});

export default router;
