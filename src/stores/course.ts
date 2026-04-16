import { ref, computed, toRaw, watch } from 'vue';
import type { Assessment, Breakdown, Co, Course } from "@/types/course";
import type { School } from "@/types/school";
import { createCourseObject } from "@/utils/courseHelpers";
import { defineStore } from "pinia";
import { checkDiff as checkDiffCommon, resetDiff as resetDiffCommon } from '@/utils/common.ts'
import {
  createCo,
  createPlan,
  createReference,
  createAssessment,
  createBreakdown,
} from '@/utils/courseHelpers'
import { formatRevision, formatId } from '@/utils/common';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
import { dataService } from '@/services/dataService';
import type { SchoolsByCode, ProgrammesWithCourse, ProgrammeWithCourse } from '@/services/dataService';
import type { AttrDesc } from '@/types/school';
import { navigateToParent } from '@/utils/navigationHelpers'

import { useCourseListStore } from './courselist';
const courseListStore = useCourseListStore()

export const useCourseStore = defineStore('course', () => {
  const draft = ref<Course>(createCourseObject())
  const saved = ref<Course>(createCourseObject())
  const revisions = ref<Course[]>([])
  const loading_flags = ref<{ [key: string]: boolean }>({})
  const loading = computed(() => Object.values(loading_flags.value).some(flag => flag))

  // parameters for editing ui
  const editingTab = ref<string>('summary')

  // programme and school parameters
  const programmes = ref<ProgrammesWithCourse>({})
  const schools = ref<SchoolsByCode>({})
  const selectedProgrammeCode = ref<string>("")
  const selectedProgramme = computed<ProgrammeWithCourse | null>(() => {
    return programmes.value[selectedProgrammeCode.value] || null;
  })

  const selectedSchool = computed<School | null>(() => {
    if (!selectedProgrammeCode.value) return null;
    const schoolCode = programmes.value[selectedProgrammeCode.value]?.school;
    return schoolCode ? schools.value[schoolCode] || null : null;
  });
  const notAssignedToProgramme = computed<boolean>(() => {
    return Object.keys(programmes.value).length === 0;
  })
  const programmeNotSelected = computed<boolean>(() => {
    return selectedProgramme.value === null || Object.keys(selectedProgramme.value).length === 0;
  })
  const programmeNotAssigned = computed<boolean>(() => {
    return !programmeNotSelected.value && (selectedSchool.value === null);
  })

  async function traceCourseUsage(): Promise<void> {
    loading_flags.value[traceCourseUsage.name] = true
    if (!saved.value.code) return;
    const usage = await dataService.traceCourseUsageAcrossProgrammes(saved.value.code)
    programmes.value = usage.programmes
    schools.value = usage.schools
    loading_flags.value[traceCourseUsage.name] = false
  }
  watch(() => saved.value.code, traceCourseUsage)

  function clear(): void { draft.value = createCourseObject(); saved.value = createCourseObject(); }
  function createDraft(): void { draft.value = structuredClone(toRaw(saved.value)); }
  function resetDraft(): void { draft.value = structuredClone(toRaw(saved.value)); }
  function commit(): void { saved.value = structuredClone(toRaw(draft.value)); }

  async function loadCourseByCode(code: string): Promise<void> {
    loading_flags.value[loadCourseByCode.name] = true
    clear()
    revisions.value = await dataService.getCourse(code)
    revisions.value.sort((a, b) => b.revision.localeCompare(a.revision));
    if (revisions.value.length > 0) {
      saved.value = revisions.value[0]!;
    }
    loading_flags.value[loadCourseByCode.name] = false
  }

  function loadRevision(revision: string) {
    loading_flags.value[loadRevision.name] = true
    clear();
    const revIndex = revisions.value.findIndex(cour => cour.revision === revision);
    if (revIndex !== -1) {
      saved.value = revisions.value[revIndex]!;
    }
    loading_flags.value[loadRevision.name] = false
  }

  async function deleteRevision() {
    loading_flags.value[deleteRevision.name] = true
    if (saved.value.id !== "") {
      await dataService.deleteItem('courses', saved.value.id);
      const revIndex = revisions.value.findIndex(cour => cour.id === saved.value.id)
      revisions.value.splice(revIndex, 1);
      if (revIndex < revisions.value.length) {
        saved.value = revisions.value[revIndex]!;
      } else if (revisions.value.length > 0) {
        saved.value = revisions.value[revisions.value.length - 1]!;
      } else {
        courseListStore.removeCourseByCode(saved.value.code)
        clear();
        navigateToParent();
      }
    }
    loading_flags.value[deleteRevision.name] = false
  }

  function resetDiff(pathArray: string[]): void { resetDiffCommon(draft.value, saved.value, pathArray) }
  function checkDiff(pathArray: string[]): boolean { return checkDiffCommon(draft.value, saved.value, pathArray) }

  function checkListItem(key: 'transferableSkills' | 'prerequisites' | 'deliveryMethods', value: string): boolean {
    return draft.value[key].includes(value)
  }
  function addListItem(key: 'transferableSkills' | 'prerequisites' | 'deliveryMethods', value: string): void {
    if (!checkListItem(key, value)) {
      draft.value[key].push(value)
    }
  }
  function removeListItem(key: 'transferableSkills' | 'prerequisites' | 'deliveryMethods', value: string): void {
    if (checkListItem(key, value)) {
      const idx = draft.value[key].indexOf(value)
      draft.value[key].splice(idx, 1)
    }
  }
  function toggleListItem(key: 'transferableSkills' | 'prerequisites' | 'deliveryMethods', value: string): void {
    if (checkListItem(key, value)) {
      removeListItem(key, value)
    } else {
      addListItem(key, value)
    }
  }
  function addTransferableSkill(value: string): void { addListItem('transferableSkills', value) }
  function removeTransferableSkill(value: string): void { removeListItem('transferableSkills', value) }
  function toggleTransferableSkill(value: string): void { toggleListItem('transferableSkills', value) }
  function addPrerequisite(value: string): void { addListItem('prerequisites', value) }
  function removePrerequisite(value: string): void { removeListItem('prerequisites', value) }
  function togglePrerequisite(value: string): void { toggleListItem('prerequisites', value) }
  function addDeliveryMethod(value: string): void { addListItem('deliveryMethods', value) }
  function removeDeliveryMethod(value: string): void { removeListItem('deliveryMethods', value) }
  function toggleDeliveryMethod(value: string): void { toggleListItem('deliveryMethods', value) }

  const WKLIST = computed<Array<[string, string]>>(() => {
    if (selectedSchool.value) {
      const school = selectedSchool.value;
      if (school && school.components && school.components.wks) {
        return school.components.wks.map((wk: AttrDesc, index: number) => [`WK${index + 1}`, wk.descriptor]);
      }
    }
    return [];
  })

  const WPLIST = computed<Array<[string, string]>>(() => {
    if (selectedSchool.value) {
      const school = selectedSchool.value;
      if (school && school.components && school.components.wps) {
        return school.components.wps.map((wp: AttrDesc, index: number) => [`WP${index + 1}`, wp.descriptor]);
      }
    }
    return [];
  })

  const EALIST = computed<Array<[string, string]>>(() => {
    if (selectedSchool.value) {
      const school = selectedSchool.value;
      if (school && school.components && school.components.eas) {
        return school.components.eas.map((ea: AttrDesc, index: number) => [`EA${index + 1}`, ea.descriptor]);
      }
    }
    return [];
  })

  function addCoMapping(coIndex: number, type: 'po' | 'wk' | 'wp' | 'ea', componentNumber: number): void {
    const co = draft.value.cos[coIndex]
    const componentKey: keyof Co = `${type}s`
    if (co) {
      if (!co[componentKey]?.includes(componentNumber)) {
        co[componentKey]?.push(componentNumber)
      }
    }
  }
  function removeCoMapping(coIndex: number, type: 'po' | 'wk' | 'wp' | 'ea', componentNumber: number): void {
    const co = draft.value.cos[coIndex]
    const componentKey: keyof Co = `${type}s`
    if (co) {
      co[componentKey] = co[componentKey]?.filter((n) => n !== componentNumber)
    }
  }
  function toggleCoMapping(coIndex: number, type: 'po' | 'wk' | 'wp' | 'ea', componentNumber: number): void {
    const co = draft.value.cos[coIndex]
    const componentKey: keyof Co = `${type}s`
    if (co) {
      if (!co[componentKey]?.includes(componentNumber)) {
        co[componentKey]?.push(componentNumber)
      } else {
        co[componentKey] = co[componentKey]?.filter((n) => n !== componentNumber)
      }
    }
  }


  // function checkMappingDiff(coursetype: "examBased" | "projectBased", component: "wk" | "wp" | "ea"): boolean {
  //   const originalPoList = originalProgramme.value.poList
  //   const original = originalPoList.map(po => get(po, ['mapping', coursetype, component]))

  //   const currentPoList = programme.value.poList
  //   const current = currentPoList.map(po => get(po, ['mapping', coursetype, component]))

  //   if (original && current) {
  //     return diff(original, current).length > 0 || original.length !== current.length;
  //   } else return true;
  // }

  // function resetMappingDiff(coursetype: "examBased" | "projectBased", component: "wk" | "wp" | "ea"): void {
  //   const originalPoList = originalProgramme.value.poList
  //   const original = originalPoList.map(po => get(po, ['mapping', coursetype, component]))

  //   const currentPoList = programme.value.poList
  //   const current = currentPoList.map(po => get(po, ['mapping', coursetype, component]))

  //   if (original && current) {
  //     currentPoList.map((po, index) => set(po, ['mapping', coursetype, component], structuredClone(toRaw(original[index]))))
  //   }
  // }

  function addCo(): void { draft.value.cos.push(createCo()) }
  function removeCo(index: number): void { draft.value.cos.splice(index, 1) }
  function moveCoUp(index: number): void { moveUp('cos', index); }
  function moveCoDown(index: number): void { moveDown('cos', index); }

  function addAssessment(): void { draft.value.assessments.push(createAssessment()) }
  function deleteAssessment(index: number): void { draft.value.assessments.splice(index, 1) }

  function addBreakdown(assessmentIndex: number): void {
    if (assessmentIndex >= 0 && assessmentIndex < draft.value.assessments.length) {
      draft.value.assessments[assessmentIndex]!.breakdown.push(createBreakdown())
    }
  }
  function deleteBreakdown(assessmentIndex: number, breakdownIndex: number): void {
    if (assessmentIndex >= 0 && assessmentIndex < draft.value.assessments.length) {
      draft.value.assessments[assessmentIndex]!.breakdown.splice(breakdownIndex, 1)
    }
  }

  function addAssessmentMapping(assessmentIndex: number, breakdownIndex: number, type: 'wp' | 'ea' | 'co', componentNumber: number): void {
    const assessment = draft.value.assessments[assessmentIndex]
    if (assessment) {
      if (breakdownIndex == -1) {
        const componentKey: keyof Assessment = `${type}s`
        if (!assessment[componentKey]) assessment[componentKey] = []
        if (!assessment[componentKey].includes(componentNumber)) {
          assessment[componentKey].push(componentNumber)
        }
      } else {
        const breakdown = assessment.breakdown[breakdownIndex]
        if (breakdown) {
          const componentKey: keyof Breakdown = type == "co" ? "co" : `${type}s`
          if (componentKey == "co") {
            breakdown.co = componentNumber
          } else {
            if (!breakdown[componentKey]) breakdown[componentKey] = []
            if (!breakdown[componentKey].includes(componentNumber)) {
              breakdown[componentKey].push(componentNumber)
            }
          }
        }
      }
    }
  }

  function removeAssessmentMapping(assessmentIndex: number, breakdownIndex: number, type: 'wp' | 'ea' | 'co', componentNumber: number): void {
    const assessment = draft.value.assessments[assessmentIndex]
    if (assessment) {
      if (breakdownIndex == -1) {
        const componentKey: keyof Assessment = `${type}s`
        if (assessment[componentKey]) {
          assessment[componentKey] = assessment[componentKey].filter((n) => n !== componentNumber)
        }
      } else {
        const breakdown = assessment.breakdown[breakdownIndex]
        if (breakdown && type !== "co") {
          const componentKey: keyof Breakdown = `${type}s`
          if (breakdown[componentKey]) {
            breakdown[componentKey] = breakdown[componentKey].filter((n) => n !== componentNumber)
          }
        }
      }
    }
  }

  function toggleAssessmentMapping(assessmentIndex: number, breakdownIndex: number, type: 'wp' | 'ea' | 'co', componentNumber: number): void {
    const assessment = draft.value.assessments[assessmentIndex]
    if (assessment) {
      if (breakdownIndex == -1) {
        const componentKey: keyof Assessment = `${type}s`
        if (!assessment[componentKey]) assessment[componentKey] = []
        if (!assessment[componentKey].includes(componentNumber)) {
          assessment[componentKey].push(componentNumber)
        } else {
          assessment[componentKey] = assessment[componentKey].filter((n) => n !== componentNumber)
        }
      } else {
        const breakdown = assessment.breakdown[breakdownIndex]
        if (breakdown) {
          const componentKey: keyof Breakdown = type == "co" ? "co" : `${type}s`
          if (componentKey == "co") {
            breakdown.co = componentNumber
          } else {
            if (!breakdown[componentKey]) breakdown[componentKey] = []
            if (!breakdown[componentKey].includes(componentNumber)) {
              breakdown[componentKey].push(componentNumber)
            } else {
              breakdown[componentKey] = breakdown[componentKey].filter((n) => n !== componentNumber)
            }
          }
        }
      }
    }
  }

  function addTopic(): void { draft.value.teachingPlan.push(createPlan()) }
  function removeTopic(index: number): void { draft.value.teachingPlan.splice(index, 1) }

  function addReference(): void { draft.value.references.push(createReference()) }
  function deleteReference(index: number): void { draft.value.references.splice(index, 1) }
  function moveReferenceUp(index: number): void { moveUp('references', index); }
  function moveReferenceDown(index: number): void { moveDown('references', index); }

  async function save(): Promise<void> {
    loading_flags.value[save.name] = true
    draft.value.parentRevision = draft.value.revision
    draft.value.revision = formatRevision()
    draft.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    draft.value.id = formatId(draft.value);
    try {
      await dataService.saveCourse(draft.value);
      commit();
      addToRevisions();
    } catch (error) {
      console.error('Error saving course:', error);
    }
    loading_flags.value[save.name] = false
  }

  function addToRevisions(): void {
    revisions.value.splice(0, 0, toRaw(draft.value))
  }

  function moveUp(keyOfList: keyof Course, index: number): void {
    if (Array.isArray(draft.value[keyOfList])) {
      if (index > 0) {
        const item = draft.value[keyOfList].splice(index, 1)[0];
        draft.value[keyOfList].splice(index - 1, 0, item);
      }
    }
  }

  function moveDown(keyOfList: keyof Course, index: number): void {
    if (Array.isArray(draft.value[keyOfList])) {
      if (index < draft.value[keyOfList].length - 1) {
        const item = draft.value[keyOfList].splice(index, 1)[0];
        draft.value[keyOfList].splice(index + 1, 0, item);
      }
    }
  }

  const recommendedMappingForCo = computed(() => {
    return draft.value.cos.map((co) => {
      const polist = co.pos
      const recommended = {
        wk: new Set<number>(),
        wp: new Set<number>(),
        ea: new Set<number>(),
        sdg: false,
      }
      polist.forEach((poNumber) => {
        const po = selectedProgramme.value?.poList[poNumber - 1]
        if (po) {
          po.mapping[draft.value.courseType].wk.forEach( (item) => recommended.wk.add(item) )
          po.mapping[draft.value.courseType].wp.forEach( (item) => recommended.wp.add(item) )
          po.mapping[draft.value.courseType].ea.forEach( (item) => recommended.ea.add(item) )
          recommended.sdg = recommended.sdg || po.mapping[draft.value.courseType].sdg
        }
      })
      return recommended
    })
  })

  const recommendedMappingForAssessment = computed(() => {
    return draft.value.assessments.map((assessment) => {
      const colist = assessment.cos
      const recommended = {
        breakdown: new Array < { wp: Set<number>, ea: Set<number> } >(),
        wp: new Set<number>(),
        ea: new Set<number>(),
      }
      colist.forEach((coNumber) => {
        const recCoMapping = recommendedMappingForCo.value?.[coNumber - 1]
        if (recCoMapping) {
          recCoMapping.wp.forEach( (item) => recommended.wp.add(item) )
          recCoMapping.ea.forEach( (item) => recommended.ea.add(item) )
        }
      })

      recommended.breakdown = assessment.breakdown.map((breakdown) => {
        const recommended = {
          wp: new Set<number>(),
          ea: new Set<number>(),
        }
        const recCoMapping = recommendedMappingForCo.value?.[breakdown.co - 1]
        if (recCoMapping) {
          recCoMapping.wp.forEach((wp) => recommended.wp.add(wp))
          recCoMapping.ea.forEach((ea) => recommended.ea.add(ea))
        }
        return recommended
      })

      return recommended
    })
  })

  return {
    loading, loading_flags,
    draft, saved, revisions,
    loadCourseByCode, loadRevision, deleteRevision,
    clear, createDraft, resetDraft, save,
    programmes, schools,
    selectedProgrammeCode, selectedProgramme, selectedSchool,
    notAssignedToProgramme, programmeNotSelected, programmeNotAssigned,
    editingTab,
    checkDiff, resetDiff,
    // updateMapping,
    addTransferableSkill, removeTransferableSkill, toggleTransferableSkill,
    addPrerequisite, removePrerequisite, togglePrerequisite,
    addDeliveryMethod, removeDeliveryMethod, toggleDeliveryMethod,
    WKLIST, WPLIST, EALIST,
    addCo, removeCo, moveCoUp, moveCoDown,
    addCoMapping, removeCoMapping, toggleCoMapping,
    addTopic, removeTopic,
    addAssessment, deleteAssessment,
    addBreakdown, deleteBreakdown,
    addAssessmentMapping, removeAssessmentMapping, toggleAssessmentMapping,
    addReference, deleteReference, moveReferenceUp, moveReferenceDown,
    recommendedMappingForCo, recommendedMappingForAssessment,
  }
})
