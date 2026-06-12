<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTool } from '../../composables/useTool';
import { calculateRepayment, type RepaymentResult } from '../../utils/finance';
import ToolLayout from '../../components/common/ToolLayout.vue';
import { DollarSign, JapaneseYen, Calendar, Percent, CreditCard, Layers } from 'lucide-vue-next';

const { t, locale } = useTool();

const loanType = ref<'commercial' | 'fund' | 'combination'>('commercial');
const loanAmount = ref<number>(1000000);
const fundAmount = ref<number>(500000);
const loanYears = ref<number>(30);
const annualRate = ref<number>(3.85);
const fundRate = ref<number>(2.85);
const repaymentMethod = ref<'equalLoan' | 'equalPrincipal'>('equalLoan');

const results = computed(() => {
  let mainPart: RepaymentResult = { monthly: 0, interest: 0, total: 0, first: 0, decrease: 0 };
  let fundPart: RepaymentResult = { monthly: 0, interest: 0, total: 0, first: 0, decrease: 0 };

  if (loanType.value === 'commercial') {
    mainPart = calculateRepayment(loanAmount.value, annualRate.value, loanYears.value, repaymentMethod.value);
  } else if (loanType.value === 'fund') {
    mainPart = calculateRepayment(loanAmount.value, fundRate.value, loanYears.value, repaymentMethod.value);
  } else {
    mainPart = calculateRepayment(loanAmount.value, annualRate.value, loanYears.value, repaymentMethod.value);
    fundPart = calculateRepayment(fundAmount.value, fundRate.value, loanYears.value, repaymentMethod.value);
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
  const currentLocale = locale?.value || 'zh';
  const currency = currentLocale === 'zh' ? 'CNY' : 'USD';
  try {
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(val || 0);
  } catch (e) {
    return (val || 0).toString();
  }
};

const clearForm = () => {
  loanAmount.value = 1000000;
  fundAmount.value = 500000;
  loanYears.value = 30;
  annualRate.value = 3.85;
  fundRate.value = 2.85;
};
</script>

<template>
  <div class="tool-container">
    <ToolLayout
      :input-label="t('tools.mortgage-calculator.loanAmount')"
      :output-label="t('tools.mortgage-calculator.totalRepayment')"
      @clear="clearForm"
    >
      <template #input>
        <div class="form-container">
          <!-- Loan Type -->
          <div class="form-group">
            <label class="form-label"><Layers :size="14" /> {{ t('tools.mortgage-calculator.loanType') }}</label>
            <div class="pill-group">
              <button v-for="type in ['commercial', 'fund', 'combination']" :key="type" 
                :class="{ active: loanType === type }" @click="loanType = type as any">
                {{ t(`tools.mortgage-calculator.${type}`) }}
              </button>
            </div>
          </div>

          <!-- Principal -->
          <div class="form-group">
            <label class="form-label">
              <JapaneseYen v-if="locale === 'zh'" :size="14" />
              <DollarSign v-else :size="14" />
              {{ loanType === 'combination' ? t('tools.mortgage-calculator.commercialAmount') : t('tools.mortgage-calculator.loanAmount') }}
            </label>
            <div class="input-unit-wrapper">
              <input type="number" v-model.number="loanAmount" class="tool-input" />
              <span class="unit-text">{{ locale === 'zh' ? '元' : '' }}</span>
            </div>
          </div>

          <div v-if="loanType === 'combination'" class="form-group animate-in">
            <label class="form-label"><JapaneseYen :size="14" /> {{ t('tools.mortgage-calculator.fundAmount') }}</label>
            <div class="input-unit-wrapper">
              <input type="number" v-model.number="fundAmount" class="tool-input" />
              <span class="unit-text">{{ locale === 'zh' ? '元' : '' }}</span>
            </div>
          </div>

          <!-- Term and Rates -->
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label"><Calendar :size="14" /> {{ t('tools.mortgage-calculator.loanTerm') }}</label>
              <div class="input-unit-wrapper">
                <input type="number" v-model.number="loanYears" class="tool-input" />
                <span class="unit-text">{{ t('tools.roi-calculator.years') }}</span>
              </div>
            </div>

            <div v-if="loanType !== 'fund'" class="form-group">
              <label class="form-label"><Percent :size="14" /> {{ loanType === 'combination' ? t('tools.mortgage-calculator.commercialRate') : t('tools.mortgage-calculator.interestRate') }}</label>
              <div class="input-unit-wrapper">
                <input type="number" v-model.number="annualRate" step="0.01" class="tool-input" />
                <span class="unit-text">%</span>
              </div>
            </div>

            <div v-if="loanType !== 'commercial'" class="form-group animate-in">
              <label class="form-label"><Percent :size="14" /> {{ loanType === 'combination' ? t('tools.mortgage-calculator.fundRate') : t('tools.mortgage-calculator.interestRate') }}</label>
              <div class="input-unit-wrapper">
                <input type="number" v-model.number="fundRate" step="0.01" class="tool-input" />
                <span class="unit-text">%</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"><CreditCard :size="14" /> {{ t('tools.mortgage-calculator.repaymentMethod') }}</label>
            <div class="pill-group">
              <button v-for="method in ['equalLoan', 'equalPrincipal']" :key="method"
                :class="{ active: repaymentMethod === method }" @click="repaymentMethod = method as any">
                {{ t(`tools.mortgage-calculator.${method}`) }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <template #output>
        <div class="results-container">
          <!-- Main Payment Display -->
          <div class="main-payment-box">
            <template v-if="results.isEqualLoan">
              <div class="payment-label">{{ t('tools.mortgage-calculator.monthlyPayment') }}</div>
              <div class="payment-amount">{{ formatCurrency(results.monthlyPayment) }}</div>
            </template>
            <template v-else>
              <div class="payment-dual">
                <div class="payment-item">
                  <div class="payment-label">{{ t('tools.mortgage-calculator.firstMonth') }}</div>
                  <div class="payment-amount small">{{ formatCurrency(results.firstMonth) }}</div>
                </div>
                <div class="payment-item">
                  <div class="payment-label">{{ t('tools.mortgage-calculator.decreasePerMonth') }}</div>
                  <div class="payment-amount small decrease">{{ formatCurrency(results.decreasePerMonth) }}</div>
                </div>
              </div>
            </template>

            <!-- Combination Breakdown -->
            <div v-if="loanType === 'combination'" class="combination-breakdown animate-in">
              <span>{{ t('tools.mortgage-calculator.commercialPart') }}: {{ formatCurrency(results.mainPart.first) }}</span>
              <span class="plus">+</span>
              <span>{{ t('tools.mortgage-calculator.fundPart') }}: {{ formatCurrency(results.fundPart.first) }}</span>
            </div>
          </div>

          <!-- Secondary Stats -->
          <div class="stats-list">
            <div class="stat-row">
              <span class="stat-name"><i class="dot interest"></i> {{ t('tools.mortgage-calculator.totalInterest') }}</span>
              <span class="stat-val">{{ formatCurrency(results.totalInterest) }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name"><i class="dot principal"></i> {{ t('tools.mortgage-calculator.loanAmount') }}</span>
              <span class="stat-val">{{ formatCurrency(results.totalLoan) }}</span>
            </div>
            <div class="stat-row total-repayment">
              <span class="stat-name">{{ t('tools.mortgage-calculator.totalRepayment') }}</span>
              <span class="stat-val">{{ formatCurrency(results.totalRepayment) }}</span>
            </div>
          </div>

          <!-- Visualization -->
          <div class="progress-bar">
            <div class="bar-part principal" :style="{ width: (results.totalLoan / results.totalRepayment * 100) + '%' }"></div>
            <div class="bar-part interest" :style="{ width: (results.totalInterest / results.totalRepayment * 100) + '%' }"></div>
          </div>
        </div>
      </template>
    </ToolLayout>

    <div class="info-tip">
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
.form-container { display: flex; flex-direction: column; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); display: flex; align-items: center; gap: 0.4rem; text-transform: uppercase; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.pill-group { display: flex; background: var(--bg-secondary); padding: 4px; border-radius: 8px; border: 1px solid var(--border-color); }
.pill-group button { flex: 1; padding: 0.5rem; border: none; background: transparent; color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; cursor: pointer; border-radius: 6px; transition: all 0.2s; }
.pill-group button.active { background: var(--bg-card); color: var(--accent-color); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

.input-unit-wrapper { position: relative; }
.unit-text { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); font-size: 0.8rem; color: var(--text-muted); }

.tool-input { width: 100%; height: 42px; padding: 0 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 1rem; font-weight: 600; outline: none; transition: border-color 0.2s; }
.tool-input:focus { border-color: var(--accent-color); }

.results-container { display: flex; flex-direction: column; gap: 1.5rem; padding: 0.5rem; }
.main-payment-box { text-align: center; padding: 1.5rem; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color); }
.payment-label { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.25rem; }
.payment-amount { font-size: 2.25rem; font-weight: 800; color: var(--accent-color); }
.payment-amount.small { font-size: 1.5rem; }
.payment-amount.decrease { color: #22c55e; }
.payment-dual { display: flex; justify-content: space-around; }

.combination-breakdown { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.75rem; font-weight: 500; }
.plus { color: var(--text-muted); }

.stats-list { display: flex; flex-direction: column; gap: 0.75rem; }
.stat-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); }
.stat-val { color: var(--text-primary); }
.total-repayment { margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-color); font-size: 1rem; color: var(--text-primary); }

.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 0.4rem; }
.dot.interest { background: #f59e0b; }
.dot.principal { background: var(--accent-color); }

.progress-bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; background: var(--bg-secondary); margin-top: 0.5rem; }
.bar-part.principal { background: var(--accent-color); }
.bar-part.interest { background: #f59e0b; }

.info-tip { margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: 10px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

.animate-in { animation: slideDown 0.3s ease-out; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
