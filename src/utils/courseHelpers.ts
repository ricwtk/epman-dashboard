import { courses } from "./courseExamples";
import type {
  Course,
  Allocation,
  Plan,
  Assessment
} from "@/types/course";

// currently using courseExamples.ts
export function getCourseByCode(code: string): Course | undefined {
  return courses.find((course) => course.code === code);
}

// currently using courseExamples.ts
export function getCourseList(): { code: string, name: string }[] {
  return courses.map((course) => ({ code: course.code, name: course.name }));
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

// default objects creation
export const createNewCourse = (overrides?: Partial<Course>): Course => {
  const defaultCourse: Course = {
    code: "",
    name: "",
    prerequisites: [],
    lecturers: [],
    category: "",
    semester: 1,
    year: 1,
    credits: 0,
    synopsis: "",
    transferableSkills: [],
    deliveryMethods: [],
    cos: [],
    startFrom: ['semester', new Date().toISOString().substring(0, 7)],
    assessments: [],
    teachingPlan: [],
    references: [],
    gradingScheme: "default",
    committed: {
      on: new Date(),
      by: ""
    },
    revision: "1.0.0",
    parentRevision: ""
  };

  return { ...defaultCourse, ...overrides };
};

export const createPlan = (description: string, overrides?: Partial<Allocation>): Plan => ({
  description,
  hours: {
    lecture: { online: 0, f2f: 0 },
    practical: { online: 0, f2f: 0 },
    tutorial: { online: 0, f2f: 0 },
    assessment: { online: 0, f2f: 0 },
    self: { online: 0, f2f: 0 },
    others: { online: 0, f2f: 0 },
    ...overrides
  }
});

export const createAssessment = (description: string, component: string): Assessment => ({
  description,
  component,
  weightage: 0,
  cos: [],
  breakdown: []
});
