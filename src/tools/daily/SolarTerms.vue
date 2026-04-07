<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Lunar, Solar } from 'lunar-javascript';
import { ChevronLeft, ChevronRight, Info, Calendar } from 'lucide-vue-next';

const { t } = useI18n();

const currentYear = ref(new Date().getFullYear());
const now = new Date();

const termMap: Record<string, string> = {
  '立春': 'LI_CHUN', '雨水': 'YU_SHUI', '惊蛰': 'JING_ZHE', '春分': 'CHUN_FEN',
  '清明': 'QING_MING', '谷雨': 'GU_YU', '立夏': 'LI_XIA', '小满': 'XIAO_MAN',
  '芒种': 'MANG_ZHONG', '夏至': 'XIA_ZHI', '小暑': 'XIAO_SHU', '大暑': 'DA_SHU',
  '立秋': 'LI_QIU', '处暑': 'CHU_SHU', '白露': 'BAI_LU', '秋分': 'QIU_FEN',
  '寒露': 'HAN_LU', '霜降': 'SHUANG_JIANG', '立冬': 'LI_DONG', '小雪': 'XIAO_XUE',
  '大雪': 'DA_XUE', '冬至': 'DONG_ZHI', '小寒': 'XIAO_HAN', '大寒': 'DA_HAN'
};

const solarTermsList = computed(() => {
  const year = currentYear.value;
  // 通过该公历年份的首尾日期，获取对应的农历节气表
  // Solar.fromYmd 是公历，获取 1月1日 和 12月31日 永远是安全的
  const solar1 = Solar.fromYmd(year, 1, 1);
  const solar2 = Solar.fromYmd(year, 12, 31);
  
  const jq1 = solar1.getLunar().getJieQiTable();
  const jq2 = solar2.getLunar().getJieQiTable();
  
  // 合并节气表（自动去重并保留最新计算值）
  const combined = { ...jq1, ...jq2 };
  
  const list = Object.keys(combined)
    .map(name => {
      const sDate = combined[name];
      const ymd = sDate.toYmd();
      const [y, m, d] = ymd.split('-').map(Number);
      
      // 只有年份匹配当前公历年的才保留
      if (y !== year) return null;
      
      return {
        name,
        date: ymd,
        time: sDate.toYmdHms().split(' ')[1].substring(0, 5),
        fullDate: new Date(sDate.toYmdHms().replace(/-/g, '/')),
        key: termMap[name] || name
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

  // 再次确保唯一性（防止跨年期间某些节气被计入两次）
  const unique = Array.from(new Map(list.map(item => [item.name, item])).values());
  return unique.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
});

const isCurrent = (termDate: Date, nextTermDate?: Date) => {
  if (!nextTermDate) return now >= termDate;
  return now >= termDate && now < nextTermDate;
};

const getStatus = (termDate: Date, idx: number, list: any[]) => {
  const nextTerm = list[idx + 1];
  if (isCurrent(termDate, nextTerm?.fullDate)) return 'current';
  if (now < termDate && (idx === 0 || now >= list[idx - 1].fullDate)) return 'next';
  return '';
};

const changeYear = (delta: number) => {
  currentYear.value += delta;
};
</script>

<template>
  <div class="tool-container">
    <div class="workspace">
      <div class="header-controls">
        <div class="year-selector">
          <button class="icon-btn" @click="changeYear(-1)" :title="t('tools.solar-terms.prevYear')">
            <ChevronLeft :size="20" />
          </button>
          <div class="current-year">
            <Calendar :size="20" />
            <span>{{ currentYear }} {{ t('tools.solar-terms.year') }}</span>
          </div>
          <button class="icon-btn" @click="changeYear(1)" :title="t('tools.solar-terms.nextYear')">
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>

      <div class="terms-grid">
        <div 
          v-for="(item, index) in solarTermsList" 
          :key="item.name"
          class="term-card"
          :class="getStatus(item.fullDate, index, solarTermsList)"
        >
          <div class="status-badge" v-if="getStatus(item.fullDate, index, solarTermsList)">
            {{ t(`tools.solar-terms.${getStatus(item.fullDate, index, solarTermsList)}`) }}
          </div>
          <div class="term-name">{{ t(`tools.solar-terms.terms.${item.key}`) }}</div>
          <div class="term-chinese">{{ item.name }}</div>
          <div class="term-info">
            <div class="info-item">
              <span class="label">{{ t('tools.solar-terms.date') }}</span>
              <span class="value">{{ item.date }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('tools.solar-terms.time') }}</span>
              <span class="value">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tip-box">
        <Info :size="18" />
        <p>{{ t('tools.solar-terms.tips') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header-controls {
  display: flex;
  justify-content: center;
}

.year-selector {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--bg-card);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.current-year {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-color);
}

.icon-btn {
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--accent-color);
  color: white;
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.term-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  transition: all 0.3s;
}

.term-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent-color);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.term-card.current {
  border: 2px solid var(--accent-color);
  background: rgba(var(--accent-color-rgb), 0.05);
}

.term-card.next {
  border: 2px dashed var(--accent-color);
}

.status-badge {
  position: absolute;
  top: -10px;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: var(--accent-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.term-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  text-align: center;
}

.term-chinese {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.term-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.info-item .label {
  color: var(--text-tertiary);
}

.info-item .value {
  color: var(--text-primary);
  font-weight: 600;
  font-family: 'Fira Code', monospace;
}

.tip-box {
  display: flex;
  gap: 0.75rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 480px) {
  .terms-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
