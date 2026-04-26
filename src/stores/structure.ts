import { ref, watch, toRaw, computed } from 'vue';
import type { ProgrammeStructure } from "@/types/programme";
import type { Course, CourseMappingInfo } from "@/types/course";
import { createNewStructure } from "@/utils/structureHelpers";
import { createCourseMappingInfo } from '@/utils/courseHelpers';
import { defineStore } from "pinia";
import diff from 'microdiff';
import { dataService } from '@/services/dataService';
import { formatRevision, formatStructureId } from '@/utils/common';

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

import { useStructureListStore } from '@/stores/structurelist';
const structureListStore = useStructureListStore();

export const useStructureStore = defineStore('structure', () => {
  const programmeCode = ref<string>("")
  const structureRevisions = ref<{ [revision: string]: ProgrammeStructure }>({})
  const revisions = computed<string[]>(() => Object.keys(structureRevisions.value).sort((a, b) => b.localeCompare(a)))
  const loading_flags = ref<{ [key: string]: boolean }>({})
  const loading = computed(() => Object.values(loading_flags.value).some(flag => flag))

  const selectedStructureLabel = ref<string>("")
  const draft = ref<ProgrammeStructure>(createNewStructure())
  const saved = ref<ProgrammeStructure>(createNewStructure())

  async function loadStructureRevisionsByProgrammeAndLabel(programme: string, label: string) {
    loading_flags.value[loadStructureRevisionsByProgrammeAndLabel.name] = true
    structureRevisions.value = await dataService.getStructureRevisionsByProgrammeAndLabel(programme, label)
    loading_flags.value[loadStructureRevisionsByProgrammeAndLabel.name] = false
  }
  watch([programmeCode, selectedStructureLabel], () => {
    if (programmeCode.value && selectedStructureLabel.value) {
      loadStructureRevisionsByProgrammeAndLabel(
        programmeCode.value,
        selectedStructureLabel.value
      )
    }
  })

  const selectedRevision = ref<string>("")
  watch(structureRevisions, () => {
    if (revisions.value.length < 1) { selectedRevision.value = "" }
    else if (
      !selectedRevision.value
      || !revisions.value.includes(selectedRevision.value)
    ) { selectedRevision.value = revisions.value[0] || "" }
    else { loadStructure(); }
  })
  watch(selectedRevision, () => loadStructure())
  function loadStructure() {
    if (revisions.value.includes(selectedRevision.value)) {
      saved.value = structureRevisions.value[selectedRevision.value]!
      draft.value = structuredClone(toRaw(saved.value))
    }
  }

  function clear(): void { saved.value = createNewStructure(); draft.value = createNewStructure(); courseMappings.value = [] }
  function resetDraft(): void { draft.value = structuredClone(toRaw(saved.value)) }
  function createDraft(): void { draft.value = structuredClone(toRaw(saved.value)) }
  function commit(): void { saved.value = structuredClone(toRaw(draft.value)) }

  function resetDiff(): void { resetDraft() }

  function checkDiff(): boolean { return getDiff().length > 0; }

  function getDiff() { return diff(saved.value, draft.value) }

  function copyStructureFrom(struc: ProgrammeStructure): void {
    saved.value = structuredClone(toRaw(struc))
    draft.value = structuredClone(toRaw(struc))
    selectedStructureLabel.value = struc.label
    selectedRevision.value = struc.revision
    structureRevisions.value[struc.revision] = structuredClone(toRaw(struc))
  }

  async function save(): Promise<void> {
    loading_flags.value[save.name] = true
    draft.value.parentRevision = draft.value.revision
    draft.value.revision = formatRevision()
    draft.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    draft.value.id = formatStructureId(draft.value)
    try {
      await dataService.saveStructure(draft.value)
      commit()
      structureListStore.saveStructure(draft.value)
      structureRevisions.value[draft.value.revision] = structuredClone(toRaw(draft.value))
      selectedRevision.value = draft.value.revision
    } catch (error) {
      console.error('Error saving structure:', error)
    }
    loading_flags.value[save.name] = false
  }

  async function deleteRevision() {
    loading_flags.value[deleteRevision.name] = true
    if (draft.value.id !== "") {
      const idToDelete = draft.value.id
      await dataService.deleteItem("structures", idToDelete)

      const revIndex = revisions.value.indexOf(selectedRevision.value)
      if (revisions.value.includes(selectedRevision.value)) {
        delete structureRevisions.value[selectedRevision.value]
      }
      if (revisions.value.length == 0) {
        selectedRevision.value = ""
        selectedStructureLabel.value = ""
        structureListStore.deleteStructure(draft.value)
        clear()
      } else if (revisions.value.length > revIndex) {
        selectedRevision.value = revisions.value[revIndex]!
      } else {
        selectedRevision.value = revisions.value[revIndex - 1]!
      }
    }
    loading_flags.value[deleteRevision.name] = false
  }

  const courseMappings = ref<CourseMappingInfo[]>([])
  async function getMappings() {
    loading_flags.value[getMappings.name] = true;
    const coursesFromDb: { [code: string]: Course } = await dataService.getCourses()

    courseMappings.value = saved.value.semesterOrder.reduce((acc, semester, semesterIndex) => {
      return [...acc, ...saved.value.semesters[semester]!.map(course => {
        const mapping = createCourseMappingInfo(coursesFromDb[course]!)
        mapping.semester = semesterIndex + 1
        return mapping
      })]
    }, [] as CourseMappingInfo[])

    loading_flags.value[getMappings.name] = false;
  }

  return {
    loading, loading_flags,
    programmeCode,
    draft, saved,
    selectedStructureLabel,
    structureRevisions,
    revisions, selectedRevision, deleteRevision,
    createDraft, resetDraft, clear,
    resetDiff, checkDiff, getDiff,
    loadStructure, copyStructureFrom,
    save, commit,
    courseMappings, getMappings
  }
})
