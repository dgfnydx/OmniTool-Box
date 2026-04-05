<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Upload, Download, Image as ImageIcon, ArrowRight, Trash2 } from 'lucide-vue-next';
import { useToastStore } from '../../store/toast';

const { t } = useI18n();
const toast = useToastStore();

const originalFile = ref<File | null>(null);
const originalUrl = ref('');
const compressedUrl = ref('');
const originalSize = ref(0);
const compressedSize = ref(0);
const quality = ref(0.8);
const scale = ref(1.0);
const format = ref<'original' | 'image/jpeg' | 'image/webp' | 'image/png'>('original');

const isProcessing = ref(false);

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toast.show('Please upload an image file.', 'error');
    return;
  }

  originalFile.value = file;
  originalSize.value = file.size;
  
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value);
  originalUrl.value = URL.createObjectURL(file);
  
  compressImage();
};

const compressImage = async () => {
  if (!originalFile.value) return;
  isProcessing.value = true;

  const img = new Image();
  img.src = originalUrl.value;
  
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const width = img.width * scale.value;
  const height = img.height * scale.value;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);

  const outputFormat = format.value === 'original' ? originalFile.value.type : format.value;
  
  // PNG is lossless in canvas.toBlob quality parameter is ignored for PNG.
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      (b) => resolve(b),
      outputFormat,
      outputFormat === 'image/png' ? undefined : quality.value
    );
  });

  if (blob) {
    if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value);
    compressedUrl.value = URL.createObjectURL(blob);
    compressedSize.value = blob.size;
  }

  isProcessing.value = false;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const downloadImage = () => {
  if (!compressedUrl.value) return;
  const link = document.createElement('a');
  const extension = (format.value === 'original' ? originalFile.value?.type : format.value)?.split('/')[1] || 'jpg';
  link.download = `compressed_${originalFile.value?.name.split('.')[0]}.${extension}`;
  link.href = compressedUrl.value;
  link.click();
};

const clearAll = () => {
  originalFile.value = null;
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value);
  if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value);
  originalUrl.value = '';
  compressedUrl.value = '';
  originalSize.value = 0;
  compressedSize.value = 0;
};

watch([quality, scale, format], () => {
  if (originalFile.value) compressImage();
});

onUnmounted(() => {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value);
  if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value);
});
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="input-section" v-if="!originalFile">
        <input 
          type="file" 
          id="image-upload" 
          accept="image/*" 
          @change="handleFileUpload" 
          hidden 
        />
        <label for="image-upload" class="upload-area">
          <Upload :size="48" />
          <p>{{ t('tools.image-compressor.uploadTip') }}</p>
        </label>
      </div>

      <div class="process-section" v-else>
        <div class="controls-panel">
          <div class="control-group">
            <div class="label-row">
              <label>{{ t('tools.image-compressor.quality') }}</label>
              <span>{{ Math.round(quality * 100) }}%</span>
            </div>
            <input type="range" v-model.number="quality" min="0.1" max="1.0" step="0.05" />
          </div>

          <div class="control-group">
            <div class="label-row">
              <label>{{ t('tools.image-compressor.scale') }}</label>
              <span>{{ Math.round(scale * 100) }}%</span>
            </div>
            <input type="range" v-model.number="scale" min="0.1" max="1.0" step="0.1" />
          </div>

          <div class="control-group">
            <label>{{ t('tools.image-compressor.format') }}</label>
            <select v-model="format">
              <option value="original">{{ t('tools.image-compressor.keepOriginal') }}</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>

          <div class="action-buttons">
            <button class="download-btn" @click="downloadImage" :disabled="isProcessing">
              <Download :size="20" />
              {{ t('tools.image-compressor.download') }}
            </button>
            <button class="danger-btn" @click="clearAll">
              <Trash2 :size="20" />
            </button>
          </div>
        </div>

        <div class="comparison-panel">
          <div class="comparison-card original">
            <div class="card-header">
              <span>{{ t('tools.image-compressor.original') }}</span>
              <span class="size-badge">{{ formatSize(originalSize) }}</span>
            </div>
            <div class="image-preview">
              <img :src="originalUrl" />
            </div>
          </div>

          <div class="comparison-divider">
            <div class="reduction-info" v-if="compressedSize > 0" :class="{ 'increased': compressedSize > originalSize }">
              <div class="percentage">
                {{ compressedSize > originalSize ? '+' : '-' }}{{ Math.abs(Math.round((1 - compressedSize / originalSize) * 100)) }}%
              </div>
              <ArrowRight :size="24" />
            </div>
          </div>

          <div class="comparison-card compressed">
            <div class="card-header">
              <span>{{ t('tools.image-compressor.compressed') }}</span>
              <span class="size-badge primary">{{ formatSize(compressedSize) }}</span>
            </div>
            <div class="image-preview">
              <div v-if="isProcessing" class="loading-overlay">
                <div class="spinner"></div>
              </div>
              <img :src="compressedUrl" />
            </div>
          </div>
        </div>
        <div class="image-tips-box">
          <Info :size="18" />
          <div class="tips-content">
            <p v-if="compressedSize > originalSize" class="warning-text">
              注意：当前设置导致文件体积变大。这通常是因为原图已高度压缩，或者目标格式（如 PNG）在当前质量下编码效率较低。请尝试降低质量或缩放尺寸。
            </p>
            <p>支持 JPEG, PNG, WebP。对于 PNG 图片，建议转换格式为 WebP 或 JPEG 以获得更好的压缩效果。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  width: 100%;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 5rem;
  border: 2px dashed var(--border-color);
  border-radius: 16px;
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: var(--accent-color);
  background: var(--bg-secondary);
}

.upload-area p {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.process-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.controls-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) auto;
  gap: 2rem;
  padding: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  align-items: flex-end;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.control-group span {
  font-size: 0.85rem;
  color: var(--accent-color);
  font-weight: 700;
}

input[type="range"] {
  width: 100%;
  accent-color: var(--accent-color);
}

select {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.danger-btn {
  padding: 0.75rem;
  background: var(--bg-secondary);
  color: var(--text-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
}

.danger-btn:hover {
  color: #ef4444;
  border-color: #ef4444;
}

.comparison-panel {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.5rem;
  align-items: stretch;
}

.comparison-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.size-badge {
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.size-badge.primary {
  background: rgba(var(--accent-color-rgb), 0.1);
  color: var(--accent-color);
}

.image-preview {
  flex: 1;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(45deg, var(--bg-secondary) 25%, transparent 25%), 
                    linear-gradient(-45deg, var(--bg-secondary) 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, var(--bg-secondary) 75%), 
                    linear-gradient(-45deg, transparent 75%, var(--bg-secondary) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  position: relative;
}

.image-preview img {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.comparison-divider {
  display: flex;
  align-items: center;
  justify-content: center;
}

.reduction-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-color);
}

.reduction-info.increased {
  color: #ef4444;
}

.percentage {
  font-size: 1.25rem;
  font-weight: 800;
}

.image-tips-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-top: 1rem;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.warning-text {
  color: #ef4444;
  font-weight: 600;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(var(--bg-card-rgb), 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .comparison-panel {
    grid-template-columns: 1fr;
  }
  
  .comparison-divider {
    transform: rotate(90deg);
    padding: 1rem;
  }
}
</style>
