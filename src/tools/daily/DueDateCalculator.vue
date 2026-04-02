<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Baby, Calendar, Clock, Heart, Info } from 'lucide-vue-next';

const { t } = useI18n();

const lastPeriodDate = ref(new Date().toISOString().split('T')[0]);

const results = computed(() => {
  if (!lastPeriodDate.value) return null;

  const start = new Date(lastPeriodDate.value);
  const today = new Date();
  
  // 预产期: 末次月经 + 280天
  const edd = new Date(start);
  edd.setDate(start.getDate() + 280);
  
  // 当前已怀孕天数
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 孕周和天
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  
  // 剩余天数
  const remainingDays = Math.max(0, 280 - diffDays);
  
  // 进度百分比
  const progress = Math.min(100, Math.max(0, (diffDays / 280) * 100));

  return {
    edd: edd.toISOString().split('T')[0],
    weeks,
    days,
    remainingDays,
    progress: progress.toFixed(1),
    isOverdue: diffDays > 280
  };
});
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="input-section">
        <div class="form-group">
          <label>{{ t('tools.due-date-calculator.lastPeriod') }}</label>
          <div class="date-input-wrapper">
            <Calendar :size="20" class="input-icon" />
            <input type="date" v-model="lastPeriodDate" class="date-input" />
          </div>
        </div>

        <div class="tip-box">
          <Info :size="18" />
          <p>{{ t('tools.due-date-calculator.tip') }}</p>
        </div>
      </div>

      <div class="result-section">
        <div v-if="results" class="result-content">
          <div class="main-stats">
            <div class="stat-card edd">
              <Baby :size="32" />
              <div class="stat-info">
                <span>{{ t('tools.due-date-calculator.edd') }}</span>
                <strong>{{ results.edd }}</strong>
              </div>
            </div>

            <div class="stat-card age">
              <Clock :size="32" />
              <div class="stat-info">
                <span>{{ t('tools.due-date-calculator.gestationalAge') }}</span>
                <strong>{{ results.weeks }} {{ t('tools.due-date-calculator.weeks') }} {{ results.days }} {{ t('tools.due-date-calculator.days') }}</strong>
              </div>
            </div>
          </div>

          <div class="progress-container">
            <div class="progress-header">
              <span>{{ t('tools.due-date-calculator.progress') }}</span>
              <span>{{ results.progress }}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: results.progress + '%' }">
                <Heart :size="14" class="progress-icon" />
              </div>
            </div>
            <p class="remaining-text">
              {{ t('tools.due-date-calculator.remaining') }}: <strong>{{ results.remainingDays }}</strong> {{ t('tools.due-date-calculator.days') }}
            </p>
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
  gap: 0.75rem;
}

label {
  font-weight: 600;
  color: var(--text-primary);
}

.date-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-secondary);
  pointer-events: none;
}

.date-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 3rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
}

.tip-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #f0fdf4;
  border-radius: 8px;
  color: #166534;
  font-size: 0.85rem;
  line-height: 1.5;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-color);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-info span {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.stat-info strong {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.stat-card.edd { color: #ec4899; }
.stat-card.age { color: #3b82f6; }

.progress-container {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-weight: 500;
  font-size: 0.95rem;
}

.progress-bar-bg {
  height: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  overflow: visible;
  position: relative;
  margin-bottom: 1rem;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ec4899, #f472b6);
  border-radius: 6px;
  position: relative;
  transition: width 0.5s ease-out;
}

.progress-icon {
  position: absolute;
  right: -7px;
  top: -1px;
  color: #ec4899;
  filter: drop-shadow(0 0 2px rgba(236, 72, 153, 0.5));
}

.remaining-text {
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.remaining-text strong {
  color: var(--accent-color);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
