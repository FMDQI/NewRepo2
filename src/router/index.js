import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/components/Layout.vue';
import Dashboard from '@/views/Dashboard.vue';
import Inventory from '@/views/Inventory.vue';
import Orders from '@/views/Orders.vue';
import Replenishment from '@/views/Replenishment.vue';
import Recycling from '@/views/Recycling.vue';
import NormalItems from '@/views/NormalItems.vue';
import Login from '@/views/Login.vue'; // 引入登录页面

const routes = [
    {
        path: '/',
        redirect: '/login', // 默认跳转到登录页面
    },
    {
        path: '/login',
        component: Login, // 登录页面
    },
    {
        path: '/',
        component: Layout, // 使用母版页
        meta: { requiresAuth: true }, // 需要登录
        children: [
            { path: '/dashboard', component: Dashboard },
            { path: '/inventory', component: Inventory },
            { path: '/orders', component: Orders },
            { path: '/replenishment', component: Replenishment },
            { path: '/recycling', component: Recycling },
            { path: '/normal-items', component: NormalItems },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('access_token'); // 检查是否登录

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); // 未登录则跳转到登录页面
    } else {
        next(); // 已登录则继续
    }
});

export default router;