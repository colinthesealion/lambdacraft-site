import { Client } from 'basic-ftp';
import DotEnv from 'dotenv';
import { Response } from 'express';
import { parse } from 'prismarine-nbt';
import promptSync from 'prompt-sync';
import { WritableStreamBuffer } from 'stream-buffers';

DotEnv.config();

const cubedHostClientConfig = {
  host: 'chi1.mc.cubedhost.com',
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
};
export function setCubedhostClientConfig() {
  if (!cubedHostClientConfig.user || !cubedHostClientConfig.password) {
    const prompt = promptSync();
    if (!cubedHostClientConfig.user) {
      cubedHostClientConfig.user = prompt('CubedHost Username: ');
    }
    if (!cubedHostClientConfig.password) {
      cubedHostClientConfig.password = prompt('CubedHost Password: ', { echo: '*' });
    }
  }
}

export async function getNBTDataFromCubedHost(filename: string) {
  console.log(`Fetching NBT ${filename}...`);
  console.group();
  const buffer = new WritableStreamBuffer({
    initialSize: (100 * 1024),
    incrementAmount: (10 * 1024),
  });
  const client = new Client();
  await client.access(cubedHostClientConfig);
  await client.downloadTo(buffer, filename);
  client.close();
  console.log('done');
  console.groupEnd();

  if (buffer.size()) {
    const { parsed } = await parse(buffer.getContents() as Buffer);
    return parsed.value;
  }
  return;
}

export async function streamJSONFileFromCubedHost(filename: string, response: Response) {
  console.log(`Fetching JSON ${filename}...`);
  console.group();
  response.type('json');
  const client = new Client();
  await client.access(cubedHostClientConfig);
  await client.downloadTo(response, filename);
  client.close();
  console.log('done');
  console.groupEnd();
}