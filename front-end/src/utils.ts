import advancementDefinitions from './advancement-definitions.json';
import { AdvancementDefinition, AdvancementDefinitionByGroup } from './types';

export function getAdvancementDefinitionsForGroup(groupName: string): AdvancementDefinition[] {
    return (advancementDefinitions as AdvancementDefinitionByGroup)[groupName] || [];
}

export function deNamespace(namespacedId: string) {
    let [,id] = namespacedId.split(':');
    if (!id) {
        id = namespacedId;
    }
    return id.split('_').map(
        word => word.substr(0, 1).toUpperCase() + word.substr(1)
    ).join(' ');
}