import { Router } from 'express';

import { streamJSONFileFromCubedHost, getNBTDataFromCubedHost } from './cubed-host';

const router = Router();

router.get('/advancements/:uuid', (request, response) => {
  const filename = `Savanah Plateau/advancements/${request.params.uuid}.json`;
  streamJSONFileFromCubedHost(filename, response);
});

router.get('/data/:uuid', async (request, response) => {
  const filename = `Savanah Plateaudata/${request.params.uuid}.dat`;
  const data = await getNBTDataFromCubedHost(filename);
  response.json(data);
});

router.get('/stats/:uuid', (request, response) => {
  const filename = `Savanah Plateau/stats/${request.params.uuid}.json`;
  streamJSONFileFromCubedHost(filename, response);
});

router.get('/list', (_request, response) => {
  streamJSONFileFromCubedHost('whitelist.json', response);
});

export default router;
