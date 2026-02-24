<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import type { School } from '@/types/school';
import { ref, onMounted } from 'vue';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { navigateToProgrammeExternal } from '@/utils/navigationHelpers';
import { Button } from '@/components/ui/button';
import { SquareArrowOutUpRightIcon } from 'lucide-vue-next';

const props = defineProps<{
  school: School;
  editing: boolean;
}>();

defineEmits(['update:editing']);

import { dataService } from '@/services/dataService';
const programmeNames = ref<Map<string, string>>(new Map());
onMounted(async () => {
  programmeNames.value = await dataService.getNameOfProgrammes(props.school.programmes);
});
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme List
    </template>
    <template #body>
      <!-- <div class="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-2"> -->
      <div class="flex flex-row flex-wrap gap-2">
        <div v-for="programme in school.programmes" :key="programme" class="flex flex-row justify-center">
          <ButtonGroup class="gap-0!">
            <ButtonGroupText class="max-w-50">
              <span class="truncate" :title="programmeNames.get(programme)">{{ programme }} {{ programmeNames.get(programme) }}</span>
            </ButtonGroupText>
            <Button variant="outline" size="icon" @click="navigateToProgrammeExternal(programme)"><SquareArrowOutUpRightIcon /></Button>
          </ButtonGroup>
        </div>
      </div>
    </template>
  </ContentCard>
</template>
