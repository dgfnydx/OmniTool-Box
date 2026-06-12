import { ref, onMounted, onUnmounted } from 'vue';

export function useCurrentTime(interval = 1000) {
  const currentTimestamp = ref(Math.floor(Date.now() / 1000));
  const currentDateTime = ref(new Date().toLocaleString());
  let intervalId: any = null;

  const update = () => {
    const now = Date.now();
    currentTimestamp.value = Math.floor(now / 1000);
    currentDateTime.value = new Date(now).toLocaleString();
  };

  onMounted(() => {
    update();
    intervalId = setInterval(update, interval);
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return {
    currentTimestamp,
    currentDateTime
  };
}
