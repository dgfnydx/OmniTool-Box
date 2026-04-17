<script setup lang="ts">
import ToolButton from './ToolButton.vue';
import { Trash2, Copy } from 'lucide-vue-next';

interface Props {
  inputLabel?: string;
  outputLabel?: string;
  error?: string;
}

defineProps<Props>();
defineEmits(['clear', 'copy']);
</script>

<template>
  <div class="tool-workspace">
    <!-- Input Section -->
    <div class="tool-editor-section">
      <div class="tool-label-row">
        <label class="tool-label">{{ inputLabel || 'Input' }}</label>
        <div class="tool-actions">
          <slot name="input-actions"></slot>
          <ToolButton 
            type="secondary" 
            :icon="Trash2" 
            @click="$emit('clear')"
          >
            {{ $t('common.actions.clear') }}
          </ToolButton>
        </div>
      </div>
      <slot name="input"></slot>
    </div>

    <!-- Output Section -->
    <div class="tool-editor-section">
      <div class="tool-label-row">
        <label class="tool-label">{{ outputLabel || 'Output' }}</label>
        <div class="tool-actions">
          <slot name="output-actions"></slot>
          <ToolButton 
            v-if="!$slots['output-actions']"
            type="text" 
            :icon="Copy" 
            @click="$emit('copy')"
          >
            {{ $t('common.actions.copy') }}
          </ToolButton>
        </div>
      </div>
      <div v-if="error" class="tool-error-msg">{{ error }}</div>
      <slot name="output"></slot>
    </div>
  </div>
</template>
