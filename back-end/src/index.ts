import express, { Response } from 'express';
import cors from 'cors';

import { Client } from 'basic-ftp';

async function streamFileFromCubedHost(filename: string, stream: Response) {
  const client = new Client();
  await client.access({
    host: 'chi1.mc.cubedhost.com',
    //port: 21,
    user: 'redacted',
    password: 'redacted',
  });
  await client.downloadTo(stream, filename);
  client.close();
}

const app = express();
app.use(cors());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

const port = process.env.port || 3001;
app.listen(port, () => console.log(`http://localhost:${port}/players`));
