import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../store/toast';

export function useTool() {
  const { t } = useI18n();
  const toast = useToastStore();
  
  const input = ref('');
  const output = ref('');
  const error = ref('');

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

  return {
    input,
    output,
    error,
    clear,
    copy,
    t
  };
}
