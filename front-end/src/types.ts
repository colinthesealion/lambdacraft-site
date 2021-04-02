export interface CriterionDefinition {
  id: string;
  name?: string;
  icon?: string;
}

export interface CriteriaDefintion {
  goal: string;
  criterion: CriterionDefinition[];
}

export interface AdvancementDefinition {
  id: string;
  name: string;
  icon?: string;
  criteria: CriteriaDefintion[];
}

export interface AdvancementDefinitionByGroup {
  [key: string]: AdvancementDefinition[];
}

export interface CriteriaData {
  [key: string]: string;
}

export interface AdvancementDatum {
    done: boolean;
    criteria: CriteriaData;
}

export interface AdvancementData {
    [key: string]: AdvancementDatum;
}

export interface Player {
  uuid: string;
  name: string;
}