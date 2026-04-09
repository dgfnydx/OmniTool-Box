<script setup lang="ts">
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
          <button @click="$emit('clear')" class="btn-secondary">{{ $t('common.actions.clear') }}</button>
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
          <button @click="$emit('copy')" class="btn-text" v-if="!$slots['output-actions']">{{ $t('common.actions.copy') }}</button>
        </div>
      </div>
      <div v-if="error" class="tool-error-msg">{{ error }}</div>
      <slot name="output"></slot>
    </div>
  </div>
</template>
