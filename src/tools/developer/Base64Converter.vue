<script setup lang="ts">
import { useTool } from '../../composables/useTool';
import ToolLayout from '../../components/common/ToolLayout.vue';

const { input, output, error, clear, copy, t } = useTool();

const encodeBase64 = () => {
  try {
    error.value = '';
    const bytes = new TextEncoder().encode(input.value);
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
    output.value = btoa(binString);
  } catch (e: any) {
    error.value = t('tools.base64-converter.encodeError') + ': ' + e.message;
  }
};

const decodeBase64 = () => {
  try {
    error.value = '';
    const binString = atob(input.value);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    output.value = new TextDecoder().decode(bytes);
  } catch (e: any) {
    error.value = t('tools.base64-converter.decodeError') + ': ' + e.message;
  }
};
</script>

<template>
  <ToolLayout
    :input-label="t('tools.base64-converter.input')"
    :output-label="t('tools.base64-converter.output')"
    :error="error"
    @clear="clear"
    @copy="copy()"
  >
    <template #input-actions>
      <button @click="encodeBase64" class="btn-primary">{{ t('tools.base64-converter.encode') }}</button>
      <button @click="decodeBase64" class="btn-primary">{{ t('tools.base64-converter.decode') }}</button>
    </template>
    
    <template #input>
      <textarea 
        v-model="input" 
        class="tool-textarea"
        :placeholder="t('tools.base64-converter.inputPlaceholder')" 
        spellcheck="false"
      ></textarea>
    </template>

    <template #output>
      <textarea 
        :value="output" 
        readonly 
        class="tool-textarea"
        :placeholder="t('tools.base64-converter.outputPlaceholder')" 
        spellcheck="false"
      ></textarea>
    </template>
  </ToolLayout>
</template>
