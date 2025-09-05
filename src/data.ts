// src/data.ts
export type CityKey = 'new_york' | 'los_angeles' | 'tokyo' | 'beijing' | 'shanghai' | 'other';

export interface CityCost {
  name: string;
  // 每月“基础生活开销(不含房租)”的估算，单位：USD
  essentialsUSD: number;
  // 常见房型的月租估算，单位：USD
  rentsUSD: {
    shared: number; // 合租/宿舍
    studio: number; // 单间/小公寓
    luxury: number; // 偏高端
  };
}

export const CITIES: Record<CityKey, CityCost> = {
  new_york: {
    name: 'New York',
    essentialsUSD: 1200,
    rentsUSD: { shared: 1200, studio: 2500, luxury: 4000 },
  },
  los_angeles: {
    name: 'Los Angeles',
    essentialsUSD: 1000,
    rentsUSD: { shared: 1000, studio: 2100, luxury: 3500 },
  },
  tokyo: {
    name: 'Tokyo',
    essentialsUSD: 900,
    rentsUSD: { shared: 800, studio: 1600, luxury: 2800 },
  },
  beijing: {
    name: 'Beijing',
    essentialsUSD: 700,
    rentsUSD: { shared: 500, studio: 1100, luxury: 2000 },
  },
  shanghai: {
    name: 'Shanghai',
    essentialsUSD: 800,
    rentsUSD: { shared: 600, studio: 1200, luxury: 2200 },
  },
  other: {
    name: 'Other (Custom)',
    essentialsUSD: 800,
    rentsUSD: { shared: 600, studio: 1200, luxury: 2200 },
  },
};

// 货币换算（静态近似，用于 MVP）
export const FX = {
  USD: 1,
  CNY: 7.2,
  JPY: 155,
};
export type Currency = keyof typeof FX;

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  CNY: '¥',
  JPY: '¥',
};
