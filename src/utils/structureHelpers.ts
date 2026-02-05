import { type ProgrammeStructure } from "@/types/programme";
import { structures } from "./structureExamples";

// using structureExamples
export const getStructureByProgrammeAndLabel = (
  programmeCode: string,
  programmeRevision: string,
  label: string
): ProgrammeStructure | undefined => {
  return structures.find(item => item.programme === programmeCode && item.programmeRevision === programmeRevision && item.label === label);
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

/**
 * Converts a structure array into a table format,
 * with each group of rows representing a semester
 * and each column representing a year.
 * @param structure - The structure array to convert.
 * @returns The converted table.
 */
export const convertStructureToTable = (
  structure: string[][]
): string[][] => {
  const maxSemesters = Math.max(...structure.map(s => s.length));
  const table = Array.from({ length: maxSemesters }, () => []);

  structure.forEach((semester, index) => {
    semester.forEach((course, courseIndex) => {
      table[courseIndex].push(course);
    });
  });

  return table;
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
