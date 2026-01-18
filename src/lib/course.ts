import { courses } from "./courseexamples";

export interface Co {
  description: string;
  bloomtax: [string, number]; // e.g., ['c', 6]
  pos: number[];
  was: number[];
  wks: number[];
  wps: number[];
  eas: number[];
  sdg: boolean;
}

export interface Breakdown {
  description: string;
  weightage: number;
  cos: number[];
  rubrics?: any; // Define rubric structure as needed
}

export interface Assessment {
  description: string;
  weightage: number;
  cos: number[];
  breakdown: Breakdown[];
}

export interface Allocation {
  lecture?: { online: number; f2f: number };
  practical?: { online: number; f2f: number };
  tutorial?: { online: number; f2f: number };
  self?: { online: number; f2f: number };
  others?: { online: number; f2f: number };
}

export interface Plan {
  week: string;
  description: string;
  type: 'content' | 'assessment';
  hours: Allocation[];
}

export interface Reference {
  desc: string;
  label: string;
}

export interface Course {
  code: string;
  name: string;
  prerequisites: string[];
  lecturers: string[];
  category: string;
  semester: number;
  year: number;
  credits: number;
  synopsis: string;
  transferableSkills: string[];
  deliveryMethods: string[];
  cos: Co[];
  startFrom: [string, string]; // ['semester' | 'intake', 'YYYY-MM']
  assessments: Assessment[];
  weeklyPlan: Plan[];
  references: Reference[];
  gradingScheme: string; // function name
  committed: {
    on: Date;
    by: string;
  };
  revision: string;
  parentRevision: string;
}

export function getCourseById(code: string): Course | undefined {
  return courses.find((course) => course.code === code);
}
