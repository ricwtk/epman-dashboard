import { courses } from "./courseexamples";

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

export function getCourseById(code: string): Course | undefined {
  return courses.find((course) => course.code === code);
}

export const getTotalHours = (hours: { online: number, f2f: number }) => (hours.online + hours.f2f);

export const getTopicHours = (hours: Allocation) =>
  getTotalHours(hours.lecture)
  + getTotalHours(hours.tutorial)
  + getTotalHours(hours.practical)
  + getTotalHours(hours.assessment)
  + getTotalHours(hours.others)
  + getTotalHours(hours.self);

export const getTotalComponentHours = (teachingPlan: Plan[], component: keyof Allocation) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + getTotalHours(topic.hours[component]);
  }, 0);
  return total;
};

export const getTotalComponentOnlineHours = (teachingPlan: Plan[], component: keyof Allocation) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + topic.hours[component].online;
  }, 0);
  return total;
};

export const getTotalComponentF2FHours = (teachingPlan: Plan[], component: keyof Allocation) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + topic.hours[component].f2f;
  }, 0);
  return total;
};

export const getTotalHoursForCourse = (teachingPlan: Plan[]) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + getTopicHours(topic.hours);
  }, 0);
  return total;
};

export const getCreditHours = (totalHours: number) => Math.round(totalHours / 40);
