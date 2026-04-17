<script setup lang="ts">
import { ref, computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import ContentItem from '@/components/contentcard/ContentItem.vue';
import ContentItemBadges from '@/components/contentcard/ContentItemBadges.vue';
import ContentItemSelect from '@/components/contentcard/ContentItemSelect.vue';
import ContentItemNumber from '@/components/contentcard/ContentItemNumber.vue';
import ContentItemGroup from '@/components/contentcard/ContentItemGroup.vue';
import { type Course } from '@/types/course';
import { COURSE_TYPES } from '@/constants';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import LoadingComponent from '@/components/LoadingComponent.vue';

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
</script>

<template>
  <!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveCourse">
    <template #title>
      Course Summary
    </template>
    <template #body="{ editing }">
      <LoadingComponent :show="courseStore.loading" />
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-3">
          <ContentItem title="Code">
            <Input v-model="course.code" v-if="editing" disabled></Input>
            <div v-else>{{course.code}}</div>
          </ContentItem>
          <ContentItem title="Name" class="flex-1">
            <Input v-model="course.name" v-if="editing"></Input>
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
          />
          <ContentItemGroup
            title="Offering"
            :selected="[{ label: 'Year ' + course.year, key: course.year }, { label: 'Semester ' + course.semester, key: course.semester }]"
            :editing="editing"
            :options="[
              [...Array(4).keys()].map((year) => ({ label: 'Year ' + (year + 1), key: year + 1 })),
              [...Array(3).keys()].map((semester) => ({ label: 'Semester ' + (semester + 1), key: semester + 1 })),
            ]"
            @update:selected="(value) => { course.year = value[0] as number; course.semester = value[1] as number }"
          />
          <ContentItemSelect
            title="Category"
            :selected="{ label: course.category, key: course.category }"
            elsemessage="Category not defined"
            :editing="editing"
            :options="courseListStore.courseCodes.map((code) => ({ label: courseListStore.getDisplayLabel(code), key: code }))"
            @select="(option) => course.category = option.key"
          />
          <ContentItemSelect
            title="Course Type"
            :selected="{ label: COURSE_TYPES.find((t) => t.key === course.courseType)?.label || '', key: course.courseType }"
            :editing="editing"
            :options="COURSE_TYPES.map((t) => ({ label: t.label, key: t.key }))"
            elsemessage="Course type not defined"
            @select="(option) => course.courseType = option.key as typeof course.courseType"
          />
          <ContentItemBadges
            title="Lecturers"
            :badges="course.lecturers.map((l) => ({ label: l, key: l }))"
            elsemessage="No lecturers"
            :editing="editing"
          />
        </div>
        <ContentItem title="Synopsis">
          <div>
            <Badge v-if="!course.synopsis" variant="outline">No synopsis</Badge>
            <Textarea v-if="editing" v-model="course.synopsis"></Textarea>
            <span v-else>{{course.synopsis}}</span>
          </div>
        </ContentItem>
        <div class="flex flex-wrap gap-3">
          <ContentItemBadges
            title="Prerequisites"
            :badges="course.prerequisites.map((p) => ({ label: courseListStore.getDisplayLabel(p), key: p })) || []"
            elsemessage="No prerequisites"
            :editing="editing"
            :options="courseListStore.courseCodes.map((code) => ({ label: courseListStore.getDisplayLabel(code), key: code }))"
          />
          <ContentItemBadges
            title="Transferable Skills"
            :badges="course.transferableSkills.map((s) => ({ label: s, key: s })) || []"
            elsemessage="No transferable skills"
            :editing="editing"
          />
          <ContentItemBadges
            title="Delivery Methods"
            :badges="course.deliveryMethods.map((m) => ({ label: m, key: m })) || []"
            elsemessage="No delivery methods"
            :editing="editing"
          />
        </div>
      </div>
      <!-- <div class="justify-end flex flex-row grow gap-1" v-if="editing">
        <Button variant="default">Save</Button>
        <Button variant="ghost">Cancel</Button>
      </div> -->
    </template>
  </ContentCard>
</template>
