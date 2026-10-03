import { describe, it, expect } from "vitest";
import { calculateRevenueSplit, SERVICE_DEPARTMENTS } from "../mockData";
import { REGIONAL_MARKET_PRICING } from "../../lib/currencyLanguageStore";

function parsePriceToNumber(price: string): number {
  return Number(price.replace(/[^0-9.]/g, ""));
}

describe("calculateRevenueSplit", () => {
  it("splits 45% admin / 15% PM / 40% talent and the parts sum to the total", () => {
    const result = calculateRevenueSplit(1000000, 1000);
    expect(result.adminMarginPercent).toBe(45);
    expect(result.pmFeePercent).toBe(15);
    expect(result.talentPoolPercent).toBe(40);

    // Rounding can introduce at most a few units of drift per currency; the
    // three shares should still reconstruct ~100% of the total.
    const reconstructedNGN = result.adminMarginNGN + result.pmFeeNGN + result.talentPoolNGN;
    expect(Math.abs(reconstructedNGN - 1000000)).toBeLessThanOrEqual(3);
  });

  it("only includes hybrid payout fields when isHybridPMTalent is true", () => {
    const normal = calculateRevenueSplit(1000000, 1000, false);
    expect(normal.hybridTotalPayoutNGN).toBeUndefined();
    expect(normal.hybridTotalPayoutUSD).toBeUndefined();

    const hybrid = calculateRevenueSplit(1000000, 1000, true);
    expect(hybrid.hybridTotalPayoutNGN).toBe(hybrid.pmFeeNGN + hybrid.talentPoolNGN);
    expect(hybrid.hybridTotalPayoutUSD).toBe(hybrid.pmFeeUSD + hybrid.talentPoolUSD);
  });
});

describe("SERVICE_DEPARTMENTS", () => {
  it("has a unique id for every department (no duplicate/contradicting department-count data)", () => {
    const ids = SERVICE_DEPARTMENTS.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every department/currency has starter <= growth <= enterprise pricing (no inverted tiers)", () => {
    for (const currency of Object.keys(
      REGIONAL_MARKET_PRICING,
    ) as (keyof typeof REGIONAL_MARKET_PRICING)[]) {
      const table = REGIONAL_MARKET_PRICING[currency];
      for (const dept of SERVICE_DEPARTMENTS) {
        const pricing = table[dept.id];
        if (!pricing) continue; // missing coverage is a separate content-quality issue
        const starter = parsePriceToNumber(pricing.starter);
        const growth = parsePriceToNumber(pricing.growth);
        const enterprise = parsePriceToNumber(pricing.enterprise);
        expect(starter).toBeLessThanOrEqual(growth);
        expect(growth).toBeLessThanOrEqual(enterprise);
      }
    }
  });

  it("every declared department has pricing coverage in every supported currency", () => {
    const missing: string[] = [];
    for (const currency of Object.keys(
      REGIONAL_MARKET_PRICING,
    ) as (keyof typeof REGIONAL_MARKET_PRICING)[]) {
      const table = REGIONAL_MARKET_PRICING[currency];
      for (const dept of SERVICE_DEPARTMENTS) {
        if (!table[dept.id]) missing.push(`${currency}/${dept.id}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
