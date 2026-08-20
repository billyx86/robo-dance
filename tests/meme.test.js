import { describe, it, expect } from "vitest";
import {
  MODES,
  SURPRISES,
  STARTERS,
  REACTIONS,
  PALETTES,
  pickRandom,
  wrapTextLines,
} from "../lib/meme.js";

describe("data tables", () => {
  it("has a mode for every dance chip in the UI", () => {
    for (const mode of ["dance", "spin-mode", "break", "vibing"]) {
      expect(MODES[mode]).toBeTruthy();
      expect(MODES[mode].bpm).toBeGreaterThan(0);
    }
  });

  it("has surprise pairs, starter templates and reactions", () => {
    expect(SURPRISES.length).toBeGreaterThan(0);
    for (const [top, bottom] of SURPRISES) {
      expect(typeof top).toBe("string");
      expect(typeof bottom).toBe("string");
    }
    expect(STARTERS.length).toBeGreaterThan(0);
    expect(REACTIONS.length).toBeGreaterThan(0);
    for (const r of REACTIONS) {
      expect(r.id).toBeTruthy();
      expect(r.emoji).toBeTruthy();
      expect(r.name).toBeTruthy();
    }
    for (const palette of Object.values(PALETTES)) {
      expect(palette).toHaveLength(3);
    }
  });
});

describe("pickRandom", () => {
  it("returns an element of the array", () => {
    const arr = ["a", "b", "c"];
    for (let i = 0; i < 50; i++) {
      expect(arr).toContain(pickRandom(arr));
    }
  });

  it("respects an injected rand (deterministic in tests)", () => {
    expect(pickRandom(["a", "b", "c"], () => 0)).toBe("a");
    expect(pickRandom(["a", "b", "c"], () => 0.999)).toBe("c");
  });
});

describe("wrapTextLines", () => {
  const measure = (t) => t.length; // 1 char = 1 unit

  it("fits short text on one line", () => {
    expect(wrapTextLines("hi", 10, measure)).toEqual(["hi"]);
  });

  it("wraps at word boundaries when a line would overflow", () => {
    expect(wrapTextLines("aa bb cc", 5, measure)).toEqual(["aa bb", "cc"]);
  });

  it("keeps a single word longer than maxWidth on its own line", () => {
    expect(wrapTextLines("verylongword", 5, measure)).toEqual(["verylongword"]);
  });

  it("handles empty and whitespace-only text", () => {
    expect(wrapTextLines("", 10, measure)).toEqual([]);
    expect(wrapTextLines("   ", 10, measure)).toEqual([]);
  });

  it("tolerates non-string input", () => {
    expect(wrapTextLines(42, 10, measure)).toEqual(["42"]);
  });
});
