<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Info } from 'lucide-vue-next';

const { t } = useI18n();

const weight = ref(70);
const height = ref(175);

const bmi = computed(() => {
  if (weight.value <= 0 || height.value <= 0) return 0;
  const h = height.value / 100;
  return parseFloat((weight.value / (h * h)).toFixed(1));
});

const category = computed(() => {
  if (bmi.value < 18.5) return 'underweight';
  if (bmi.value < 25) return 'normal';
  if (bmi.value < 30) return 'overweight';
  return 'obese';
});

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case 'underweight': return '#3b82f6';
    case 'normal': return '#22c55e';
    case 'overweight': return '#f59e0b';
    case 'obese': return '#ef4444';
    default: return 'var(--text-secondary)';
  }
};
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="input-section">
        <div class="form-group">
          <label>{{ t('tools.bmi-calculator.weight') }}</label>
          <div class="input-wrapper">
            <input type="number" v-model.number="weight" min="1" max="500" />
            <span class="unit">kg</span>
          </div>
          <input type="range" v-model.number="weight" min="20" max="200" step="0.1" class="range-slider" />
        </div>

        <div class="form-group">
          <label>{{ t('tools.bmi-calculator.height') }}</label>
          <div class="input-wrapper">
            <input type="number" v-model.number="height" min="1" max="300" />
            <span class="unit">cm</span>
          </div>
          <input type="range" v-model.number="height" min="100" max="250" step="1" class="range-slider" />
        </div>

        <div class="tip-box">
          <Info :size="18" />
          <p>{{ t('tools.bmi-calculator.tip') }}</p>
        </div>
      </div>

      <div class="result-section">
        <div class="bmi-display">
          <div class="bmi-value-circle" :style="{ borderColor: getCategoryColor(category) }">
            <span class="label">{{ t('tools.bmi-calculator.result') }}</span>
            <span class="value">{{ bmi }}</span>
          </div>
          
          <div class="category-badge" :style="{ backgroundColor: getCategoryColor(category) }">
            {{ t(`tools.bmi-calculator.${category}`) }}
          </div>
        </div>

        <div class="bmi-scale">
          <div class="scale-item" :class="{ active: category === 'underweight' }">
            <div class="color-bar" style="background: #3b82f6"></div>
            <span>&lt; 18.5</span>
          </div>
          <div class="scale-item" :class="{ active: category === 'normal' }">
            <div class="color-bar" style="background: #22c55e"></div>
            <span>18.5 - 25</span>
          </div>
          <div class="scale-item" :class="{ active: category === 'overweight' }">
            <div class="color-bar" style="background: #f59e0b"></div>
            <span>25 - 30</span>
          </div>
          <div class="scale-item" :class="{ active: category === 'obese' }">
            <div class="color-bar" style="background: #ef4444"></div>
            <span>&gt; 30</span>
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
  gap: 3rem;
  align-items: center;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: 600;
  color: var(--text-primary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1.1rem;
  outline: none;
}

.unit {
  position: absolute;
  right: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.range-slider {
  width: 100%;
  accent-color: var(--accent-color);
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

.result-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.bmi-value-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 12px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.bmi-value-circle .label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.bmi-value-circle .value {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.category-badge {
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: -1rem;
}

.bmi-scale {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  gap: 0.5rem;
}

.scale-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  transition: all 0.2s;
}

.scale-item.active {
  opacity: 1;
  transform: translateY(-4px);
}

.color-bar {
  height: 6px;
  width: 100%;
  border-radius: 3px;
}

.scale-item span {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
