export default {
  name: 'SHA256 Hash Generator',
  description: 'Generate SHA256 hash for any text.',
  input: 'Source Text',
  output: 'SHA256 Hash',
  hash: 'Generate Hash',
  singleMode: 'Single',
  batchMode: 'Batch',
  inputPlaceholder: 'Enter text to hash...',
  batchPlaceholder: 'Enter one text per line (max 1000 lines)...',
  outputPlaceholder: 'SHA256 hash will appear here...',
  hashError: 'Hashing error',
  limitError: 'Batch mode allows up to {limit} non-empty lines'
};