<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getToolById } from '../registry/toolRegistry';

const { t } = useI18n();
const props = defineProps<{
  id: string;
}>();

const tool = computed(() => getToolById(props.id));

const toolComponent = shallowRef();

watch(() => props.id, async (newId) => {
  const selectedTool = getToolById(newId);
  if (selectedTool) {
    toolComponent.value = defineAsyncComponent(selectedTool.component);
  }
}, { immediate: true });
</script>

<template>
  <div v-if="tool" class="tool-view-container">
    <header class="tool-header">
      <div class="tool-icon">
        <component :is="tool.icon" />
      </div>
      <div class="tool-meta">
        <h1>{{ t(`tools.${tool.id}.name`) }}</h1>
        <p>{{ t(`tools.${tool.id}.description`) }}</p>
      </div>
    </header>

    <main class="tool-content">
      <component :is="toolComponent" v-if="toolComponent" />
      <div v-else class="loading">{{ t('common.loading') }}</div>
    </main>
  </div>
  <div v-else class="error">{{ t('common.notFound') }}</div>
</template>

<style scoped>
.tool-view-container {
  padding: 1rem 0;
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tool-icon {
  width: 64px;
  height: 64px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
}

.tool-meta h1 {
  margin: 0;
  font-size: 2rem;
}

.tool-meta p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.tool-content {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2.5rem;
  min-height: 400px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .tool-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .tool-content {
    padding: 1.5rem;
  }
}
</style>
