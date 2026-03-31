<script setup lang="ts">
import { tools } from '../registry/toolRegistry';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="home-container">
    <header class="hero">
      <h1>{{ t('home.heroTitle') }}</h1>
      <p>{{ t('home.heroSubtitle') }}</p>
    </header>

    <div class="tool-grid">
      <RouterLink 
        v-for="tool in tools" 
        :key="tool.id" 
        :to="{ name: 'tool', params: { id: tool.id } }"
        class="tool-card"
      >
        <div class="card-icon">
          <component :is="tool.icon" />
        </div>
        <h3>{{ t(`tools.${tool.id}.name`) }}</h3>
        <p>{{ t(`tools.${tool.id}.description`) }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem 0;
}

.hero {
  text-align: center;
  margin-bottom: 4rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--accent-color), #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tool-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-color);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
}

.tool-card h3 {
  margin: 0;
  font-size: 1.25rem;
}

.tool-card p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
