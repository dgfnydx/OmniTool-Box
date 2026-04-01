<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';
import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import { RefreshCw, Copy } from 'lucide-vue-next';

extend([a11yPlugin]);

const { t } = useI18n();
const toast = useToastStore();

const color = ref('#3b82f6');
const formats = ref({
  hex: '#3b82f6',
  rgb: 'rgb(59, 130, 246)',
  hsl: 'hsl(217, 91%, 60%)'
});

const contrastRatio = computed(() => {
  return colord(color.value).contrast();
});

const contrastLevel = computed(() => {
  if (contrastRatio.value >= 7) return { label: 'AAA', color: '#22c55e' };
  if (contrastRatio.value >= 4.5) return { label: 'AA', color: '#3b82f6' };
  return { label: 'Fail', color: '#ef4444' };
});

const updateAll = (val: string) => {
  const c = colord(val);
  if (c.isValid()) {
    formats.value.hex = c.toHex();
    formats.value.rgb = c.toRgbString();
    formats.value.hsl = c.toHslString();
    color.value = c.toHex();
  }
};

watch(color, (newVal) => {
  updateAll(newVal);
});

const generateRandom = () => {
  const randomColor = colord({
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  }).toHex();
  color.value = randomColor;
};

const copyFormat = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.show(t('common.actions.copied'));
};

const scheme = computed(() => {
  const c = colord(color.value);
  return [
    c.lighten(0.2).toHex(),
    c.lighten(0.1).toHex(),
    c.toHex(),
    c.darken(0.1).toHex(),
    c.darken(0.2).toHex()
  ];
});
</script>

<template>
  <div class="tool-container">
    <div class="palette-grid">
      <!-- Main Picker Card -->
      <div class="card picker-card">
        <div class="preview-box" :style="{ backgroundColor: color }">
          <input type="color" v-model="color" class="color-input" />
          <div class="preview-label" :style="{ color: colord(color).isDark() ? '#fff' : '#000' }">
            {{ color.toUpperCase() }}
          </div>
        </div>
        
        <div class="format-list">
          <div v-for="(val, key) in formats" :key="key" class="format-item">
            <label>{{ key.toUpperCase() }}</label>
            <div class="input-with-action">
              <input type="text" :value="val" readonly />
              <button class="icon-btn" @click="copyFormat(val)"><Copy :size="16" /></button>
            </div>
          </div>
        </div>

        <button class="random-btn" @click="generateRandom">
          <RefreshCw :size="18" />
          <span>{{ t('tools.color-palette.random') }}</span>
        </button>
      </div>

      <!-- Analysis Card -->
      <div class="card side-card">
        <h3>{{ t('tools.color-palette.analysis') }}</h3>
        
        <div class="contrast-box">
          <div class="contrast-value" :style="{ color: contrastLevel.color }">
            {{ contrastRatio.toFixed(2) }}
          </div>
          <div class="contrast-meta">
            <div class="contrast-level" :style="{ backgroundColor: contrastLevel.color }">
              {{ contrastLevel.label }}
            </div>
            <p>{{ t('tools.color-palette.wcag') }}</p>
          </div>
        </div>

        <div class="accessibility-preview">
          <div class="preview-text" :style="{ backgroundColor: color, color: '#ffffff' }">
            White Text on Color
          </div>
          <div class="preview-text" :style="{ backgroundColor: color, color: '#000000' }">
            Black Text on Color
          </div>
        </div>

        <div class="shades-grid">
          <div 
            v-for="shade in scheme" 
            :key="shade" 
            class="shade-item" 
            :style="{ backgroundColor: shade }"
            @click="color = shade"
            :title="shade"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.palette-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.picker-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-box {
  height: 180px;
  border-radius: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.color-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.preview-label {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  pointer-events: none;
  font-family: monospace;
}

.format-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.format-item label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.input-with-action {
  display: flex;
  gap: 0.5rem;
}

.input-with-action input {
  flex: 1;
  height: 40px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0 1rem;
  color: var(--text-primary);
  font-family: monospace;
  outline: none;
}

.random-btn {
  height: 48px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.random-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.side-card h3 {
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.contrast-box {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.contrast-value {
  font-size: 2rem;
  font-weight: 800;
}

.contrast-level {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.contrast-meta p {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.accessibility-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.preview-text {
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: center;
}

.shades-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.shade-item {
  cursor: pointer;
  transition: transform 0.1s;
}

.shade-item:hover {
  transform: scaleY(1.2);
}

.icon-btn {
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
}

.icon-btn:hover {
  color: var(--accent-color);
  border-color: var(--accent-color);
}

@media (max-width: 900px) {
  .palette-grid {
    grid-template-columns: 1fr;
  }
}
</style>
