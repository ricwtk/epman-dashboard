import type { Allocation } from "@/types/course";

// export const FIREBASE_EMAIL_LOCAL_STORAGE_NAME = "epman:emailforsignin"
export const STRUCTURE_DISPLAY_MODES = ['by year', 'by semester'];
export const NUMBER_OF_SEMESTER_PER_YEAR = 3;
export const COURSE_TYPES = [
  { key: "examBased", label: "Exam Based" },
  { key: "projectBased", label: "Project Based" }
] as const;
export const BLOOM_TAXONOMY = [
  {
    domain: "Cognitive",
    levels: [
      'Remember',
      'Understand',
      'Apply',
      'Analyze',
      'Synthesize',
      'Evaluate'
    ]
  },
  {
    domain: "Affective",
    levels: [
      'Receiving',
      'Responding',
      'Valuing',
      'Organization',
      'Characterizing by a Value'
    ]
  },
  {
    domain: "Psychomotor",
    levels: [
      'Imitation',
      'Manipulation',
      'Precision',
      'Articulation',
      'Naturalisation'
    ]
  }
]

export const DATALEVEL_OPTIONS = [
  { title: "Read Only", description: "No edit permission" },
  { title: "Edit Course", description: "Course content" },
  { title: "Edit Programme", description: "Programme details" },
  { title: "Edit School", description: "School parameters" }
]

export const USERLEVEL_OPTIONS = [
  { title: "Read Only", description: "No edit permission" },
  { title: "Edit User", description: "Profile" },
  { title: "Create User", description: "New user" },
  { title: "Delete User", description: "Delete user" }
]

export const DEFAULT_PW = 'sunway123';

export const SLT_CATEGORIES: { short: string; long: string; key: keyof Allocation }[] = [
  { short: 'L', long: "Lecture", key: "lecture" },
  { short: 'T', long: "Tutorial", key: "tutorial" },
  { short: 'P', long: "Practical", key: "practical" },
  { short: 'A', long: "Assessment", key: "assessment" },
  { short: 'O', long: "Others", key: "others" },
  { short: 'IL', long: "Independent Learning", key: "self" },
]

export const RECOMMENDATION_CLASS = "bg-green-100"
