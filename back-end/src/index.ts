import { Client } from 'basic-ftp';
import cors from 'cors';
import express, { Response } from 'express';
import promptSync from 'prompt-sync';

const cubedHostClientConfig = {
  host: 'chi1.mc.cubedhost.com',
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
};

async function streamFileFromCubedHost(filename: string, stream: Response) {
  const client = new Client();
  await client.access(cubedHostClientConfig);
  await client.downloadTo(stream, filename);
  client.close();
}

function startExpressServer() {
  const app = express();
  app.use(cors());
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.get('/players', (_req, res) => {
    res.type('json');
    streamFileFromCubedHost('whitelist.json', res);
  });
  app.get('/advancements/:uuid', (req, res) => {
    const filename = `Savanah Plateau/advancements/${req.params.uuid}.json`;
    console.log(filename);
    res.type('json');
    streamFileFromCubedHost(filename, res);
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