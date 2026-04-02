<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';

const { t } = useI18n();
const toast = useToastStore();
const input = ref('');
const output = ref('');
const error = ref('');

const convertToUppercase = (amountStr: string) => {
  if (!amountStr || isNaN(Number(amountStr))) {
    return '';
  }

  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  
  let num = Math.abs(parseFloat(amountStr));
  let s = '';
  
  // 处理小数部分
  for (let i = 0; i < fraction.length; i++) {
    const val = Math.floor(num * 10 * Math.pow(10, i)) % 10;
    if (val > 0) {
      s += (digit[val] + fraction[i]).replace(/零./, '');
    }
  }
  
  s = s || '整';
  
  // 处理整数部分
  let integer = Math.floor(num);
  for (let i = 0; i < unit[0].length && integer > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && integer > 0; j++) {
      p = digit[integer % 10] + unit[1][j] + p;
      integer = Math.floor(integer / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  
  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
};

watch(input, (newVal) => {
  error.value = '';
  if (newVal && isNaN(Number(newVal))) {
    error.value = t('tools.amount-to-uppercase.invalidAmount');
    output.value = '';
    return;
  }
  output.value = convertToUppercase(newVal);
});

const clearAll = () => {
  input.value = '';
  output.value = '';
  error.value = '';
};

const copyOutput = () => {
  if (output.value) {
    navigator.clipboard.writeText(output.value);
    toast.show(t('tools.amount-to-uppercase.copied'));
  }
};
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.amount-to-uppercase.input') }}</label>
          <div class="actions">
            <button @click="clearAll" class="secondary-btn">{{ t('common.actions.clear') }}</button>
          </div>
        </div>
        <input 
          v-model="input" 
          type="text"
          :placeholder="t('tools.amount-to-uppercase.placeholder')" 
          class="amount-input"
        />
        <div v-if="error" class="error-msg">{{ error }}</div>
      </div>

      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.amount-to-uppercase.output') }}</label>
          <button v-if="output" @click="copyOutput" class="text-btn">{{ t('common.actions.copy') }}</button>
        </div>
        <textarea 
          v-model="output" 
          readonly 
          :placeholder="t('tools.amount-to-uppercase.outputPlaceholder')" 
          spellcheck="false"
          class="uppercase-textarea"
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
  gap: 1rem;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label {
  font-weight: 600;
}

.amount-input {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 1.5rem;
  outline: none;
}

.uppercase-textarea {
  height: 200px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1.25rem;
  line-height: 1.6;
  resize: none;
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
