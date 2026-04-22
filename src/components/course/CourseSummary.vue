<script setup lang="ts">
import { ref, computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import ContentItem from '@/components/contentcard/ContentItem.vue';
import ContentItemBadges from '@/components/contentcard/ContentItemBadges.vue';
import ContentItemSelect from '@/components/contentcard/ContentItemSelect.vue';
import ContentItemNumber from '@/components/contentcard/ContentItemNumber.vue';
import ContentItemGroup from '@/components/contentcard/ContentItemGroup.vue';
import { COURSE_TYPES } from '@/constants';
import { Badge } from '@/components/ui/badge';
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupTextarea } from '@/components/ui/input-group';

import LoadingComponent from '@/components/LoadingComponent.vue';
import ResetButton from '@/components/ResetButton.vue';

import { useCourseListStore } from '@/stores/courselist';
const courseListStore = useCourseListStore();

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore();
const saveCourse = () => { courseStore.save(); }

const editing = ref(false);

const course = computed({
  get: () => editing.value ? courseStore.draft : courseStore.saved,
  set: (value) => {
    if (editing.value)
      courseStore.draft = value;
    else
      courseStore.saved = value;
  },
})

const setEditing = (value: boolean) => {
  editing.value = value;
  if (courseStore.draft.code !== courseStore.saved.code) {
    courseStore.createDraft();
  }
};

// defineProps<{
//   course: Course;
//   editing: boolean;
//   loading?: boolean;
// }>();

// defineEmits(['update:editing']);
const paths = [
  ['code'],
  ['name'],
  ['credits'],
  ['year'],
  ['semester'],
  ['category'],
  ['courseType'],
  ['lecturers'],
  ['synopsis'],
  ['transferableSkills'],
  ['prerequisites'],
  ['deliveryMethods']
]

const isSummaryDiff = computed(() => {
  return paths.some(path => courseStore.checkDiff(path));
});
const resetSummaryDiff = () => {
  paths.forEach(path => courseStore.resetDiff(path));
}
</script>

