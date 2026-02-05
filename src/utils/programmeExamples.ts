import type { Programme, Mapping } from '@/types/programme'
// Define the common BEM/Washington Accord PO descriptions
// to avoid repeating strings inside every object
const engineeringPoAttributes = [
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

/**
 * Utility to generate unique, random mapping data
 */
const getRandomMapping = (): Mapping => ({
  wk: Array.from(new Set(Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => Math.floor(Math.random() * 8) + 1))),
  wp: Array.from(new Set(Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => Math.floor(Math.random() * 7) + 1))),
  ea: Array.from(new Set(Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => Math.floor(Math.random() * 5) + 1))),
  sdg: Math.random() > 0.5
});
const getRandomPEO = (): number => Math.floor(Math.random() * 3) + 1;

// --- Programme Definitions ---

export const mechanicalEngineering: Programme = {
  code: "BMEC",
  name: "Bachelor of Mechanical Engineering with Honours",
  revision: "2024-V1",
  parentRevision: "",
  poList: engineeringPoAttributes.map(attr => ({
    attribute: attr,
    descriptor: "",
    mapping: {
      peo: getRandomPEO(),
      examBased: getRandomMapping(),
      projectBased: getRandomMapping()
    }
  })),
  committed: {
    on: null,
    by: ""
  }
};

export const electronicEngineering: Programme = {
  code: "BEEE",
  name: "Bachelor of Electronic and Electrical Engineering with Honours",
  revision: "2024-V1",
  parentRevision: "",
  poList: engineeringPoAttributes.map(attr => ({
    attribute: attr,
    descriptor: "",
    mapping: {
      peo: getRandomPEO(),
      examBased: getRandomMapping(),
      projectBased: getRandomMapping()
    }
  })),
  committed: {
    on: null,
    by: ""
  }
};

export const mechatronicEngineering: Programme = {
  code: "BMRE",
  name: "Bachelor of Mechatronic Engineering (Robotics) with Honours",
  revision: "2024-V1",
  parentRevision: "",
  poList: engineeringPoAttributes.map(attr => ({
    attribute: attr,
    descriptor: "",
    mapping: {
      peo: getRandomPEO(),
      examBased: getRandomMapping(),
      projectBased: getRandomMapping()
    }
  })),
  committed: {
    on: null,
    by: ""
  }
};

export const chemicalEngineering: Programme = {
  code: "BCHE",
  name: "Bachelor of Chemical Engineering with Honours",
  revision: "2024-V1",
  parentRevision: "",
  poList: engineeringPoAttributes.map(attr => ({
    attribute: attr,
    descriptor: "",
    mapping: {
      peo: getRandomPEO(),
      examBased: getRandomMapping(),
      projectBased: getRandomMapping()
    }
  })),
  committed: {
    on: null,
    by: ""
  }
};

export const civilEngineering: Programme = {
  code: "BCIV",
  name: "Bachelor of Civil Engineering with Honours",
  revision: "2024-V1",
  parentRevision: "",
  poList: engineeringPoAttributes.map(attr => ({
    attribute: attr,
    descriptor: "",
    mapping: {
      peo: getRandomPEO(),
      examBased: getRandomMapping(),
      projectBased: getRandomMapping()
    }
  })),
  committed: {
    on: null,
    by: ""
  }
};

export const programmes = [
  mechanicalEngineering,
  mechatronicEngineering,
  electronicEngineering,
  chemicalEngineering,
  civilEngineering
]
