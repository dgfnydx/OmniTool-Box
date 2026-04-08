<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { Upload, Download, RotateCcw, Maximize, Trash2 } from 'lucide-vue-next';
import { useToastStore } from '../../store/toast';

const { t } = useI18n();
const toast = useToastStore();

const imageInput = ref<HTMLInputElement | null>(null);
const imageElement = ref<HTMLImageElement | null>(null);
const previewImage = ref<string | null>(null);
const cropper = ref<Cropper | null>(null);
const aspectRatio = ref<number | null>(null);
const customWidth = ref<number>(1);
const customHeight = ref<number>(1);

const applyCustomRatio = () => {
  if (customWidth.value > 0 && customHeight.value > 0) {
    const ratio = customWidth.value / customHeight.value;
    setAspectRatio(ratio);
  }
};

const processFile = (file: File) => {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
      // Reset cropper instance if it exists
      if (cropper.value) {
        cropper.value.destroy();
        cropper.value = null;
      }
    };
    reader.readAsDataURL(file);
  }
};

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) processFile(file);
};

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  if (file) processFile(file);
};

const initCropper = () => {
  if (imageElement.value && previewImage.value) {
    if (cropper.value) {
      cropper.value.destroy();
    }
    cropper.value = new Cropper(imageElement.value, {
      aspectRatio: aspectRatio.value || NaN,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 0.8,
      restore: false,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
    });
  }
};

const handleImageLoad = () => {
  initCropper();
};

const setAspectRatio = (ratio: number | null) => {
  aspectRatio.value = ratio;
  if (cropper.value) {
    cropper.value.setAspectRatio(ratio || NaN);
  }
};

const rotate = (degree: number) => {
  if (cropper.value) {
    cropper.value.rotate(degree);
  }
};

const reset = () => {
  if (cropper.value) {
    cropper.value.reset();
  }
};

const clearImage = () => {
  previewImage.value = null;
  if (cropper.value) {
    cropper.value.destroy();
    cropper.value = null;
  }
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

const downloadCroppedImage = () => {
  if (!cropper.value) return;

  const canvas = cropper.value.getCroppedCanvas({
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  });

  if (!canvas) {
    toast.show(t('common.common.actions.failed'), 'error');
    return;
  }

  canvas.toBlob((blob: Blob | null) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `cropped-image-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.show(t('common.actions.copied'), 'success');
    }
  }, 'image/png');
};

onUnmounted(() => {
  if (cropper.value) {
    cropper.value.destroy();
  }
});
</script>

<template>
  <div class="tool-container">
    <div 
      v-if="!previewImage" 
      class="upload-area" 
      @click="imageInput?.click()"
      @dragover.prevent
      @dragenter.prevent
      @drop.prevent="handleDrop"
    >
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileUpload"
      />
      <div class="upload-content">
        <Upload :size="48" />
        <p>{{ t('tools.image-cropper.uploadTip') }}</p>
      </div>
    </div>

    <div v-else class="cropper-workspace">
      <div class="cropper-container">
        <img 
          ref="imageElement" 
          :src="previewImage" 
          alt="To crop" 
          @load="handleImageLoad"
        />
      </div>

      <div class="toolbar">
        <div class="tool-group">
          <label>{{ t('tools.image-cropper.aspectRatio') }}</label>
          <div class="button-group">
            <button 
              :class="{ active: aspectRatio === null }" 
              @click="setAspectRatio(null)"
            >Free</button>
            <button 
              :class="{ active: aspectRatio === 1 }" 
              @click="setAspectRatio(1)"
            >1:1</button>
            <button 
              :class="{ active: aspectRatio === 16/9 }" 
              @click="setAspectRatio(16/9)"
            >16:9</button>
            <button 
              :class="{ active: aspectRatio === 4/3 }" 
              @click="setAspectRatio(4/3)"
            >4:3</button>
            <button 
              :class="{ active: aspectRatio === 2/3 }" 
              @click="setAspectRatio(2/3)"
            >2:3</button>
          </div>
        </div>

        <div class="tool-group">
          <label>{{ t('tools.image-cropper.customRatio') }}</label>
          <div class="custom-ratio-inputs">
            <div class="input-with-label">
              <span>{{ t('tools.image-cropper.width') }}</span>
              <input 
                type="number" 
                v-model.number="customWidth" 
                min="1"
                @input="applyCustomRatio"
              />
            </div>
            <div class="input-with-label">
              <span>{{ t('tools.image-cropper.height') }}</span>
              <input 
                type="number" 
                v-model.number="customHeight" 
                min="1"
                @input="applyCustomRatio"
              />
            </div>
          </div>
        </div>

        <div class="tool-group">
          <label>{{ t('tools.image-cropper.actions') }}</label>
          <div class="button-group">
            <button @click="rotate(-90)" :title="t('tools.image-cropper.rotateLeft')">
              <RotateCcw :size="18" style="transform: scaleX(-1);" />
            </button>
            <button @click="rotate(90)" :title="t('tools.image-cropper.rotateRight')">
              <RotateCcw :size="18" />
            </button>
            <button @click="reset" :title="t('tools.image-cropper.reset')">
              <Maximize :size="18" />
            </button>
            <button @click="clearImage" class="danger" :title="t('common.actions.clear')">
              <Trash2 :size="18" />
            </button>
          </div>
        </div>

        <button class="primary-button download-btn" @click="downloadCroppedImage">
          <Download :size="18" />
          {{ t('tools.image-cropper.download') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  max-width: 1000px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-card);
}

.upload-area:hover {
  border-color: var(--accent-color);
  background: var(--bg-secondary);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
}

.hidden {
  display: none;
}

.cropper-workspace {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  width: 200px;
  flex-shrink: 0;
}

.tool-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tool-group label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.button-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.custom-ratio-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-with-label {
  display: flex;
  align-items: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0 0.5rem;
}

.input-with-label span {
  font-size: 0.75rem;
  color: var(--text-secondary);
  width: 20px;
}

.input-with-label input {
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
}

.button-group button {
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.button-group button:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: var(--bg-secondary);
}

.button-group button.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

.button-group button.danger:hover {
  background: #fee2e2;
  border-color: #ef4444;
  color: #ef4444;
}

.primary-button {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  width: 100%;
}

.primary-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.download-btn {
  margin-top: 1rem;
}

.cropper-container {
  flex-grow: 1;
  min-width: 0;
  max-height: 700px;
  background-image: linear-gradient(45deg, var(--bg-secondary) 25%, transparent 25%),
    linear-gradient(-45deg, var(--bg-secondary) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--bg-secondary) 75%),
    linear-gradient(-45deg, transparent 75%, var(--bg-secondary) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

img {
  display: block;
  max-width: 100%;
}

@media (max-width: 992px) {
  .cropper-workspace {
    flex-direction: column;
  }
  .toolbar {
    width: 100%;
    order: 2;
  }
  .cropper-container {
    width: 100%;
    order: 1;
  }
  .button-group {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  }
}
</style>
