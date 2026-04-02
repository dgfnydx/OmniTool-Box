<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import exifr from 'exifr';
import { Upload, Camera, MapPin, FileText } from 'lucide-vue-next';

const { t } = useI18n();
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const metadata = ref<any>(null);
const basicInfo = ref<any>(null);
const isLoading = ref(false);
const error = ref('');

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const processFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file.';
    return;
  }

  isLoading.value = true;
  error.value = '';
  previewUrl.value = URL.createObjectURL(file);
  
  basicInfo.value = {
    name: file.name,
    size: formatSize(file.size),
    type: file.type
  };

  try {
    const data = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      interop: true,
      ifd1: true,
      xmp: true,
      icc: true,
      iptc: true,
      jfif: true,
      ihdr: true
    });

    if (!data) {
      metadata.value = null;
    } else {
      metadata.value = data;
    }
  } catch (e: any) {
    console.error(e);
    error.value = 'Failed to parse EXIF data.';
  } finally {
    isLoading.value = false;
  }
};

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    processFile(e.dataTransfer.files[0]);
  }
};

const triggerUpload = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="tool-container">
    <div class="exif-workspace">
      <!-- Upload Area -->
      <div 
        class="upload-area" 
        @dragover.prevent 
        @drop="onDrop"
        @click="triggerUpload"
      >
        <input 
          type="file" 
          ref="fileInput" 
          @change="onFileChange" 
          accept="image/*" 
          style="display: none"
        />
        <div v-if="!previewUrl" class="upload-placeholder">
          <Upload :size="48" />
          <p>{{ t('tools.photo-exif.uploadPlaceholder') }}</p>
        </div>
        <img v-else :src="previewUrl" class="preview-img" alt="Preview" />
        <div v-if="isLoading" class="loader-overlay">
          <div class="spinner"></div>
        </div>
      </div>

      <!-- Info Area -->
      <div class="info-area">
        <div v-if="error" class="error-msg">{{ error }}</div>
        
        <div v-if="basicInfo" class="info-card">
          <div class="card-header">
            <FileText :size="20" />
            <h3>{{ t('tools.photo-exif.basicInfo') }}</h3>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span>{{ t('tools.photo-exif.filename') }}</span>
              <strong>{{ basicInfo.name }}</strong>
            </div>
            <div class="info-item">
              <span>{{ t('tools.photo-exif.filesize') }}</span>
              <strong>{{ basicInfo.size }}</strong>
            </div>
          </div>
        </div>

        <div v-if="metadata" class="info-card">
          <div class="card-header">
            <Camera :size="20" />
            <h3>{{ t('tools.photo-exif.exifInfo') }}</h3>
          </div>
          <div class="info-grid">
            <div class="info-item" v-if="metadata.Make || metadata.Model">
              <span>{{ t('tools.photo-exif.cameraModel') }}</span>
              <strong>{{ metadata.Make }} {{ metadata.Model }}</strong>
            </div>
            <div class="info-item" v-if="metadata.ExposureTime">
              <span>{{ t('tools.photo-exif.exposure') }}</span>
              <strong>1/{{ Math.round(1/metadata.ExposureTime) }}s</strong>
            </div>
            <div class="info-item" v-if="metadata.ISO">
              <span>{{ t('tools.photo-exif.iso') }}</span>
              <strong>{{ metadata.ISO }}</strong>
            </div>
            <div class="info-item" v-if="metadata.FocalLength">
              <span>{{ t('tools.photo-exif.focalLength') }}</span>
              <strong>{{ metadata.FocalLength }}mm</strong>
            </div>
            <div class="info-item" v-if="metadata.DateTimeOriginal">
              <span>{{ t('tools.photo-exif.dateTime') }}</span>
              <strong>{{ new Date(metadata.DateTimeOriginal).toLocaleString() }}</strong>
            </div>
          </div>
        </div>

        <div v-if="metadata?.latitude && metadata?.longitude" class="info-card">
          <div class="card-header">
            <MapPin :size="20" />
            <h3>{{ t('tools.photo-exif.gpsInfo') }}</h3>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span>{{ t('tools.photo-exif.latitude') }}</span>
              <strong>{{ metadata.latitude.toFixed(6) }}</strong>
            </div>
            <div class="info-item">
              <span>{{ t('tools.photo-exif.longitude') }}</span>
              <strong>{{ metadata.longitude.toFixed(6) }}</strong>
            </div>
          </div>
          <a 
            :href="`https://www.google.com/maps?q=${metadata.latitude},${metadata.longitude}`" 
            target="_blank" 
            class="map-link"
          >
            View on Google Maps
          </a>
        </div>

        <div v-if="basicInfo && !metadata && !isLoading" class="no-exif">
          {{ t('tools.photo-exif.noExif') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exif-workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.upload-area {
  aspect-ratio: 4/3;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: border-color 0.2s;
  background: var(--bg-secondary);
}

.upload-area:hover {
  border-color: var(--accent-color);
}

.upload-placeholder {
  text-align: center;
  color: var(--text-secondary);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.info-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 1.25rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--accent-color);
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--bg-secondary);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item span {
  color: var(--text-secondary);
}

.info-item strong {
  color: var(--text-primary);
}

.map-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--accent-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.map-link:hover {
  text-decoration: underline;
}

.error-msg {
  color: #ef4444;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.no-exif {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: 8px;
}

.loader-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--bg-secondary);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .exif-workspace {
    grid-template-columns: 1fr;
  }
}
</style>
