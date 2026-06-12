<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTool } from '../../composables/useTool';
import { useCurrentTime } from '../../composables/useCurrentTime';
import { formatTimestamp, parseDateToTimestamp, getCurrentDateTimeString } from '../../utils/date';
import ToolLayout from '../../components/common/ToolLayout.vue';
import { Copy } from 'lucide-vue-next';

const { copy, t } = useTool();
const { currentTimestamp } = useCurrentTime();

// TS to Date conversion
const tsInput = ref(currentTimestamp.value.toString());
const dateResult = ref('');

// Date to TS conversion
const dateInput = ref(getCurrentDateTimeString());
const tsResult = ref('');

const convertTsToDate = () => {
  const result = formatTimestamp(tsInput.value);
  dateResult.value = result || t('tools.timestamp-converter.invalidTs');
};

const convertDateToTs = () => {
  const result = parseDateToTimestamp(dateInput.value);
  tsResult.value = result !== null ? result.toString() : t('tools.timestamp-converter.invalidDate');
};

// Initial conversion
convertTsToDate();
convertDateToTs();

// React to inputs
watch(tsInput, convertTsToDate);
watch(dateInput, convertDateToTs);
</script>

<template>
  <div class="tool-container">
    <!-- Current Time Banner -->
    <div class="current-time-banner">
      <div class="time-label">{{ t('tools.timestamp-converter.currentTs') }}</div>
      <div class="time-value">
        <code>{{ currentTimestamp }}</code>
        <button class="btn-text" @click="copy(currentTimestamp.toString())">
          <Copy :size="16" />
        </button>
      </div>
    </div>

    <ToolLayout
      :input-label="t('tools.timestamp-converter.tsToDate')"
      :output-label="t('tools.timestamp-converter.dateToTs')"
      @clear="tsInput = ''; dateInput = ''"
    >
      <template #input>
        <div class="tool-editor-section">
          <div class="input-with-label">
            <input v-model="tsInput" type="text" class="tool-input" placeholder="1711872000" />
            <span class="input-suffix">seconds</span>
          </div>
          <div class="result-display">
            <label>{{ t('tools.timestamp-converter.resultDate') }}</label>
            <div class="result-row">
              <code>{{ dateResult }}</code>
              <button class="btn-text" @click="copy(dateResult)"><Copy :size="14" /></button>
            </div>
          </div>
        </div>
      </template>

      <template #output>
        <div class="tool-editor-section">
          <input v-model="dateInput" type="text" class="tool-input" placeholder="2026-03-31 09:00:00" />
          <div class="result-display">
            <label>{{ t('tools.timestamp-converter.resultTs') }}</label>
            <div class="result-row">
              <code>{{ tsResult }}</code>
              <button class="btn-text" @click="copy(tsResult)"><Copy :size="14" /></button>
            </div>
          </div>
        </div>
      </template>
    </ToolLayout>
  </div>
</template>

<style scoped>
.current-time-banner {
  background: var(--bg-secondary);
  padding: 1.5rem;
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

.tool-input {
  width: 100%;
  height: 48px;
  padding: 0 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: monospace;
  outline: none;
}

.input-with-label {
  position: relative;
}

.input-suffix {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.result-display {
  background: var(--bg-secondary);
  padding: 1.25rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.result-display label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

code {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  font-size: 1.1rem;
}
</style>
