import type {
  Po,
  Mapping,
  Programme
} from "@/types/programme"
import { programmes } from "@/utils/programmeExamples"
import { formatId } from './common';

// using programmeExamples.ts
export function getProgrammeList(): { code: string, name: string }[] {
  return programmes.map((programme) => ({ code: programme.code, name: programme.name }));
}

// using programmeExamples.ts
export function getProgrammeByCode(code: string): Programme {
  return programmes.find((programme) => programme.code === code) || createNewProgramme({ code: code });
}

/**
 * A utility to generate default "empty" states for your interfaces.
 * This simulates a constructor by returning a fresh object of the specified type.
 */
export const createNewMapping = (overrides?: Partial<Mapping>): Mapping => ({
  wk: [],
  wp: [],
  ea: [],
  sdg: false,
  ...overrides,
});

export const createNewPo = (overrides?: Partial<Po>): Po => ({
  attribute: "",
  descriptor: "",
  mapping: {
    peo: 1,
    examBased: createNewMapping(),
    projectBased: createNewMapping(),
  },
  ...overrides,
});

export const createNewProgramme = (overrides?: Partial<Programme>): Programme => {
  const newProgramme = {
    id: "",
    code: "",
    name: "",
    revision: "",
    parentRevision: "",
    peoList: [],
    poList: [],
    committed: {
      on: null,
      by: ""
    },
    ...overrides,
  }
  newProgramme.id = formatId(newProgramme);
  return newProgramme;
};
