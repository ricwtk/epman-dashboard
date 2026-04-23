import { COURSE_TYPES } from "@/constants";
import { formatId } from "./common";
// import { courses } from "./courseExamples";
import type {
  Course,
  Co,
  Allocation,
  Plan,
  Assessment,
  Breakdown,
  CourseInfo,
} from "@/types/course";

// currently using courseExamples.ts
// export function getCourseByCode(code: string): Course {
//   return courses.find((course) => course.code === code) || createCourseObject({ code: code });
// }

// currently using courseExamples.ts
// export function getCourseInfoByCode(code: string): { code: string, name: string, credits: number } {
//   let thisCourse = courses.find((course) => course.code === code) || createCourseObject({ code: code });
//   return { code: thisCourse.code, name: thisCourse.name, credits: thisCourse.credits };
// }

// currently using courseExamples.ts
// export function getCourseList(): { code: string, name: string }[] {
//   return courses.map((course) => ({ code: course.code, name: course.name }));
// }

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
export const createCourseObject = (overrides?: Partial<Course>): Course => {
  const newCourse: Course = {
    id: "",
    code: "",
    name: "",
    prerequisites: [],
    lecturers: [],
    category: "",
    courseType: COURSE_TYPES[0].key,
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
    references: {
      main: [],
      additional: [],
    },
    gradingScheme: "default",
    committed: {
      on: new Date(),
      by: ""
    },
    revision: "1.0.0",
    parentRevision: "",
    ...overrides
  };
  newCourse.id = formatId(newCourse);
  return newCourse;
};

export const createCo = (overrides?: Partial<Co>): Co => ({
  description: "",
  bloomtax: ['', 0],
  pos: [],
  wks: [],
  wps: [],
  eas: [],
  sdg: false,
  ...overrides
});

export const createPlan = (description?: string, overrides?: Partial<Allocation>): Plan => ({
  description: description || '',
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

export const createAssessment = (overrides?: Partial<Assessment>): Assessment => ({
  description: '',
  component: '',
  weightage: 0,
  cos: [],
  breakdown: [],
  wps: [],
  eas: [],
  ...overrides
});

export const createBreakdown = (overrides?: Partial<Breakdown>): Breakdown => ({
  description: '',
  weightage: 0,
  co: 1,
  wps: [],
  eas: [],
  rubrics: {},
  ...overrides
});

export const createCourseInfo = (course?: Partial<Course>): CourseInfo => ({
  name: course?.name || "",
  code: course?.code || "",
  credits: course?.credits || 0,
  category: course?.category || "",
  lecturers: course?.lecturers || [],
  courseType: course?.courseType || COURSE_TYPES[0].key,
  transferableSkills: course?.transferableSkills || [],
  deliveryMethods: course?.deliveryMethods || []
});

export function getCEPCEA(assessment: Assessment, coIndex: number, componentType: 'wp' | 'ea', componentList: string[][]): string[][] {
  const descriptors: string[][] = []
  const componentKey = `${componentType}s` as 'wps' | 'eas'
  const componentLabel = `${componentType.toUpperCase()}`
  if (assessment) {
    if (assessment.breakdown.length > 0) {
      for (const breakdown of assessment.breakdown) {
        if (breakdown.co == coIndex) {
          if (breakdown[componentKey] && breakdown[componentKey].length > 0) {
            descriptors.push(...breakdown[componentKey].sort().map(
              (componentNumber: number) => componentList[componentNumber-1] || [`${componentLabel}${componentNumber}`, ]
            ))
          }
        }
      }
    } else {
      if (assessment.cos.includes(coIndex)) {
        if (assessment[componentKey] && assessment[componentKey].length > 0) {
          descriptors.push(...assessment[componentKey].sort().map(
            (componentNumber: number) => componentList[componentNumber-1] || [`${componentLabel}${componentNumber}`, ]
          ))
        }
      }
    }
  }
  return [...new Map(descriptors.map(descriptor => [descriptor[0], descriptor])).values()]
}
