<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Upload, Link, Copy, Trash2, History } from 'lucide-vue-next';
import { useToastStore } from '../../store/toast';
import { colord } from 'colord';

const { t } = useI18n();
const toast = useToastStore();

const imageUrl = ref('');
const previewImage = ref<string | null>(null);
const imageElement = ref<HTMLImageElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const pickedColor = ref('#ffffff');
const colorHistory = ref<string[]>([]);
const isHovering = ref(false);
const magnifierPos = ref({ x: 0, y: 0 });
const magnifierColor = ref('#ffffff');

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const loadFromUrl = () => {
  if (imageUrl.value.trim()) {
    previewImage.value = imageUrl.value.trim();
  }
};

const initCanvas = () => {
  if (!imageElement.value || !canvasElement.value) return;
  const canvas = canvasElement.value;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  canvas.width = imageElement.value.naturalWidth;
  canvas.height = imageElement.value.naturalHeight;
  
  try {
    ctx.drawImage(imageElement.value, 0, 0);
  } catch (e) {
    console.error('Canvas Error:', e);
    toast.show(t('tools.image-color-picker.canvasError'), 'error');
  }
};

const getColorAtPixel = (clientX: number, clientY: number) => {
  if (!imageElement.value || !canvasElement.value) return null;
  const rect = imageElement.value.getBoundingClientRect();
  const scaleX = canvasElement.value.width / rect.width;
  const scaleY = canvasElement.value.height / rect.height;
  
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  
  const ctx = canvasElement.value.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return colord({ r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] / 255 }).toHex();
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isHovering.value) isHovering.value = true;
  const color = getColorAtPixel(e.clientX, e.clientY);
  if (color) {
    magnifierColor.value = color;
    magnifierPos.value = { x: e.offsetX, y: e.offsetY };
  }
};

const pickColor = (e: MouseEvent) => {
  const color = getColorAtPixel(e.clientX, e.clientY);
  if (color) {
    pickedColor.value = color;
    if (!colorHistory.value.includes(color)) {
      colorHistory.value.unshift(color);
      if (colorHistory.value.length > 10) colorHistory.value.pop();
    }
  }
};

const copyColor = (value: string) => {
  navigator.clipboard.writeText(value);
  toast.show(t('tools.image-color-picker.copySuccess'), 'success');
};

const clearImage = () => {
  previewImage.value = null;
  imageUrl.value = '';
  pickedColor.value = '#ffffff';
  if (fileInput.value) fileInput.value.value = '';
};

const colorFormats = computed(() => {
  const c = colord(pickedColor.value);
  return [
    { label: 'HEX', value: c.toHex().toUpperCase() },
    { label: 'RGB', value: c.toRgbString() },
    { label: 'HSL', value: c.toHslString() }
  ];
});
</script>

<template>
  <div class="tool-container">
    <div v-if="!previewImage" class="upload-section">
      <div 
        class="upload-area" 
        @click="fileInput?.click()"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileUpload"
        />
        <Upload :size="48" />
        <p>{{ t('tools.image-color-picker.uploadTip') }}</p>
      </div>

      <div class="url-input-group">
        <div class="input-wrapper">
          <Link :size="18" />
          <input 
            v-model="imageUrl" 
            type="text" 
            :placeholder="t('tools.image-color-picker.urlPlaceholder')"
            @keyup.enter="loadFromUrl"
          />
        </div>
        <button class="primary-button" @click="loadFromUrl">
          {{ t('tools.image-color-picker.loadUrl') }}
        </button>
      </div>
    </div>

    <div v-else class="picker-workspace">
      <div class="main-content">
        <div class="image-viewer-container">
          <div 
            class="image-wrapper"
            @mousemove="handleMouseMove"
            @mouseleave="isHovering = false"
            @click="pickColor"
          >
            <img 
              ref="imageElement" 
              :src="previewImage" 
              crossorigin="anonymous"
              @load="initCanvas"
              alt="Source"
            />
            <canvas ref="canvasElement" class="hidden-canvas"></canvas>
            
            <div 
              v-if="isHovering" 
              class="magnifier"
              :style="{ 
                left: magnifierPos.x + 'px', 
                top: magnifierPos.y + 'px',
                borderColor: magnifierColor 
              }"
            >
              <div class="magnifier-inner" :style="{ backgroundColor: magnifierColor }"></div>
            </div>
          </div>
        </div>

        <div class="side-panel">
          <div class="panel-section current-color-section">
            <label>{{ t('tools.image-color-picker.pickedColor') }}</label>
            <div class="color-preview-large" :style="{ backgroundColor: pickedColor }"></div>
            
            <div class="format-list">
              <div v-for="fmt in colorFormats" :key="fmt.label" class="format-item">
                <span class="format-label">{{ fmt.label }}</span>
                <span class="format-value">{{ fmt.value }}</span>
                <button class="icon-button" @click="copyColor(fmt.value)">
                  <Copy :size="16" />
                </button>
              </div>
            </div>
          </div>

          <div class="panel-section history-section">
            <div class="section-header">
              <History :size="16" />
              <label>{{ t('tools.image-color-picker.history') }}</label>
            </div>
            <div class="history-grid">
              <div 
                v-for="color in colorHistory" 
                :key="color"
                class="history-item"
                :style="{ backgroundColor: color }"
                :title="color"
                @click="pickedColor = color"
              ></div>
            </div>
          </div>

          <button class="secondary-button clear-btn" @click="clearImage">
            <Trash2 :size="18" />
            {{ t('common.actions.clear') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  max-width: 1200px;
  margin: 0 auto;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 16px;
  padding: 5rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
}

.upload-area:hover {
  border-color: var(--accent-color);
  background: var(--bg-secondary);
  color: var(--accent-color);
}

.url-input-group {
  display: flex;
  gap: 1rem;
}

.input-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  background: transparent;
  color: var(--text-primary);
  outline: none;
}

.picker-workspace {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.image-viewer-container {
  flex-grow: 1;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  min-height: 400px;
  max-height: 700px;
  position: relative;
}

.image-wrapper {
  position: relative;
  cursor: crosshair;
  display: inline-block;
}

.image-wrapper img {
  max-width: 100%;
  display: block;
}

.hidden-canvas {
  display: none;
}

.magnifier {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  pointer-events: none;
  transform: translate(-50%, -120%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #eee;
}

.magnifier-inner {
  width: 100%;
  height: 100%;
}

.side-panel {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
}

.current-color-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.current-color-section label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.color-preview-large {
  width: 100%;
  height: 80px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.format-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.format-item {
  display: grid;
  grid-template-columns: 45px 1fr 32px;
  align-items: center;
  background: var(--bg-secondary);
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  gap: 0.5rem;
}

.format-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.format-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.8125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.icon-button:hover {
  background: var(--border-color);
  color: var(--accent-color);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.section-header label {
  font-size: 0.875rem;
  font-weight: 600;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.history-item {
  aspect-ratio: 1;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: transform 0.1s;
}

.history-item:hover {
  transform: scale(1.1);
}

.primary-button {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.primary-button:hover {
  opacity: 0.9;
}

.secondary-button {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.secondary-button:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: #fee2e2;
}

.hidden {
  display: none;
}

@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }
  .side-panel {
    width: 100%;
  }
}
</style>
