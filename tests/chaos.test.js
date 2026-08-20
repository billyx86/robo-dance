import { describe, it, expect } from "vitest";
import {
  clampChaos,
  chaosLabel,
  parseStoredChaos,
  DEFAULT_CHAOS,
  CHAOS_NAMES,
} from "../lib/chaos.js";

describe("clampChaos", () => {
  it("passes normal values through", () => {
    expect(clampChaos(0)).toBe(0);
    expect(clampChaos(50)).toBe(50);
    expect(clampChaos(100)).toBe(100);
    expect(clampChaos(12.5)).toBe(12.5);
  });

  it("clamps to [0, 100]", () => {
    expect(clampChaos(-5)).toBe(0);
    expect(clampChaos(101)).toBe(100);
    expect(clampChaos(-Infinity)).toBe(0);
    expect(clampChaos(Infinity)).toBe(100);
  });

  it("treats NaN and non-numbers as 0 (issue #1)", () => {
    expect(clampChaos(NaN)).toBe(0);
    expect(clampChaos("42")).toBe(0);
    expect(clampChaos(null)).toBe(0);
    expect(clampChaos(undefined)).toBe(0);
    expect(clampChaos({})).toBe(0);
  });
});

describe("chaosLabel", () => {
  it("returns the label for each threshold", () => {
    expect(chaosLabel(0)).toBe(CHAOS_NAMES[0][1]);
    for (const [threshold, label] of CHAOS_NAMES) {
      expect(chaosLabel(threshold)).toBe(label);
    }
  });

  it("picks the highest threshold at or below the value", () => {
    expect(chaosLabel(14)).toBe(CHAOS_NAMES[0][1]);
    expect(chaosLabel(15)).toBe(CHAOS_NAMES[1][1]);
    expect(chaosLabel(99)).toBe(CHAOS_NAMES[5][1]);
    expect(chaosLabel(100)).toBe("LEGAL IS CALLING");
  });
});

describe("parseStoredChaos", () => {
  it("falls back when absent", () => {
    expect(parseStoredChaos(null)).toBe(DEFAULT_CHAOS);
    expect(parseStoredChaos(undefined)).toBe(DEFAULT_CHAOS);
    expect(parseStoredChaos("", 7)).toBe(7);
  });

  it("parses numeric strings", () => {
    expect(parseStoredChaos("42")).toBe(42);
    expect(parseStoredChaos("  37 ")).toBe(37);
    expect(parseStoredChaos("0.5")).toBe(0.5);
  });

  it("falls back on corrupted values (issue #1)", () => {
    expect(parseStoredChaos("garbage")).toBe(DEFAULT_CHAOS);
    expect(parseStoredChaos("12abc")).toBe(DEFAULT_CHAOS);
    expect(parseStoredChaos("NaN")).toBe(DEFAULT_CHAOS);
    expect(parseStoredChaos("[object Object]")).toBe(DEFAULT_CHAOS);
  });
});
