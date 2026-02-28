// src/services/dataService.ts
import { db } from "./firebase";
import {
  collection,
  doc, getDoc, setDoc, deleteDoc,
  getDocs,
  query, where, orderBy,
  QueryConstraint
} from "firebase/firestore";
import type { Course } from "@/types/course";
import type { Programme, ProgrammeStructure } from "@/types/programme";
import type { School } from "@/types/school";
import { createNewProgramme } from "@/utils/programmeHelpers";

// Generic helper to fetch a document
async function fetchDoc<T>(collectionName: string, id: string): Promise<T | null> {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? (snapshot.data() as T) : null;
}

// Generic helper to fetch a document by code
async function fetchDocsByCode<T>(collectionName: string, codeString: string): Promise<T[]> {
  const colRef = collection(db, collectionName); // 1. Reference the collection
  const q = query(colRef, where("code", "==", codeString)); // 2. Create a query against the 'code' field
  const querySnapshot = await getDocs(q); // 3. Execute the query
  // 4. Map the results into an array
  return querySnapshot.docs.map(doc => ({
    ...(doc.data() as T),
    id: doc.id // Optional: include the document ID if needed
  }));
}

// Generic helper to fetch a collection
async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];

async function fetchLatestCollection<
  T extends { revision: string },
>(
  collectionName: string,
  uniqueKey: StringKeys<T>,
  extraConstraints: QueryConstraint[] = []
): Promise<Record<string, T>> {
  const q = query(
    collection(db, collectionName),
    orderBy('revision', 'desc'),
    ...extraConstraints
  );
  const querySnapshot = await getDocs(q);

  const processedValues = new Set<string>();
  const result: Record<string, T> = {};

  for (const doc of querySnapshot.docs) {
    const data = doc.data() as T;
    const key = data[uniqueKey] as string;

    if (!processedValues.has(key)) {
      result[key] = { ...data };
      processedValues.add(key);
    }
  }

  return result;
}

export interface MappedProgramme {
  name: string;
  code: string;
  school: {
    name: string;
    code: string;
  } | null;
}

export interface GroupedStructures {
  [label: string]: ProgrammeStructure[];
}

export interface ProgrammesWithSchool {
  [progKey: string]: School | {};
}

export interface SchoolsByCode {
  [schoolKey: string]: School;
}

export interface ProgrammesWithCourse{
  [progKey: string]: {
    school: string;
    structures: {
      [structKey: string]: string
    }
  }
}

export interface CourseAssignment {
  programme: {
    name: string;
    code: string;
  };
  school: {
    name: string;
    code: string;
  } | null;
}

