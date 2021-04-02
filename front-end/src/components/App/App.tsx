import React from 'react';
import { RecoilRoot, selector, selectorFamily, useRecoilValue } from 'recoil';
import { CircularProgress, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core';

import Advancements from '../Advancements';
import { AdvancementData, Player } from '../../types';
import { getPlayers, getPlayerAdvancementData } from '../../api';

const playersQuery = selector<Player[]>({
  key: 'Players',
  get: async () => {
    return (await getPlayers()).sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  }
});
interface PlayerDropdownProps {
  player?: Player;
  setPlayer: (player: Player) => void;
}
function PlayerDropdown({ player, setPlayer }: PlayerDropdownProps) {
  const players = useRecoilValue(playersQuery);
  const handleChange = React.useCallback((event: React.ChangeEvent<{ value: unknown}>) => {
    const newPlayer = players.find(({ uuid }) => uuid === event.target.value);
    if (newPlayer) {
      setPlayer(newPlayer);
    }
  }, [players, setPlayer]);
  return (
    <FormControl style={{ minWidth: 120 }}>
      <InputLabel>Player</InputLabel>
      <Select
        value={player?.uuid ?? ''}
        onChange={handleChange}
      >
        {players.map(({ uuid, name }) => <MenuItem key={uuid} value={uuid}>{name}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

const advancementDataQuery = selectorFamily<AdvancementData, string>({
  key: 'AdvancementData',
  get: uuid => () => getPlayerAdvancementData(uuid),
});
interface PlayerAdvancmentProps {
  player: Player;
}
function PlayerAdvancments({ player }: PlayerAdvancmentProps) {
  const advancementData = useRecoilValue(advancementDataQuery(player.uuid));
  return <Advancements advancementData={advancementData} />;
}

interface AppProps {
}
export default function App(_props: AppProps) {
  const [player, setPlayer] = React.useState<Player>();
  return (
    <RecoilRoot>
      <Typography variant="h4" gutterBottom>LambdaCraft Advancement Progress</Typography>
      <React.Suspense fallback={<CircularProgress />}>
        <PlayerDropdown player={player} setPlayer={setPlayer} />
      </React.Suspense>
      <br /><br />
      <React.Suspense fallback={<CircularProgress />}>
        {player && <PlayerAdvancments player={player} />}
      </React.Suspense>
    </RecoilRoot>
  );
}
