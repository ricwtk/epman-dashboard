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

export function createNewSchool(overrides?: Partial<School>): School {
  return {
    name: 'New School',
    code: 'NS',
    programmes: [],
    components: {},
    ...overrides,
  };
}
