import React from 'react';
import { TreeItem } from '@material-ui/lab';

import TodoLabel from '../TodoLabel';
import { CriteriaData, CriterionDefinition } from "../../types";

function isDone(definition: CriterionDefinition, data?: CriteriaData) {
    return !!data && definition.id in data;
}

function getName({ id, name }: CriterionDefinition) {
  if (name) {
    return name;
  }
  let [,key] = id.split(':');
  key = key || id.substr(0,1).toUpperCase() + id.substr(1);
  const parts = key.split('_').map(part => part.substr(0,1).toUpperCase() + part.substr(1));
  return parts.join(' ');
}

interface CriteriaProps {
    definition: CriterionDefinition;
    data?: CriteriaData;
}
export default function Criteria({ definition, data}: CriteriaProps) {
  const { id } = definition;
  const name = React.useMemo(() => getName(definition), [definition]);
  const done = React.useMemo(
    () => isDone(definition, data),
    [definition, data]
  );
  return <TreeItem nodeId={id} label={<TodoLabel name={name} done={done} />} />;
}