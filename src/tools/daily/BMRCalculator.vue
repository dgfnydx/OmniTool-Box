<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Info, User, Users } from 'lucide-vue-next';

const { t } = useI18n();

const gender = ref<'male' | 'female'>('male');
const age = ref(25);
const weight = ref(70);
const height = ref(175);

const bmr = computed(() => {
  if (age.value <= 0 || weight.value <= 0 || height.value <= 0) return 0;
  
  let result = (10 * weight.value) + (6.25 * height.value) - (5 * age.value);
  if (gender.value === 'male') {
    result += 5;
  } else {
    result -= 161;
  }
  
  return Math.round(result);
});

// 计算不同活动水平下的热量需求
const activityLevels = computed(() => [
  { key: 'sedentary', factor: 1.2 },
  { key: 'light', factor: 1.375 },
  { key: 'moderate', factor: 1.55 },
  { key: 'active', factor: 1.725 },
  { key: 'extra', factor: 1.9 }
]);
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="input-section">
        <div class="form-group">
          <label>{{ t('tools.bmr-calculator.gender') }}</label>
          <div class="gender-selector">
            <button 
              :class="{ active: gender === 'male' }" 
              @click="gender = 'male'"
            >
              <User :size="20" />
              {{ t('tools.bmr-calculator.male') }}
            </button>
            <button 
              :class="{ active: gender === 'female' }" 
              @click="gender = 'female'"
            >
              <Users :size="20" />
              {{ t('tools.bmr-calculator.female') }}
            </button>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('tools.bmr-calculator.age') }}</label>
            <input type="number" v-model.number="age" min="1" max="120" />
          </div>
          <div class="form-group">
            <label>{{ t('tools.bmr-calculator.weight') }}</label>
            <div class="input-with-unit">
              <input type="number" v-model.number="weight" min="1" max="500" />
              <span>kg</span>
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('tools.bmr-calculator.height') }}</label>
            <div class="input-with-unit">
              <input type="number" v-model.number="height" min="1" max="300" />
              <span>cm</span>
            </div>
          </div>
        </div>

        <div class="tip-box">
          <Info :size="18" />
          <p>{{ t('tools.bmr-calculator.tip') }}</p>
        </div>
      </div>

      <div class="result-section">
        <div class="bmr-card">
          <span class="label">{{ t('tools.bmr-calculator.result') }}</span>
          <div class="value-row">
            <span class="value">{{ bmr }}</span>
            <span class="unit">{{ t('tools.bmr-calculator.calories') }}</span>
          </div>
        </div>

        <div class="activity-table">
          <div 
            v-for="level in activityLevels" 
            :key="level.factor"
            class="activity-row"
          >
            <span class="activity-label">{{ t(`tools.bmr-calculator.activity.${level.key}`) }}</span>
            <span class="activity-value">{{ Math.round(bmr * level.factor) }} kcal</span>
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
  padding: 2rem;
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.gender-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.gender-selector button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.gender-selector button.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

input[type="number"] {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
}

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-unit span {
  position: absolute;
  right: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.tip-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
}

.bmr-card {
  background: linear-gradient(135deg, var(--accent-color), #6366f1);
  padding: 2rem;
  border-radius: 16px;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
}

.bmr-card .label {
  font-size: 1rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.bmr-card .value-row {
  margin-top: 0.5rem;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.bmr-card .value {
  font-size: 3.5rem;
  font-weight: 800;
}

.bmr-card .unit {
  font-size: 1.1rem;
  opacity: 0.9;
}

.activity-table {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.activity-row {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.activity-row:last-child {
  border-bottom: none;
}

.activity-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  flex: 1;
}

.activity-value {
  font-weight: 600;
  color: var(--text-primary);
  margin-left: 1rem;
}

@media (max-width: 768px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
