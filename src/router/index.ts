import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { tools } from '../registry/toolRegistry';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/tool/:id',
    name: 'tool',
    component: () => import('../views/ToolView.vue'),
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
