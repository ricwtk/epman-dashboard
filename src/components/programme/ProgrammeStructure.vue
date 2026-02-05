<script setup lang="ts">
import { computed } from 'vue';
import { getStructureLabelsByProgramme } from '@/utils/structureHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

defineEmits(['update:editing']);

const props = defineProps<{
  programme: string;
  programmeRevision: string;
  editing: boolean;
}>();

const labels = computed(() => getStructureLabelsByProgramme(props.programme, props.programmeRevision));
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme Structure
    </template>
    <template #body>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a structure" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="label in labels" :value="label">{{ label }}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </template>
  </ContentCard>
</template>
