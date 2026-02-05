import { type ProgrammeStructure } from "@/types/programme";

export const structures: ProgrammeStructure[] = [
  // --- BCIV (Civil Engineering) ---
  {
    programme: "BCIV",
    programmeRevision: "2024-V1",
    label: "default",
    structure: [["MATH101", "STATICS101"], ["FLUIDS201"]],
    committed: { on: new Date('2024-11-01'), by: "admin_office" },
    revision: "CIV-BASE",
    parentRevision: "null"
  },
  {
    programme: "BCIV",
    programmeRevision: "2025-V1",
    label: "direct entry",
    structure: [["FLUIDS201", "STRUCT_ANALYSIS"], ["GEOM102", "CONCRETE_1"]],
    committed: { on: new Date('2025-11-20'), by: "dept_civil_head" },
    revision: "CIV-2026-DE",
    parentRevision: "CIV-BASE"
  },

  // --- BMEC (Mechanical Engineering) ---
  {
    programme: "BMEC",
    programmeRevision: "2026-V1",
    label: "default",
    structure: [["MATH101", "THERMO101"], ["DYNAMICS201", "CAD102"]],
    committed: { on: new Date('2025-12-01'), by: "dept_mech_head" },
    revision: "MEC-2026-STD",
    parentRevision: "MEC-BASE"
  },
  {
    programme: "BMEC",
    programmeRevision: "2026-V1",
    label: "Jordan Smith", // Individualized Plan
    structure: [["MATH101", "THERMO101"], ["DYNAMICS201", "ROBOT_INTEL"]],
    committed: { on: new Date('2026-01-05'), by: "academic_advisor" },
    revision: "MEC-2026-JS",
    parentRevision: "MEC-2026-STD"
  },

  // --- BCHE (Chemical Engineering) ---
  {
    programme: "BCHE",
    programmeRevision: "2025-V1",
    label: "default",
    structure: [["CHEM101", "MATH101"], ["THERMO_CHEM"]],
    committed: { on: new Date('2024-12-05'), by: "admin_office" },
    revision: "CHE-BASE",
    parentRevision: "null"
  },
  {
    programme: "BCHE",
    programmeRevision: "2026-V1",
    label: "default",
    structure: [["CHEM101", "MATH101", "MASS_BAL"], ["THERMO_CHEM", "REACTION_ENG"]],
    committed: { on: new Date('2025-12-05'), by: "dept_chem_head" },
    revision: "CHE-2026-UPDATED",
    parentRevision: "CHE-BASE"
  },

  // --- BMRE (Mechatronics) ---
  {
    programme: "BMRE",
    programmeRevision: "2026-V1",
    label: "default",
    structure: [["CIRCUITS101", "PROG_C++"], ["ROBOT_KINEMATICS"]],
    committed: { on: new Date('2025-12-10'), by: "dept_robotics_head" },
    revision: "MRE-BASE",
    parentRevision: "null"
  },
  {
    programme: "BMRE",
    programmeRevision: "2026-V1",
    label: "direct entry",
    structure: [["ROBOT_KINEMATICS", "SENSORS"], ["AI_ROBOTICS", "MICRO_CONTROLLERS"]],
    committed: { on: new Date('2026-01-15'), by: "dept_robotics_head" },
    revision: "MRE-2026-DE",
    parentRevision: "MRE-BASE"
  },

  // --- BEEE (Electrical Engineering) ---
  {
    programme: "BEEE",
    programmeRevision: "2026-V1",
    label: "default",
    structure: [["MATH101", "CIRCUITS101"], ["EM_FIELDS"]],
    committed: { on: new Date('2025-12-10'), by: "dept_elec_head" },
    revision: "EEE-BASE",
    parentRevision: "null"
  },
  {
    programme: "BEEE",
    programmeRevision: "2026-V1",
    label: "Sarah Chen", // Individualized Plan
    structure: [["MATH101", "CIRCUITS101"], ["EM_FIELDS", "RENEWABLE_OPT"]],
    committed: { on: new Date('2026-02-01'), by: "academic_advisor" },
    revision: "EEE-2026-SC",
    parentRevision: "EEE-BASE"
  }
];
