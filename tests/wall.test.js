import { describe, it, expect } from "vitest";
import { capWall, seedWall, shrinkToFit, WALL_LIMIT } from "../lib/wall.js";
import { STARTERS } from "../lib/meme.js";

const img = "data:image/png;base64," + "A".repeat(60_000); // ~60 KB dataURL
const userPost = (caption, withImg = true) => ({
  caption,
  likes: 0,
  ...(withImg ? { dataUrl: img } : {}),
});

describe("capWall", () => {
  it("keeps the newest `limit` entries (newest first)", () => {
    const wall = Array.from({ length: 30 }, (_, i) => userPost("post " + i, false));
    const capped = capWall(wall);
    expect(capped).toHaveLength(WALL_LIMIT);
    expect(capped[0].caption).toBe("post 0");
    expect(capped[capped.length - 1].caption).toBe("post " + (WALL_LIMIT - 1));
  });

  it("leaves short walls untouched and does not mutate the input", () => {
    const wall = [userPost("a", false), userPost("b", false)];
    const out = capWall(wall, 10);
    expect(out).toHaveLength(2);
    expect(wall).toHaveLength(2);
  });
});

describe("seedWall", () => {
  it("seeds one card per starter template, all marked seed", () => {
    const seeded = seedWall(STARTERS, () => 0.5);
    expect(seeded).toHaveLength(STARTERS.length);
    for (const card of seeded) {
      expect(card.seed).toBe(true);
      expect(card.likes).toBeGreaterThanOrEqual(1);
      expect(card.likes).toBeLessThanOrEqual(20);
    }
    expect(seeded[0].caption).toBe(STARTERS[0].caption);
  });
});

describe("shrinkToFit", () => {
  it("returns an equal-length copy when already within budget", () => {
    const wall = [userPost("a", false), userPost("b", false)];
    const out = shrinkToFit(wall, 1_000_000);
    expect(out).toHaveLength(2);
    expect(out).not.toBe(wall);
  });

  it("strips the oldest image posts first, keeping the posts (and newer images)", () => {
    // Budget fits exactly one 60KB image + a small caption-only card.
    const wall = [userPost("newest"), userPost("old")];
    const out = shrinkToFit(wall, 70_000);
    expect(out).toHaveLength(2);
    // the OLDEST image is converted to caption-only; the newer one survives
    expect(out[out.length - 1].dataUrl).toBeUndefined();
    expect(out[out.length - 1].bg).toBeTruthy();
    expect(out[out.length - 1].emoji).toBeTruthy();
    expect(out[0].dataUrl).toBe(img);
  });

  it("drops oldest user posts only as a last resort (never seeds)", () => {
    const wall = [
      userPost("newest"),
      { seed: true, bg: ["#fff", "#000"], emoji: "🤖", caption: "seed", likes: 1, dataUrl: img },
      userPost("older"),
      userPost("oldest"),
    ];
    // Budget smaller than even the fully-stripped wall forces drops.
    const out = shrinkToFit(wall, 100);
    // seeds are never dropped
    expect(out.find((x) => x.seed)).toBeTruthy();
    // oldest user posts are gone
    expect(out.some((x) => x.caption === "oldest")).toBe(false);
    expect(out.some((x) => x.caption === "older")).toBe(false);
  });

  it("does not mutate the input", () => {
    const wall = [userPost("a"), userPost("b")];
    const before = JSON.stringify(wall);
    shrinkToFit(wall, 10_000);
    expect(JSON.stringify(wall)).toBe(before);
  });
});
