<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';
import { 
  Type, 
  Hash, 
  AlignLeft, 
  Clock, 
  Copy, 
  Trash2, 
  MessageSquare, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToastStore();
const text = ref('');
const showDefinitions = ref(false);

const stats = computed(() => {
  const content = text.value || '';
  
  // 优化后的单词/字数统计逻辑
  const enWords = content.match(/[a-zA-Z0-9']+/g) || [];
  const cjkChars = content.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || [];
  
  const words = enWords.length + cjkChars.length;
  const charsWithSpaces = content.length;
  const charsNoSpaces = content.replace(/\s/g, '').length;
  const lines = content ? content.split('\n').length : 0;
  
  // 句子统计 (匹配 . ! ? 以及中文的 。 ！ ？)
  const sentences = content.match(/[^.!?。！？]+[.!?。！？]+/g) || [];
  
  const readingTime = Math.ceil(words / 200);

  return { words, charsWithSpaces, charsNoSpaces, lines, sentences: sentences.length, readingTime };
});

const toUppercase = () => {
  text.value = text.value.toUpperCase();
  toast.show(t('tools.word-counter.converted'));
};

const toLowercase = () => {
  text.value = text.value.toLowerCase();
  toast.show(t('tools.word-counter.converted'));
};

const clearText = () => {
  text.value = '';
};

const copyText = () => {
  if (text.value) {
    navigator.clipboard.writeText(text.value);
    toast.show(t('common.actions.copied'));
  }
};
</script>

<template>
  <div class="tool-container">
    <!-- Definitions Section -->
    <div class="info-section">
      <button class="info-toggle" @click="showDefinitions = !showDefinitions">
        <HelpCircle :size="16" />
        <span>{{ t('tools.word-counter.definitions.title') }}</span>
        <component :is="showDefinitions ? ChevronUp : ChevronDown" :size="16" class="chevron" />
      </button>
      
      <div v-if="showDefinitions" class="info-content">
        <ul>
          <li>{{ t('tools.word-counter.definitions.words') }}</li>
          <li>{{ t('tools.word-counter.definitions.chars') }}</li>
          <li>{{ t('tools.word-counter.definitions.lines') }}</li>
          <li>{{ t('tools.word-counter.definitions.sentences') }}</li>
          <li>{{ t('tools.word-counter.definitions.readingTime') }}</li>
        </ul>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><Type :size="20" /></div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.words }}</div>
          <div class="stat-label">{{ t('tools.word-counter.words') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><Hash :size="20" /></div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.charsWithSpaces }}</div>
          <div class="stat-label">{{ t('tools.word-counter.chars') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><AlignLeft :size="20" /></div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.lines }}</div>
          <div class="stat-label">{{ t('tools.word-counter.lines') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><MessageSquare :size="20" /></div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.sentences }}</div>
          <div class="stat-label">{{ t('tools.word-counter.sentences') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><Clock :size="20" /></div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.readingTime }}m</div>
          <div class="stat-label">{{ t('tools.word-counter.readingTime') }}</div>
        </div>
      </div>
    </div>

    <div class="editor-area">
      <div class="editor-header">
        <div class="actions">
          <button @click="toUppercase" class="action-btn">{{ t('tools.word-counter.uppercase') }}</button>
          <button @click="toLowercase" class="action-btn">{{ t('tools.word-counter.lowercase') }}</button>
        </div>
        <div class="actions">
          <button @click="copyText" class="icon-btn" :title="t('common.actions.copy')"><Copy :size="18" /></button>
          <button @click="clearText" class="icon-btn danger" :title="t('common.actions.clear')"><Trash2 :size="18" /></button>
        </div>
      </div>
      <textarea 
        v-model="text" 
        :placeholder="t('tools.word-counter.placeholder')"
        spellcheck="false"
      ></textarea>
      <div class="editor-footer">
        {{ stats.charsNoSpaces }} {{ t('tools.word-counter.charsNoSpaces') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--border-color);
}

.stat-icon {
  width: 36px;
  height: 36px;
  background: var(--bg-card);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  flex-shrink: 0;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

.editor-area {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.editor-header {
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.4rem 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-primary);
}

.action-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

textarea {
  width: 100%;
  height: 400px;
  padding: 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.6;
  outline: none;
  resize: vertical;
}

.editor-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: right;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.icon-btn.danger:hover {
  color: #ef4444;
}

/* Info Section */
.info-section {
  margin-bottom: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.info-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.info-toggle:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.chevron {
  margin-left: auto;
  opacity: 0.5;
}

.info-content {
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.info-content ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-content li {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
}

.info-content li::before {
  content: "•";
  color: var(--accent-color);
  font-weight: bold;
  margin-right: 0.75rem;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
