<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import QRCode from 'qrcode';
import { Download, RefreshCw, Upload, X } from 'lucide-vue-next';

const { t } = useI18n();

const text = ref('https://omni-tool-box.arbays.com/');
const size = ref(256);
const fgColor = ref('#000000');
const bgColor = ref('#ffffff');
const errorLevel = ref<'L' | 'M' | 'Q' | 'H'>('H'); // Default to H for logo support
const logoUrl = ref<string | null>(null);
const logoSizePercent = ref(20); // 20% of QR size
const qrDataUrl = ref('');
const canvasRef = ref<HTMLCanvasElement | null>(null);

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoUrl.value = e.target?.result as string;
      errorLevel.value = 'H'; // Auto switch to High correction
    };
    reader.readAsDataURL(file);
  }
};

const clearLogo = () => {
  logoUrl.value = null;
};

const generateQR = async () => {
  if (!text.value) {
    qrDataUrl.value = '';
    return;
  }

  try {
    // 1. Generate base QR code
    const tempCanvas = document.createElement('canvas');
    await QRCode.toCanvas(tempCanvas, text.value, {
      width: size.value,
      margin: 2,
      color: {
        dark: fgColor.value,
        light: bgColor.value,
      },
      errorCorrectionLevel: errorLevel.value
    });

    const ctx = tempCanvas.getContext('2d');
    if (ctx && logoUrl.value) {
      // 2. Load and draw Logo
      const logoImg = new Image();
      logoImg.src = logoUrl.value;
      await new Promise((resolve) => (logoImg.onload = resolve));

      const logoSize = (size.value * logoSizePercent.value) / 100;
      const logoPos = (size.value - logoSize) / 2;

      // Draw white background for logo (optional but recommended)
      ctx.fillStyle = bgColor.value;
      ctx.fillRect(logoPos - 2, logoPos - 2, logoSize + 4, logoSize + 4);

      ctx.drawImage(logoImg, logoPos, logoPos, logoSize, logoSize);
    }

    qrDataUrl.value = tempCanvas.toDataURL('image/png');
  } catch (err) {
    console.error(err);
  }
};

const downloadQR = () => {
  if (!qrDataUrl.value) return;
  const link = document.createElement('a');
  link.download = `qrcode-${Date.now()}.png`;
  link.href = qrDataUrl.value;
  link.click();
};

watch([text, size, fgColor, bgColor, errorLevel, logoUrl, logoSizePercent], generateQR);
onMounted(generateQR);
</script>

<template>
  <div class="tool-container">
    <div class="qr-workspace">
      <!-- Controls -->
      <div class="card controls-card">
        <div class="input-group">
          <label>{{ t('tools.qr-generator.content') }}</label>
          <textarea 
            v-model="text" 
            :placeholder="t('tools.qr-generator.placeholder')"
            spellcheck="false"
          ></textarea>
        </div>

        <div class="options-grid">
          <div class="input-group">
            <label>{{ t('tools.qr-generator.size') }} ({{ size }}px)</label>
            <input type="range" v-model.number="size" min="128" max="512" step="16" />
          </div>

          <div class="input-group">
            <label>{{ t('tools.qr-generator.errorCorrection') }}</label>
            <select v-model="errorLevel">
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>

          <div class="input-group">
            <label>{{ t('tools.qr-generator.fgColor') }}</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="fgColor" />
              <span class="color-value">{{ fgColor.toUpperCase() }}</span>
            </div>
          </div>

          <div class="input-group">
            <label>{{ t('tools.qr-generator.bgColor') }}</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="bgColor" />
              <span class="color-value">{{ bgColor.toUpperCase() }}</span>
            </div>
          </div>
        </div>

        <!-- Logo Controls -->
        <div class="logo-section">
          <label>{{ t('tools.qr-generator.uploadLogo') }}</label>
          <div class="logo-actions">
            <label v-if="!logoUrl" class="upload-btn">
              <Upload :size="16" />
              <span>{{ t('common.actions.format').replace(/.*$/, 'Upload') }}</span>
              <input type="file" @change="handleFileUpload" accept="image/*" hidden />
            </label>
            <div v-else class="logo-preview-row">
              <div class="mini-logo">
                <img :src="logoUrl" />
                <button class="remove-logo" @click="clearLogo"><X :size="12" /></button>
              </div>
              <div class="logo-size-control">
                <span>{{ t('tools.qr-generator.logoSize') }}: {{ logoSizePercent }}%</span>
                <input type="range" v-model.number="logoSizePercent" min="10" max="30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="card preview-card">
        <div class="qr-preview-wrapper">
          <div v-if="qrDataUrl" class="qr-container">
            <img :src="qrDataUrl" alt="QR Code Preview" />
          </div>
          <div v-else class="qr-placeholder">
            <RefreshCw :size="48" class="loading-icon" />
          </div>
        </div>

        <button 
          @click="downloadQR" 
          class="primary-btn download-btn" 
          :disabled="!qrDataUrl"
        >
          <Download :size="18" />
          {{ t('tools.qr-generator.download') }}
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

.qr-workspace {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
}

.controls-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  resize: none;
  outline: none;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.logo-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

.logo-section label {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.logo-preview-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.mini-logo {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.mini-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-logo {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  padding: 2px;
  cursor: pointer;
}

.logo-size-control {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.logo-size-control span {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.preview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.qr-preview-wrapper {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white; /* Always white for better contrast */
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.qr-container img {
  max-width: 100%;
  height: auto;
  display: block;
}

.loading-icon {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.download-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.8rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.download-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .qr-workspace {
    grid-template-columns: 1fr;
  }
}
</style>
