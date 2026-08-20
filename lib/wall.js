// Meme wall logic, extracted from app.js so it is unit-testable.
// Pure: no DOM, no localStorage — callers pass values in / take them out.

export const WALL_LIMIT = 24;

/** Keep only the newest `limit` entries (newest first). */
export function capWall(wall, limit = WALL_LIMIT) {
  return wall.slice(0, limit);
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
