import React from 'react';
import ReactJson from 'react-json-view';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import Advancements from '../Advancements';
import { AdvancementData, Player } from '../../types';
import { getPlayers, getPlayerAdvancementData, getPlayerData } from '../../api';

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

const playerDataQuery = selectorFamily<any,string>({
  key: 'PlayerData',
  get: uuid => () => getPlayerData(uuid),
});
interface PlayerDataProps {
  player: Player;
}
const dimensionNames: {[key: string]: string} = {
  'minecraft:the_nether': 'Nether',
  'minecraft:the_end': 'The End',
  'minecraft:overworld': 'Overworld',
};
function getDimensionName(id: string) {
  if (id in dimensionNames) {
    return dimensionNames[id];
  }
  else {
    return id;
  }
}
function PlayerData({ player }: PlayerDataProps) {
  const data = useRecoilValue(playerDataQuery(player.uuid));
  return(
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><>Current Dimension:</></TableCell>
            <TableCell><>{getDimensionName(data.Dimension.value)}</></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><>Current Position:</></TableCell>
            <TableCell><>{data.Pos.value.value[0]}, {data.Pos.value.value[1]}, {data.Pos.value.value[2]}</></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><>Last Seen:</></TableCell>
            <TableCell>
              <ReactJson src={data.Paper.value.LastSeen} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell><>Level:</></TableCell>
            <TableCell><>{data.XpLevel.value}</></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
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
                <Tab label="Data" value="data" />
                <Tab label="Advancement Progress" value="advancements" />
              </TabList>
            </Paper>
            <TabPanel value="skin">
              <img src={`https://minecraftskinstealer.com/api/v1/skin/render/fullbody/${player.name}/700`} alt={player.name} />
            </TabPanel>
            <TabPanel value="data">
              <React.Suspense fallback={<CircularProgress />}>
                <PlayerData player={player} />
              </React.Suspense>
            </TabPanel>
            <TabPanel value="advancements">
              <React.Suspense fallback={<CircularProgress />}>
                <PlayerAdvancments player={player} />
              </React.Suspense>
            </TabPanel>
          </TabContext>
        </>
      )}
    </RecoilRoot>
  );
}
