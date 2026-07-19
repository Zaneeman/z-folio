import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

// "<cols>x<rows>.<seq>", e.g. "2x2.001.jpg" or "1x2.014.png" — the shape
// prefix says which bento cell shapes the image is allowed to fill.
const SHAPE_NAME = /^(\d+)x(\d+)\.\d+$/i;

// Keyed by shape ("1x1", "2x1", ...); files that don't match the naming
// convention land under "misc" and are used as a fallback for any shape.
export type FeaturedImages = Record<string, string[]>;

export function getFeaturedImages(): FeaturedImages {
  const dir = path.join(process.cwd(), "public", "images", "projects", "featured");

  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return {};
  }

  const grouped: FeaturedImages = {};

  files
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .forEach((f) => {
      const stem = f.slice(0, f.length - path.extname(f).length);
      const match = SHAPE_NAME.exec(stem);
      const shape = match ? `${match[1]}x${match[2]}` : "misc";
      (grouped[shape] ??= []).push(`/images/projects/featured/${f}`);
    });

  return grouped;
}
