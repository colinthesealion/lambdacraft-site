import React from 'react';
import {
  CircularProgress,
  Paper,
  Tab,
} from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import PlayerAdvancements from './PlayerAdvancements';
import PlayerData from './PlayerData';
import PlayerDropdown from './PlayerDropdown';
import PlayerStats from './PlayerStats';
import { Player } from '../types';

export default function Members() {
  const [player, setPlayer] = React.useState<Player>();
  const [selectedTab, selectTab]  = React.useState('skin');
  const handleChange = React.useCallback((_event: React.SyntheticEvent, value: string) => {
    selectTab(value);
  }, [selectTab]);

  return (
    <>
      <React.Suspense fallback={<CircularProgress />}>
        <PlayerDropdown player={player} setPlayer={setPlayer} />
      </React.Suspense>
      {player && (
        <TabContext value={selectedTab}>
          <Paper square>
            <TabList onChange={handleChange}>
              <Tab label="Skin" value="skin" />
              <Tab label="Data" value="data" />
              <Tab label="Stats" value="stats" />
              <Tab label="Advancements" value="advancements" />
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
          <TabPanel value="stats">
            <React.Suspense fallback={<CircularProgress />}>
              <PlayerStats player={player} />
            </React.Suspense>
          </TabPanel>
          <TabPanel value="advancements">
            <React.Suspense fallback={<CircularProgress />}>
              <PlayerAdvancements player={player} />
            </React.Suspense>
          </TabPanel>
        </TabContext>
      )}
    </>
  );
}
