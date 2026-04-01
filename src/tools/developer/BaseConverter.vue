<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';
import { ArrowRightLeft, Copy, Trash2 } from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToastStore();

const input = ref('10');
const fromBase = ref(10);
const toBase = ref(2);
const result = ref('');
const error = ref('');

const commonBases = [
  { name: 'Binary', value: 2 },
  { name: 'Octal', value: 8 },
  { name: 'Decimal', value: 10 },
  { name: 'Hex', value: 16 }
];

const convert = () => {
  error.value = '';
  if (!input.value.trim()) {
    result.value = '';
    return;
  }

  try {
    // Parse the input according to the source base
    const decimalValue = parseInt(input.value, fromBase.value);
    
    if (isNaN(decimalValue)) {
      throw new Error('Invalid input');
    }

    // Convert to the target base
    result.value = decimalValue.toString(toBase.value).toUpperCase();
  } catch (e) {
    result.value = '';
    error.value = t('tools.base-converter.invalidInput');
  }
};

const swapBases = () => {
  const tempBase = fromBase.value;
  fromBase.value = toBase.value;
  toBase.value = tempBase;
  
  if (result.value && !error.value) {
    input.value = result.value;
  }
  convert();
};

const clearAll = () => {
  input.value = '';
  result.value = '';
  error.value = '';
};

const copyResult = () => {
  if (result.value) {
    navigator.clipboard.writeText(result.value);
    toast.show(t('common.actions.copied'));
  }
};

watch([input, fromBase, toBase], convert, { immediate: true });
</script>

<template>
  <div class="tool-container">
    <div class="converter-card">
      <div class="input-grid">
        <div class="input-section">
          <div class="label-row">
            <label>{{ t('tools.base-converter.fromBase') }}</label>
            <div class="quick-bases">
              <button 
                v-for="base in commonBases" 
                :key="base.value"
                @click="fromBase = base.value"
                :class="{ active: fromBase === base.value }"
                class="base-pill"
              >
                {{ base.value }}
              </button>
            </div>
          </div>
          <div class="base-selector">
            <input type="number" v-model.number="fromBase" min="2" max="36" class="base-input">
            <input 
              type="text" 
              v-model="input" 
              :placeholder="t('tools.base-converter.input')"
              class="value-input"
              spellcheck="false"
            >
          </div>
        </div>

        <div class="action-divider">
          <button class="swap-btn" @click="swapBases">
            <ArrowRightLeft :size="20" />
          </button>
        </div>

        <div class="input-section">
          <div class="label-row">
            <label>{{ t('tools.base-converter.toBase') }}</label>
            <div class="quick-bases">
              <button 
                v-for="base in commonBases" 
                :key="base.value"
                @click="toBase = base.value"
                :class="{ active: toBase === base.value }"
                class="base-pill"
              >
                {{ base.value }}
              </button>
            </div>
          </div>
          <div class="base-selector">
            <input type="number" v-model.number="toBase" min="2" max="36" class="base-input">
            <div class="result-display" :class="{ error: error }">
              {{ error || result || '---' }}
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <button @click="clearAll" class="secondary-btn">
          <Trash2 :size="16" />
          <span>{{ t('common.actions.clear') }}</span>
        </button>
        <button @click="copyResult" class="primary-btn" :disabled="!result || !!error">
          <Copy :size="16" />
          <span>{{ t('common.actions.copy') }}</span>
        </button>
      </div>
    </div>

    <div class="info-card">
      <p>💡 <b>Tip:</b> {{ t('tools.base-converter.tip') }}</p>
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  max-width: 800px;
  margin: 0 auto;
}

.converter-card {
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.input-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

label {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quick-bases {
  display: flex;
  gap: 0.25rem;
}

.base-pill {
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.base-pill:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.base-pill.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.base-selector {
  display: flex;
  gap: 0.75rem;
}

.base-input {
  width: 70px;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 700;
  text-align: center;
  outline: none;
}

.value-input, .result-display {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 1.25rem;
  font-weight: 600;
  outline: none;
  transition: border-color 0.2s;
}

.value-input:focus {
  border-color: var(--accent-color);
}

.result-display {
  background: var(--bg-secondary);
  min-height: 52px;
  display: flex;
  align-items: center;
}

.result-display.error {
  color: #ef4444;
  font-size: 0.9rem;
  border-color: rgba(239, 68, 68, 0.2);
}

.action-divider {
  display: flex;
  justify-content: center;
  position: relative;
}

.action-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
  z-index: 0;
}

.swap-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--accent-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s;
}

.swap-btn:hover {
  transform: rotate(180deg);
  background: var(--bg-secondary);
}

.card-footer {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.primary-btn, .secondary-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn {
  background: var(--accent-color);
  color: white;
  border: none;
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-btn {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.primary-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.secondary-btn:hover {
  background: var(--bg-secondary);
}

.info-card {
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .base-selector {
    flex-direction: column;
  }
  .base-input {
    width: 100%;
  }
}
</style>
