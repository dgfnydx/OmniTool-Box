<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';

const { t } = useI18n();
const toast = useToastStore();
const input = ref('');
const output = ref('');
const error = ref('');

const encodeBase64 = () => {
  try {
    error.value = '';
    output.value = btoa(input.value);
  } catch (e: any) {
    error.value = t('tools.base64-converter.encodeError') + ': ' + e.message;
  }
};

const decodeBase64 = () => {
  try {
    error.value = '';
    output.value = atob(input.value);
  } catch (e: any) {
    error.value = t('tools.base64-converter.decodeError') + ': ' + e.message;
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
          <label>{{ t('tools.base64-converter.input') }}</label>
          <div class="actions">
            <button @click="encodeBase64" class="primary-btn">{{ t('tools.base64-converter.encode') }}</button>
            <button @click="decodeBase64" class="primary-btn">{{ t('tools.base64-converter.decode') }}</button>
            <button @click="clearAll" class="secondary-btn">{{ t('common.actions.clear') }}</button>
          </div>
        </div>
        <textarea 
          v-model="input" 
          :placeholder="t('tools.base64-converter.inputPlaceholder')" 
          spellcheck="false"
        ></textarea>
      </div>

      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.base64-converter.output') }}</label>
          <button v-if="output" @click="copyOutput" class="text-btn">{{ t('common.actions.copy') }}</button>
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <textarea 
          v-model="output" 
          readonly 
          :placeholder="t('tools.base64-converter.outputPlaceholder')" 
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
}

textarea {
  height: 400px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: monospace;
  resize: vertical;
  outline: none;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.primary-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
}

.secondary-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.75rem;
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

.error-msg {
  color: #ef4444;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
