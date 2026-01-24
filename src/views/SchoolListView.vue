<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getSchoolList } from '@/utils/schoolHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Button } from '@/components/ui/button';
import { navigateToSchool, navigateToPath } from '@/utils/navigationHelpers';

const schools: Ref<{ code: string, name: string }[]> = ref([]);
onMounted(() => {
  schools.value = getSchoolList();
  schools.value.sort((a, b) => a.code.localeCompare(b.code));
});
</script>

<template>
<div class="card-plain px-4">
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink @click="navigateToPath('/')">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink @click="navigateToPath('/school')">
          School
        </BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</div>

  <ContentCard :editable="false">
    <template #title>
      Schools
    </template>
    <template #body>
    <div class="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-4
      xl:grid-cols-5
      2xl:grid-cols-6
      gap-2
    ">
      <template v-for="school in schools" :key="school.code">
        <Button
          variant="default"
          @click="navigateToSchool(school.code)"
        >
          {{ school.code }} {{ school.name }}
        </Button>
      </template>
    </div>
    </template>
  </ContentCard>
</template>
