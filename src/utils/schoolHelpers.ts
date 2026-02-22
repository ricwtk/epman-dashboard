import type { School } from '@/types/school';
import { schools } from './schoolExamples';

// using schoolExamples.ts
export function getSchoolList(): { code: string, name: string }[] {
  return schools.map((school) => ({ code: school.code, name: school.name }));
}

// using schoolExamples.ts
export function getSchoolByCode(code: string): School {
  return schools.find((school) => school.code === code) || createNewSchool();
}

// using schoolExamples.ts
export function getSchoolByProgrammeCode(programmeCode: string): School | null {
  return schools.find(school => school.programmes.includes(programmeCode)) || null;
}

export function createNewSchool(overrides?: Partial<School>): School {
  const newSchool = {
    id: "",
    name: 'New School',
    code: 'NS',
    revision: "",
    parentRevision: "",
    committed: {
      on: null,
      by: ""
    },
    programmes: [],
    components: {},
    ...overrides,
  };
  newSchool.id = `${newSchool.code}-${newSchool.revision}`;
  return newSchool;
}
