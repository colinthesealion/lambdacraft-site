import React from 'react';
import { GridList } from '@material-ui/core';

import { getMapURL } from '../api';

interface MapGridProps {
  rows: string[][];
}

export default function MapGrid({ rows }: MapGridProps) {
  return (
    <GridList cols={rows[0].length} cellHeight={128} style={{ width: 128 * rows[0].length }}>
      {rows.map((row, index) => (
        <React.Fragment key={index}>
          {row.map(id => (
            <img
              key={id}
              title={`Lambda Craft Map ${id}`}
              alt={`Lambda Craft Map ${id}`}
              src={getMapURL(id)}
            />
          ))}
          <br />
        </React.Fragment>
      ))}
    </GridList>
  );
}