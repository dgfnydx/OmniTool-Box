<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useTool } from '../../composables/useTool';
import ToolLayout from '../../components/common/ToolLayout.vue';
import ToolArea from '../../components/common/ToolArea.vue';
import ToolButton from '../../components/common/ToolButton.vue';
import { Braces, Copy } from 'lucide-vue-next';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-json';

const { input, output, error, isLoading, clear, copy, tryExecute, t } = useTool();
const codeContainer = ref<HTMLElement | null>(null);

const formatJson = () => tryExecute(async () => {
  if (!input.value.trim()) {
    output.value = '';
    return;
  }
  const parsed = JSON.parse(input.value);
  output.value = JSON.stringify(parsed, null, 2);
  
  await nextTick();
  if (codeContainer.value) {
    Prism.highlightElement(codeContainer.value);
  }
}, 'tools.json-formatter.invalidJson');

const handleCopy = () => copy();
const handleClear = () => {
  clear();
  output.value = ''; // Ensure output is reset
};
</script>

<template>
  <ToolLayout
    :input-label="t('tools.json-formatter.input')"
    :output-label="t('tools.json-formatter.output')"
    :error="error"
    @clear="handleClear"
    @copy="handleCopy"
  >
    <template #input-actions>
      <ToolButton :icon="Braces" :loading="isLoading" @click="formatJson">
        {{ t('common.actions.format') }}
      </ToolButton>
    </template>
    
    <template #input>
      <ToolArea 
        v-model="input" 
        height="500px"
        :placeholder="t('tools.json-formatter.inputPlaceholder')" 
      />
    </template>

    <template #output>
      <ToolArea height="500px" readonly>
        <div class="output-wrapper">
          <pre class="language-json"><code ref="codeContainer">{{ output }}</code></pre>
          <div v-if="!output && !error" class="placeholder-text">
            {{ t('tools.json-formatter.outputPlaceholder') }}
          </div>
        </div>
      </ToolArea>
    </template>

    <template #output-actions>
      <ToolButton v-if="output" type="text" :icon="Copy" @click="handleCopy">
        {{ t('common.actions.copy') }}
      </ToolButton>
    </template>
  </ToolLayout>
</template>

<style scoped>
.output-wrapper {
  height: 100%;
  background: #2d2d2d; /* Prism Tomorrow theme bg */
  overflow: auto;
  border-radius: 12px;
  position: relative;
}

pre {
  margin: 0;
  padding: 1rem;
  background: transparent !important;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

code {
  background: transparent !important;
  text-shadow: none !important;
}

.placeholder-text {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: #888;
  font-size: 0.9rem;
  pointer-events: none;
}
</style>
