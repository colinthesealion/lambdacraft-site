import React from 'react';
import { TreeItem } from '@material-ui/lab';

import Advancement, { isDone as isAdvancementDone } from '../Advancement';
import TodoLabel from '../TodoLabel';
import { getAdvancementDefinitionsForGroup } from '../../utils';
import { AdvancementData, AdvancementDefinition } from '../../types';

interface AdvancmentGroupProps {
    groupName: string;
    advancementData: AdvancementData;
}

function isDone(advancmentDefinitions: AdvancementDefinition[], advancementData: AdvancementData) {
  return advancmentDefinitions.every(definition => isAdvancementDone(definition, advancementData));
}

export default function AdvancementGroup({ groupName, advancementData }: AdvancmentGroupProps) {
  const [rootDefinition, ...advancementDefinitions] = getAdvancementDefinitionsForGroup(groupName);
  const done = React.useMemo(
    () => isDone(advancementDefinitions, advancementData),
    [advancementDefinitions, advancementData]
  );
  return (
    <TreeItem nodeId={rootDefinition.id} label={<TodoLabel id={rootDefinition.id} name={rootDefinition.name} done={done} />}>
      {advancementDefinitions.map(advancementDefinition => (
        <Advancement key={advancementDefinition.id} definition={advancementDefinition} data={advancementData} />
      ))}
    </TreeItem>
  );
}