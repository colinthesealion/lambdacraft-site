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

interface ClientEntry {
  client: Client;
  busy: boolean;
}
const clientPool: ClientEntry[] = [];
const maxClients = 6;
async function getAvailableClient(): Promise<ClientEntry> {
  let client = clientPool.find(({ busy }) => !busy);
  if (!client && clientPool.length < maxClients) {
    client = {
      client: new Client(),
      busy: true,
    };
    clientPool.push(client);
  }
  if (!client) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getAvailableClient());
      }, 100);
    })
  }
  client.busy = true;
  if (client.client.closed) {
    await client.client.access(cubedHostClientConfig);
  }
  return client;
}

export async function getNBTDataFromCubedHost(filename: string) {
  console.log(`Fetching NBT ${filename}...`);
  console.group();
  const buffer = new WritableStreamBuffer({
    initialSize: (100 * 1024),
    incrementAmount: (10 * 1024),
  });
  const client = await getAvailableClient();
  await client.client.downloadTo(buffer, filename);
  client.busy = false;
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
  const client = await getAvailableClient();
  await client.client.downloadTo(response, filename);
  client.busy = false;
  console.log('done');
  console.groupEnd();
}

export async function listFilesFromCubedHost(path: string) {
  console.log(`Fetching file listing at ${path}...`);
  console.group();
  const client = await getAvailableClient();
  const list = await client.client.list(path);
  client.busy = false;
  console.log('done');
  console.groupEnd();
  return list;
}