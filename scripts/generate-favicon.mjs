import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const src = join(publicDir, 'profile.jpg');

async function main() {
  // 32x32 PNG
  await sharp(src).resize(32, 32, { fit: 'cover', position: 'top' }).png().toFile(join(publicDir, 'favicon-32x32.png'));
  // 16x16 PNG
  await sharp(src).resize(16, 16, { fit: 'cover', position: 'top' }).png().toFile(join(publicDir, 'favicon-16x16.png'));
  // 180x180 apple touch
  await sharp(src).resize(180, 180, { fit: 'cover', position: 'top' }).png().toFile(join(publicDir, 'apple-touch-icon.png'));
  // favicon.ico (using 32x32 PNG — browsers accept PNG ico)
  const png32 = await sharp(src).resize(32, 32, { fit: 'cover', position: 'top' }).png().toBuffer();
  writeFileSync(join(publicDir, 'favicon.ico'), png32);
  console.log('Favicons generated successfully.');
}

main().catch(console.error);
