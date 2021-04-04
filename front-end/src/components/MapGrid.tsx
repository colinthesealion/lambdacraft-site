import { getMapURL } from '../api';

interface MapGridProps {
  rows: string[][];
}

export default function MapGrid({ rows }: MapGridProps) {
  return (
    <>
      {rows.map((row, index) => (
        <div key={index}>
          {row.map(id => (
            <img
              key={id}
              title={`Lambda Craft Map ${id}`}
              alt={`Lambda Craft Map ${id}`}
              src={getMapURL(id)}
            />
          ))}
        </div>
      ))}
    </>
  );
}