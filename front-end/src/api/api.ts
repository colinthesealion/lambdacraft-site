import { AdvancementData, Player } from '../types';

export async function fetchFromBackend(route: string) {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${route}`);
  if(!response.ok) {
    throw new Error(`Failed to fetch ${route}`);
  }
  return response.json();
}

export async function getPlayerAdvancementData(uuid: string): Promise<AdvancementData> {
  return (await fetchFromBackend(`advancements/${uuid}`)) as AdvancementData;
}

export async function getPlayerData(uuid: string): Promise<any> {
  return fetchFromBackend(`player/data/${uuid}`);
}

export async function getPlayerStats(uuid: string): Promise<any> {
  return fetchFromBackend(`player/stats/${uuid}`);
}

export async function getPlayers(): Promise<Player[]> {
  return (await fetchFromBackend('players')) as Player[];
}