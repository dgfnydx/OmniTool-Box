<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';
import { RefreshCw, Copy, ShieldCheck, ShieldAlert, Shield } from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToastStore();

const length = ref(16);
const includeUppercase = ref(true);
const includeLowercase = ref(true);
const includeNumbers = ref(true);
const includeSymbols = ref(true);
const password = ref('');

const charset = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

const generatePassword = () => {
  let characters = '';
  if (includeUppercase.value) characters += charset.uppercase;
  if (includeLowercase.value) characters += charset.lowercase;
  if (includeNumbers.value) characters += charset.numbers;
  if (includeSymbols.value) characters += charset.symbols;

  if (characters === '') {
    password.value = '';
    return;
  }

  let result = '';
  const array = new Uint32Array(length.value);
  crypto.getRandomValues(array);

  for (let i = 0; i < length.value; i++) {
    result += characters.charAt(array[i] % characters.length);
  }
  password.value = result;
};

const copyPassword = () => {
  if (password.value) {
    navigator.clipboard.writeText(password.value);
    toast.show(t('common.actions.copied'));
  }
};

const passwordStrength = computed(() => {
  if (!password.value) return 0;
  let strength = 0;
  if (password.value.length >= 12) strength += 1;
  if (/[A-Z]/.test(password.value)) strength += 1;
  if (/[a-z]/.test(password.value)) strength += 1;
  if (/[0-9]/.test(password.value)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password.value)) strength += 1;
  return strength;
});

const strengthText = computed(() => {
  const s = passwordStrength.value;
  if (s <= 2) return t('tools.password-generator.weak');
  if (s <= 4) return t('tools.password-generator.medium');
  return t('tools.password-generator.strong');
});

const strengthColor = computed(() => {
  const s = passwordStrength.value;
  if (s <= 2) return '#ef4444';
  if (s <= 4) return '#f59e0b';
  return '#22c55e';
});

onMounted(generatePassword);
</script>

<template>
  <div class="tool-container">
    <div class="password-display">
      <div class="password-text">{{ password || '---' }}</div>
      <div class="display-actions">
        <button class="icon-btn" @click="generatePassword" :title="t('common.actions.generate')">
          <RefreshCw :size="20" />
        </button>
        <button class="icon-btn" @click="copyPassword" :title="t('common.actions.copy')">
          <Copy :size="20" />
        </button>
      </div>
    </div>

    <div class="strength-bar">
      <div class="bar-bg">
        <div class="bar-fill" :style="{ width: (passwordStrength / 5) * 100 + '%', background: strengthColor }"></div>
      </div>
      <div class="strength-label" :style="{ color: strengthColor }">
        <ShieldCheck v-if="passwordStrength > 4" :size="16" />
        <ShieldAlert v-else-if="passwordStrength <= 2" :size="16" />
        <Shield v-else :size="16" />
        <span>{{ strengthText }}</span>
      </div>
    </div>

    <div class="options-card">
      <div class="option-row">
        <label>{{ t('tools.password-generator.length') }}: {{ length }}</label>
        <input type="range" v-model.number="length" min="4" max="50" @input="generatePassword" />
      </div>

      <div class="checkbox-grid">
        <label class="checkbox-item">
          <input type="checkbox" v-model="includeUppercase" @change="generatePassword" />
          <span>{{ t('tools.password-generator.uppercase') }}</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="includeLowercase" @change="generatePassword" />
          <span>{{ t('tools.password-generator.lowercase') }}</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="includeNumbers" @change="generatePassword" />
          <span>{{ t('tools.password-generator.numbers') }}</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" v-model="includeSymbols" @change="generatePassword" />
          <span>{{ t('tools.password-generator.symbols') }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.password-display {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
}

.password-text {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  word-break: break-all;
  padding-right: 1rem;
}

.display-actions {
  display: flex;
  gap: 0.5rem;
}

.strength-bar {
  margin-bottom: 2rem;
}

.bar-bg {
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.bar-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.options-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.option-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-row label {
  font-weight: 600;
  color: var(--text-primary);
}

input[type="range"] {
  width: 100%;
  accent-color: var(--accent-color);
}

.checkbox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  background: var(--bg-secondary);
  transition: all 0.2s;
}

.checkbox-item:hover {
  background: var(--border-color);
}

.checkbox-item input {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-color);
}

.checkbox-item span {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.icon-btn {
  width: 40px;
  height: 40px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.icon-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}
</style>
