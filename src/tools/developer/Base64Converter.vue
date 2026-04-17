<script setup lang="ts">
import { useTool } from '../../composables/useTool';
import ToolLayout from '../../components/common/ToolLayout.vue';
import ToolArea from '../../components/common/ToolArea.vue';
import ToolButton from '../../components/common/ToolButton.vue';
import { Lock, Unlock } from 'lucide-vue-next';

const { input, output, error, isLoading, clear, copy, tryExecute, t } = useTool();

const encodeBase64 = () => tryExecute(() => {
  const bytes = new TextEncoder().encode(input.value);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  output.value = btoa(binString);
}, 'tools.base64-converter.encodeError');

const decodeBase64 = () => tryExecute(() => {
  const binString = atob(input.value);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
  output.value = new TextDecoder().decode(bytes);
}, 'tools.base64-converter.decodeError');
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
      <ToolButton :icon="Lock" :loading="isLoading" @click="encodeBase64">
        {{ t('tools.base64-converter.encode') }}
      </ToolButton>
      <ToolButton :icon="Unlock" :loading="isLoading" @click="decodeBase64">
        {{ t('tools.base64-converter.decode') }}
      </ToolButton>
    </template>
    
    <template #input>
      <ToolArea 
        v-model="input" 
        :placeholder="t('tools.base64-converter.inputPlaceholder')" 
      />
    </template>

    <template #output>
      <ToolArea 
        v-model="output" 
        readonly 
        :placeholder="t('tools.base64-converter.outputPlaceholder')" 
      />
    </template>
  </ToolLayout>
</template>
