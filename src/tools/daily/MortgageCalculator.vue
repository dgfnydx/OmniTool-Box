<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { DollarSign, JapaneseYen, Calendar, Percent, CreditCard, Layers } from 'lucide-vue-next';

const { t, locale } = useI18n();

const loanType = ref<'commercial' | 'fund' | 'combination'>('commercial');
const loanAmount = ref<number>(1000000);
const fundAmount = ref<number>(500000);
const loanYears = ref<number>(30);
const annualRate = ref<number>(3.85);
const fundRate = ref<number>(2.85);
const repaymentMethod = ref<'equalLoan' | 'equalPrincipal'>('equalLoan');

const calculatePart = (P: number, rate: number, years: number, method: 'equalLoan' | 'equalPrincipal') => {
  const i = rate / 100 / 12;
  const n = years * 12;
  
  if (P <= 0) return { monthly: 0, interest: 0, total: 0, first: 0, decrease: 0 };

  if (method === 'equalLoan') {
    const monthly = i === 0 ? P / n : (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = monthly * n;
    return { monthly, interest: total - P, total, first: monthly, decrease: 0 };
  } else {
    const monthlyPrincipal = P / n;
    const first = monthlyPrincipal + P * i;
    const last = monthlyPrincipal + (P - (n - 1) * monthlyPrincipal) * i;
    const total = (first + last) * n / 2;
    const decrease = (P / n) * i;
    return { monthly: first, interest: total - P, total, first, decrease };
  }
};

const results = computed(() => {
  let mainPart = { monthly: 0, interest: 0, total: 0, first: 0, decrease: 0 };
  let fundPart = { monthly: 0, interest: 0, total: 0, first: 0, decrease: 0 };

  if (loanType.value === 'commercial') {
    mainPart = calculatePart(loanAmount.value, annualRate.value, loanYears.value, repaymentMethod.value);
  } else if (loanType.value === 'fund') {
    mainPart = calculatePart(loanAmount.value, fundRate.value, loanYears.value, repaymentMethod.value);
  } else {
    mainPart = calculatePart(loanAmount.value, annualRate.value, loanYears.value, repaymentMethod.value);
    fundPart = calculatePart(fundAmount.value, fundRate.value, loanYears.value, repaymentMethod.value);
  }

  const totalLoan = loanType.value === 'combination' ? (loanAmount.value + fundAmount.value) : loanAmount.value;

  return {
    monthlyPayment: mainPart.monthly + fundPart.monthly,
    firstMonth: mainPart.first + fundPart.first,
    decreasePerMonth: mainPart.decrease + fundPart.decrease,
    totalInterest: mainPart.interest + fundPart.interest,
    totalRepayment: mainPart.total + fundPart.total,
    totalLoan,
    mainPart,
    fundPart,
    isEqualLoan: repaymentMethod.value === 'equalLoan'
  };
});

const formatCurrency = (val: number) => {
  const currency = locale.value === 'zh' ? 'CNY' : 'USD';
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(val);
};
</script>

<template>
  <div class="tool-container">
    <div class="calculator-grid">
      <!-- Input Section -->
      <div class="card input-card">
        <!-- Loan Type Selector -->
        <div class="input-group">
          <label><Layers :size="16" /> {{ t('tools.mortgage-calculator.loanType') }}</label>
          <div class="radio-group tabs">
            <button :class="{ active: loanType === 'commercial' }" @click="loanType = 'commercial'">
              {{ t('tools.mortgage-calculator.commercial') }}
            </button>
            <button :class="{ active: loanType === 'fund' }" @click="loanType = 'fund'">
              {{ t('tools.mortgage-calculator.fund') }}
            </button>
            <button :class="{ active: loanType === 'combination' }" @click="loanType = 'combination'">
              {{ t('tools.mortgage-calculator.combination') }}
            </button>
          </div>
        </div>

        <!-- Amounts -->
        <div class="input-group">
          <label>
            <JapaneseYen v-if="locale === 'zh'" :size="16" />
            <DollarSign v-else :size="16" />
            {{ loanType === 'combination' ? t('tools.mortgage-calculator.commercialAmount') : t('tools.mortgage-calculator.loanAmount') }}
          </label>
          <div class="input-with-unit">
            <input type="number" v-model.number="loanAmount" step="10000" />
            <span class="unit">{{ locale === 'zh' ? '元' : '' }}</span>
          </div>
        </div>

        <div v-if="loanType === 'combination'" class="input-group animate-in">
          <label>
            <JapaneseYen v-if="locale === 'zh'" :size="16" />
            <DollarSign v-else :size="16" />
            {{ t('tools.mortgage-calculator.fundAmount') }}
          </label>
          <div class="input-with-unit">
            <input type="number" v-model.number="fundAmount" step="10000" />
            <span class="unit">{{ locale === 'zh' ? '元' : '' }}</span>
          </div>
        </div>

        <!-- Rates & Term -->
        <div class="options-row">
          <div class="input-group">
            <label><Calendar :size="16" /> {{ t('tools.mortgage-calculator.loanTerm') }}</label>
            <div class="input-with-unit small">
              <input type="number" v-model.number="loanYears" min="1" max="50" />
              <span class="unit">{{ t('tools.roi-calculator.years') }}</span>
            </div>
          </div>

          <div v-if="loanType !== 'fund'" class="input-group">
            <label><Percent :size="16" /> {{ loanType === 'combination' ? t('tools.mortgage-calculator.commercialRate') : t('tools.mortgage-calculator.interestRate') }}</label>
            <div class="input-with-unit small">
              <input type="number" v-model.number="annualRate" step="0.01" />
              <span class="unit">%</span>
            </div>
          </div>

          <div v-if="loanType !== 'commercial'" class="input-group animate-in">
            <label><Percent :size="16" /> {{ loanType === 'combination' ? t('tools.mortgage-calculator.fundRate') : t('tools.mortgage-calculator.interestRate') }}</label>
            <div class="input-with-unit small">
              <input type="number" v-model.number="fundRate" step="0.01" />
              <span class="unit">%</span>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label><CreditCard :size="16" /> {{ t('tools.mortgage-calculator.repaymentMethod') }}</label>
          <div class="radio-group">
            <button :class="{ active: repaymentMethod === 'equalLoan' }" @click="repaymentMethod = 'equalLoan'">
              {{ t('tools.mortgage-calculator.equalLoan') }}
            </button>
            <button :class="{ active: repaymentMethod === 'equalPrincipal' }" @click="repaymentMethod = 'equalPrincipal'">
              {{ t('tools.mortgage-calculator.equalPrincipal') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Result Section -->
      <div class="card result-card">
        <div class="main-stats">
          <div v-if="results.isEqualLoan" class="stat-box">
            <span class="stat-label">{{ t('tools.mortgage-calculator.monthlyPayment') }}</span>
            <span class="stat-value highlight">{{ formatCurrency(results.monthlyPayment!) }}</span>
            <!-- Breakdown for Combination -->
            <div v-if="loanType === 'combination'" class="breakdown-mini animate-in">
              <span>{{ t('tools.mortgage-calculator.commercialPart') }}: {{ formatCurrency(results.mainPart.monthly) }}</span>
              <span class="plus">+</span>
              <span>{{ t('tools.mortgage-calculator.fundPart') }}: {{ formatCurrency(results.fundPart.monthly) }}</span>
            </div>
          </div>
          <div v-else class="stat-box-grid">
            <div class="stat-sub-box">
              <span class="stat-label">{{ t('tools.mortgage-calculator.firstMonth') }}</span>
              <span class="stat-value small">{{ formatCurrency(results.firstMonth!) }}</span>
              <!-- Breakdown for Combination -->
              <div v-if="loanType === 'combination'" class="breakdown-mini animate-in">
                <span>{{ formatCurrency(results.mainPart.first) }} + {{ formatCurrency(results.fundPart.first) }}</span>
              </div>
            </div>
            <div class="stat-sub-box">
              <span class="stat-label">{{ t('tools.mortgage-calculator.decreasePerMonth') }}</span>
              <span class="stat-value small text-decrease">{{ formatCurrency(results.decreasePerMonth!) }}</span>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="secondary-stats">
          <div class="stat-item">
            <div class="label-group">
              <div class="dot interest"></div>
              <div class="label-with-breakdown">
                <span>{{ t('tools.mortgage-calculator.totalInterest') }}</span>
                <div v-if="loanType === 'combination'" class="sub-text animate-in">
                  ({{ t('tools.mortgage-calculator.commercial') }}: {{ formatCurrency(results.mainPart.interest) }} / {{ t('tools.mortgage-calculator.fund') }}: {{ formatCurrency(results.fundPart.interest) }})
                </div>
              </div>
            </div>
            <span class="value">{{ formatCurrency(results.totalInterest) }}</span>
          </div>
          <div class="stat-item">
            <div class="label-group"><div class="dot principal"></div><span>{{ t('tools.mortgage-calculator.loanAmount') }}</span></div>
            <span class="value">{{ formatCurrency(results.totalLoan) }}</span>
          </div>
          <div class="stat-item total">
            <span>{{ t('tools.mortgage-calculator.totalRepayment') }}</span>
            <span class="value">{{ formatCurrency(results.totalRepayment) }}</span>
          </div>
        </div>

        <div class="visual-bar">
          <div class="bar principal" :style="{ width: (results.totalLoan / results.totalRepayment * 100) + '%' }"></div>
          <div class="bar interest" :style="{ width: (results.totalInterest / results.totalRepayment * 100) + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="info-card">
      <p>💡 <b>{{ repaymentMethod === 'equalLoan' ? t('tools.mortgage-calculator.equalLoan') : t('tools.mortgage-calculator.equalPrincipal') }}:</b> 
        {{ repaymentMethod === 'equalLoan' ? 
          (locale === 'zh' ? '每月偿还同等数额的贷款(包括本金和利息)，适合收入稳定的家庭。' : 'Repay the same amount of loan (including principal and interest) every month.') : 
          (locale === 'zh' ? '每月偿还同等数额的本金，利息随本金逐月递减，初期还款压力大，但总利息较少。' : 'Repay the same amount of principal every month, interest decreases over time.') 
        }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.tool-container { max-width: 1100px; margin: 0 auto; }
.calculator-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
.card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 2rem; box-shadow: var(--card-shadow); }
.input-card { display: flex; flex-direction: column; gap: 1.25rem; }
.input-group { display: flex; flex-direction: column; gap: 0.6rem; }
.input-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; }
.options-row { display: grid; grid-template-columns: 1fr 1.2fr 1.2fr; gap: 1rem; }
.input-with-unit { display: flex; align-items: center; position: relative; }
.input-with-unit input { width: 100%; padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 1.1rem; font-weight: 600; outline: none; transition: all 0.2s; }
.input-with-unit .unit { position: absolute; right: 1rem; font-size: 0.8rem; color: var(--text-muted); }
.input-with-unit.small input { padding-right: 2.5rem; }
.radio-group { display: flex; background: var(--bg-secondary); padding: 4px; border-radius: 10px; border: 1px solid var(--border-color); }
.radio-group button { flex: 1; padding: 0.5rem; border: none; background: transparent; color: var(--text-secondary); border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; }
.radio-group button.active { background: var(--bg-card); color: var(--accent-color); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.tabs button { padding: 0.75rem; }
.result-card { display: flex; flex-direction: column; }
.main-stats { padding: 1rem 0; text-align: center; display: flex; flex-direction: column; align-items: center; }
.stat-label { font-size: 0.9rem; color: var(--text-muted); font-weight: 600; }
.stat-value { font-size: 2.75rem; font-weight: 800; color: var(--text-primary); }
.stat-value.highlight { color: var(--accent-color); }
.stat-value.small { font-size: 1.5rem; }
.stat-box-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%; }
.breakdown-mini { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem; font-weight: 500; }
.plus { color: var(--text-muted); }
.label-with-breakdown { display: flex; flex-direction: column; }
.label-with-breakdown .sub-text { font-size: 0.7rem; color: var(--text-muted); font-weight: normal; margin-top: 2px; }
.text-decrease { color: #22c55e; }
.divider { height: 1px; background: var(--border-color); margin: 1.5rem 0; }
.secondary-stats { display: flex; flex-direction: column; gap: 0.8rem; }
.stat-item { display: flex; justify-content: space-between; align-items: center; }
.label-group { display: flex; align-items: center; gap: 0.6rem; color: var(--text-secondary); font-weight: 600; font-size: 0.95rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot.interest { background: #f59e0b; }
.dot.principal { background: var(--accent-color); }
.stat-item.total { margin-top: 0.5rem; padding-top: 1rem; border-top: 1px dashed var(--border-color); font-weight: 800; font-size: 1.1rem; }
.visual-bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; margin-top: 2rem; background: var(--bg-secondary); }
.bar.principal { background: var(--accent-color); }
.bar.interest { background: #f59e0b; }
.info-card { padding: 1.25rem; background: var(--bg-secondary); border-radius: 12px; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-top: 1.5rem; }
.animate-in { animation: slideDown 0.3s ease-out; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 900px) {
  .calculator-grid { grid-template-columns: 1fr; }
  .options-row { grid-template-columns: 1fr; }
}
</style>
