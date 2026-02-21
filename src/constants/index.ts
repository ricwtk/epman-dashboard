export const FIREBASE_EMAIL_LOCAL_STORAGE_NAME = "epman:emailforsignin"
export const STRUCTURE_DISPLAY_MODES = ['by year', 'by semester'];
export const NUMBER_OF_SEMESTER_PER_YEAR = 3;
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

export const PO_ATTRIBUTES = [
  "Engineering Knowledge",
  "Problem Analysis",
  "Design/Development of Solutions",
  "Investigation",
  "Tool Usage",
  "The Engineer and the World",
  "Ethics",
  "Individual and Collaborative Team Work",
  "Communication",
  "Project Management and Finance",
  "Life-long Learning"
];

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
