<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import ContentItem from '@/components/contentcard/ContentItem.vue';
import ContentItemBadges from '@/components/contentcard/ContentItemBadges.vue';
import { Button } from '@/components/ui/button';
import { type Course } from '@/types/course';
import { COURSE_TYPES } from '@/constants';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Badge } from '@/components/ui/badge';

defineProps<{
  course: Course;
  editing: boolean;
}>();

defineEmits(['update:editing']);
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Course Summary
    </template>
    <template #body="{ editing }">
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-3">
          <ContentItem title="Code">
            <div>{{course.code}}</div>
          </ContentItem>
          <ContentItem title="Name">
            <div>{{course.name}}</div>
          </ContentItem>
          <ContentItemBadges
            title="Credit Hours"
            :badges="[ String(course.credits) ]"
            elsemessage=""
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <ContentItem title="Offering">
            <ButtonGroup class="gap-0!">
              <ButtonGroupText>
                <span>{{ "Year " + course.year }}</span>
              </ButtonGroupText>
              <ButtonGroupText>
                <span>{{ "Semester " + course.semester }}</span>
              </ButtonGroupText>
            </ButtonGroup>
          </ContentItem>
          <ContentItemBadges
            title="Category"
            :badges="[ COURSE_TYPES.find((t) => t.key === course.category)?.label || '' ]"
            elsemessage="Category not defined"
          />
          <ContentItemBadges
            title="Lecturers"
            :badges="course.lecturers"
            elsemessage="No lecturers"
          />
        </div>
        <ContentItem title="Synopsis">
          <div>
            <Badge v-if="!course.synopsis" variant="outline">No synopsis</Badge>
            {{course.synopsis}}
          </div>
        </ContentItem>
        <div class="flex flex-wrap gap-3">
          <ContentItemBadges
            title="Prerequisites"
            :badges="course.prerequisites || []"
            elsemessage="No prerequisites"
          />
          <ContentItemBadges
            title="Transferable Skills"
            :badges="course.transferableSkills || []"
            elsemessage="No transferable skills"
          />
          <ContentItemBadges
            title="Delivery Methods"
            :badges="course.deliveryMethods || []"
            elsemessage="No delivery methods"
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
