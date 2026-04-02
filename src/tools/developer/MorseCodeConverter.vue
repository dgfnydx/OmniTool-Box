<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';

const { t } = useI18n();
const toast = useToastStore();
const input = ref('');
const output = ref('');
const error = ref('');

const MORSE_CODE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', '\\': '.-..-.', // Use " as fallback for \
  ' ': '/'
};

const REVERSE_MORSE_MAP: Record<string, string> = Object.entries(MORSE_CODE_MAP).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

const convertToMorse = () => {
  error.value = '';
  try {
    const text = input.value;
    const morseArray: string[] = [];
    
    for (const char of text) {
      if (char === '\n') {
        morseArray.push('\n');
        continue;
      }
      
      const upperChar = char.toUpperCase();
      if (MORSE_CODE_MAP[upperChar]) {
        morseArray.push(MORSE_CODE_MAP[upperChar]);
      } else {
        // Fallback for non-ASCII (Chinese, etc.): convert to \uXXXX
        const unicodeHex = char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase();
        const escapeSeq = `\\U${unicodeHex}`;
        for (const s of escapeSeq) {
          morseArray.push(MORSE_CODE_MAP[s] || '');
        }
      }
    }
    
    output.value = morseArray.filter(s => s !== '').join(' ');
  } catch (e: any) {
    error.value = e.message;
  }
};

const convertFromMorse = () => {
  error.value = '';
  try {
    const codes = input.value.trim().split(/\s+/);
    let decodedText = '';
    
    for (const code of codes) {
      if (code === '/') {
        decodedText += ' ';
        continue;
      }
      const char = REVERSE_MORSE_MAP[code];
      if (!char && code !== '') {
        throw new Error(t('tools.morse-converter.invalidMorse') + ': ' + code);
      }
      decodedText += char || '';
    }
    
    // Handle the \uXXXX sequences back to characters
    const finalResult = decodedText.replace(/\\U([0-9A-F]{4})/gi, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
    
    output.value = finalResult;
  } catch (e: any) {
    error.value = e.message;
  }
};

const clearAll = () => {
  input.value = '';
  output.value = '';
  error.value = '';
};

const copyOutput = () => {
  if (output.value) {
    navigator.clipboard.writeText(output.value);
    toast.show(t('common.actions.copied'));
  }
};
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.morse-converter.input') }}</label>
          <div class="actions">
            <button @click="convertToMorse" class="primary-btn">{{ t('tools.morse-converter.toMorse') }}</button>
            <button @click="convertFromMorse" class="primary-btn">{{ t('tools.morse-converter.fromMorse') }}</button>
            <button @click="clearAll" class="secondary-btn">{{ t('common.actions.clear') }}</button>
          </div>
        </div>
        <textarea 
          v-model="input" 
          :placeholder="t('tools.morse-converter.inputPlaceholder')" 
          spellcheck="false"
        ></textarea>
      </div>

      <div class="editor-section">
        <div class="label-row">
          <label>{{ t('tools.morse-converter.output') }}</label>
          <button v-if="output" @click="copyOutput" class="text-btn">{{ t('common.actions.copy') }}</button>
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <textarea 
          v-model="output" 
          readonly 
          :placeholder="t('tools.morse-converter.outputPlaceholder')" 
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
}

textarea {
  height: 400px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: monospace;
  resize: vertical;
  outline: none;
  font-size: 1.1rem;
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.primary-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.primary-btn:hover {
  opacity: 0.9;
}

.secondary-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.text-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-weight: 500;
}

.error-msg {
  color: #ef4444;
  font-size: 0.875rem;
  padding: 0.25rem 0;
}

@media (max-width: 768px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
