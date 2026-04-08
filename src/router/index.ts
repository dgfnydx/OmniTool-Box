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
  let title = t('seo.title');
  let description = t('seo.description');
  let keywords = t('seo.keywords');

  if (to.name === 'tool' && to.params.id) {
    const tool = getToolById(to.params.id as string);
    if (tool) {
      const toolName = t(`tools.${tool.id}.name`);
      const toolDesc = t(`tools.${tool.id}.description`);
      title = `${toolName} - ${t('seo.title')}`;
      description = `${toolName}: ${toolDesc} - ${t('seo.description')}`;
      keywords = `${toolName}, ${keywords}`;
    }
  }

  document.title = title;
  
  // Update meta tags for SEO
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);
  
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) metaKeywords.setAttribute('content', keywords);

  // Update OG tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);
});

export default router;
