import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { inject } from '@vercel/analytics';
import App from './App.vue';
import router from './router';
import i18n from './i18n';

// Initialize Vercel Analytics
inject();

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.use(router);

app.mount('#app');
