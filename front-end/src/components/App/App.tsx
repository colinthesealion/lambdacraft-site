import React from 'react';
import {
  RecoilRoot,
  selector,
  selectorFamily,
  useRecoilValue
} from 'recoil';
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Typography
} from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

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
      <InputLabel>Member</InputLabel>
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
  const [selectedTab, selectTab]  = React.useState('skin');
  const handleChange = React.useCallback((_event: React.SyntheticEvent, value: string) => {
    selectTab(value);
  }, [selectTab]);
  return (
    <RecoilRoot>
      <Typography variant="h4" gutterBottom>LambdaCraft Members</Typography>
      <React.Suspense fallback={<CircularProgress />}>
        <PlayerDropdown player={player} setPlayer={setPlayer} />
      </React.Suspense>
      {player && (
        <>
          <TabContext value={selectedTab}>
            <Paper square>
              <TabList onChange={handleChange}>
                <Tab label="Skin" value="skin" />
                <Tab label="Advancement Progress" value="advancements" />
              </TabList>
            </Paper>
            <TabPanel value="skin">
              <img src={`https://minecraftskinstealer.com/api/v1/skin/render/fullbody/${player.name}/700`} alt={player.name} />
            </TabPanel>
            <TabPanel value="advancements">
              <React.Suspense fallback={<CircularProgress />}>
                {player && <PlayerAdvancments player={player} />}
              </React.Suspense>
            </TabPanel>
          </TabContext>
        </>
      )}
      
    </RecoilRoot>
  );
}
