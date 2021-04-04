import { fetchFromBackend, getBackendURL } from './utils';

export async function getListOfMaps() {
  return (await fetchFromBackend('map/list')) as string[];
}

export function getMapURL(id: string) {
  return getBackendURL(`map/get/${id}`);
}