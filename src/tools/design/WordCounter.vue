<script setup lang="ts">
import { computed } from 'vue';
import { useTool } from '../../composables/useTool';
import { analyzeText } from '../../utils/text';
import ToolLayout from '../../components/common/ToolLayout.vue';
import { 
  Type, 
  Hash, 
  AlignLeft, 
  Clock, 
  MessageSquare, 
} from 'lucide-vue-next';

const { input, clear, copy, t } = useTool();

const stats = computed(() => analyzeText(input.value));

const toUppercase = () => {
  input.value = input.value.toUpperCase();
};

const toLowercase = () => {
  input.value = input.value.toLowerCase();
};

const STAT_ITEMS = [
  { key: 'words', icon: Type, unit: '' },
  { key: 'charsWithSpaces', icon: Hash, unit: '' },
  { key: 'lines', icon: AlignLeft, unit: '' },
  { key: 'sentences', icon: MessageSquare, unit: '' },
  { key: 'readingTime', icon: Clock, unit: 'm' }
];
</script>

<template>
  <div class="tool-container">
    <ToolLayout
      :input-label="t('tools.word-counter.words')"
      :output-label="t('tools.word-counter.definitions.title')"
      @clear="clear"
      @copy="copy(input)"
    >
      <template #input-actions>
        <button @click="toUppercase" class="btn-secondary small">{{ t('tools.word-counter.uppercase') }}</button>
        <button @click="toLowercase" class="btn-secondary small">{{ t('tools.word-counter.lowercase') }}</button>
      </template>

      <template #input>
        <div class="editor-wrapper">
          <textarea 
            v-model="input" 
            class="tool-textarea"
            :placeholder="t('tools.word-counter.placeholder')"
            spellcheck="false"
          ></textarea>
          <div class="editor-footer">
            {{ stats.charsNoSpaces }} {{ t('tools.word-counter.charsNoSpaces') }}
          </div>
        </div>
      </template>

      <template #output>
        <div class="stats-panel">
          <div class="stats-grid">
            <div v-for="item in STAT_ITEMS" :key="item.key" class="stat-card">
              <div class="stat-icon"><component :is="item.icon" :size="18" /></div>
              <div class="stat-info">
                <div class="stat-value">{{ (stats as any)[item.key] }}{{ item.unit }}</div>
                <div class="stat-label">{{ t(`tools.word-counter.${item.key === 'charsWithSpaces' ? 'chars' : item.key}`) }}</div>
              </div>
            </div>
          </div>

          <div class="definitions-box">
            <h3>{{ t('tools.word-counter.definitions.title') }}</h3>
            <ul>
              <li v-for="key in ['words', 'chars', 'lines', 'sentences', 'readingTime']" :key="key">
                {{ t(`tools.word-counter.definitions.${key}`) }}
              </li>
            </ul>
          </div>
        </div>
      </template>
    </ToolLayout>
  </div>
</template>

<style scoped>
.editor-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
.editor-footer { font-size: 0.8rem; color: var(--text-muted); text-align: right; font-weight: 500; }

.stats-panel { display: flex; flex-direction: column; gap: 1.5rem; }
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.stat-card { background: var(--bg-secondary); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 0.75rem; }
.stat-icon { width: 32px; height: 32px; background: var(--bg-card); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--accent-color); flex-shrink: 0; }
.stat-value { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
.stat-label { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }

.definitions-box { background: var(--bg-secondary); border-radius: 12px; padding: 1.25rem; border: 1px dashed var(--border-color); }
.definitions-box h3 { font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--text-primary); }
.definitions-box ul { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
.definitions-box li { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; padding-left: 1.25rem; position: relative; }
.definitions-box li::before { content: "•"; position: absolute; left: 0.25rem; color: var(--accent-color); font-weight: bold; }

@media (max-width: 600px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
