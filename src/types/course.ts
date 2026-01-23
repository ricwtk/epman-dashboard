export interface Co {
  description: string;
  bloomtax: [string, number]; // e.g., ['c', 6]
  pos: number[];
  wks: number[];
  wps: number[];
  eas: number[];
  sdg: boolean;
}

export interface Breakdown {
  description: string;
  weightage: number;
  co: number;
  wps?: number[];
  eas?: number[];
  rubrics?: any; // Define rubric structure as needed
}

export interface Assessment {
  description: string;
  component: string;
  weightage: number;
  cos: number[];
  breakdown: Breakdown[];
  wps?: number[];
  eas?: number[];
}

export interface Allocation {
  lecture: { online: number; f2f: number };
  practical: { online: number; f2f: number };
  tutorial: { online: number; f2f: number };
  assessment: { online: number; f2f: number };
  self: { online: number; f2f: number };
  others: { online: number; f2f: number };
}

export interface Plan {
  description: string;
  hours: Allocation;
}

export interface Reference {
  description: string;
  label: "main" | "additional";
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
  teachingPlan: Plan[];
  references: Reference[];
  gradingScheme: string; // function name
  committed: {
    on: Date;
    by: string;
  };
  revision: string;
  parentRevision: string;
}
