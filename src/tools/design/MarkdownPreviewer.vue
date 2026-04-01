<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { marked } from 'marked';
import { useToastStore } from '../../store/toast';

const { t } = useI18n();
const toast = useToastStore();
const input = ref('# Hello Markdown\n\nStart typing to see the preview.\n\n- List item 1\n- List item 2\n\n**Bold text** and *italic text*.\n\n```js\nconsole.log("Hello World");\n```');

const htmlPreview = computed(() => {
  try {
    return marked(input.value);
  } catch (e) {
    return 'Error parsing markdown';
  }
});

const clearAll = () => {
  input.value = '';
};

const copyHtml = () => {
  if (htmlPreview.value) {
    navigator.clipboard.writeText(htmlPreview.value.toString());
    toast.show(t('common.actions.copied'));
  }
};
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.markdown-previewer.editor') }}</label>
          <button @click="clearAll" class="secondary-btn">{{ t('common.actions.clear') }}</button>
        </div>
        <textarea 
          v-model="input" 
          :placeholder="t('tools.markdown-previewer.placeholder')" 
          spellcheck="false"
        ></textarea>
      </div>

      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.markdown-previewer.preview') }}</label>
          <button v-if="htmlPreview" @click="copyHtml" class="text-btn">Copy HTML</button>
        </div>
        <div class="preview-area markdown-body" v-html="htmlPreview"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  max-width: 1200px;
  margin: 0 auto;
}

.workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label {
  font-weight: 600;
  color: var(--text-primary);
}

textarea {
  height: 600px;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: all 0.2s;
  box-shadow: var(--card-shadow);
}

textarea:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.preview-area {
  height: 600px;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  overflow-y: auto;
  box-shadow: var(--card-shadow);
}

/* GitHub-like Markdown Styling */
.markdown-body :deep(h1), 
.markdown-body :deep(h2), 
.markdown-body :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3rem;
}

.markdown-body :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.markdown-body :deep(ul), 
.markdown-body :deep(ol) {
  padding-left: 2rem;
  margin-bottom: 1rem;
}

.markdown-body :deep(code) {
  background: var(--bg-secondary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

.markdown-body :deep(pre) {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--border-color);
  padding-left: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.secondary-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background: var(--border-color);
}

.text-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
}

@media (max-width: 900px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
