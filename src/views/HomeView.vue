<script setup lang="ts">
import { computed } from 'vue';
import { tools } from '../registry/toolRegistry';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Group tools by category
const groupedTools = computed(() => {
  const groups: Record<string, typeof tools> = {};
  tools.forEach(tool => {
    if (!groups[tool.category]) {
      groups[tool.category] = [];
    }
    groups[tool.category].push(tool);
  });
  return groups;
});

// Category order for display
const categoryOrder = ['developer', 'text', 'image', 'design', 'calc', 'life'];
</script>

<template>
  <div class="home-container">
    <header class="hero">
      <h1>{{ t('home.heroTitle') }}</h1>
      <p>{{ t('home.heroSubtitle') }}</p>
    </header>

    <div class="sections-container">
      <section 
        v-for="catId in categoryOrder" 
        :key="catId" 
        class="category-section"
      >
        <div class="category-header">
          <h2>{{ t(`common.categories.${catId}`) }}</h2>
          <span class="tool-count">{{ groupedTools[catId]?.length || 0 }}</span>
        </div>

        <div class="tool-grid">
          <RouterLink 
            v-for="tool in groupedTools[catId]" 
            :key="tool.id" 
            :to="{ name: 'tool', params: { id: tool.id } }"
            class="tool-card"
          >
            <div class="card-icon">
              <component :is="tool.icon" />
            </div>
            <div class="card-content">
              <h3>{{ t(`tools.${tool.id}.name`) }}</h3>
              <p>{{ t(`tools.${tool.id}.description`) }}</p>
            </div>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem 0;
}

.hero {
  text-align: center;
  margin-bottom: 5rem;
  padding: 0 1rem;
}

.hero h1 {
  font-size: clamp(2.5rem, 8vw, 4rem);
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--accent-color), #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hero p {
  font-size: clamp(1rem, 3vw, 1.25rem);
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.sections-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.category-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.tool-count {
  font-size: 0.875rem;
  background: var(--bg-secondary);
  color: var(--accent-color);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-weight: 600;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

.tool-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
}

.tool-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-color);
  box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.1);
  background: var(--bg-secondary);
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  flex-shrink: 0;
  transition: all 0.25s;
}

.tool-card:hover .card-icon {
  background: var(--accent-color);
  color: white;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.tool-card h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.tool-card p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>
