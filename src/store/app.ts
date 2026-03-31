import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useAppStore = defineStore('app', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark');

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  watch(isDark, (val) => {
    localStorage.setItem('theme', val ? 'dark' : 'light');
    if (val) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, { immediate: true });

  return { isDark, toggleTheme };
});
