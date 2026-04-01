<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../../store/toast';
import { Play, Pause, RotateCcw, Square } from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToastStore();

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const totalSeconds = ref(0);
const remainingSeconds = ref(0);
const isRunning = ref(false);
const intervalId = ref<any>(null);

const progress = computed(() => {
  if (totalSeconds.value === 0) return 0;
  return (remainingSeconds.value / totalSeconds.value) * 100;
});

const formattedTime = computed(() => {
  const h = Math.floor(remainingSeconds.value / 3600);
  const m = Math.floor((remainingSeconds.value % 3600) / 60);
  const s = remainingSeconds.value % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
});

const startTimer = () => {
  if (isRunning.value) return;
  
  if (remainingSeconds.value === 0) {
    totalSeconds.value = hours.value * 3600 + minutes.value * 60 + seconds.value;
    if (totalSeconds.value <= 0) return;
    remainingSeconds.value = totalSeconds.value;
  }
  
  isRunning.value = true;
  intervalId.value = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--;
    } else {
      stopTimer();
      toast.show(t('tools.timer.timesUp'));
      playAlarm();
    }
  }, 1000);
};

const pauseTimer = () => {
  isRunning.value = false;
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

const stopTimer = () => {
  pauseTimer();
  remainingSeconds.value = 0;
  totalSeconds.value = 0;
};

const resetTimer = () => {
  stopTimer();
  hours.value = 0;
  minutes.value = 0;
  seconds.value = 0;
};

const playAlarm = () => {
  // Simple beep or notification logic
  console.log("ALARM!");
};

onUnmounted(() => {
  if (intervalId.value) clearInterval(intervalId.value);
});
</script>

<template>
  <div class="tool-container">
    <div class="timer-card">
      <div class="timer-display">
        <div class="progress-ring">
          <svg viewBox="0 0 100 100">
            <circle class="bg" cx="50" cy="50" r="45" />
            <circle 
              class="progress" 
              cx="50" cy="50" r="45" 
              :style="{ strokeDasharray: 283, strokeDashoffset: 283 - (283 * progress / 100) }"
            />
          </svg>
          <div class="time-text">{{ formattedTime }}</div>
        </div>
      </div>

      <div v-if="!isRunning && remainingSeconds === 0" class="timer-inputs">
        <div class="input-group">
          <input type="number" v-model="hours" min="0" max="99">
          <span>{{ t('tools.timer.hours') }}</span>
        </div>
        <div class="input-group">
          <input type="number" v-model="minutes" min="0" max="59">
          <span>{{ t('tools.timer.minutes') }}</span>
        </div>
        <div class="input-group">
          <input type="number" v-model="seconds" min="0" max="59">
          <span>{{ t('tools.timer.seconds') }}</span>
        </div>
      </div>

      <div class="timer-controls">
        <button v-if="!isRunning" @click="startTimer" class="control-btn primary" :disabled="hours === 0 && minutes === 0 && seconds === 0 && remainingSeconds === 0">
          <Play :size="24" />
        </button>
        <button v-else @click="pauseTimer" class="control-btn warning">
          <Pause :size="24" />
        </button>
        <button @click="stopTimer" class="control-btn danger">
          <Square :size="24" />
        </button>
        <button @click="resetTimer" class="control-btn secondary">
          <RotateCcw :size="24" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.timer-card {
  background: var(--bg-card);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 500px;
}

.timer-display {
  position: relative;
  width: 240px;
  height: 240px;
}

.progress-ring {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-ring svg {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
}

.progress-ring circle {
  fill: none;
  stroke-width: 8;
}

.progress-ring .bg {
  stroke: var(--bg-secondary);
}

.progress-ring .progress {
  stroke: var(--accent-color);
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}

.time-text {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  z-index: 1;
}

.timer-inputs {
  display: flex;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.input-group input {
  width: 70px;
  padding: 0.75rem;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  outline: none;
}

.input-group input:focus {
  border-color: var(--accent-color);
}

.input-group span {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timer-controls {
  display: flex;
  gap: 1rem;
}

.control-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.primary { background: var(--accent-color); color: white; }
.control-btn.warning { background: #f59e0b; color: white; }
.control-btn.danger { background: #ef4444; color: white; }
.control-btn.secondary { background: var(--bg-secondary); color: var(--text-primary); }

.control-btn:hover:not(:disabled) {
  transform: scale(1.1);
  filter: brightness(1.1);
}

/* Remove arrows from number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
