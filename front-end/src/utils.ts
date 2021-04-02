import advancementDefinitions from './advancement-definitions.json';
import { AdvancementDefinition, AdvancementDefinitionByGroup } from './types';

export function getAdvancementDefinitionsForGroup(groupName: string): AdvancementDefinition[] {
    return (advancementDefinitions as AdvancementDefinitionByGroup)[groupName] || [];
}