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

import type { CourseType } from "@/types/course";
export interface Po {
  attribute: string;
  descriptor: string;
  mapping: {
    peo: number;
  } & {
    [K in CourseType]: Mapping;
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

export interface Structure {
  [semesterKey: string]: string[]
}

export interface ProgrammeStructure {
  id: string;
  programme: string;
  label: string; // 'default' | 'direct entry' | student name
  semesters: {
    [semesterKey: string]: string[];
  };
  semesterOrder: string[];
  committed: {
    on: Date | null;
    by: string;
  };
  revision: string;
  parentRevision: string;
}

export interface ProgrammeStructureInfo {
  programme: string,
  label: string
}
