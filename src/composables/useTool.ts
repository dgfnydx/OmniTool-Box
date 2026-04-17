import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../store/toast';

export function useTool() {
  const { t, locale } = useI18n();
  const toast = useToastStore();
  
  const input = ref('');
  const output = ref('');
  const error = ref('');
  const isLoading = ref(false);

  const clear = () => {
    input.value = '';
    output.value = '';
    error.value = '';
  };

  const copy = (text?: string) => {
    const targetText = text || output.value;
    if (targetText) {
      navigator.clipboard.writeText(targetText);
      toast.show(t('common.actions.copied'));
    }
  };

  /**
   * 尝试执行一个操作，自动处理错误捕获和加载状态
   * @param fn 要执行的异步或同步函数
   * @param errorPrefixKey i18n 错误消息前缀的 key
   */
  const tryExecute = async (fn: () => void | Promise<void>, errorPrefixKey?: string) => {
    try {
      error.value = '';
      isLoading.value = true;
      await fn();
    } catch (e: any) {
      console.error(e);
      const prefix = errorPrefixKey ? t(errorPrefixKey) + ': ' : '';
      error.value = prefix + e.message;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    input,
    output,
    error,
    isLoading,
    clear,
    copy,
    tryExecute,
    t,
    locale
  };
}
