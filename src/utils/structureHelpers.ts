import { type ProgrammeStructure } from "@/types/programme";
import { structures } from "./structureExamples";

// using structureExamples
export const getStructuresByProgramme = (
  programmeCode: string
): ProgrammeStructure[] => {
  return structures.filter(item => item.programme === programmeCode);
};

// using structureExamples
export const getProgrammesByCourse = (
  courseCode: string
): Partial<ProgrammeStructure>[] => {
  return structures.filter(item =>
    item.structure.some(sem => sem.includes(courseCode))
  ).map(item => ({
    programme: item.programme,
    programmeRevision: item.programmeRevision,
    structureLabel: item.label,
    structureRevision: item.revision
  }));
};

// using structureExamples
/**
 * Retrieves all labels associated with a specific Programme and Revision.
 * @param programme - The programme code (e.g., 'BCIV').
 * @param revision - The revision string (e.g., '2026-V1').
 */
export const getStructureLabelsByProgramme = (
  programme: string,
  programmeRevision: string
): string[] => {
  return structures
    .filter(
      (item) =>
        item.programme === programme &&
        item.programmeRevision === programmeRevision
    )
    .map((item) => item.label);
};

export const createNewStructure = (
  overrides?: Partial<ProgrammeStructure>
): ProgrammeStructure => {
  return {
    programme: "",
    programmeRevision: "",
    label: "",
    structure: [],
    committed: {
      on: null, // Automatically sets current time
      by: ""
    },
    revision: "",
    parentRevision: "",
    ...overrides
  };
};
