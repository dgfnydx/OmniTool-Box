/**
 * Date and Timestamp Utilities
 */

/**
 * 将时间戳转换为可读日期字符串
 * 支持秒级(10位)和毫秒级(13位)
 */
export function formatTimestamp(ts: number | string): string {
  try {
    const val = typeof ts === 'string' ? parseInt(ts) : ts;
    if (isNaN(val)) return '';
    
    // 自动识别秒级和毫秒级
    const date = new Date(val * (val.toString().length > 11 ? 1 : 1000));
    return date.toLocaleString();
  } catch (e) {
    return '';
  }
}

/**
 * 将日期字符串转换为秒级时间戳
 */
export function parseDateToTimestamp(dateStr: string): number | null {
  try {
    const date = new Date(dateStr);
    const time = date.getTime();
    if (isNaN(time)) return null;
    return Math.floor(time / 1000);
  } catch (e) {
    return null;
  }
}

/**
 * 获取当前的 ISO 格式日期字符串 (YYYY-MM-DD HH:mm:ss)
 */
export function getCurrentDateTimeString(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}
