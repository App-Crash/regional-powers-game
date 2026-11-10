import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function slice8KMap() {
  const inputImage = path.join(__dirname, 'south_america_8k.png');
  const outputDir = path.join(__dirname, 'tiles');
  const tileSize = 500;
  const targetDimension = 8000;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const metadata = await sharp(inputImage).metadata();
  console.log(`Loaded master image: ${metadata.width}x${metadata.height}`);

  const steps = targetDimension / tileSize; // 16 steps (0 to 15)

  for (let row = 0; row < steps; row++) {
    for (let col = 0; col < steps; col++) {
      const left = col * tileSize;
      const top = row * tileSize;
      
      const outputFilename = path.join(outputDir, `tile_${col}_${row}.png`);

      await sharp(inputImage)
        .extract({ left, top, width: tileSize, height: tileSize })
        .toFile(outputFilename);
    }
  }

  console.log(`Successfully generated ${steps * steps} tiles of ${tileSize}x${tileSize} pixels in /tiles!`);
}

slice8KMap().catch(err => console.error(err));