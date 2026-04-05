<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { BarChart3, Download, Trash2, Settings2, Info } from 'lucide-vue-next';
import { useToastStore } from '../../store/toast';

const { t } = useI18n();
const toast = useToastStore();

const text = ref('');
const ignoreCase = ref(true);
const ignorePunctuation = ref(true);
const filterStopWords = ref(false);
const minFrequency = ref(1);

const stopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'the', 'this', 'but', 'not', 'or', 'if'
]);

const frequencyData = computed(() => {
  if (!text.value.trim()) return [];

  let content = text.value;
  if (ignoreCase.value) content = content.toLowerCase();
  
  // Remove punctuation if enabled
  if (ignorePunctuation.value) {
    content = content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()！？。，；：“”（）《》]/g, ' ');
  }

  const freqMap = new Map<string, number>();
  
  // Split by whitespace to get potential words
  const words = content.split(/\s+/);
  
  words.forEach(rawWord => {
    if (!rawWord) return;

    // Separate CJK characters and English words
    // This regex matches sequences of English/Latin characters OR individual CJK characters
    const matches = rawWord.match(/[a-zA-Z0-9']+|[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g);
    
    if (matches) {
      matches.forEach(item => {
        if (filterStopWords.value && stopWords.has(item.toLowerCase())) return;
        freqMap.set(item, (freqMap.get(item) || 0) + 1);
      });
    }
  });

  const total = Array.from(freqMap.values()).reduce((a, b) => a + b, 0);
  
  return Array.from(freqMap.entries())
    .map(([word, count]) => ({
      word,
      count,
      percentage: ((count / total) * 100).toFixed(2)
    }))
    .filter(item => item.count >= minFrequency.value)
    .sort((a, b) => b.count - a.count);
});

const clearText = () => {
  text.value = '';
};

const exportCSV = () => {
  if (frequencyData.value.length === 0) return;
  
  const headers = [t('tools.word-frequency.word'), t('tools.word-frequency.count'), t('tools.word-frequency.percentage')];
  const rows = frequencyData.value.map(item => [item.word, item.count, item.percentage + '%']);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `word_frequency_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.show(t('common.actions.copied'), 'success');
};
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="input-panel">
        <div class="panel-header">
          <div class="title">
            <Settings2 :size="18" />
            <span>{{ t('tools.word-frequency.settings') }}</span>
          </div>
          <button class="icon-btn danger" @click="clearText" :title="t('common.actions.clear')">
            <Trash2 :size="18" />
          </button>
        </div>

        <div class="settings-grid">
          <label class="checkbox-label">
            <input type="checkbox" v-model="ignoreCase" />
            <span>{{ t('tools.word-frequency.ignoreCase') }}</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="ignorePunctuation" />
            <span>{{ t('tools.word-frequency.ignorePunctuation') }}</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="filterStopWords" />
            <span>{{ t('tools.word-frequency.filterStopWords') }}</span>
          </label>
          <div class="min-freq">
            <span>{{ t('tools.word-frequency.minFrequency') }}</span>
            <input type="number" v-model.number="minFrequency" min="1" class="number-input" />
          </div>
        </div>

        <textarea 
          v-model="text" 
          :placeholder="t('tools.word-frequency.inputPlaceholder')"
          class="main-textarea"
        ></textarea>
      </div>

      <div class="result-panel">
        <div class="panel-header">
          <div class="title">
            <BarChart3 :size="18" />
            <span>{{ t('tools.word-frequency.name') }}</span>
          </div>
          <button 
            class="export-btn" 
            @click="exportCSV" 
            :disabled="frequencyData.length === 0"
          >
            <Download :size="16" />
            {{ t('tools.word-frequency.export') }}
          </button>
        </div>

        <div class="table-container" v-if="frequencyData.length > 0">
          <table class="freq-table">
            <thead>
              <tr>
                <th>{{ t('tools.word-frequency.word') }}</th>
                <th>{{ t('tools.word-frequency.count') }}</th>
                <th>{{ t('tools.word-frequency.percentage') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in frequencyData" :key="item.word">
                <td class="word-cell">{{ item.word }}</td>
                <td class="count-cell">{{ item.count }}</td>
                <td class="percentage-cell">
                  <div class="progress-wrapper">
                    <div class="progress-bar" :style="{ width: item.percentage + '%' }"></div>
                    <span class="percentage-text">{{ item.percentage }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" v-else>
          <Info :size="48" />
          <p>{{ t('tools.word-frequency.noData') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.input-panel, .result-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(var(--accent-color-rgb), 0.02);
}

.panel-header .title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
}

.settings-grid {
  padding: 1rem 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.min-freq {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.number-input {
  width: 50px;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
}

.main-textarea {
  width: 100%;
  height: 400px;
  padding: 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  outline: none;
}

.table-container {
  height: 500px;
  overflow-y: auto;
}

.freq-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.freq-table th {
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  z-index: 10;
}

.freq-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.word-cell {
  font-weight: 500;
  color: var(--accent-color);
}

.count-cell {
  color: var(--text-primary);
  width: 80px;
}

.percentage-cell {
  width: 180px;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  height: 6px;
  background: var(--accent-color);
  border-radius: 3px;
  opacity: 0.3;
}

.percentage-text {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  min-width: 45px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--text-tertiary);
  padding: 4rem;
}

.icon-btn {
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  display: flex;
}

.icon-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.icon-btn.danger:hover {
  color: #ef4444;
  background: #fef2f2;
}

@media (max-width: 992px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
