import React from 'react';
import {
  IconButton,
  TableCell,
  TableRow,
} from '@material-ui/core';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@material-ui/icons';

export interface Score {
  name: string;
  score: number;
}
export interface ObjectiveDefinition {
  displayName: string;
  name: string;
  scores: Score[];
}

export default function Objective({ displayName, scores }: ObjectiveDefinition) {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = React.useCallback(() => setOpen(!open), [setOpen, open]);
  const [topScore, ...otherScores] = scores;
  if (!topScore) {
    return null;
  }
  return (
    <>
      <TableRow>
        <TableCell>
          {otherScores.length > 0 && (
            <IconButton size="small" onClick={toggleOpen}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </TableCell>
        <TableCell><>{displayName}</></TableCell>
        <TableCell><>{topScore.name}</></TableCell>
        <TableCell><>{topScore.score}</></TableCell>
      </TableRow>
      {open && otherScores.map(score => (
        <TableRow key={score.name}>
            <TableCell />
            <TableCell />
            <TableCell><>{score.name}</></TableCell>
            <TableCell><>{score.score}</></TableCell>
        </TableRow>
      ))}
    </>
  );
}