<template>
  <!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveCourse">
    <template #title>
      <div class="flex flex-row items-center gap-2">
        <div>Course Summary</div>
        <ResetButton :show="editing && isSummaryDiff" @reset="resetSummaryDiff" />
      </div>
    </template>
    <template #body="{ editing }">
      <LoadingComponent :show="courseStore.loading" />
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-3">
          <ContentItem title="Code">
            <InputGroup v-if="editing">
              <InputGroupInput v-model="course.code" disabled></InputGroupInput>
              <InputGroupAddon align="inline-end">
                <ResetButton :show="false" @reset="courseStore.resetDiff(['code'])" />
              </InputGroupAddon>
            </InputGroup>
            <div v-else>{{course.code}}</div>
          </ContentItem>
          <ContentItem title="Name" class="flex-1">
            <InputGroup v-if="editing">
              <InputGroupInput v-model="course.name"></InputGroupInput>
              <InputGroupAddon align="inline-end">
                <ResetButton :show="courseStore.checkDiff(['name'])" @reset="courseStore.resetDiff(['name'])" />
              </InputGroupAddon>
            </InputGroup>
            <div v-else>{{course.name}}</div>
          </ContentItem>
        </div>
        <div class="flex flex-wrap gap-3">
          <ContentItemNumber
            title="Credit Hours"
            v-model="course.credits"
            :min="0"
            :max="10"
            :editing="editing"
          >
            <ResetButton :show="courseStore.checkDiff(['credits'])" @reset="courseStore.resetDiff(['credits'])" />
          </ContentItemNumber>
          <ContentItemGroup
            title="Offering"
            :selected="[{ label: 'Year ' + course.year, value: course.year }, { label: 'Semester ' + course.semester, value: course.semester }]"
            :editing="editing"
            :options="[
              [...Array(4).keys()].map((year) => ({ label: 'Year ' + (year + 1), value: year + 1 })),
              [...Array(3).keys()].map((semester) => ({ label: 'Semester ' + (semester + 1), value: semester + 1 })),
            ]"
            @update:selected="(value) => { course.year = value[0] as number; course.semester = value[1] as number }"
          >
            <ResetButton
              :show="courseStore.checkDiff(['year']) || courseStore.checkDiff(['semester'])"
              @reset="[['year'], ['semester']].forEach(path => courseStore.resetDiff(path))"
            />
          </ContentItemGroup>
          <ContentItemSelect
            title="Category"
            :selected="{ label: course.category, value: course.category }"
            elsemessage="Category not defined"
            :editing="editing"
            :options="courseListStore.categorySelections"
            @select="(option) => course.category = option.value"
          >
            <ResetButton
              :show="courseStore.checkDiff(['category'])"
              @reset="courseStore.resetDiff(['category'])"
            />
          </ContentItemSelect>
          <ContentItemSelect
            title="Course Type"
            :selected="{ label: COURSE_TYPES.find((t) => t.key === course.courseType)?.label || '', value: course.courseType }"
            :editing="editing"
            :options="COURSE_TYPES.map((t) => ({ label: t.label, value: t.key }))"
            elsemessage="Course type not defined"
            @select="(option) => course.courseType = option.value as typeof course.courseType"
          >
            <ResetButton
              :show="courseStore.checkDiff(['courseType'])"
              @reset="courseStore.resetDiff(['courseType'])"
            />
          </ContentItemSelect>
          <ContentItemBadges
            title="Lecturers"
            :badges="course.lecturers.map((l) => ({ label: l, value: l }))"
            elsemessage="No lecturers"
            :editing="editing"
            :options="courseListStore.lecturersSelections"
            @add="courseStore.addLecturer"
            @delete="courseStore.removeLecturer"
          >
            <ResetButton
              :show="courseStore.checkDiff(['lecturers'])"
              @reset="courseStore.resetDiff(['lecturers'])"
            />
          </ContentItemBadges>
        </div>
        <ContentItem title="Synopsis">
          <div>
            <Badge v-if="!course.synopsis" variant="outline">No synopsis</Badge>
            <InputGroup v-if="editing">
              <InputGroupTextarea v-model="course.synopsis" />
              <InputGroupAddon align="block-end">
                <div class="w-full flex justify-end">
                  <ResetButton
                    :show="courseStore.checkDiff(['synopsis'])"
                    @reset="courseStore.resetDiff(['synopsis'])"
                  />
                </div>
              </InputGroupAddon>
            </InputGroup>
            <span v-else>{{course.synopsis}}</span>
          </div>
        </ContentItem>
        <div class="flex flex-wrap gap-3">
          <ContentItemBadges
            title="Prerequisites"
            :badges="course.prerequisites.map((p) => ({ label: courseListStore.getDisplayLabel(p), value: p })) || []"
            elsemessage="No prerequisites"
            :editing="editing"
            :options="courseListStore.courseSelections"
            @add="courseStore.addPrerequisite"
            @delete="courseStore.removePrerequisite"
          >
            <ResetButton
              :show="courseStore.checkDiff(['prerequisites'])"
              @reset="courseStore.resetDiff(['prerequisites'])"
            />
          </ContentItemBadges>
          <ContentItemBadges
            title="Transferable Skills"
            :badges="course.transferableSkills.map((s) => ({ label: s, value: s })) || []"
            elsemessage="No transferable skills"
            :editing="editing"
            :options="courseListStore.transferableSkillsSelections"
            @add="courseStore.addTransferableSkill"
            @delete="courseStore.removeTransferableSkill"
          >
            <ResetButton
              :show="courseStore.checkDiff(['transferableSkills'])"
              @reset="courseStore.resetDiff(['transferableSkills'])"
            />
          </ContentItemBadges>
          <ContentItemBadges
            title="Delivery Methods"
            :badges="course.deliveryMethods.map((m) => ({ label: m, value: m })) || []"
            elsemessage="No delivery methods"
            :editing="editing"
            :options="courseListStore.deliveryMethodsSelections"
            @add="courseStore.addDeliveryMethod"
            @delete="courseStore.removeDeliveryMethod"
          >
            <ResetButton
              :show="courseStore.checkDiff(['deliveryMethods'])"
              @reset="courseStore.resetDiff(['deliveryMethods'])"
            />
          </ContentItemBadges>
        </div>
      </div>
    </template>
  </ContentCard>
</template>
