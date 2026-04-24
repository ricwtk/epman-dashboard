<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Programme } from '@/types/programme';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import ContentItem from '@/components/contentcard/ContentItem.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import ResetButton from '@/components/ResetButton.vue';

import { useProgrammeStore } from '@/stores/programme';
const programmeStore = useProgrammeStore();
const saveProgramme = () => { programmeStore.save(); }
const editing = ref(false);
const programme = computed({
  get: () => editing.value ? programmeStore.draft : programmeStore.saved,
  set: (value) => {
    if (editing.value) programmeStore.draft = value;
    else programmeStore.saved = value;
  },
})
const setEditing = (value: boolean) => {
  editing.value = value;
  if (programmeStore.draft.code !== programmeStore.saved.code) {
    programmeStore.createDraft();
  }
};

// const props = defineProps<{
//   programme: Programme;
//   editing: boolean;
//   loading?: boolean;
// }>();

// defineEmits(['update:editing']);
const paths = [
  ['code'],
  ['name'],
]

const isSummaryDiff = computed(() => {
  return paths.some(path => programmeStore.checkDiff(path));
});
const resetSummaryDiff = () => {
  paths.forEach(path => programmeStore.resetDiff(path));
}
</script>

<template>
  <!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveProgramme">
    <template #title>
      <div class="flex flex-row items-center gap-2">
        <div>Programme Summary</div>
        <ResetButton :show="!!programmeStore.draft.code && isSummaryDiff" @reset="resetSummaryDiff" />
      </div>
    </template>
    <template #body>
      <LoadingComponent :show="programmeStore.loading" />
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-3">
          <ContentItem title="Code">
            <InputGroup v-if="editing">
              <InputGroupInput v-model="programme.code" disabled></InputGroupInput>
              <InputGroupAddon align="inline-end">
                <ResetButton :show="false" @reset="programmeStore.resetDiff(['code'])" />
              </InputGroupAddon>
            </InputGroup>
            <div v-else>{{programme.code}}</div>
          </ContentItem>
          <ContentItem title="Name" class="flex-1">
            <InputGroup v-if="editing">
              <InputGroupInput v-model="programme.name"></InputGroupInput>
              <InputGroupAddon align="inline-end">
                <ResetButton
                  :show="programmeStore.checkDiff(['name'])"
                  @reset="programmeStore.resetDiff(['name'])"
                />
              </InputGroupAddon>
            </InputGroup>
            <div v-else>{{programme.name}}</div>
          </ContentItem>
        </div>
      </div>
    </template>
  </ContentCard>
</template>
