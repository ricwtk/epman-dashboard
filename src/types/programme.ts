export interface Cohort {
  cohort: string;
  intakeSemester: string;
  revision: string;
  parentRevision: string;
  structureVersion: string[];
  programme: string;
  programmeRevision: string;
}

export interface Mapping {
  wk: number[];
  wp: number[];
  ea: number[];
  sdg: boolean;
}

export interface Po {
  attribute: string;
  descriptor: string;
  mapping: {
    peo: number;
    examBased: Mapping;
    projectBased: Mapping;
  }
}

export interface Programme {
  code: string;
  name: string;
  revision: string;
  parentRevision: string;
  poList: Po[];
}

export interface ProgrammeStructure {
  programme: string;
  label: string; // 'default' | 'direct entry' | student name
  structure: string[][]; // array of array of course codes
  committed: {
    on: Date;
    by: string;
  };
  version: string;
  parentVersion: string;
}
