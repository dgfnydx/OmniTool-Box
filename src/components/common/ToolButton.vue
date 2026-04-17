<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'text' | 'danger';
  icon?: any;
  loading?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'primary',
  loading: false,
  disabled: false
});
</script>

<template>
  <button 
    class="tool-btn" 
    :class="[`btn-${type}`, { 'is-loading': loading }]"
    :disabled="disabled || loading"
  >
    <component :is="icon" v-if="icon" class="btn-icon" />
    <span class="btn-content">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;
}

.tool-btn:active {
  transform: scale(0.98);
}

.tool-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover, #2563eb);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.btn-secondary {
  background: var(--bg-card);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-secondary);
  border-color: var(--text-secondary);
}

.btn-text {
  background: transparent;
  color: var(--accent-color);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.btn-text:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.08);
}

.btn-danger {
  background: #fee2e2;
  color: #ef4444;
}

.btn-danger:hover:not(:disabled) {
  background: #fecaca;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.is-loading {
  position: relative;
  color: transparent !important;
}

.is-loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
