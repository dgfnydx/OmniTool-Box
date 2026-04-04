<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Copy, Trash2, Info, Columns, Rows } from 'lucide-vue-next';
import * as Diff from 'diff';
import { useToastStore } from '../../store/toast';

const { t } = useI18n();
const toast = useToastStore();

const originalText = ref('');
const modifiedText = ref('');
const mode = ref<'chars' | 'words' | 'lines'>('lines');
const viewMode = ref<'split' | 'unified'>('split');

// Unified diff calculation
const diffResult = computed(() => {
  if (mode.value === 'chars') {
    return Diff.diffChars(originalText.value, modifiedText.value);
  } else if (mode.value === 'words') {
    return Diff.diffWords(originalText.value, modifiedText.value);
  } else {
    return Diff.diffLines(originalText.value, modifiedText.value);
  }
});

// Side-by-side split diff calculation
const splitRows = computed(() => {
  const result: Array<{ left: any, right: any }> = [];
  const diffs = Diff.diffLines(originalText.value, modifiedText.value);
  
  let leftIndex = 0;
  let rightIndex = 0;

  for (let i = 0; i < diffs.length; i++) {
    const part = diffs[i];
    const lines = part.value.split('\n');
    // jsdiff adds an empty string at the end if there's a trailing newline
    if (lines[lines.length - 1] === '') lines.pop();

    if (part.added) {
      lines.forEach(line => {
        result.push({ 
          left: null, 
          right: { value: line, type: 'added', index: ++rightIndex } 
        });
      });
    } else if (part.removed) {
      lines.forEach(line => {
        result.push({ 
          left: { value: line, type: 'removed', index: ++leftIndex }, 
          right: null 
        });
      });
    } else {
      lines.forEach(line => {
        result.push({ 
          left: { value: line, type: 'unchanged', index: ++leftIndex }, 
          right: { value: line, type: 'unchanged', index: ++rightIndex } 
        });
      });
    }
  }

  // Basic alignment: if we have a sequence of removed followed by added, we can try to pair them
  // This is a simple implementation, more complex algorithms could be used for better alignment
  return result;
});

const clearAll = () => {
  originalText.value = '';
  modifiedText.value = '';
};

const copyResult = () => {
  const resultText = diffResult.value
    .map(part => {
      const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
      return part.value.split('\n').map(line => line ? prefix + line : line).join('\n');
    })
    .join('');
  
  navigator.clipboard.writeText(resultText);
  toast.show(t('common.actions.copied'), 'success');
};
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="input-section">
        <div class="controls-row">
          <div class="control-group">
            <label>{{ t('tools.doc-comparator.mode') }}</label>
            <div class="toggle-group">
              <button :class="{ active: mode === 'chars' }" @click="mode = 'chars'">{{ t('tools.doc-comparator.modeChars') }}</button>
              <button :class="{ active: mode === 'words' }" @click="mode = 'words'">{{ t('tools.doc-comparator.modeWords') }}</button>
              <button :class="{ active: mode === 'lines' }" @click="mode = 'lines'">{{ t('tools.doc-comparator.modeLines') }}</button>
            </div>
          </div>
          <div class="control-group">
            <label>{{ t('tools.doc-comparator.viewMode') }}</label>
            <div class="toggle-group">
              <button :class="{ active: viewMode === 'split' }" @click="viewMode = 'split'">
                <Columns :size="14" /> {{ t('tools.doc-comparator.viewSplit') }}
              </button>
              <button :class="{ active: viewMode === 'unified' }" @click="viewMode = 'unified'">
                <Rows :size="14" /> {{ t('tools.doc-comparator.viewUnified') }}
              </button>
            </div>
          </div>
        </div>

        <div class="text-inputs">
          <div class="input-group">
            <label>{{ t('tools.doc-comparator.original') }}</label>
            <textarea 
              v-model="originalText" 
              :placeholder="t('tools.doc-comparator.placeholder1')"
            ></textarea>
          </div>
          <div class="input-group">
            <label>{{ t('tools.doc-comparator.modified') }}</label>
            <textarea 
              v-model="modifiedText" 
              :placeholder="t('tools.doc-comparator.placeholder2')"
            ></textarea>
          </div>
        </div>

        <div class="actions">
          <button class="secondary-btn" @click="clearAll">
            <Trash2 :size="18" />
            {{ t('common.actions.clear') }}
          </button>
          <button class="secondary-btn" @click="copyResult" :disabled="!originalText && !modifiedText">
            <Copy :size="18" />
            {{ t('common.actions.copy') }}
          </button>
        </div>
      </div>

      <div class="result-section">
        <div class="result-header">
          <h3>{{ t('tools.doc-comparator.diffResult') }}</h3>
          <div class="legend">
            <div class="legend-item"><span class="box added"></span> {{ t('tools.doc-comparator.legend.added') }}</div>
            <div class="legend-item"><span class="box removed"></span> {{ t('tools.doc-comparator.legend.removed') }}</div>
          </div>
        </div>

        <div class="diff-container" v-if="originalText || modifiedText">
          <!-- Split View -->
          <div v-if="viewMode === 'split'" class="split-view">
            <div class="split-header">
              <div class="header-left">{{ t('tools.doc-comparator.original') }}</div>
              <div class="header-right">{{ t('tools.doc-comparator.modified') }}</div>
            </div>
            <div class="split-content">
              <div v-for="(row, idx) in splitRows" :key="idx" class="diff-row">
                <div class="line-left" :class="row.left?.type">
                  <span class="line-num">{{ row.left?.index || '' }}</span>
                  <span class="line-sign">{{ row.left ? '-' : '' }}</span>
                  <pre>{{ row.left?.value || '' }}</pre>
                </div>
                <div class="line-right" :class="row.right?.type">
                  <span class="line-num">{{ row.right?.index || '' }}</span>
                  <span class="line-sign">{{ row.right ? '+' : '' }}</span>
                  <pre>{{ row.right?.value || '' }}</pre>
                </div>
              </div>
            </div>
          </div>

          <!-- Unified View -->
          <div v-else class="unified-view">
            <pre><span 
                v-for="(part, index) in diffResult" 
                :key="index"
                :class="{ 
                  'added': part.added, 
                  'removed': part.removed,
                  'unchanged': !part.added && !part.removed 
                }"
              >{{ part.value }}</span></pre>
          </div>
        </div>

        <div v-else class="empty-state">
          <Info :size="48" />
          <p>{{ t('tools.doc-comparator.diffResult') }}将会在这里显示</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.toggle-group {
  display: flex;
  background: var(--bg-secondary);
  padding: 3px;
  border-radius: 8px;
  gap: 2px;
  border: 1px solid var(--border-color);
}

