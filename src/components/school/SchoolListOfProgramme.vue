<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import EmptyComponent from '@/components/EmptyComponent.vue';
import { SquareArrowOutUpRightIcon } from 'lucide-vue-next';
import { navigateToProgrammeExternal } from '@/utils/navigationHelpers';

const props = defineProps<{
  programmes: { code: string; name: string; }[];
  editing: boolean;
}>();

defineEmits(['update:editing']);

import { dataService } from '@/services/dataService';
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme List
    </template>
    <template #body>
      <EmptyComponent v-if="programmes.length === 0">
        <template #title>
          No Programmes
        </template>
        <template #description>
          No programme is allocated to the school
        </template>
      </EmptyComponent>
      <!-- <div class="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-2"> -->
      <div class="flex flex-row flex-wrap gap-2" v-else>
        <div v-for="programme in programmes" :key="programme.code" class="flex flex-row justify-center">
          <ButtonGroup class="gap-0!">
            <ButtonGroupText class="max-w-50">
              <span class="truncate" :title="programme.name">{{ programme.code }} {{ programme.name }}</span>
            </ButtonGroupText>
            <Button variant="outline" size="icon" @click="navigateToProgrammeExternal(programme.code)"><SquareArrowOutUpRightIcon /></Button>
          </ButtonGroup>
        </div>
      </div>
    </template>
  </ContentCard>
</template>
