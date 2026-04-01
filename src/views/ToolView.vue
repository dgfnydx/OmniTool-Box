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
const isLoading = shallowRef(false);

watch(() => props.id, async (newId) => {
  const selectedTool = getToolById(newId);
  if (selectedTool) {
    isLoading.value = true;
    toolComponent.value = null; // Reset to show loading state
    
    try {
      // Small delay to prevent flickering if component loads instantly
      const component = await selectedTool.component();
      toolComponent.value = component.default || component;
    } catch (error) {
      console.error('Failed to load tool component:', error);
    } finally {
      isLoading.value = false;
    }
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
      <Transition name="fade-slide" mode="out-in">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <span>{{ t('common.loading') }}</span>
        </div>
        <div v-else-if="toolComponent" :key="props.id" class="component-wrapper">
          <component :is="toolComponent" />
        </div>
      </Transition>
    </main>
  </div>
  <div v-else class="error-state">
    <div class="error-content">
      <h2>404</h2>
      <p>{{ t('common.notFound') }}</p>
      <RouterLink to="/" class="primary-btn">{{ t('common.home') }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.tool-view-container {
  padding: 1rem 0;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  box-shadow: var(--card-shadow);
}

.tool-icon svg {
  width: 32px;
  height: 32px;
}

.tool-meta h1 {
  margin: 0;
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.tool-meta p {
  margin: 0.25rem 0 0 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.tool-content {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.5rem;
  min-height: 500px;
  position: relative;
  box-shadow: var(--card-shadow);
}

.loading-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  color: var(--text-secondary);
  background: var(--bg-card);
  border-radius: 20px;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--bg-secondary);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.error-content h2 {
  font-size: 5rem;
  margin: 0;
  color: var(--accent-color);
  opacity: 0.2;
}

.error-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--text-secondary);
}

.primary-btn {
  display: inline-block;
  background: var(--accent-color);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

@media (max-width: 768px) {
  .tool-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .tool-meta h1 {
    font-size: 1.75rem;
  }
  
  .tool-content {
    padding: 1.5rem;
    min-height: 400px;
  }
}
</style>