.toggle-group button {
  padding: 0.4rem 0.8rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.toggle-group button.active {
  background: var(--accent-color);
  color: white;
}

.text-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-group label {
  font-weight: 600;
  color: var(--text-primary);
}

textarea {
  width: 100%;
  height: 180px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.85rem;
  resize: vertical;
  outline: none;
}

.actions {
  display: flex;
  gap: 1rem;
}

.secondary-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.9rem;
}

.result-section {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.result-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.box { width: 10px; height: 10px; border-radius: 2px; }
.box.added { background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; }
.box.removed { background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; }

.diff-container {
  background: var(--bg-secondary);
}

/* Split View Styles */
.split-view {
  display: flex;
  flex-direction: column;
}

.split-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.split-header div {
  padding: 0.5rem 1rem;
}

.split-content {
  overflow-x: auto;
}

.diff-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}

.line-left, .line-right {
  display: flex;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.line-num {
  width: 40px;
  min-width: 40px;
  text-align: right;
  padding-right: 10px;
  color: var(--text-tertiary);
  user-select: none;
  background: rgba(0,0,0,0.03);
  flex-shrink: 0;
}

.line-sign {
  width: 20px;
  min-width: 20px;
  text-align: center;
  color: var(--text-tertiary);
  user-select: none;
  flex-shrink: 0;
}

pre {
  margin: 0;
  padding: 0 5px;
  flex: 1;
  white-space: pre-wrap;
  word-break: break-all;
}

.removed { background-color: rgba(239, 68, 68, 0.15); }
.added { background-color: rgba(34, 197, 94, 0.15); }

.line-left.removed pre { color: #dc2626; }
.line-right.added pre { color: #16a34a; }

/* Unified View Styles */
.unified-view {
  padding: 1.5rem;
}

.unified-view pre {
  margin: 0;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.unified-view .added { background-color: rgba(34, 197, 94, 0.2); color: #16a34a; }
.unified-view .removed { background-color: rgba(239, 68, 68, 0.2); color: #dc2626; text-decoration: line-through; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  color: var(--text-tertiary);
  gap: 1rem;
}

@media (max-width: 768px) {
  .text-inputs { grid-template-columns: 1fr; }
  .controls-row { flex-direction: column; gap: 1rem; }
}
</style>
