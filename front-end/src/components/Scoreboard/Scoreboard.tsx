import {
  selector,
  useRecoilValue
} from 'recoil';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { fetchScoreboard } from '../../api';
import Objective, { ObjectiveDefinition } from './Objective';

const scoreboardQuery = selector({
  key: 'Scoreboard',
  get: async () => {
    const { data } = await fetchScoreboard();
    return data.value;
  },
});

const objectivesQuery = selector<ObjectiveDefinition[]>({
  key: 'Objectives',
  get: ({ get }) => {
    const scoreboard = get(scoreboardQuery);
    const objectives = scoreboard.Objectives.value.value.map((objective: any) => {
      const displayName = JSON.parse(objective.DisplayName.value).text;
      const scores = scoreboard.PlayerScores.value.value.filter((score: any) => (
        score.Objective.value === objective.Name.value
      )).map((score: any) => ({
        name: score.Name.value,
        score: score.Score.value,
      })).sort((a: any, b: any) => (
        b.score - a.score
      ));
      return {
        displayName,
        scores,
        name: objective.Name.value,
      };
    }).filter((objective: any) => (
      !/_/.test(objective.displayName)
      && objective.name !== 'constant'
      && objective.name !== 'hc_constant'
      && objective.name !== 'ms_count'
      && objective.name !== 'ms_temp'
      && objective.name !== 'ms_time'
      && objective.name !== 'ms_warnToggle'
      && objective.name !== 'nc_constant'
      && objective.name !== 'nc_x'
      && objective.name !== 'nc_y'
      && objective.name !== 'nc_z'
      && objective.displayName !== 'Confetti Creepers Config'
    ));
    objectives.sort((a: any, b: any) => {
      return a.displayName.localeCompare(b.displayName);
    });
    return objectives;
  },
});

export default function Scoreboard() {
  const objectives = useRecoilValue(objectivesQuery);
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell><>Objective</></TableCell>
            <TableCell><>Player</></TableCell>
            <TableCell><>Score</></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {objectives.map(objective => <Objective key={objective.name} {...objective} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
  

