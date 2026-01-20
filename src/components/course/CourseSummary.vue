<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import ContentItem from '@/components/contentcard/ContentItem.vue';
import ContentItemBadges from '@/components/contentcard/ContentItemBadges.vue';
import { Button } from '@/components/ui/button';
import { type Course } from '@/lib/course';

defineProps<{
  course: Course;
}>();
</script>

<template>
  <ContentCard :editable="true">
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
          <ContentItem title="Credit Hours">
            <div>{{course.credits}}</div>
          </ContentItem>
          <ContentItem title="Offering">
            <div>{{ "Year " + course.year + " Semester " + course.semester }}</div>
          </ContentItem>
        </div>
        <ContentItemBadges
          title="Lecturers"
          :badges="course.lecturers"
          elsemessage="No lecturers"
        />
        <ContentItem title="Synopsis">
          <div>{{course.synopsis}}</div>
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
