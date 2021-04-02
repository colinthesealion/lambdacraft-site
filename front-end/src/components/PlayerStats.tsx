import { selectorFamily, useRecoilValue } from 'recoil';
import ReactJson from 'react-json-view';

import { getPlayerStats } from '../api';
import { Player } from '../types';

const playerStatsQuery = selectorFamily<any,string>({
  key: 'PlayerStats',
  get: uuid => () => getPlayerStats(uuid),
});

interface PlayerStatsProps {
  player: Player;
}

export default function PlayerStats({ player }: PlayerStatsProps) {
  const data = useRecoilValue(playerStatsQuery(player.uuid));
  return <ReactJson src={data} />;
}
