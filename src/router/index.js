import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/signup', component: () => import('@/views/Signup.vue') },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})