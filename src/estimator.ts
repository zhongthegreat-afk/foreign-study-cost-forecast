// src/estimator.ts
import { CITIES, CityKey, Currency, FX } from './data';

export type Housing = 'shared' | 'studio' | 'luxury';

export interface Inputs {
  city: CityKey;
  school: string;
  housing: Housing;
  lifestyle: 1 | 2 | 3 | 4 | 5; // 1 朴素 → 5 豪华
  currency: Currency;
  custom?: {
    essentialsUSD?: number; // 自定义每月基础生活费（不含房租）
    rentUSD?: number;       // 自定义每月房租
  };
}

export interface Estimate {
  monthlyCenterUSD: number;
  monthlyMinUSD: number;
  monthlyMaxUSD: number;
  annualMin: number; // 转为目标货币后的数字
  annualMax: number; // 转为目标货币后的数字
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * 简化版算法（MVP）：
 * baseMonthlyUSD = essentials + rent
 * lifestyleFactor = 0.8,1.0,1.2,1.4,1.6（随 1~5 档线性增加）
 * monthlyCenterUSD = baseMonthlyUSD * lifestyleFactor
 * 给一个区间浮动：[-8%, +12%]
 */
export function estimateAnnualCost(i: Inputs): Estimate {
  const city = CITIES[i.city];

  const essentialsUSD =
    i.city === 'other'
      ? clamp(Number(i.custom?.essentialsUSD ?? city.essentialsUSD), 200, 5000)
      : city.essentialsUSD;

  const rentUSD =
    i.city === 'other'
      ? clamp(Number(i.custom?.rentUSD ?? 0), 0, 10000)
      : city.rentsUSD[i.housing];

  const baseMonthlyUSD = essentialsUSD + rentUSD;

  const lifestyleFactorMap = { 1: 0.8, 2: 1.0, 3: 1.2, 4: 1.4, 5: 1.6 } as const;
  const lifestyleFactor = lifestyleFactorMap[i.lifestyle];

  const monthlyCenterUSD = baseMonthlyUSD * lifestyleFactor;
  const monthlyMinUSD = monthlyCenterUSD * 0.92;
  const monthlyMaxUSD = monthlyCenterUSD * 1.12;

  const fx = FX[i.currency];
  const annualMin = monthlyMinUSD * 12 * fx;
  const annualMax = monthlyMaxUSD * 12 * fx;

  return {
    monthlyCenterUSD,
    monthlyMinUSD,
    monthlyMaxUSD,
    annualMin,
    annualMax,
  };
}

export function formatMoney(n: number, currency: Currency) {
  // 简单格式化（不依赖 Intl，以确保浏览器兼容和一致性）
  const rounded = Math.round(n);
  return `${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${currency}`;
}
