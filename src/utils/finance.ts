/**
 * Finance and Mortgage Utilities
 */

export interface RepaymentResult {
  monthly: number;
  interest: number;
  total: number;
  first: number;
  decrease: number;
}

/**
 * 计算还款数据
 * @param P 本金
 * @param rate 年利率 (%)
 * @param years 期限 (年)
 * @param method 还款方式
 */
export function calculateRepayment(
  P: number, 
  rate: number, 
  years: number, 
  method: 'equalLoan' | 'equalPrincipal'
): RepaymentResult {
  const i = rate / 100 / 12; // 月利率
  const n = years * 12;      // 总月份
  
  if (P <= 0 || n <= 0) return { monthly: 0, interest: 0, total: 0, first: 0, decrease: 0 };

  if (method === 'equalLoan') {
    // 等额本息
    const monthly = i === 0 ? P / n : (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = monthly * n;
    return { 
      monthly, 
      interest: total - P, 
      total, 
      first: monthly, 
      decrease: 0 
    };
  } else {
    // 等额本金
    const monthlyPrincipal = P / n;
    const first = monthlyPrincipal + P * i;
    const last = monthlyPrincipal + (P - (n - 1) * monthlyPrincipal) * i;
    const total = (first + last) * n / 2;
    const decrease = (P / n) * i;
    return { 
      monthly: first, 
      interest: total - P, 
      total, 
      first, 
      decrease 
    };
  }
}