export const dataService = {
  // --- Courses ---
  async getCourses(): Promise<Course[]> {
    return fetchCollection<Course>("courses");
  },

  async getCourse(code: string): Promise<Course[]> {
    // return fetchDoc<Course>("courses", code);
    return fetchDocsByCode<Course>("courses", code);
  },

  async saveCourse(course: Course): Promise<void> {
    await setDoc(doc(db, "courses", course.id), course);
  },

  // --- Programmes ---
  async getProgrammes(): Promise<{[code: string]: Programme}> {
    return fetchLatestCollection<Programme>("programmes", "code");
  },

  async getProgramme(code: string): Promise<Programme[]> {
    // return fetchDoc<Programme>("programmes", code);
    return fetchDocsByCode<Programme>("programmes", code);
  },

  async saveProgramme(programme: Programme): Promise<void> {
    await setDoc(doc(db, "programmes", programme.id), programme);
  },

  async getProgrammesOf(codes: string[]): Promise<{ [code: string]: Programme }> {
    if (codes.length === 0) return {};
    let programmes = await fetchLatestCollection<Programme>(
      "programmes", "code",
      [where("code", "in", codes)]
    );
    codes.forEach(code => {
      if (!programmes[code]) {
        programmes[code] = createNewProgramme({ code });
      }
    });
    return programmes;
  },

  // --- Schools ---
  async getSchools(): Promise<School[]> {
    return fetchCollection<School>("schools");
  },

  async getSchool(code: string): Promise<School[]> {
    // return fetchDoc<School>("schools", code);
    return fetchDocsByCode<School>("schools", code);
  },

  async saveSchool(school: School): Promise<void> {
    await setDoc(doc(db, "schools", school.id), school);
  },

  /**
    * Identifies if a programme is currently part of any school's latest revision.
    * @param programmeCode - The unique code of the programme to find.
    */
  async getSchoolByProgrammeCode(programmeCode: string): Promise<School | null> {
    try {
      const q = query(collection(db, 'schools'), orderBy('revision', 'desc'));
      const querySnapshot = await getDocs(q);
      const processedSchoolIds = new Set<string>();
      for (const doc of querySnapshot.docs) {
        const schoolId = doc.id;
        if (processedSchoolIds.has(schoolId)) continue;
        processedSchoolIds.add(schoolId);

        const data = doc.data();
        const programmes = data.programmes || [];

        if (Array.isArray(programmes) && programmes.includes(programmeCode)) {
          return data as School;
        }
      }
      return null;
    } catch (error) {
      console.error("Error finding parent school from latest revisions:", error);
      throw error;
    }
  },

  async getSchoolOfProgrammes(programmeCodes: string[]): Promise<ProgrammesWithSchool> {
    try {
      const schoolQuery = query(collection(db, 'schools'), orderBy('revision', 'desc'));
      const schoolSnap = await getDocs(schoolQuery);
      const processedSchoolCodes = new Set<string>();
      const programmesWithSchool: ProgrammesWithSchool = {};

      programmeCodes.forEach(code => {
        programmesWithSchool[code] = {};
      });

      for (const doc of schoolSnap.docs) {
        const schoolData = doc.data() as School;
        const schoolCode = schoolData.code;

        if (processedSchoolCodes.has(schoolCode)) continue;

        const programmes = schoolData.programmes || [];

        if (Array.isArray(programmes)) {
          programmeCodes.forEach(code => {
            if (programmes.includes(code)) {
              programmesWithSchool[code] = schoolData;
            }
          });
        }
      }
      return programmesWithSchool;
    } catch (error) {
      console.error("Error finding parent school from latest revisions:", error);
      throw error;
    }
  },

  // Programmes with schools
  async getProgrammesMappedBySchool(): Promise<MappedProgramme[]> {
    try {
      // 1. Fetch sorted collections
      const progQuery = query(collection(db, 'programmes'), orderBy('revision', 'desc'));
      const schoolQuery = query(collection(db, 'schools'), orderBy('revision', 'desc'));

      const [progSnap, schoolSnap] = await Promise.all([
        getDocs(progQuery),
        getDocs(schoolQuery)
      ]);

      // 2. Create a Map of which Programme Code belongs to which School
      // Key: Programme Code, Value: School Object {name, code}
      const progToSchoolMap = new Map<string, { name: string; code: string }>();
      const processedSchools = new Set<string>();

      schoolSnap.forEach(doc => {
        const schoolData = doc.data();
        const schoolCode = schoolData.code;

        if (processedSchools.has(schoolCode)) return;
        processedSchools.add(schoolCode);

        // Using your array of strings for programmes in the school doc
        if (Array.isArray(schoolData.programmes)) {
          schoolData.programmes.forEach((progCode: string) => {
            // Only map if not already mapped (since we sorted by newest school first)
            if (!progToSchoolMap.has(progCode)) {
              progToSchoolMap.set(progCode, {
                name: schoolData.name || 'Unknown School',
                code: schoolData.code
              });
            }
          });
        }
      });

      // 3. Build the final list starting from the Programmes collection
      const finalMapping: MappedProgramme[] = [];
      const processedCodes = new Set<string>();

      progSnap.forEach(doc => {
        const progData = doc.data();
        const progCode = progData.code;

        // Skip if we've already processed this code (for multi-doc revisions)
        if (!progCode || processedCodes.has(progCode)) return;
        processedCodes.add(progCode);

        finalMapping.push({
          code: progCode,
          name: progData.name || 'Unnamed Programme',
          // Look up the school in our map; if not found, it remains null
          school: progToSchoolMap.get(progCode) || null
        });
      });

      return finalMapping;
    } catch (error) {
      console.error("Error fetching sorted data:", error);
      throw error;
    }
  },

  // --- Structures ---
  async getStructures(): Promise<ProgrammeStructure[]> {
    return fetchCollection<ProgrammeStructure>("structures");
  },

  // Get structures for a specific programme
  async getStructuresByProgramme(programmeCode: string): Promise<GroupedStructures> {
    try {
      const q = query(
        collection(db, "structures"),
        where("programme", "==", programmeCode),
        orderBy("revision", 'desc') // Database already sorts descending
      );

      const snapshot = await getDocs(q);

      // 1. Get the raw data
      const allStructures = snapshot.docs.map(doc => doc.data() as ProgrammeStructure);

      // 2. Group by label using reduce
      const grouped = allStructures.reduce((acc: GroupedStructures, structure) => {
        const label = structure.label || 'Unlabeled';

        if (!acc[label]) {
          acc[label] = [];
        }

        acc[label].push(structure);
        return acc;
      }, {});

      console.log(grouped);
      return grouped;
    } catch (error) {
      console.error("Error fetching grouped structures:", error);
      throw error;
    }
  },

  async saveStructure(structure: ProgrammeStructure): Promise<void> {
    await setDoc(doc(db, "structures", structure.id), structure);
  },

  async traceCourseUsageAcrossProgrammes(courseCode: string): Promise<{programmes: ProgrammesWithCourse, schools: SchoolsByCode}> {
    try {
      // 1. Fetch all structures that contain this course
      // We don't filter by "programme" because we want to search everywhere
      const q = query(collection(db, "structures"), orderBy("revision", "desc"));
      const structureSnap = await getDocs(q);

      // Identify unique programme codes that use this course in their LATEST revision with the structure label
      const programmes: ProgrammesWithCourse = {};
      const seenPairs = new Set<string>();

      structureSnap.forEach(doc => {
        const data = doc.data();
        const pCode = data.programme;
        const label = data.label || '';
        const pairKey = `${pCode}|${label}`;

        // Skip older revisions
        if (seenPairs.has(pairKey)) return;
        seenPairs.add(pairKey);

        // 2. Find which semester contains the course
        // 'structure' is the Map: { "01": ["MATH1", "CS101"], "02": [...] }
        const semesterEntries = Object.entries(data.structure || {});
        for (const [semKey, courses] of semesterEntries) {
          if (Array.isArray(courses) && courses.includes(courseCode)) {
            if (!programmes[pCode]) programmes[pCode] = { school: "", structures: {} };
            programmes[pCode].structures[label] = semKey; // Store the semester key (e.g., "01")
            break; // Stop searching this specific structure once found
          }
        }
      });

      // 3. Map back to School info
      const progToSchoolMap = await this.getSchoolOfProgrammes(Object.keys(programmes));
      const schools: SchoolsByCode = {};

      Object.keys(progToSchoolMap).forEach(pCode => {
        const school = progToSchoolMap[pCode] as School;
        programmes[pCode]!.school = school.code
        if (!Object.keys(schools).includes(school.code)) {
          schools[school.code] = school;
        }
      })

      return { programmes, schools };

    } catch (error) {
      console.error("Error tracing course assignments:", error);
      throw error;
    }
  },
  /*
    Delete an item from a collection.
    @param collectionName - The name of the collection.
    @param docId - The ID of the document to delete.
  */
  async deleteItem(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting from ${collectionName}:`, error);
      throw error;
    }
  }
};
