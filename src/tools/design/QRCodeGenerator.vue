<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useTool } from '../../composables/useTool';
import { generateQRCode, downloadDataUrl } from '../../utils/image';
import ToolLayout from '../../components/common/ToolLayout.vue';
import { Download, Upload, X } from 'lucide-vue-next';

const { input: text, t } = useTool();
text.value = 'https://omni-tool-box.arbays.com/';

const size = ref(256);
const fgColor = ref('#000000');
const bgColor = ref('#ffffff');
const errorLevel = ref<'L' | 'M' | 'Q' | 'H'>('H');
const logoUrl = ref<string | null>(null);
const logoSizePercent = ref(20);
const qrDataUrl = ref('');

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoUrl.value = e.target?.result as string;
      errorLevel.value = 'H';
    };
    reader.readAsDataURL(file);
  }
};

const updateQR = async () => {
  const canvas = document.createElement('canvas');
  await generateQRCode(canvas, {
    text: text.value,
    size: size.value,
    fgColor: fgColor.value,
    bgColor: bgColor.value,
    errorLevel: errorLevel.value,
    logoUrl: logoUrl.value,
    logoSizePercent: logoSizePercent.value
  });
  qrDataUrl.value = canvas.toDataURL('image/png');
};

const handleDownload = () => {
  if (qrDataUrl.value) {
    downloadDataUrl(qrDataUrl.value, `qrcode-${Date.now()}.png`);
  }
};

const clearForm = () => {
  text.value = '';
  logoUrl.value = null;
};

watch([text, size, fgColor, bgColor, errorLevel, logoUrl, logoSizePercent], updateQR);
onMounted(updateQR);
</script>

<template>
  <div class="tool-container">
    <ToolLayout
      :input-label="t('tools.qr-generator.content')"
      :output-label="t('common.actions.generate')"
      @clear="clearForm"
      @copy="handleDownload"
    >
      <template #input>
        <div class="settings-panel">
          <div class="setting-group">
            <textarea 
              v-model="text" 
              class="tool-textarea small"
              :placeholder="t('tools.qr-generator.placeholder')"
              spellcheck="false"
            ></textarea>
          </div>

          <div class="settings-grid">
            <div class="setting-item">
              <label>{{ t('tools.qr-generator.size') }} ({{ size }}px)</label>
              <input type="range" v-model.number="size" min="128" max="512" step="16" class="range-input" />
            </div>

            <div class="setting-item">
              <label>{{ t('tools.qr-generator.errorCorrection') }}</label>
              <select v-model="errorLevel" class="tool-select">
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
            </div>

            <div class="setting-item">
              <label>{{ t('tools.qr-generator.fgColor') }}</label>
              <div class="color-row">
                <input type="color" v-model="fgColor" class="color-btn" />
                <code>{{ fgColor.toUpperCase() }}</code>
              </div>
            </div>

            <div class="setting-item">
              <label>{{ t('tools.qr-generator.bgColor') }}</label>
              <div class="color-row">
                <input type="color" v-model="bgColor" class="color-btn" />
                <code>{{ bgColor.toUpperCase() }}</code>
              </div>
            </div>
          </div>

          <div class="logo-area">
            <label class="setting-label">{{ t('tools.qr-generator.uploadLogo') }}</label>
            <div v-if="!logoUrl" class="upload-zone">
              <label class="upload-trigger">
                <Upload :size="18" />
                <span>Select Image</span>
                <input type="file" @change="handleFileUpload" accept="image/*" hidden />
              </label>
            </div>
            <div v-else class="logo-config">
              <div class="logo-preview-box">
                <img :src="logoUrl" />
                <button class="remove-btn" @click="logoUrl = null"><X :size="12" /></button>
              </div>
              <div class="logo-range">
                <span class="sub-label">{{ t('tools.qr-generator.logoSize') }}: {{ logoSizePercent }}%</span>
                <input type="range" v-model.number="logoSizePercent" min="10" max="30" class="range-input" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #output>
        <div class="preview-panel">
          <div class="qr-canvas-wrapper">
            <img v-if="qrDataUrl" :src="qrDataUrl" class="qr-img" />
            <div v-else class="qr-empty">Enter content to generate</div>
          </div>
          
          <button @click="handleDownload" class="btn-primary full" :disabled="!qrDataUrl">
            <Download :size="18" />
            {{ t('tools.qr-generator.download') }}
          </button>
        </div>
      </template>

      <template #output-actions>
        <div style="display:none"></div> <!-- Hide default copy button -->
      </template>
    </ToolLayout>
  </div>
</template>

<style scoped>
.settings-panel { display: flex; flex-direction: column; gap: 1.5rem; }
.setting-item { display: flex; flex-direction: column; gap: 0.5rem; }
.setting-item label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

.tool-textarea.small { height: 80px; font-size: 0.95rem; }
.tool-select { height: 38px; padding: 0 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); outline: none; }

.color-row { display: flex; align-items: center; gap: 0.75rem; }
.color-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; padding: 0; background: none; }
code { font-family: monospace; font-weight: 600; font-size: 0.85rem; color: var(--text-secondary); }

.range-input { width: 100%; height: 6px; border-radius: 3px; background: var(--bg-secondary); accent-color: var(--accent-color); cursor: pointer; }

.logo-area { border-top: 1px dashed var(--border-color); padding-top: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
.setting-label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }

.upload-trigger { display: flex; align-items: center; justify-content: center; gap: 0.5rem; height: 60px; border: 2px dashed var(--border-color); border-radius: 12px; cursor: pointer; color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; transition: all 0.2s; }
.upload-trigger:hover { border-color: var(--accent-color); color: var(--accent-color); background: var(--bg-secondary); }

.logo-config { display: flex; align-items: center; gap: 1.25rem; }
.logo-preview-box { position: relative; width: 50px; height: 50px; border-radius: 8px; border: 1px solid var(--border-color); overflow: hidden; background: white; }
.logo-preview-box img { width: 100%; height: 100%; object-fit: contain; }
.remove-btn { position: absolute; top: 0; right: 0; background: rgba(239, 68, 68, 0.8); color: white; border: none; padding: 2px; cursor: pointer; line-height: 0; }
.logo-range { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
.sub-label { font-size: 0.7rem; color: var(--text-muted); }

.preview-panel { display: flex; flex-direction: column; gap: 1.5rem; align-items: center; }
.qr-canvas-wrapper { width: 100%; aspect-ratio: 1; background: white; border-radius: 16px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
.qr-img { max-width: 90%; height: auto; display: block; }
.qr-empty { font-size: 0.85rem; color: var(--text-muted); }

.btn-primary.full { width: 100%; height: 48px; display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 1rem; }

.animate-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
