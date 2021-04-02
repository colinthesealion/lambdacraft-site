import { selectorFamily, useRecoilValue } from 'recoil';

import Advancements from './Advancements';
import { getPlayerAdvancementData } from '../api';
import { AdvancementData, Player } from '../types';

const advancementDataQuery = selectorFamily<AdvancementData, string>({
  key: 'AdvancementData',
  get: uuid => () => getPlayerAdvancementData(uuid),
});

interface PlayerAdvancmentProps {
  player: Player;
}

export default function PlayerAdvancements({ player }: PlayerAdvancmentProps) {
  const advancementData = useRecoilValue(advancementDataQuery(player.uuid));
  return <Advancements advancementData={advancementData} />;
}
