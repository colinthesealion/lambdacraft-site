import React from 'react';
import ReactJson from 'react-json-view';
import { selectorFamily, useRecoilValue } from 'recoil';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';  

import { getPlayerStats } from '../api';
import { Player } from '../types';
import { deNamespace } from '../utils';

const playerStatsQuery = selectorFamily<any,string>({
  key: 'PlayerStats',
  get: uuid => () => getPlayerStats(uuid),
});

interface PlayerStatsProps {
  player: Player;
}

export default function PlayerStats({ player }: PlayerStatsProps) {
  const data = useRecoilValue(playerStatsQuery(player.uuid));
  const categories = Object.keys(data.stats).sort();
  const [category, setCategory] = React.useState(categories[0]);
  const handleChange = React.useCallback((event: React.ChangeEvent<{ value: unknown}>) => {
    setCategory(event.target.value as string);
  }, [categories, category]);
  return (
    <>
      <FormControl style={{ minWidth: 120 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={handleChange}
        >
          {categories.map(id => <MenuItem key={id} value={id}>{deNamespace(id)}</MenuItem>)}
        </Select>
      </FormControl>
      <br /><br />
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><>Stat</></TableCell>
              <TableCell><>Count</></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(data.stats[category]).sort((a, b) => {
              return data.stats[category][b] - data.stats[category][a];
            }).map(id => (
              <TableRow key={id}>
                <TableCell><>{deNamespace(id)}</></TableCell>
                <TableCell><>{data.stats[category][id]}</></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
