import React from 'react';
import { selector, useRecoilValue } from 'recoil';
import {
  Paper,
  Tab,
} from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { getListOfMaps, getMapURL } from '../api';
import MapGrid from './MapGrid';

const mapsQuery = selector({
  key: 'Maps',
  get: async () => (await getListOfMaps()).sort((a, b) => Number(a) - Number(b)),
});

export default function Maps() {
  const maps = useRecoilValue(mapsQuery);
  const [selectedTab, selectTab]  = React.useState('all');
  const handleChange = React.useCallback((_event: React.SyntheticEvent, value: string) => {
    selectTab(value);
  }, [selectTab]);

  return (
    <TabContext value={selectedTab}>
      <Paper square>
        <TabList onChange={handleChange}>
          <Tab label="All" value="all" />
          <Tab label="The Town" value="town" />
          <Tab label="The Incident" value="incident" />
          <Tab label="Amanita Island" value="amanita" />
          <Tab label="Portrait" value="portrait" />
        </TabList>
      </Paper>
      <TabPanel value="all">
        {maps.map(id => (
          <img
            key={id}
            title={`Lambda Craft Map ${id}`}
            alt={`Lambda Craft Map ${id}`}
            src={getMapURL(id)}
          />
        ))}
      </TabPanel>
      <TabPanel value="town">
        <MapGrid
          rows={[
            ['25', '22', '20', '21', '31'],
            ['23', '24', '16', '19', '32'],
            ['30', '29', '28', '27', '34'],
          ]}
        />
      </TabPanel>
      <TabPanel value="incident">
        <MapGrid
          rows={[
            ['18'],
            ['17'],
          ]}
        />
      </TabPanel>
      <TabPanel value="amanita">
        <MapGrid
          rows={[
            ['158', '159', '161', '162'],
            ['157', '154', '160', '156'],
            ['163', '149', '146', '152'],
            ['164', '151', '150', '153'],
          ]}
        />
      </TabPanel>
      <TabPanel value="portrait">
        <MapGrid
          rows={[
            ['194', '195'],
            ['197', '198'],
            ['199', '200'],
          ]}
        />
      </TabPanel>
    </TabContext>
  );
}