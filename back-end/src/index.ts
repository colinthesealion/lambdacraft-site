
import cors from 'cors';
import express from 'express';

import { setCubedhostClientConfig, getNBTDataFromCubedHost } from './cubed-host';
import map from './map';
import player from './player';

function startExpressServer() {
  const app = express();
  app.use(cors());
  app.use((_request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use('/map', map);
  app.use('/player', player);
  app.get('/scoreboard', async (_request, response) => {
    const data = await getNBTDataFromCubedHost('Savanah Plateau/data/scoreboard.dat');
    response.json(data);
  });
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`http://localhost:${port}`));
}

setCubedhostClientConfig();
startExpressServer();