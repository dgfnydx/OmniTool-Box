<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';

const { t } = useI18n();
const toast = useToastStore();
const input = ref('');
const output = ref('');
const error = ref('');

const formatJson = () => {
  try {
    error.value = '';
    const parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed, null, 2);
  } catch (e: any) {
    error.value = (t('tools.json-formatter.invalidJson') || 'Invalid JSON') + ': ' + e.message;
    output.value = '';
  }
};

const clearAll = () => {
  input.value = '';
  output.value = '';
  error.value = '';
};

const copyOutput = () => {
  if (output.value) {
    navigator.clipboard.writeText(output.value);
    toast.show(t('common.actions.copied'));
  }
};
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.json-formatter.input') }}</label>
          <div class="actions">
            <button @click="formatJson" class="primary-btn">{{ t('common.actions.format') }}</button>
            <button @click="clearAll" class="secondary-btn">{{ t('common.actions.clear') }}</button>
          </div>
        </div>
        <textarea 
          v-model="input" 
          :placeholder="t('tools.json-formatter.inputPlaceholder')" 
          spellcheck="false"
        ></textarea>
      </div>

      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.json-formatter.output') }}</label>
          <button v-if="output" @click="copyOutput" class="text-btn">{{ t('common.actions.copy') }}</button>
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <textarea 
          v-model="output" 
          readonly 
          :placeholder="t('tools.json-formatter.outputPlaceholder')" 
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  max-width: 1000px;
  margin: 0 auto;
}

.workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label {
  font-weight: 600;
  color: var(--text-primary);
}

textarea {
  height: 400px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}

textarea:focus {
  border-color: var(--accent-color);
}

.error-msg {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.primary-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.secondary-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.text-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-weight: 500;
}

@media (max-width: 768px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
