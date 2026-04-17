/**
 * Text Analysis and Transformation Utilities
 */

export interface TextStats {
  words: number;
  charsWithSpaces: number;
  charsNoSpaces: number;
  lines: number;
  sentences: number;
  readingTime: number;
}

/**
 * 统计文本各项指标
 */
export function analyzeText(content: string): TextStats {
  if (!content) {
    return { words: 0, charsWithSpaces: 0, charsNoSpaces: 0, lines: 0, sentences: 0, readingTime: 0 };
  }

  // 单词/字数统计 (支持中英文混排)
  const enWords = content.match(/[a-zA-Z0-9']+/g) || [];
  const cjkChars = content.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || [];
  const words = enWords.length + cjkChars.length;

  const charsWithSpaces = content.length;
  const charsNoSpaces = content.replace(/\s/g, '').length;
  const lines = content.split('\n').length;
  
  // 句子统计 (匹配 . ! ? 以及中文的 。 ！ ？)
  const sentences = content.match(/[^.!?。！？]+[.!?。！？]+/g) || [];
  
  // 阅读时长 (基于 200 词/分钟)
  const readingTime = Math.ceil(words / 200);

  return { 
    words, 
    charsWithSpaces, 
    charsNoSpaces, 
    lines, 
    sentences: sentences.length, 
    readingTime 
  };
}
