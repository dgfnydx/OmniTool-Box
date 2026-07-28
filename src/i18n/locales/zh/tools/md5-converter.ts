export default {
  name: 'MD5 哈希生成器',
  description: '为任意文本生成 MD5 哈希值。',
  input: '源文本',
  output: 'MD5 哈希值',
  hash: '生成哈希',
  singleMode: '单个',
  batchMode: '批量',
  inputPlaceholder: '输入要哈希的文本...',
  batchPlaceholder: '每行输入一个文本（最多1000行）...',
  outputPlaceholder: 'MD5 哈希值将在此显示...',
  hashError: '哈希错误',
  limitError: '批量模式最多支持 {limit} 行非空文本'
};