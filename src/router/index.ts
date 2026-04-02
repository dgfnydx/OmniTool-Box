import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { getToolById } from '../registry/toolRegistry';
import i18n from '../i18n';

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

router.afterEach((to) => {
  const { t } = i18n.global as any;
  if (to.name === 'tool' && to.params.id) {
    const tool = getToolById(to.params.id as string);
    if (tool) {
      document.title = `${t(`tools.${tool.id}.name`)} - OmniTool`;
      return;
    }
  }
  document.title = 'OmniTool - All-in-One Online Toolbox';
});

export default router;
