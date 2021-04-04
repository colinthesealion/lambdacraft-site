import { fetchFromBackend } from './utils';

export async function fetchScoreboard() {
    return fetchFromBackend('scoreboard');
}