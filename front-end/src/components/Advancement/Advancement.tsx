import React from 'react';
import { TreeItem } from '@material-ui/lab';

import Criteria from '../Criteria';
import TodoLabel from '../TodoLabel';
import { AdvancementData, AdvancementDefinition } from "../../types";

export function isDone(definition: AdvancementDefinition, data: AdvancementData) {
    return !!data[definition.id]?.done;
}

interface AdvancementProps {
    definition: AdvancementDefinition;
    data: AdvancementData;
}
export default function Advancement({ definition, data}: AdvancementProps) {
  const { id, name, criteria } = definition;
  const done = React.useMemo(
      () => isDone(definition, data),
      [definition, data]
  );
  return (
    <TreeItem nodeId={id} label={<TodoLabel name={name} done={done} />}>
      {!!criteria.length && criteria[0].criterion.map(criteria => (
        <Criteria key={criteria.id} definition={criteria} data={data[id].criteria} />
      ))}
    </TreeItem>
  );
}