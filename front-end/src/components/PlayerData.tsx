import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import ReactJson from 'react-json-view';
import {
  selectorFamily,
  useRecoilValue
} from 'recoil';

import { getPlayerData } from '../api';
import { Player } from '../types';
import { deNamespace } from '../utils';

const playerDataQuery = selectorFamily<any,string>({
  key: 'PlayerData',
  get: uuid => () => getPlayerData(uuid),
});
interface PlayerDataProps {
  player: Player;
}
export default function PlayerData({ player }: PlayerDataProps) {
  const data = useRecoilValue(playerDataQuery(player.uuid));
  return(
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><>Current Dimension:</></TableCell>
            <TableCell><>{deNamespace(data.Dimension.value)}</></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><>Current Position:</></TableCell>
            <TableCell><>{data.Pos.value.value[0]}, {data.Pos.value.value[1]}, {data.Pos.value.value[2]}</></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><>Last Seen:</></TableCell>
            <TableCell>
              <ReactJson src={data.Paper?.value.LastSeen} />
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