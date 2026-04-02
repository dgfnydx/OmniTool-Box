<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';
import * as OpenCC from 'opencc-js';

const { t } = useI18n();
const toast = useToastStore();
const input = ref('');
const output = ref('');
const mode = ref<'s2t' | 't2s'>('s2t');

// 简转繁转换器
const s2tConverter = OpenCC.Converter({ from: 'cn', to: 'tw' });
// 繁转简转换器
const t2sConverter = OpenCC.Converter({ from: 'tw', to: 'cn' });

const handleConvert = () => {
  if (!input.value) {
    output.value = '';
    return;
  }
  
  if (mode.value === 's2t') {
    output.value = s2tConverter(input.value);
  } else {
    output.value = t2sConverter(input.value);
  }
};

// 实时转换
watch([input, mode], () => {
  handleConvert();
});

const clearAll = () => {
  input.value = '';
  output.value = '';
};

const copyOutput = () => {
  if (output.value) {
    navigator.clipboard.writeText(output.value);
    toast.show(t('tools.chinese-converter.copied'));
  }
};
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.chinese-converter.input') }}</label>
          <div class="actions">
            <button @click="clearAll" class="secondary-btn">{{ t('common.actions.clear') }}</button>
          </div>
        </div>
        <textarea 
          v-model="input" 
          :placeholder="t('tools.chinese-converter.placeholder')" 
          spellcheck="false"
        ></textarea>
      </div>

      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.chinese-converter.output') }}</label>
          <div class="controls">
            <select v-model="mode" class="mode-select">
              <option value="s2t">{{ t('tools.chinese-converter.toTraditional') }}</option>
              <option value="t2s">{{ t('tools.chinese-converter.toSimplified') }}</option>
            </select>
            <button v-if="output" @click="copyOutput" class="text-btn">{{ t('common.actions.copy') }}</button>
          </div>
        </div>
        <textarea 
          v-model="output" 
          readonly 
          :placeholder="t('tools.chinese-converter.outputPlaceholder')" 
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

.controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mode-select {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.85rem;
  outline: none;
}

textarea {
  height: 400px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1.1rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.secondary-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.text-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
