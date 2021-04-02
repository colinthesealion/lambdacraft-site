import React from 'react';
import { TreeView } from '@material-ui/lab';
import { ArrowRight, ArrowDropDown } from '@material-ui/icons';

import AdvancementGroup from '../AdvancementGroup';

import { AdvancementData } from '../../types';

const orderedGroupNames = [
  'Minecraft',
  'Adventure',
  'Nether',
  'End',
  'Husbandry',
] as const;

interface AdvancementsProps {
    advancementData: AdvancementData;
}
export default function Advancements({ advancementData }: AdvancementsProps) {
  return (
    <TreeView
      defaultCollapseIcon={<ArrowDropDown />}
      defaultExpandIcon={<ArrowRight />}
    >
      {orderedGroupNames.map(groupName =>
        <AdvancementGroup key={groupName} groupName={groupName} advancementData={advancementData} />
      )}
    </TreeView>
  );
}