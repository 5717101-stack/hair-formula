import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#27272a"/>
      <stop offset="100%" style="stop-color:#18181b"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="108" fill="url(#bg)"/>
  <!-- Scissors icon -->
  <g transform="translate(256,240)" fill="none" stroke="#fafafa" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left blade -->
    <circle cx="-60" cy="60" r="36"/>
    <line x1="-36" y1="36" x2="60" y2="-80"/>
    <!-- Right blade -->
    <circle cx="60" cy="60" r="36"/>
    <line x1="36" y1="36" x2="-60" y2="-80"/>
    <!-- Center pivot -->
    <line x1="-8" y1="-12" x2="8" y2="-12"/>
  </g>
  <!-- Text -->
  <text x="256" y="400" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="700" fill="#fafafa" letter-spacing="3">FORMULA</text>
</svg>`;

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
];

for (const { name, size } of sizes) {
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  writeFileSync(join(publicDir, name), buf);
  console.log(`Created ${name} (${size}x${size})`);
}

// Also create favicon.ico from 32px
const ico32 = await sharp(Buffer.from(svg)).resize(32, 32).png().toBuffer();
writeFileSync(join(publicDir, "favicon.ico"), ico32);
console.log("Created favicon.ico");

console.log("All icons generated.");
