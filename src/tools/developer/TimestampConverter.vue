<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';
import { RefreshCw, Copy, Trash2 } from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToastStore();
const currentTimestamp = ref(Math.floor(Date.now() / 1000));
const intervalId = ref<any>(null);

const tsInput = ref(currentTimestamp.value.toString());
const dateResult = ref('');

const dateInput = ref(new Date().toISOString().slice(0, 19).replace('T', ' '));
const tsResult = ref('');

const convertTsToDate = () => {
  try {
    const ts = parseInt(tsInput.value);
    if (isNaN(ts)) throw new Error();
    const date = new Date(ts * (tsInput.value.length > 11 ? 1 : 1000));
    dateResult.value = date.toLocaleString();
  } catch (e) {
    dateResult.value = t('tools.timestamp-converter.invalidTs');
  }
};

const convertDateToTs = () => {
  try {
    const date = new Date(dateInput.value);
    if (isNaN(date.getTime())) throw new Error();
    tsResult.value = Math.floor(date.getTime() / 1000).toString();
  } catch (e) {
    tsResult.value = t('tools.timestamp-converter.invalidDate');
  }
};

const copyToClipboard = (text: string) => {
  if (text) {
    navigator.clipboard.writeText(text);
    toast.show(t('common.actions.copied'));
  }
};

const updateCurrentTs = () => {
  currentTimestamp.value = Math.floor(Date.now() / 1000);
};

onMounted(() => {
  convertTsToDate();
  convertDateToTs();
  intervalId.value = setInterval(updateCurrentTs, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId.value);
});
</script>

<template>
  <div class="tool-container">
    <!-- Current Time Banner -->
    <div class="current-time-card">
      <div class="time-label">{{ t('tools.timestamp-converter.currentTs') }}</div>
      <div class="time-value">
        <code>{{ currentTimestamp }}</code>
        <button class="icon-btn small" @click="copyToClipboard(currentTimestamp.toString())">
          <Copy :size="14" />
        </button>
      </div>
    </div>

    <div class="converter-grid">
      <!-- Timestamp to Date -->
      <div class="card">
        <h3>{{ t('tools.timestamp-converter.tsToDate') }}</h3>
        <div class="input-group">
          <input v-model="tsInput" type="text" placeholder="1711872000" @input="convertTsToDate" />
          <div class="unit-select">
            <span>seconds</span>
          </div>
        </div>
        <div class="result-box">
          <label>{{ t('tools.timestamp-converter.resultDate') }}</label>
          <div class="result-value">
            <code>{{ dateResult }}</code>
            <button v-if="dateResult" class="icon-btn small" @click="copyToClipboard(dateResult)">
              <Copy :size="14" />
            </button>
          </div>
        </div>
      </div>

      <!-- Date to Timestamp -->
      <div class="card">
        <h3>{{ t('tools.timestamp-converter.dateToTs') }}</h3>
        <div class="input-group">
          <input v-model="dateInput" type="text" placeholder="2026-03-31 09:00:00" @input="convertDateToTs" />
        </div>
        <div class="result-box">
          <label>{{ t('tools.timestamp-converter.resultTs') }}</label>
          <div class="result-value">
            <code>{{ tsResult }}</code>
            <button v-if="tsResult" class="icon-btn small" @click="copyToClipboard(tsResult)">
              <Copy :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.current-time-card {
  background: var(--bg-secondary);
  padding: 1.25rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.time-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.time-value {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
}

.converter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card h3 {
  margin: 0;
  font-size: 1.1rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

input {
  flex: 1;
  height: 40px;
  padding: 0 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
}

input:focus {
  border-color: var(--accent-color);
}

.result-box {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-box label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.result-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

code {
  font-family: monospace;
  font-size: 1rem;
  font-weight: 600;
}

.icon-btn.small {
  width: 28px;
  height: 28px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
}

.icon-btn.small:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

@media (max-width: 900px) {
  .converter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
