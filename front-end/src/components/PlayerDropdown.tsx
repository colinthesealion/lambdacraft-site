import React from 'react';
import { selector, useRecoilValue } from 'recoil';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';  

import { getPlayers } from '../api';
import { Player } from '../types';

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

export default function PlayerDropdown({ player, setPlayer }: PlayerDropdownProps) {
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
