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

/** Clamp a chaos value to [0, 100]. (No finiteness check yet — see fix in #1.) */
export function clampChaos(n) {
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

/** Read the stored chaos value, falling back to the default when absent. */
export function parseStoredChaos(raw, fallback = DEFAULT_CHAOS) {
  if (!raw) return fallback;
  return Number(raw);
}
