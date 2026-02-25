// src/services/dataService.ts
import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import type { Course } from "@/types/course";
import type { Programme, ProgrammeStructure } from "@/types/programme";
import type { School } from "@/types/school";

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

export const dataService = {
  // --- Courses ---
  async getCourses(): Promise<Course[]> {
    return fetchCollection<Course>("courses");
  },

  async getCourse(code: string): Promise<Course | null> {
    return fetchDoc<Course>("courses", code);
  },

  async saveCourse(course: Course): Promise<void> {
    await setDoc(doc(db, "courses", course.code), course);
  },

  // --- Programmes ---
  async getProgrammes(): Promise<Programme[]> {
    return fetchCollection<Programme>("programmes");
  },

  async getProgramme(code: string): Promise<Programme[]> {
    // return fetchDoc<Programme>("programmes", code);
    return fetchDocsByCode<Programme>("programmes", code);
  },

  async saveProgramme(programme: Programme): Promise<void> {
    await setDoc(doc(db, "programmes", programme.id), programme);
  },

  async getNameOfProgrammes(codes: string[]): Promise<Map<string, string>> {
    const programmes = await this.getProgrammes();
    const programmenames = new Map<string, string>();
    programmes.filter(p => codes.includes(p.code)).forEach(p => programmenames.set(p.code, p.name));
    return programmenames;
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
