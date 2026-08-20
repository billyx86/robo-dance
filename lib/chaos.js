// Chaos meter logic, extracted from app.js so it is unit-testable.
// Pure: no DOM, no localStorage — callers pass values in / take them out.

export const CHAOS_NAMES = [
  [0, "dangerously calm"],
  [15, "mildly unhinged"],
  [30, "beep-boop delirious"],
  [50, "mainframe melting"],
  [70, "HR is concerned"],
  [90, "MAXIMUM SILLY"],
  [100, "LEGAL IS CALLING"],
];

export const DEFAULT_CHAOS = 12;

/**
 * Clamp a chaos value to [0, 100]. Non-finite input (NaN/Infinity — e.g.
 * from a corrupted localStorage value) is treated as 0 rather than
 * propagating NaN into the meter (issue #1).
 */
export function clampChaos(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  // Math.min/max fold +Infinity -> 100 and -Infinity -> 0 for us.
  return Math.min(100, Math.max(0, n));
}

/** Label for the current chaos level. */
export function chaosLabel(n) {
  let name = CHAOS_NAMES[0][1];
  for (const [threshold, label] of CHAOS_NAMES) {
    if (n >= threshold) name = label;
  }
  return name;
}

/**
 * Read the stored chaos value, falling back to the default when absent or
 * corrupted (non-numeric) — e.g. a hand-edited "garbage" localStorage
 * value (issue #1).
 */
export function parseStoredChaos(raw, fallback = DEFAULT_CHAOS) {
  if (raw == null || String(raw).trim() === "") return fallback;
  const n = Number(String(raw).trim());
  return Number.isFinite(n) ? n : fallback;
}
