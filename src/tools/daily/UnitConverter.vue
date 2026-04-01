<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowRightLeft } from 'lucide-vue-next';

const { t } = useI18n();

const categories: Record<string, Record<string, number>> = {
  length: {
    meters: 1,
    kilometers: 1000,
    centimeters: 0.01,
    millimeters: 0.001,
    miles: 1609.34,
    yards: 0.9144,
    feet: 0.3048,
    inches: 0.0254
  },
  weight: {
    kilograms: 1,
    grams: 0.001,
    milligrams: 0.000001,
    pounds: 0.453592,
    ounces: 0.0283495
  },
  digital: {
    bytes: 1,
    kilobytes: 1024,
    megabytes: 1024 * 1024,
    gigabytes: 1024 * 1024 * 1024,
    terabytes: 1024 * 1024 * 1024 * 1024
  },
  area: {
    squareMeters: 1,
    squareKilometers: 1000000,
    squareFeet: 0.092903,
    acres: 4046.86,
    hectares: 10000
  }
};

const selectedCategory = ref('length');
const fromUnit = ref('meters');
const toUnit = ref('kilometers');
const fromValue = ref<number>(1);
const toValue = ref<number>(0);

const convert = (val: number, from: string, to: string, cat: string) => {
  if (cat === 'temperature') {
    // Special case for temperature
    if (from === 'celsius' && to === 'fahrenheit') return (val * 9/5) + 32;
    if (from === 'fahrenheit' && to === 'celsius') return (val - 32) * 5/9;
    if (from === 'celsius' && to === 'kelvin') return val + 273.15;
    if (from === 'kelvin' && to === 'celsius') return val - 273.15;
    if (from === 'fahrenheit' && to === 'kelvin') return (val - 32) * 5/9 + 273.15;
    if (from === 'kelvin' && to === 'fahrenheit') return (val - 273.15) * 9/5 + 32;
    return val;
  }
  
  const factor = categories[cat][from] / categories[cat][to];
  return val * factor;
};

const updateToValue = () => {
  toValue.value = Number(convert(fromValue.value, fromUnit.value, toUnit.value, selectedCategory.value).toFixed(6));
};

const swapUnits = () => {
  const temp = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = temp;
  updateToValue();
};

watch([selectedCategory], () => {
  const units = Object.keys(selectedCategory.value === 'temperature' ? {celsius:0, fahrenheit:0, kelvin:0} : categories[selectedCategory.value]);
  fromUnit.value = units[0];
  toUnit.value = units[1] || units[0];
  updateToValue();
});

watch([fromValue, fromUnit, toUnit], updateToValue, { immediate: true });
</script>

<template>
  <div class="tool-container">
    <div class="converter-card">
      <div class="category-selector">
        <button 
          v-for="(_, cat) in categories" 
          :key="cat"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ t(`tools.unit-converter.categories.${cat}`) }}
        </button>
        <!-- Temperature special case -->
        <button 
          :class="{ active: selectedCategory === 'temperature' }"
          @click="selectedCategory = 'temperature'"
        >
          {{ t('tools.unit-converter.categories.temperature') }}
        </button>
      </div>

      <div class="converter-grid">
        <div class="input-section">
          <label>{{ t('tools.unit-converter.from') }}</label>
          <select v-model="fromUnit">
            <template v-if="selectedCategory === 'temperature'">
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
              <option value="kelvin">Kelvin (K)</option>
            </template>
            <template v-else>
              <option v-for="(_, unit) in categories[selectedCategory]" :key="unit" :value="unit">
                {{ unit.charAt(0).toUpperCase() + unit.slice(1) }}
              </option>
            </template>
          </select>
          <input type="number" v-model="fromValue" step="any">
        </div>

        <button class="swap-btn" @click="swapUnits">
          <ArrowRightLeft :size="20" />
        </button>

        <div class="input-section">
          <label>{{ t('tools.unit-converter.to') }}</label>
          <select v-model="toUnit">
            <template v-if="selectedCategory === 'temperature'">
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
              <option value="kelvin">Kelvin (K)</option>
            </template>
            <template v-else>
              <option v-for="(_, unit) in categories[selectedCategory]" :key="unit" :value="unit">
                {{ unit.charAt(0).toUpperCase() + unit.slice(1) }}
              </option>
            </template>
          </select>
          <div class="result-display">{{ toValue }}</div>
        </div>
      </div>
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
  padding: 2rem;
  border-radius: 20px;
  box-shadow: var(--card-shadow);
}

.category-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.category-selector button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.category-selector button.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.converter-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 1.5rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

select, input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

select:focus, input:focus {
  border-color: var(--accent-color);
}

.result-display {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  min-height: 48px;
  display: flex;
  align-items: center;
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
  margin-bottom: 4px;
  transition: all 0.2s;
}

.swap-btn:hover {
  background: var(--bg-secondary);
  transform: rotate(180deg);
}

@media (max-width: 600px) {
  .converter-grid {
    grid-template-columns: 1fr;
  }
  
  .swap-btn {
    transform: rotate(90deg);
    margin: 0 auto;
  }
  
  .swap-btn:hover {
    transform: rotate(270deg);
  }
}
</style>
