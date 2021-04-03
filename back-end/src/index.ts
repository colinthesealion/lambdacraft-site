
import cors from 'cors';
import express from 'express';

import player from './player';

function startExpressServer() {
  const app = express();
  app.use(cors());
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use('/player', player);
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`http://localhost:${port}`));
}

startExpressServer();