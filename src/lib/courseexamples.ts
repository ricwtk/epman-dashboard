import { type Course } from "./course";

export const courses: Course[] = [
  {
    code: "CS101",
    name: "Introduction to Programming",
    category: "Core",
    semester: 1,
    year: 1,
    credits: 3,
    synopsis:
      "This course introduces fundamental programming concepts including variables, control structures, functions, and basic problem-solving techniques.",
    prerequisites: [],
    lecturers: ["Richard Wong"],
    transferableSkills: ["Problem Solving", "Logical Thinking", "Basic Coding"],
    deliveryMethods: ["Lectures", "Hands-on Labs", "Tutorials"],

    cos: [
      {
        description: "Explain basic programming concepts",
        bloomtax: ["understand", 2],
        pos: [1, 2],
        was: [1, 2],
        wks: [1, 2],
        wps: [1, 2],
        eas: [1, 2],
        sdg: true
      },
      {
        description: "Write simple programs using control structures",
        bloomtax: ["apply", 3],
        pos: [2, 3],
        was: [2, 3],
        wks: [2, 3],
        wps: [2, 3],
        eas: [2, 3],
        sdg: true
      }
    ],

    startFrom: ["semester", "2025-09"],

    assessments: [
      {
        description: "Continuous Assessment",
        component: "Written Assessment",
        weightage: 40,
        cos: [1, 2],
        breakdown: [
          { description: "Lab Exercises", weightage: 20, co: 2, wps: [2] },
          { description: "Quiz", weightage: 20, co: 1, wps: [2], eas: [1,2,3] }
        ]
      },
      {
        description: "Final Examination",
        component: "Written Assessment",
        weightage: 60,
        cos: [1, 2],
        breakdown: [],
        wps: [4]
      }
    ],

    weeklyPlan: [
      {
        week: "Week 1",
        description: "Programming fundamentals and variables",
        type: "content",
        hours: [{ lecture: { online: 1, f2f: 2 } }]
      }
    ],

    references: [
      { description: "Introduction to Programming Using Python", label: "main" },
      { description: "Programming Using Python", label: "additional" },
      { description: "Programming Using Python 2", label: "additional" },
      { description: "Programming Using Python 3", label: "additional" },
    ],

    gradingScheme: "standardGrade",
    committed: { on: new Date("2025-07-01"), by: "Richard Wong" },
    revision: "1.0",
    parentRevision: ""
  },

  {
    code: "CS202",
    name: "Data Structures",
    category: "Core",
    semester: 2,
    year: 2,
    credits: 3,
    synopsis:
      "This course covers fundamental data structures and their applications in efficient algorithm design.",
    prerequisites: ["CS101"],
    lecturers: ["Richard Wong"],
    transferableSkills: ["Algorithmic Thinking", "Efficiency Analysis"],
    deliveryMethods: ["Lectures", "Practical Labs"],

    cos: [
      {
        description: "Describe common data structures",
        bloomtax: ["understand", 2],
        pos: [1],
        was: [1],
        wks: [1],
        wps: [1],
        eas: [1],
        sdg: true
      },
      {
        description: "Implement data structures in code",
        bloomtax: ["apply", 3],
        pos: [2, 3],
        was: [2, 3],
        wks: [2, 3],
        wps: [2, 3],
        eas: [2, 3],
        sdg: false
      }
    ],

    startFrom: ["semester", "2026-02"],

    assessments: [
      {
        description: "Assignments",
        component: "Assignment",
        weightage: 50,
        cos: [2],
        breakdown: [],
        wps: [1,2],
        eas: [2],
      },
      {
        description: "Final Exam",
        component: "Written Assessment",
        weightage: 50,
        cos: [1, 2],
        breakdown: [
          { description: "Linked List Assignment", weightage: 25, co: 1, eas: [1], wps: [1] },
          { description: "Tree Assignment", weightage: 25, co: 2, wps: [2], eas: [2] }
        ]
      }
    ],

    weeklyPlan: [
      {
        week: "Week 4",
        description: "Stacks and Queues",
        type: "content",
        hours: [
          { lecture: { online: 1, f2f: 2 } },
          { practical: { online: 0, f2f: 1 } }
        ]
      }
    ],

    references: [
      { description: "Data Structures and Algorithms in Java", label: "main" }
    ],

    gradingScheme: "standardGrade",
    committed: { on: new Date("2025-11-15"), by: "Richard Wong" },
    revision: "1.0",
    parentRevision: ""
  },

  {
    code: "SE301",
    name: "Software Engineering",
    category: "Core",
    semester: 1,
    year: 3,
    credits: 3,
    synopsis:
      "Focuses on software development life cycle models, requirements engineering, design principles, and team-based development.",
    prerequisites: ["CS202"],
    lecturers: ["Richard Wong"],
    transferableSkills: ["Teamwork", "Communication", "Project Management"],
    deliveryMethods: ["Lectures", "Case Studies", "Project-Based Learning"],

    cos: [
      {
        description: "Explain software development life cycle models",
        bloomtax: ["understand", 2],
        pos: [1, 4],
        was: [1, 4],
        wks: [1, 4],
        wps: [1, 4],
        eas: [1, 4],
        sdg: false
      },
      {
        description: "Apply software design principles in projects",
        bloomtax: ["apply", 3],
        pos: [3, 5],
        was: [3, 5],
        wks: [3, 5],
        wps: [3, 5],
        eas: [3, 5],
        sdg: false
      }
    ],

    startFrom: ["intake", "2025-10"],

    assessments: [
      {
        description: "Group Project",
        component: "Project",
        weightage: 60,
        cos: [1, 2],
        breakdown: [
          { description: "Proposal", weightage: 20, co: 1 },
          { description: "Final System", weightage: 40, co: 2 }
        ]
      },
      {
        description: "Final Exam",
        component: "Written Assessment",
        weightage: 40,
        cos: [1],
        breakdown: []
      }
    ],

    weeklyPlan: [
      {
        week: "Week 8",
        description: "Agile and Scrum",
        type: "content",
        hours: [{ lecture: { online: 1, f2f: 2 } }]
      }
    ],

    references: [
      { description: "Software Engineering by Sommerville", label: "main" }
    ],

    gradingScheme: "projectHeavyGrade",
    committed: { on: new Date("2025-08-20"), by: "Richard Wong" },
    revision: "1.1",
    parentRevision: "1.0"
  },

  {
    code: "AI401",
    name: "Artificial Intelligence",
    category: "Elective",
    semester: 2,
    year: 4,
    credits: 3,
    synopsis:
      "Introduces artificial intelligence concepts including search, machine learning, and neural networks.",
    prerequisites: ["CS202", "SE301"],
    lecturers: ["Richard Wong"],
    transferableSkills: ["Analytical Thinking", "Model Evaluation"],
    deliveryMethods: ["Lectures", "Labs", "Mini Projects"],

    cos: [
      {
        description: "Explain fundamental AI concepts",
        bloomtax: ["understand", 2],
        pos: [1],
        was: [1],
        wks: [1],
        wps: [1],
        eas: [1],
        sdg: true
      },
      {
        description: "Develop simple AI models",
        bloomtax: ["create", 6],
        pos: [2, 3],
        was: [2, 3],
        wks: [2, 3],
        wps: [2, 3],
        eas: [2, 3],
        sdg: true
      }
    ],

    startFrom: ["semester", "2026-09"],

    assessments: [
      {
        description: "AI Project",
        component: "Project",
        weightage: 50,
        cos: [1,2],
        breakdown: [
          { description: "Model Design", weightage: 25, co: 2, wps: [2] },
          { description: "Evaluation Report", weightage: 25, co: 1, eas: [1,2,3] }
        ]
      },
      {
        description: "Final Exam",
        component: "Written Assessment",
        weightage: 50,
        cos: [1],
        breakdown: [],
        wps: [4],
        eas: []
      }
    ],

    weeklyPlan: [
      {
        week: "Week 10",
        description: "Neural Networks",
        type: "content",
        hours: [
          { lecture: { online: 2, f2f: 1 } },
          { practical: { online: 1, f2f: 0 } }
        ]
      }
    ],

    references: [
      { description: "Artificial Intelligence: A Modern Approach", label: "main" }
    ],

    gradingScheme: "standardGrade",
    committed: { on: new Date("2026-01-10"), by: "Richard Wong" },
    revision: "1.0",
    parentRevision: ""
  },

  {
    code: "CS499",
    name: "Final Year Project",
    category: "Capstone",
    semester: 2,
    year: 4,
    credits: 3,
    synopsis:
      "A capstone project where students independently design, implement, and document a substantial computing project.",
    prerequisites: ["SE301"],
    lecturers: ["Richard Wong"],
    transferableSkills: [
      "Research Skills",
      "Technical Writing",
      "Presentation Skills",
      "Independent Learning"
    ],
    deliveryMethods: ["Supervision", "Independent Study", "Presentations"],

    cos: [
      {
        description: "Formulate a research or development problem",
        bloomtax: ["analyze", 4],
        pos: [3, 4],
        was: [1, 2],
        wks: [1, 2],
        wps: [1, 2],
        eas: [1, 2],
        sdg: false
      },
      {
        description: "Produce a complete project and report",
        bloomtax: ["create", 6],
        pos: [5, 6],
        was: [1, 2],
        wks: [1, 2],
        wps: [1, 2],
        eas: [1, 2],
        sdg: false
      }
    ],

    startFrom: ["intake", "2026-03"],

    assessments: [
      {
        description: "Project Evaluation",
        component: "Project",
        weightage: 100,
        cos: [1, 2],
        breakdown: [
          { description: "Proposal", weightage: 20, co: 1, wps: [1], eas: [1] },
          { description: "Poster & Presentation", weightage: 30, co: 2, wps: [2], eas: [2] },
          { description: "Final Thesis", weightage: 50, co: 1, wps: [3], eas: [3] }
        ]
      }
    ],

    weeklyPlan: [
      {
        week: "Week 14",
        description: "Final Presentation",
        type: "assessment",
        hours: [{ others: { online: 0, f2f: 3 } }]
      }
    ],

    references: [
      { description: "IEEE Research Writing Guidelines", label: "main" }
    ],

    gradingScheme: "passFailWithGrade",
    committed: { on: new Date("2026-02-01"), by: "Richard Wong" },
    revision: "2.0",
    parentRevision: "1.5"
  }
];
