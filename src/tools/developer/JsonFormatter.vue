<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // 使用深色主题
import 'prismjs/components/prism-json';

const { t } = useI18n();
const toast = useToastStore();
const input = ref('');
const output = ref('');
const error = ref('');
const codeContainer = ref<HTMLElement | null>(null);

const formatJson = async () => {
  try {
    error.value = '';
    if (!input.value.trim()) {
      output.value = '';
      return;
    }
    const parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed, null, 2);
    
    // 等待 DOM 更新后执行高亮
    await nextTick();
    if (codeContainer.value) {
      Prism.highlightElement(codeContainer.value);
    }
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

// 监听输入变化自动格式化（可选，但通常点击按钮更好）
// watch(input, () => {
//   if (input.value) formatJson();
// });
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
        
        <div class="output-wrapper">
          <pre class="language-json"><code ref="codeContainer">{{ output }}</code></pre>
          <div v-if="!output && !error" class="placeholder-text">
            {{ t('tools.json-formatter.outputPlaceholder') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  max-width: 1200px;
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
  height: 500px;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
  box-shadow: var(--card-shadow);
}

textarea:focus {
  border-color: var(--accent-color);
}

.output-wrapper {
  height: 500px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: #2d2d2d; /* Prism Tomorrow 主题背景色 */
  overflow: auto;
  position: relative;
  box-shadow: var(--card-shadow);
}

pre {
  margin: 0;
  padding: 1rem;
  background: transparent !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
}

code {
  background: transparent !important;
  text-shadow: none !important;
}

.placeholder-text {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  color: #888;
  font-size: 14px;
  pointer-events: none;
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
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.primary-btn:hover {
  opacity: 0.9;
}

.secondary-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.text-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 900px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
