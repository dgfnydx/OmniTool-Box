<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getEncoding } from 'js-tiktoken';
import { useToastStore } from '../../store/toast';
import { Trash2, Copy } from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToastStore();
const input = ref('');
const model = ref('cl100k_base'); // GPT-4/GPT-3.5 default

const tokenCount = computed(() => {
  if (!input.value) return 0;
  try {
    const enc = getEncoding(model.value as any);
    const tokens = enc.encode(input.value);
    return tokens.length;
  } catch (e) {
    console.error('Encoding error:', e);
    return 0;
  }
});

const characterCount = computed(() => input.value.length);

const clearInput = () => {
  input.value = '';
};

const copyInput = () => {
  if (input.value) {
    navigator.clipboard.writeText(input.value);
    toast.show(t('common.actions.copied'));
  }
};
</script>

<template>
  <div class="tool-container">
    <div class="stats-grid">
      <div class="stat-card accent">
        <div class="stat-value">{{ tokenCount }}</div>
        <div class="stat-label">{{ t('tools.token-counter.tokens') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ characterCount }}</div>
        <div class="stat-label">{{ t('tools.token-counter.characters') }}</div>
      </div>
    </div>

    <div class="workspace-card">
      <div class="editor-header">
        <div class="header-left">
          <label>{{ t('tools.token-counter.model') }}</label>
          <select v-model="model" class="model-select">
            <option value="cl100k_base">cl100k_base (GPT-4 / GPT-3.5-Turbo)</option>
            <option value="p50k_base">p50k_base (GPT-3 / Codex)</option>
            <option value="r50k_base">r50k_base (GPT-2 / Older)</option>
          </select>
        </div>
        <div class="header-right">
          <button @click="copyInput" class="icon-btn" :title="t('common.actions.copy')">
            <Copy :size="18" />
          </button>
          <button @click="clearInput" class="icon-btn" :title="t('common.actions.clear')">
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
      
      <textarea 
        v-model="input" 
        :placeholder="t('tools.token-counter.placeholder')" 
        spellcheck="false"
      ></textarea>
    </div>

    <div class="info-card">
      <p>💡 <b>{{ model }}</b>: {{ t(`tools.token-counter.models.${model}`) }}</p>
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  max-width: 900px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  text-align: center;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
}

.stat-card.accent {
  border-color: var(--accent-color);
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.stat-value {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-card.accent .stat-value {
  color: var(--accent-color);
}

.stat-label {
  font-size: 1rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.workspace-card {
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
}

.editor-header {
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.model-select {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
}

.header-right {
  display: flex;
  gap: 0.5rem;
}

textarea {
  width: 100%;
  height: 400px;
  padding: 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.info-card {
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--bg-card);
  color: var(--accent-color);
  border-color: var(--border-color);
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
