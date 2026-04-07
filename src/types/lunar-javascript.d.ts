declare module 'lunar-javascript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    getLunar(): Lunar;
    toYmd(): string;
    toYmdHms(): string;
    getYear(): number;
  }

  export class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar;
    static fromSolar(solar: Solar): Lunar;
    getJieQiTable(): Record<string, Solar>;
    getJieQiList(): string[];
  }
}
