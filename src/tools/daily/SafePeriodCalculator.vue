<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Calendar as CalendarIcon, Info } from 'lucide-vue-next';

const { t } = useI18n();

const lastDate = ref(new Date().toISOString().split('T')[0]);
const cycleLength = ref(28);
const periodLength = ref(5);

interface Result {
  nextPeriod: string;
  ovulationDay: string;
  fertileStart: string;
  fertileEnd: string;
  safe1Start: string;
  safe1End: string;
  safe2Start: string;
  safe2End: string;
}

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const results = computed<Result | null>(() => {
  if (!lastDate.value || cycleLength.value < 20 || cycleLength.value > 45) return null;

  const start = new Date(lastDate.value);
  
  // 下次月经
  const nextPeriod = new Date(start);
  nextPeriod.setDate(start.getDate() + cycleLength.value);
  
  // 排卵日 (下次月经前14天)
  const ovulation = new Date(nextPeriod);
  ovulation.setDate(nextPeriod.getDate() - 14);
  
  // 易孕期 (排卵日前5后4)
  const fertileStart = new Date(ovulation);
  fertileStart.setDate(ovulation.getDate() - 5);
  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(ovulation.getDate() + 4);
  
  // 前安全期 (月经结束到易孕期开始)
  const safe1Start = new Date(start);
  safe1Start.setDate(start.getDate() + periodLength.value);
  const safe1End = new Date(fertileStart);
  safe1End.setDate(fertileStart.getDate() - 1);
  
  // 后安全期 (易孕期结束到下次月经)
  const safe2Start = new Date(fertileEnd);
  safe2Start.setDate(fertileEnd.getDate() + 1);
  const safe2End = new Date(nextPeriod);
  safe2End.setDate(nextPeriod.getDate() - 1);

  return {
    nextPeriod: formatDate(nextPeriod),
    ovulationDay: formatDate(ovulation),
    fertileStart: formatDate(fertileStart),
    fertileEnd: formatDate(fertileEnd),
    safe1Start: formatDate(safe1Start),
    safe1End: formatDate(safe1End),
    safe2Start: formatDate(safe2Start),
    safe2End: formatDate(safe2End)
  };
});
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="input-section">
        <div class="form-group">
          <label>{{ t('tools.safe-period-calculator.lastPeriod') }}</label>
          <input type="date" v-model="lastDate" class="date-input" />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('tools.safe-period-calculator.cycleLength') }}</label>
            <div class="number-input-wrapper">
              <input type="number" v-model.number="cycleLength" min="20" max="45" />
              <span>{{ t('tools.safe-period-calculator.days') }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label>{{ t('tools.safe-period-calculator.periodLength') }}</label>
            <div class="number-input-wrapper">
              <input type="number" v-model.number="periodLength" min="2" max="14" />
              <span>{{ t('tools.safe-period-calculator.days') }}</span>
            </div>
          </div>
        </div>

        <div class="tip-box">
          <Info :size="18" />
          <p>{{ t('tools.safe-period-calculator.tip') }}</p>
        </div>
      </div>

      <div class="result-section">
        <div v-if="results" class="result-cards">
          <div class="result-card period">
            <div class="card-icon"><CalendarIcon :size="20" /></div>
            <div class="card-content">
              <span>{{ t('tools.safe-period-calculator.nextPeriod') }}</span>
              <strong>{{ results.nextPeriod }}</strong>
            </div>
          </div>

          <div class="result-card ovulation">
            <div class="card-icon"><CalendarIcon :size="20" /></div>
            <div class="card-content">
              <span>{{ t('tools.safe-period-calculator.ovulationDay') }}</span>
              <strong>{{ results.ovulationDay }}</strong>
            </div>
          </div>

          <div class="result-card fertile">
            <div class="card-icon"><CalendarIcon :size="20" /></div>
            <div class="card-content">
              <span>{{ t('tools.safe-period-calculator.fertileWindow') }}</span>
              <strong>{{ results.fertileStart }} ~ {{ results.fertileEnd }}</strong>
            </div>
          </div>

          <div class="result-card safe">
            <div class="card-icon"><CalendarIcon :size="20" /></div>
            <div class="card-content">
              <span>{{ t('tools.safe-period-calculator.safeWindow') }}</span>
              <div class="safe-dates">
                <strong>{{ results.safe1Start }} ~ {{ results.safe1End }}</strong>
                <strong>{{ results.safe2Start }} ~ {{ results.safe2End }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.date-input, 
.number-input-wrapper input {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
}

.number-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.number-input-wrapper input {
  width: 100%;
  padding-right: 3rem;
}

.number-input-wrapper span {
  position: absolute;
  right: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.tip-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #fff7ed;
  border-radius: 8px;
  color: #c2410c;
  font-size: 0.85rem;
  line-height: 1.5;
}

.result-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: transform 0.2s;
}

.result-card:hover {
  transform: translateX(4px);
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-content span {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.card-content strong {
  font-size: 1.1rem;
}

/* Colors */
.period .card-icon { background: #fee2e2; color: #ef4444; }
.period { border-left: 4px solid #ef4444; }

.ovulation .card-icon { background: #fef9c3; color: #ca8a04; }
.ovulation { border-left: 4px solid #ca8a04; }

.fertile .card-icon { background: #dcfce7; color: #22c55e; }
.fertile { border-left: 4px solid #22c55e; }

.safe .card-icon { background: #dbeafe; color: #3b82f6; }
.safe { border-left: 4px solid #3b82f6; }

.safe-dates {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (max-width: 768px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
