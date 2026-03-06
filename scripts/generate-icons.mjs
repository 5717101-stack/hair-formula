import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const logoPath = join(publicDir, "logo.png");

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
];

for (const { name, size } of sizes) {
  const buf = await sharp(logoPath)
    .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
  writeFileSync(join(publicDir, name), buf);
  console.log(`Created ${name} (${size}x${size})`);
}

const ico32 = await sharp(logoPath)
  .resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toBuffer();
writeFileSync(join(publicDir, "favicon.ico"), ico32);
console.log("Created favicon.ico");

console.log("All icons generated from logo.");
