<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: string;
  readonly?: boolean;
  placeholder?: string;
  height?: string;
  copyable?: boolean;
  language?: string; // 如果有，可以用于高亮提示
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  readonly: false,
  placeholder: '',
  height: '400px',
  copyable: false
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>

<template>
  <div class="tool-area-container" :style="{ height }">
    <slot>
      <textarea
        v-model="value"
        class="tool-textarea"
        :readonly="readonly"
        :placeholder="placeholder"
        spellcheck="false"
      ></textarea>
    </slot>
    <div v-if="copyable && value" class="area-actions">
      <!-- Future: Floating copy button -->
    </div>
  </div>
</template>

<style scoped>
.tool-area-container {
  width: 100%;
  position: relative;
}

.tool-textarea {
  width: 100%;
  height: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: all 0.2s ease;
  box-shadow: var(--card-shadow);
}

.tool-textarea:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.tool-textarea[readonly] {
  background: var(--bg-secondary);
  border-style: dashed;
}

/* 滚动条美化 */
.tool-textarea::-webkit-scrollbar {
  width: 8px;
}

.tool-textarea::-webkit-scrollbar-track {
  background: transparent;
}

.tool-textarea::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.tool-textarea::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>
