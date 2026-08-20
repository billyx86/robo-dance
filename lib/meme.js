// Meme forge data + pure helpers, extracted from app.js so they are
// unit-testable. No DOM, no canvas — the text wrapper takes its measuring
// function as a parameter.

export const MODES = {
  dance: { bpm: 128, label: "GROOVE" },
  "spin-mode": { bpm: 148, label: "SPIN" },
  break: { bpm: 160, label: "BREAK" },
  vibing: { bpm: 110, label: "VIBE" },
};

export const SURPRISES = [
  ["ME WHEN", "THE CI IS GREEN"],
  ["POV:", "YOU FIXED IT BY RESTARTING"],
  ["NOBODY:", "ME: DEPLOYS ON FRIDAY"],
  ["THEY SAID IT COULDN'T DANCE", "IT DANCED ANYWAY"],
  ["TOUCH GRASS", "ERROR: MODULE NOT FOUND"],
  ["MY CODE", "AT 3AM"],
  ["SIR, THIS IS A", "WENDY'S API"],
  ["IT'S NOT A BUG", "IT'S A FEATURE (LIE)"],
  ["WHEN THE ROBOT", "UNDERSTANDS THE ASSIGNMENT"],
  ["BRAIN:", "EMPTY. DANCE: FULL."],
];

export const STARTERS = [
  { bg: ["#ff5cad", "#7b2ff7"], emoji: "🤖", caption: "beep boop I'm the main character" },
  { bg: ["#00f0ff", "#0055ff"], emoji: "💃", caption: "absolutely losing it in production" },
  { bg: ["#ffe600", "#ff6b00"], emoji: "🔥", caption: "this is fine (robot edition)" },
  { bg: ["#b8ff3c", "#00c853"], emoji: "✨", caption: "certified silly unit" },
  { bg: ["#ff2d95", "#1a0033"], emoji: "🚀", caption: "ship it. dance about it." },
  { bg: ["#9b59ff", "#00e5f5"], emoji: "🪩", caption: "error 404: chill not found" },
];

export const REACTIONS = [
  { id: "wheeze", emoji: "😭", name: "Wheeze" },
  { id: "send", emoji: "📲", name: "Send it" },
  { id: "cursed", emoji: "👁️", name: "Cursed" },
  { id: "based", emoji: "🗿", name: "Based" },
  { id: "boop", emoji: "🤖", name: "Boop" },
  { id: "fire", emoji: "🔥", name: "Fire" },
  { id: "skill", emoji: "📉", name: "Skill issue" },
  { id: "dance", emoji: "🕺", name: "Dance harder" },
];

export const PALETTES = {
  cyan: ["#00e5f5", "#0066aa", "#0a0a12"],
  hot: ["#ff2d95", "#7b1fa2", "#1a0010"],
  acid: ["#ffe600", "#ff6b00", "#1a1000"],
  void: ["#2a2a40", "#0a0a14", "#000"],
  rainbow: ["#ff2d95", "#00f0ff", "#ffe600"],
};

/** Pick a random element. `rand` is injectable for tests. */
export function pickRandom(arr, rand = Math.random) {
  return arr[Math.floor(rand() * arr.length)];
}

/**
 * Greedy word wrap: split `text` into lines no wider than `maxWidth`.
 * `measureText(text) -> number` is provided by the caller (the canvas
 * context in the app, a stub in tests).
 */
export function wrapTextLines(text, maxWidth, measureText) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (measureText(test) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}
