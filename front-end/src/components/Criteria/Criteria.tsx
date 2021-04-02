import React from 'react';
import { TreeItem } from '@material-ui/lab';

import TodoLabel from '../TodoLabel';
import { CriteriaData, CriterionDefinition } from "../../types";
import { deNamespace } from '../../utils';

function isDone(definition: CriterionDefinition, data?: CriteriaData) {
    return !!data && definition.id in data;
}

interface CriteriaProps {
    definition: CriterionDefinition;
    data?: CriteriaData;
}
export default function Criteria({ definition, data}: CriteriaProps) {
  const { id } = definition;
  const name = React.useMemo(() => definition.name || deNamespace(definition.id), [definition.id]);
  const done = React.useMemo(
    () => isDone(definition, data),
    [definition, data]
  );
  return <TreeItem nodeId={id} label={<TodoLabel id={id} name={name} done={done} />} />;
}