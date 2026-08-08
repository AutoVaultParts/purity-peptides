import sharp from "sharp";
import { readdirSync, mkdirSync, statSync } from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OUTPUT_DIR = path.join(PUBLIC_DIR, "optimized");
const MAX_WIDTH = 800;
const JPEG_QUALITY = 75;

mkdirSync(OUTPUT_DIR, { recursive: true });

const files = readdirSync(PUBLIC_DIR).filter(
  (f) => f.startsWith("category-photo-") && (f.endsWith(".jpg") || f.endsWith(".jpeg"))
);

async function run() {
  console.log(`Found ${files.length} category photos to optimize.\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);

    const before = statSync(inputPath).size;

    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(outputPath);

    const after = statSync(outputPath).size;
    totalBefore += before;
    totalAfter += after;

    const beforeKb = (before / 1024).toFixed(0);
    const afterKb = (after / 1024).toFixed(0);
    const savings = (100 - (after / before) * 100).toFixed(0);

    console.log(`${file}: ${beforeKb}KB -> ${afterKb}KB  (-${savings}%)`);
  }

  console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
  console.log(`\nOptimized files written to public/optimized/`);
  console.log(`Once you've confirmed they look good, move them into public/ to replace the originals.`);
}

run();
