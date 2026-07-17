<script setup lang="ts">
import { useTool } from '../../composables/useTool';
import ToolLayout from '../../components/common/ToolLayout.vue';

const { input, output, error, clear, copy, t } = useTool();

const sha256 = async () => {
  try {
    error.value = '';
    if (!input.value) {
      output.value = '';
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(input.value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    output.value = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
      <button @click="sha256" class="btn-primary">{{ t('tools.sha256-converter.hash') }}</button>
    </template>
    
    <template #input>
      <textarea 
        v-model="input" 
        class="tool-textarea"
        :placeholder="t('tools.sha256-converter.inputPlaceholder')" 
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