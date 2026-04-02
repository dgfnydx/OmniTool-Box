<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { TrendingUp, TrendingDown, DollarSign, JapaneseYen, Calendar } from 'lucide-vue-next';

const { t, locale } = useI18n();

const invested = ref<number>(1000);
const returned = ref<number>(1200);
const periodValue = ref<number>(1);
const periodUnit = ref<'days' | 'months' | 'years'>('years');

const profit = computed(() => returned.value - invested.value);
const isProfit = computed(() => profit.value >= 0);

const roi = computed(() => {
  if (invested.value === 0) return 0;
  return (profit.value / invested.value) * 100;
});

const annualizedRoi = computed(() => {
  if (invested.value === 0 || periodValue.value <= 0) return 0;
  
  // Convert period to years
  let years = periodValue.value;
  if (periodUnit.value === 'days') years = periodValue.value / 365;
  if (periodUnit.value === 'months') years = periodValue.value / 12;
  
  // Annualized ROI = [(Returned / Invested) ^ (1 / years) - 1] * 100
  const ratio = returned.value / invested.value;
  if (ratio <= 0) return -100; // Total loss
  
  return (Math.pow(ratio, 1 / years) - 1) * 100;
});

const formatCurrency = (val: number) => {
  const currency = locale.value === 'zh' ? 'CNY' : 'USD';
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: currency,
  }).format(val);
};

const formatPercent = (val: number) => {
  return val.toFixed(2) + '%';
};
</script>

<template>
  <div class="tool-container">
    <div class="roi-grid">
      <!-- Inputs -->
      <div class="card input-card">
        <div class="input-group">
          <label>
            <JapaneseYen v-if="locale === 'zh'" :size="16" />
            <DollarSign v-else :size="16" />
            {{ t('tools.roi-calculator.invested') }}
          </label>
          <input type="number" v-model.number="invested" step="any" />
        </div>

        <div class="input-group">
          <label>
            <JapaneseYen v-if="locale === 'zh'" :size="16" />
            <DollarSign v-else :size="16" />
            {{ t('tools.roi-calculator.returned') }}
          </label>
          <input type="number" v-model.number="returned" step="any" />
        </div>

        <div class="input-group">
          <label>
            <Calendar :size="16" />
            {{ t('tools.roi-calculator.period') }}
          </label>
          <div class="period-input">
            <input type="number" v-model.number="periodValue" min="0.1" step="any" />
            <select v-model="periodUnit">
              <option value="days">{{ t('tools.roi-calculator.days') }}</option>
              <option value="months">{{ t('tools.roi-calculator.months') }}</option>
              <option value="years">{{ t('tools.roi-calculator.years') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="card result-card">
        <div class="stat-main" :class="{ 'text-profit': isProfit, 'text-loss': !isProfit }">
          <div class="stat-label">{{ isProfit ? t('tools.roi-calculator.profit') : t('tools.roi-calculator.loss') }}</div>
          <div class="stat-value">{{ formatCurrency(Math.abs(profit)) }}</div>
          <div class="stat-icon">
            <TrendingUp v-if="isProfit" :size="48" />
            <TrendingDown v-else :size="48" />
          </div>
        </div>

        <div class="stat-details">
          <div class="detail-item">
            <span class="detail-label">{{ t('tools.roi-calculator.roi') }}</span>
            <span class="detail-value" :class="isProfit ? 'text-profit' : 'text-loss'">
              {{ isProfit ? '+' : '' }}{{ formatPercent(roi) }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">{{ t('tools.roi-calculator.annualized') }}</span>
            <span class="detail-value" :class="annualizedRoi >= 0 ? 'text-profit' : 'text-loss'">
              {{ annualizedRoi >= 0 ? '+' : '' }}{{ formatPercent(annualizedRoi) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="info-card">
      <p>💡 <b>Tip:</b> {{ t('tools.roi-calculator.tip') }}</p>
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  max-width: 1000px;
  margin: 0 auto;
}

.roi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.input-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.input-group input, .input-group select {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  outline: none;
  transition: all 0.2s;
}

.input-group input:focus {
  border-color: var(--accent-color);
  background: var(--bg-card);
}

.period-input {
  display: flex;
  gap: 0.5rem;
}

.period-input input {
  flex: 1;
}

.period-input select {
  width: 100px;
}

.result-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-main {
  text-align: center;
  padding: 1rem 0 2rem;
  position: relative;
}

.stat-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 3.5rem;
  font-weight: 800;
}

.stat-icon {
  opacity: 0.1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.stat-details {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.detail-value {
  font-size: 1.5rem;
  font-weight: 800;
}

.text-profit { color: #22c55e; }
.text-loss { color: #ef4444; }

.info-card {
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .roi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
