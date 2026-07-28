<script setup lang="ts">
import { ref } from 'vue';
import { useTool } from '../../composables/useTool';
import ToolLayout from '../../components/common/ToolLayout.vue';

const { input, output, error, clear, copy, t } = useTool();

type Mode = 'single' | 'batch';
const mode = ref<Mode>('single');

const hashSingle = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const sha256 = async () => {
  try {
    error.value = '';
    const trimmedInput = input.value.trim();

    if (!trimmedInput) {
      output.value = '';
      return;
    }

    if (mode.value === 'single') {
      output.value = await hashSingle(input.value);
    } else {
      const lines = input.value.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim() !== '');
      const limit = 1000;
      if (nonEmptyLines.length > limit) {
        error.value = t('tools.sha256-converter.limitError', { limit });
        return;
      }
      const results: string[] = [];
      for (const line of lines) {
        if (line.trim() === '') {
          results.push('');
        } else {
          results.push(await hashSingle(line));
        }
      }
      output.value = results.join('\n');
    }
  } catch (e: any) {
    error.value = t('tools.sha256-converter.hashError') + ': ' + e.message;
  }
};
</script>

<template>
  <ToolLayout
    :input-label="t('tools.sha256-converter.input')"
    :output-label="t('tools.sha256-converter.output')"
    :error="error"
    @clear="clear"
    @copy="copy()"
  >
    <template #input-actions>
      <div class="mode-switch">
        <button
          :class="['mode-btn', { active: mode === 'single' }]"
          @click="mode = 'single'"
        >{{ t('tools.sha256-converter.singleMode') }}</button>
        <button
          :class="['mode-btn', { active: mode === 'batch' }]"
          @click="mode = 'batch'"
        >{{ t('tools.sha256-converter.batchMode') }}</button>
      </div>
      <button @click="sha256" class="btn-primary">{{ t('tools.sha256-converter.hash') }}</button>
    </template>

    <template #input>
      <textarea
        v-model="input"
        class="tool-textarea"
        :placeholder="mode === 'single' ? t('tools.sha256-converter.inputPlaceholder') : t('tools.sha256-converter.batchPlaceholder')"
        spellcheck="false"
      ></textarea>
    </template>

    <template #output>
      <textarea
        :value="output"
        readonly
        class="tool-textarea"
        :placeholder="t('tools.sha256-converter.outputPlaceholder')"
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