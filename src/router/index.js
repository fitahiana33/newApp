import {createRouter, createWebHistory} from 'vue-router';
import LoginView from "../views/backoffice/LoginView.vue";
import DashboardView from '../views/backoffice/DashboardView.vue';
import { useAuth } from '../composables/useAuth';
import ResetDataView from '@/views/backoffice/ResetDataView.vue';

const routes = [
    //Backoffice
    {path: "/", component: LoginView},
    {path: "/dashboard", component: DashboardView, meta: { requiresAuth: true }},
    {path: "/resetData", component: ResetDataView, meta: { requiresAuth: true }},
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const { isLogged } = useAuth();
router.beforeEach((to, from) => {
    if(to.meta?.requiresAuth && !isLogged.value) {
        return "/";
    }
    if(to.name === "Login" && isLogged.value) {
        return "/dashboard";
    }
});

export default router;