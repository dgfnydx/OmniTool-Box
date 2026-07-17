export default {
  name: 'MD5 Hash Generator',
  description: 'Generate MD5 hash for any text.',
  input: 'Source Text',
  output: 'MD5 Hash',
  hash: 'Generate Hash',
  singleMode: 'Single',
  batchMode: 'Batch',
  inputPlaceholder: 'Enter text to hash...',
  batchPlaceholder: 'Enter one text per line (max 200 lines)...',
  outputPlaceholder: 'MD5 hash will appear here...',
  hashError: 'Hashing error',
  limitError: 'Batch mode allows up to {limit} non-empty lines'
};