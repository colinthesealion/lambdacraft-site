import { Client } from 'basic-ftp';
import cors from 'cors';
import DotEnv from 'dotenv';
import express, { Response } from 'express';
import { parse } from 'prismarine-nbt';
import promptSync from 'prompt-sync';
import { WritableStreamBuffer } from 'stream-buffers';

DotEnv.config();

const cubedHostClientConfig = {
  host: 'chi1.mc.cubedhost.com',
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
};

async function getNBTDataFromCubedHost(filename: string) {
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

async function streamFileFromCubedHost(filename: string, stream: Response) {
  console.log(`Fetching file ${filename}...`)
  console.group();
  const client = new Client();
  await client.access(cubedHostClientConfig);
  await client.downloadTo(stream, filename);
  client.close();
  console.log('done');
  console.groupEnd();
}

function startExpressServer() {
  const app = express();
  app.use(cors());
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.get('/advancements/:uuid', (req, res) => {
    const filename = `Savanah Plateau/advancements/${req.params.uuid}.json`;
    res.type('json');
    streamFileFromCubedHost(filename, res);
  });
  app.get('/player/data/:uuid', async (req, res) => {
    const filename = `Savanah Plateau/playerdata/${req.params.uuid}.dat`;
    const data = await getNBTDataFromCubedHost(filename);
    res.json(data);
  });
  app.get('/player/stats/:uuid', (req, res) => {
    const filename = `Savanah Plateau/stats/${req.params.uuid}.json`;
    res.type('json');
    streamFileFromCubedHost(filename, res);
  });
  app.get('/players', (_req, res) => {
    res.type('json');
    streamFileFromCubedHost('whitelist.json', res);
  });

  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`http://localhost:${port}/players`));
}

if (!cubedHostClientConfig.user || !cubedHostClientConfig.password) {
  const prompt = promptSync();
  if (!cubedHostClientConfig.user) {
    cubedHostClientConfig.user = prompt('CubedHost Username: ');
  }
  if (!cubedHostClientConfig.password) {
    cubedHostClientConfig.password = prompt('CubedHost Password: ', { echo: '*' });
  }
}

startExpressServer();