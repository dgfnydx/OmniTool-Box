<script setup lang="ts">
import { useToastStore } from '../../store/toast';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-vue-next';

const toastStore = useToastStore();
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id" 
        class="toast-item" 
        :class="toast.type"
      >
        <div class="toast-icon">
          <CheckCircle v-if="toast.type === 'success'" :size="18" />
          <AlertCircle v-else-if="toast.type === 'error'" :size="18" />
          <Info v-else :size="18" />
        </div>
        <div class="toast-msg">{{ toast.message }}</div>
        <button class="toast-close" @click="toastStore.remove(toast.id)">
          <X :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 9999;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  min-width: 260px;
  max-width: 400px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.875rem 1rem;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
}

.toast-icon {
  flex-shrink: 0;
}

.success .toast-icon { color: #22c55e; }
.error .toast-icon { color: #ef4444; }
.info .toast-icon { color: #3b82f6; }

.toast-msg {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.toast-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* Transition Animations */
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
