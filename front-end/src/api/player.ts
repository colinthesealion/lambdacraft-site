import { AdvancementData, Player } from '../types';
import { fetchFromBackend } from './utils';

export async function getPlayerAdvancementData(uuid: string): Promise<AdvancementData> {
  return (await fetchFromBackend(`player/advancements/${uuid}`)) as AdvancementData;
}

export async function getPlayerData(uuid: string): Promise<any> {
  return fetchFromBackend(`player/data/${uuid}`);
}

export async function getPlayerStats(uuid: string): Promise<any> {
  return fetchFromBackend(`player/stats/${uuid}`);
}

export async function getPlayers(): Promise<Player[]> {
  return (await fetchFromBackend('player/list')) as Player[];
}
