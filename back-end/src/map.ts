import { Router } from 'express';
import path from 'path';
import Jimp from 'jimp';

import { listFilesFromCubedHost, getNBTDataFromCubedHost } from './cubed-host';
import { getColor } from './color';

const router = Router();

router.get('/list', async (_request, response) => {
  const files = await listFilesFromCubedHost('Savanah Plateau/data');
  const maps = files.filter(file => /^map/.test(file.name)).map(file => {
    const basename = path.basename(file.name, '.dat');
    const [,id] = basename.split('_');
    return id;
  });
  response.json(maps);
});

router.get('/get/:id', async(request, response) => {
  const data = await getNBTDataFromCubedHost(`Savanah Plateau/data/map_${request.params.id}.dat`);
  if (data && data.data) {
    const colors = (data.data.value as any).colors.value;
    const image = await makePng(colors);
    response.type('png');
    response.write(image);
    response.end();
  }
  else {
    response.json(data);
  }
});

export async function makePng(colors: number[]) {
  const image: any = await new Promise((resolve, reject) => {
    new Jimp(128, 128, (err: Error, image: any) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(image);
      }
    });
  });
  colors.forEach((colorId, index) => {
    const x = index % 128;
    const y = Math.floor(index / 128);
    const color = getColor(colorId);
    image.setPixelColor(Jimp.rgbaToInt(...color), x, y);
  })
  return image.getBufferAsync(Jimp.MIME_PNG);
}

export default router;