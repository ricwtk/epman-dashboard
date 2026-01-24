<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { getProgrammeList } from '@/utils/programmeHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Button } from '@/components/ui/button';
import NavIndicator from '@/components/NavIndicator.vue';
import { navigateToProgramme } from '@/utils/navigationHelpers';

const programmes: Ref<{ code: string, name: string }[]> = ref([]);
onMounted(() => {
  programmes.value = getProgrammeList();
  programmes.value.sort((a, b) => a.code.localeCompare(b.code));
});
</script>

<template>
  <NavIndicator :items="[
    { label: 'Home', path: '/' },
    { label: 'Programme', path: '/programme' }
  ]"/>

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
