<script setup lang="ts">
import { ref } from 'vue';
import { useTool } from '../../composables/useTool';
import { md5 } from '../../utils/crypto';
import ToolLayout from '../../components/common/ToolLayout.vue';

const { input, output, error, clear, copy, t } = useTool();

type Mode = 'single' | 'batch';
const mode = ref<Mode>('single');

const compute = () => {
  try {
    error.value = '';
    const trimmedInput = input.value.trim();

    if (!trimmedInput) {
      output.value = '';
      return;
    }

    if (mode.value === 'single') {
      output.value = md5(input.value);
    } else {
      const lines = input.value.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim() !== '');
      const limit = 1000;
      if (nonEmptyLines.length > limit) {
        error.value = t('tools.md5-converter.limitError', { limit });
        return;
      }
      const results: string[] = [];
      for (const line of lines) {
        if (line.trim() === '') {
          results.push('');
        } else {
          results.push(md5(line));
        }
      }
      output.value = results.join('\n');
    }
  } catch (e: any) {
    error.value = t('tools.md5-converter.hashError') + ': ' + e.message;
  }
};
</script>

<template>
  <ToolLayout
    :input-label="t('tools.md5-converter.input')"
    :output-label="t('tools.md5-converter.output')"
    :error="error"
    @clear="clear"
    @copy="copy()"
  >
    <template #input-actions>
      <div class="mode-switch">
        <button
          :class="['mode-btn', { active: mode === 'single' }]"
          @click="mode = 'single'"
        >{{ t('tools.md5-converter.singleMode') }}</button>
        <button
          :class="['mode-btn', { active: mode === 'batch' }]"
          @click="mode = 'batch'"
        >{{ t('tools.md5-converter.batchMode') }}</button>
      </div>
      <button @click="compute" class="btn-primary">{{ t('tools.md5-converter.hash') }}</button>
    </template>

    <template #input>
      <textarea
        v-model="input"
        class="tool-textarea"
        :placeholder="mode === 'single' ? t('tools.md5-converter.inputPlaceholder') : t('tools.md5-converter.batchPlaceholder')"
        spellcheck="false"
      ></textarea>
    </template>

    <template #output>
      <textarea
        :value="output"
        readonly
        class="tool-textarea"
        :placeholder="t('tools.md5-converter.outputPlaceholder')"
        spellcheck="false"
      ></textarea>
    </template>
  </ToolLayout>
</template>

<style scoped>
.mode-switch {
  display: flex;
  gap: 0.25rem;
}

.mode-btn {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn:hover {
  background: var(--bg-card);
}

.mode-btn.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}
</style>