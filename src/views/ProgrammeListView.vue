<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getProgrammeList } from '@/utils/programmeHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Button } from '@/components/ui/button';
import { navigateToProgramme, navigateToPath } from '@/utils/navigationHelpers';

const programmes: Ref<{ code: string, name: string }[]> = ref([]);
onMounted(() => {
  programmes.value = getProgrammeList();
  programmes.value.sort((a, b) => a.code.localeCompare(b.code));
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
          <BreadcrumbLink @click="navigateToPath('/programme')">
            Programme
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>

  <ContentCard :editable="false">
    <template #title>
      Programme List
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
        <template v-for="programme in programmes" :key="programme.code">
          <Button
            variant="default"
            @click="navigateToProgramme(programme.code)"
          >
            {{ programme.code }} {{ programme.name }}
          </Button>
        </template>
      </div>
    </template>
  </ContentCard>
</template>
