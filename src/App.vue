<script setup lang="ts">
import DefaultLayout from './layouts/DefaultLayout.vue';
import ToastContainer from './components/common/ToastContainer.vue';
</script>

<template>
  <DefaultLayout />
  <ToastContainer />
</template>

<style>
:root {
  /* Light Theme */
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-card: #ffffff;
  --bg-sidebar: #fcfcfd;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --accent-color: #3b82f6;
  --border-color: #e2e8f0;
  --card-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.dark {
  /* Dark Theme */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --bg-sidebar: #0f172a;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --accent-color: #3b82f6;
  --border-color: #334155;
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

/* Base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

h1, h2, h3, h4 {
  color: var(--text-primary);
  font-weight: 700;
}
</style>
