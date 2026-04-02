<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';
import { pinyin } from 'pinyin-pro';

const { t } = useI18n();
const toast = useToastStore();
const input = ref('');
const output = ref('');
const toneType = ref<'tone' | 'none' | 'first'>('tone');

const convertPinyin = () => {
  if (!input.value) {
    output.value = '';
    return;
  }
  
  const options: any = {
    toneType: toneType.value === 'none' ? 'none' : 'symbol',
    pattern: toneType.value === 'first' ? 'first' : 'pinyin'
  };

  output.value = pinyin(input.value, options);
};

// 实时转换
watch([input, toneType], () => {
  convertPinyin();
});

const clearAll = () => {
  input.value = '';
  output.value = '';
};

const copyOutput = () => {
  if (output.value) {
    navigator.clipboard.writeText(output.value);
    toast.show(t('tools.pinyin-converter.copied'));
  }
};
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.pinyin-converter.input') }}</label>
          <div class="actions">
            <button @click="clearAll" class="secondary-btn">{{ t('common.actions.clear') }}</button>
          </div>
        </div>
        <textarea 
          v-model="input" 
          :placeholder="t('tools.pinyin-converter.placeholder')" 
          spellcheck="false"
        ></textarea>
      </div>

      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.pinyin-converter.output') }}</label>
          <div class="controls">
            <select v-model="toneType" class="tone-select">
              <option value="tone">{{ t('tools.pinyin-converter.tone') }}</option>
              <option value="none">{{ t('tools.pinyin-converter.noTone') }}</option>
              <option value="first">{{ t('tools.pinyin-converter.firstLetter') }}</option>
            </select>
            <button v-if="output" @click="copyOutput" class="text-btn">{{ t('common.actions.copy') }}</button>
          </div>
        </div>
        <textarea 
          v-model="output" 
          readonly 
          :placeholder="t('tools.pinyin-converter.outputPlaceholder')" 
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

.tone-select {
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
