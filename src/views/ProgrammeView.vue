<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
</script>

<template>
  <div class="card-plain px-4">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/programme">
            Programme
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/programme/bmec">
            Bachelor of Mechanical Engineering with Honours
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
  <!-- <template v-if="course">
    <div class="card-plain px-4 text-muted-foreground text-sm">
      {{ course.code }} {{ course.name }}
      <Badge>{{ course.revision }}</Badge>
    </div>
    <CourseSummary :course="course" :editing="editing" @update:editing="updateEditing" />
    <CourseOutcomes :cos="course?.cos || []" :editing="editing" @update:editing="updateEditing" />
    <CourseAssessments :assessments="course?.assessments" :coCount="course?.cos?.length || 0" :editing="editing" @update:editing="updateEditing" />
    <CEPCEAImplementation :course="course" :editing="editing" @update:editing="updateEditing" />
    <CoursePlan :course="course" :editing="editing" @update:editing="updateEditing" />
    <CourseReferences :references="course.references || []" :editing="editing" @update:editing="updateEditing" />
    <CourseUpdateDialog v-model:isOpen="editing" />
  </template> -->
</template>
