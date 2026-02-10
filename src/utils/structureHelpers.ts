import { type ProgrammeStructure } from "@/types/programme";
import { structures } from "./structureExamples";
import { getCourseInfoByCode } from "./courseHelpers";

// using structureExamples
export const getStructureByProgrammeAndLabel = (
  programmeCode: string,
  label: string
): ProgrammeStructure => {
  return structures.find(item => item.programme === programmeCode && item.label === label) || createNewStructure();
};

// using structureExamples
export const getProgrammesByCourse = (
  courseCode: string
): Partial<ProgrammeStructure>[] => {
  return structures.filter(item =>
    item.structure.some(sem => sem.includes(courseCode))
  ).map(item => ({
    programme: item.programme,
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
): string[] => {
  return structures
    .filter((item) => item.programme === programme)
    .map((item) => item.label);
};

/**
 * Retrieves all course information associated with a specific Structure.
 * @param structure - The structure array with course codes.
 * @returns The structure array with course information.
 */
export const getCourseInfoInStructure = (
  structure: string[][],
): { code: string, name: string, credits: number }[][] => {
  return structure.map((sem) =>
    sem.map((course) => getCourseInfoByCode(course))
  );
};

/**
 * Converts a structure array into a table format,
 * with each group of rows representing a semester
 * and each column representing a year.
 * |       | Year 1   | Year 2   | Year 3   | Year 4   |
 * | Sem 1 | Course 1 | Course 2 | Course 3 | Course 4 |
 * | Sem 2 | Course 5 | Course 6 | Course 7 | Course 8 |
 * | Sem 3 | Course 9 | Course 10| Course 11| Course 12|
 * @param structure - The structure array to convert.
 * @returns The converted table.
 */
export const convertStructureToTable = (
  structure?: any[][]
): {
  info: {
    numberOfSemestersPerYear: number;
    numberOfYears: number;
  };
  structure: any[][][]
} => {
  if (!structure) {
    return {
      info: {
        numberOfSemestersPerYear: 3,
        numberOfYears: 1,
      },
      structure: [],
    };
  }
  const numberOfSemestersPerYear = 3;
  const numberOfYears = Math.ceil(structure.length / numberOfSemestersPerYear);
  let arrangedStructure: string[][][] = [];

  for (let s = 0; s < numberOfSemestersPerYear; s++) {
    let semesterStructure: string[][] = [];
    for (let i = s; i < structure.length; i+=numberOfSemestersPerYear) {
      semesterStructure.push(structure[i] || []);
    }
    arrangedStructure.push(semesterStructure);
  };
  return {
    info: {
      numberOfSemestersPerYear,
      numberOfYears,
    },
    structure: arrangedStructure,
  };
};

export const createNewStructure = (
  overrides?: Partial<ProgrammeStructure>
): ProgrammeStructure => {
  return {
    programme: "",
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
