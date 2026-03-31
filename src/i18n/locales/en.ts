export default {
  common: {
    search: 'Search tools...',
    home: 'Home',
    categories: {
      developer: 'Developer',
      daily: 'Daily',
      design: 'Design'
    },
    actions: {
      format: 'Format',
      clear: 'Clear',
      copy: 'Copy',
      generate: 'Generate',
      copied: 'Copied to clipboard!',
      failed: 'Action failed'
    },
    loading: 'Loading tool...',
    notFound: 'Tool not found'
  },
  home: {
    heroTitle: 'OmniTool Box',
    heroSubtitle: 'Your all-in-one workspace for developer, daily, and design tools.'
  },
  tools: {
    'json-formatter': {
      name: 'JSON Formatter',
      description: 'Clean and format your JSON code.',
      input: 'Input JSON',
      output: 'Formatted JSON',
      inputPlaceholder: 'Paste your JSON here...',
      outputPlaceholder: 'Formatted JSON will appear here...',
      invalidJson: 'Invalid JSON'
    },
    'base64-converter': {
      name: 'Base64 Converter',
      description: 'Encode and decode Base64 data.',
      input: 'Source Text',
      output: 'Result',
      encode: 'Encode',
      decode: 'Decode',
      inputPlaceholder: 'Enter text or Base64 here...',
      outputPlaceholder: 'Result will appear here...'
    },
    'timestamp-converter': {
      name: 'Timestamp Converter',
      description: 'Convert Unix timestamps to readable dates.',
      currentTs: 'Current Unix Timestamp',
      tsToDate: 'Timestamp to Date',
      dateToTs: 'Date to Timestamp',
      resultDate: 'Local Date Time',
      resultTs: 'Unix Timestamp',
      invalidTs: 'Invalid Timestamp',
      invalidDate: 'Invalid Date Format'
    },
    'password-generator': {
      name: 'Password Generator',
      description: 'Create secure and random passwords.',
      length: 'Password Length',
      uppercase: 'Include Uppercase',
      lowercase: 'Include Lowercase',
      numbers: 'Include Numbers',
      symbols: 'Include Symbols',
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong'
    },
    'unit-converter': {
      name: 'Unit Converter',
      description: 'Convert between different units.'
    },
    'timer': {
      name: 'Timer',
      description: 'Simple countdown timer.'
    },
    'word-counter': {
      name: 'Word Counter',
      description: 'Count words, characters, and sentences.'
    },
    'color-palette': {
      name: 'Color Palette',
      description: 'Hex/RGB/HSL color converter and generator.'
    },
    'markdown-previewer': {
      name: 'Markdown Previewer',
      description: 'Live preview for Markdown syntax.'
    }
  }
}
