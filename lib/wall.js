// Meme wall logic, extracted from app.js so it is unit-testable.
// Pure: no DOM, no localStorage — callers pass values in / take them out.

export const WALL_LIMIT = 24;

/** Keep only the newest `limit` entries (newest first). */
export function capWall(wall, limit = WALL_LIMIT) {
  return wall.slice(0, limit);
}

/**
 * Shrink a wall so its serialized form fits within `budget` characters.
 * Pure: no localStorage. The wall is stored newest-first, so the oldest
 * posts are at the end. Strategy (issue #2):
 *   1. Turn the oldest image posts into caption-only cards (gradient +
 *      emoji) until it fits — the posts (and their likes) survive.
 *   2. Only if that's still not enough, drop the *oldest user* posts
 *      (seeded cards are never dropped).
 * Returns a new array; the input is not mutated.
 */
export function shrinkToFit(
  wall,
  budget = 4 * 1024 * 1024,
  sizeOf = (w) => JSON.stringify(w).length,
) {
  const out = wall.map((it) => ({ ...it }));
  if (sizeOf(out) <= budget) return out;

  for (let i = out.length - 1; i >= 0; i--) {
    if (sizeOf(out) <= budget) break;
    if (!out[i].dataUrl) continue;
    delete out[i].dataUrl;
    out[i].emoji = out[i].emoji || "🤖";
    out[i].bg = out[i].bg || ["#ff2d95", "#7b2ff7"];
  }

  for (let i = out.length - 1; i >= 0; i--) {
    if (sizeOf(out) <= budget) break;
    if (out[i].seed) continue;
    out.splice(i, 1);
  }
  return out;
}

/** First-visit wall: one seeded card per starter template. */
export function seedWall(starters, rand = Math.random) {
  return starters.map((s) => ({
    bg: s.bg,
    emoji: s.emoji,
    caption: s.caption,
    likes: Math.floor(rand() * 20) + 1,
    seed: true,
  }));
}
