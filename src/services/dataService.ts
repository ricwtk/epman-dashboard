// src/services/dataService.ts
import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, setDoc, query, where } from "firebase/firestore";
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

  async getProgramme(code: string): Promise<Programme | null> {
    return fetchDoc<Programme>("programmes", code);
  },

  async saveProgramme(programme: Programme): Promise<void> {
    await setDoc(doc(db, "programmes", programme.code), programme);
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

  // --- Structures ---
  async getStructures(): Promise<ProgrammeStructure[]> {
    return fetchCollection<ProgrammeStructure>("structures");
  },

  // Get structures for a specific programme
  async getStructuresByProgramme(programmeCode: string): Promise<ProgrammeStructure[]> {
    const q = query(collection(db, "structures"), where("programme", "==", programmeCode));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ProgrammeStructure);
  },

  async saveStructure(structure: ProgrammeStructure): Promise<void> {
    // Structures might need a composite ID or specific naming convention
    const id = `${structure.programme}_${structure.label}`;
    await setDoc(doc(db, "structures", id), structure);
  }
};
