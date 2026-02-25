export interface Cohort {
  cohort: string;
  intakeSemester: string;
  revision: string;
  parentRevision: string;
  structureLabel: string;
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
  id: string;
  code: string;
  name: string;
  revision: string;
  parentRevision: string;
  peoList: string[];
  poList: Po[];
  committed: {
    on: Date | null;
    by: string;
  };
}

export interface ProgrammeStructure {
  id: string;
  programme: string;
  label: string; // 'default' | 'direct entry' | student name
  // structure: { [semesterKey: string]: string[] };
  structure: string[][];
  committed: {
    on: Date | null;
    by: string;
  };
  revision: string;
  parentRevision: string;
}
