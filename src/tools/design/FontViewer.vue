<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Upload, Type, RotateCcw, Info } from 'lucide-vue-next';
import { useToastStore } from '../../store/toast';

const { t } = useI18n();
const toast = useToastStore();

const previewText = ref('The quick brown fox jumps over the lazy dog. 1234567890 永恒的艺术，不朽的篇章。');
const fontSize = ref(36);
const lineHeight = ref(1.5);
const letterSpacing = ref(0);
const fontWeight = ref(400);
const isItalic = ref(false);
const selectedFont = ref('sans-serif');

const systemFonts = [
  { name: 'Sans-serif', value: 'sans-serif' },
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'PingFang SC', value: '"PingFang SC", sans-serif' },
  { name: 'Microsoft YaHei', value: '"Microsoft YaHei", sans-serif' },
  { name: 'Source Han Sans', value: '"Source Han Sans SC", sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' }
];

const localFonts = ref<{ name: string; family: string; url: string }[]>([]);

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const fontName = file.name.split('.')[0];
  const fontFamily = `custom-font-${Date.now()}`;
  const fontUrl = URL.createObjectURL(file);

  try {
    const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
    await fontFace.load();
    document.fonts.add(fontFace);
    
    localFonts.value.push({
      name: fontName,
      family: fontFamily,
      url: fontUrl
    });
    
    selectedFont.value = fontFamily;
    toast.show(`Font "${fontName}" loaded!`, 'success');
  } catch (error) {
    toast.show('Failed to load font file.', 'error');
  }
};

const resetText = () => {
  previewText.value = 'The quick brown fox jumps over the lazy dog. 1234567890 永恒的艺术，不朽的篇章。';
};

onUnmounted(() => {
  localFonts.value.forEach(font => {
    URL.revokeObjectURL(font.url);
  });
});
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="control-panel">
        <div class="section">
          <label>{{ t('tools.font-viewer.previewText') }}</label>
          <div class="input-with-action">
            <textarea v-model="previewText" rows="3"></textarea>
            <button class="icon-btn" @click="resetText" :title="t('tools.font-viewer.reset')">
              <RotateCcw :size="16" />
            </button>
          </div>
        </div>

        <div class="controls-grid">
          <div class="control-item">
            <label>{{ t('tools.font-viewer.fontSize') }}: {{ fontSize }}px</label>
            <input type="range" v-model.number="fontSize" min="12" max="120" />
          </div>
          <div class="control-item">
            <label>{{ t('tools.font-viewer.lineHeight') }}: {{ lineHeight }}</label>
            <input type="range" v-model.number="lineHeight" min="0.5" max="3" step="0.1" />
          </div>
          <div class="control-item">
            <label>{{ t('tools.font-viewer.letterSpacing') }}: {{ letterSpacing }}px</label>
            <input type="range" v-model.number="letterSpacing" min="-5" max="20" />
          </div>
          <div class="control-item">
            <label>{{ t('tools.font-viewer.fontWeight') }}: {{ fontWeight }}</label>
            <input type="range" v-model.number="fontWeight" min="100" max="900" step="100" />
          </div>
        </div>

        <div class="font-selection">
          <div class="font-list-section">
            <label>{{ t('tools.font-viewer.systemFonts') }}</label>
            <div class="font-chips">
              <button 
                v-for="font in systemFonts" 
                :key="font.value"
                :class="{ active: selectedFont === font.value }"
                @click="selectedFont = font.value"
                :style="{ fontFamily: font.value }"
              >
                {{ font.name }}
              </button>
            </div>
          </div>

          <div class="font-list-section" v-if="localFonts.length > 0">
            <label>{{ t('tools.font-viewer.localFonts') }}</label>
            <div class="font-chips">
              <button 
                v-for="font in localFonts" 
                :key="font.family"
                :class="{ active: selectedFont === font.family }"
                @click="selectedFont = font.family"
                :style="{ fontFamily: font.family }"
              >
                {{ font.name }}
              </button>
            </div>
          </div>

          <div class="upload-area">
            <input 
              type="file" 
              id="font-upload" 
              accept=".ttf,.otf,.woff,.woff2" 
              @change="handleFileUpload" 
              hidden 
            />
            <label for="font-upload" class="upload-label">
              <Upload :size="20" />
              <span>{{ t('tools.font-viewer.uploadTip') }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="preview-panel">
        <div class="preview-header">
          <div class="font-badge">
            <Type :size="16" />
            <span>{{ selectedFont }}</span>
          </div>
        </div>
        <div class="preview-content-wrapper">
          <div 
            class="preview-content"
            :style="{
              fontFamily: selectedFont,
              fontSize: fontSize + 'px',
              lineHeight: lineHeight,
              letterSpacing: letterSpacing + 'px',
              fontWeight: fontWeight,
              fontStyle: isItalic ? 'italic' : 'normal'
            }"
          >
            {{ previewText }}
          </div>
        </div>
        <div class="tip-box">
          <Info :size="16" />
          <p>支持 TTF, OTF, WOFF, WOFF2 格式。本地字体仅在当前会话有效，不会上传到服务器。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
}

.control-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.input-with-action {
  position: relative;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  resize: vertical;
  font-size: 0.9rem;
  outline: none;
}

.icon-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem;
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 4px;
}

.icon-btn:hover {
  background: var(--border-color);
  color: var(--accent-color);
}

.controls-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-item label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

input[type="range"] {
  width: 100%;
  accent-color: var(--accent-color);
}

.font-selection {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.font-list-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.font-list-section label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.font-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.font-chips button {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.font-chips button:hover {
  border-color: var(--accent-color);
}

.font-chips button.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.upload-area {
  margin-top: 0.5rem;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.upload-label:hover {
  border-color: var(--accent-color);
  background: var(--bg-secondary);
  color: var(--accent-color);
}

.preview-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.font-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.preview-content-wrapper {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 3rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.preview-content {
  width: 100%;
  text-align: center;
  word-break: break-all;
  white-space: pre-wrap;
  transition: all 0.1s;
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

@media (max-width: 992px) {
  .workspace {
    grid-template-columns: 1fr;
  }
  
  .control-panel {
    max-height: none;
  }
}
</style>
