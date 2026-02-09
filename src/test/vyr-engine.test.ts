import { describe, it, expect } from "vitest";
import { computeState, normalizeHrvMsToIndex, validateWearableData } from "../lib/vyr-engine";
import { computeBaselineFromHistory, FALLBACK_BASELINE } from "../lib/vyr-baseline";
import { DEMO_SCENARIOS } from "../lib/vyr-mock-data";
import type { WearableData } from "../lib/vyr-types";

describe("normalizeHrvMsToIndex", () => {
  it("maps low HRV ms to low index", () => {
    expect(normalizeHrvMsToIndex(20)).toBeLessThan(40);
  });

  it("maps mid HRV ms to mid index", () => {
    const idx = normalizeHrvMsToIndex(44); // J-Style real value
    expect(idx).toBeGreaterThanOrEqual(30);
    expect(idx).toBeLessThanOrEqual(70);
  });

  it("maps high HRV ms to high index", () => {
    expect(normalizeHrvMsToIndex(100)).toBeGreaterThan(70);
  });

  it("clamps extremes", () => {
    expect(normalizeHrvMsToIndex(1)).toBeGreaterThanOrEqual(0);
    expect(normalizeHrvMsToIndex(500)).toBeLessThanOrEqual(100);
  });
});

describe("validateWearableData", () => {
  it("clamps out-of-range values", () => {
    const bad: WearableData = {
      date: "2026-02-09", rhr: -5, hrvIndex: 999, sleepDuration: 20,
      sleepQuality: 150, sleepRegularity: 200, awakenings: 50,
      previousDayActivity: "medium", stressScore: -10, spo2: 110, bodyTemperature: 50,
    };
    const valid = validateWearableData(bad);
    expect(valid.rhr).toBe(35);
    expect(valid.hrvIndex).toBe(100);
    expect(valid.sleepDuration).toBe(14);
    expect(valid.spo2).toBe(100);
    expect(valid.bodyTemperature).toBe(42);
    expect(valid.stressScore).toBe(0);
  });
});

describe("computeState with J-Style real data", () => {
  it("produces valid score for jstyleReal scenario", () => {
    const { wearableData } = DEMO_SCENARIOS.jstyleReal;
    const state = computeState(wearableData as WearableData);
    
    expect(state.vyrScore).toBeGreaterThanOrEqual(0);
    expect(state.vyrScore).toBeLessThanOrEqual(100);
    expect(state.pillars.energia).toBeGreaterThanOrEqual(1);
    expect(state.pillars.energia).toBeLessThanOrEqual(5);
    expect(state.pillars.clareza).toBeGreaterThanOrEqual(1);
    expect(state.pillars.clareza).toBeLessThanOrEqual(5);
    expect(state.pillars.estabilidade).toBeGreaterThanOrEqual(1);
    expect(state.pillars.estabilidade).toBeLessThanOrEqual(5);
    expect(state.stateLabel).toBeTruthy();
    expect(state.recommendedAction).toMatch(/BOOT|HOLD|CLEAR/);
  });

  it("high performance scenario scores higher than recovery", () => {
    const high = computeState(DEMO_SCENARIOS.highPerformance.wearableData as WearableData);
    const recovery = computeState(DEMO_SCENARIOS.recovery.wearableData as WearableData);
    
    expect(high.vyrScore).toBeGreaterThan(recovery.vyrScore);
  });

  it("uses hrvRawMs when hrvIndex is 0", () => {
    const data = DEMO_SCENARIOS.jstyleReal.wearableData as WearableData;
    expect(data.hrvIndex).toBe(0);
    expect(data.hrvRawMs).toBe(44);
    
    const state = computeState(data);
    // Should not produce degenerate results from hrvIndex=0
    expect(state.pillars.estabilidade).toBeGreaterThan(1);
  });
});

describe("computeBaselineFromHistory", () => {
  it("returns fallback with insufficient data", () => {
    const bl = computeBaselineFromHistory([]);
    expect(bl.daysUsed).toBe(0);
    expect(bl.rhr.mean).toBe(FALLBACK_BASELINE.rhr.mean);
  });

  it("computes baseline with spo2 and temperature", () => {
    const data: WearableData[] = Array.from({ length: 7 }, (_, i) => ({
      date: `2026-02-0${i + 1}`,
      rhr: 65 + i, hrvIndex: 50, sleepDuration: 7, sleepQuality: 70,
      sleepRegularity: 10, awakenings: 2, previousDayActivity: "medium" as const,
      stressScore: 40, spo2: 97 + (i % 3), bodyTemperature: 36.5 + i * 0.1,
    }));
    const bl = computeBaselineFromHistory(data);
    expect(bl.daysUsed).toBe(7);
    expect(bl.spo2.mean).toBeGreaterThan(96);
    expect(bl.bodyTemperature.mean).toBeGreaterThan(36);
  });
});
