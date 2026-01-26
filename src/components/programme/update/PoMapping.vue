<script setup lang="ts">
import { getEditingProgrammeAndStore } from '@/composables/programme';
import { storeToRefs } from 'pinia';
import { RotateCcwIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const props = defineProps<{
  title: string,
  coursetype: "examBased" | "projectBased"
}>();

const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();
const { school } = storeToRefs(editingProgrammeStore);

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import VerticalText from '@/components/VerticalText.vue';
import { Checkbox } from '@/components/ui/checkbox';
import { computed } from 'vue';

const mapping = computed(() => {
  if (props.coursetype == "examBased") {
    return programme.value.poList.map((po) => po.mapping.examBased);
  } else {
    return programme.value.poList.map((po) => po.mapping.projectBased);
  }
});

const handleMappingChange = (poIndex: number, component: "wk" | "wp" | "ea", compValue: number, isChecked: boolean | 'indeterminate') => {
  const currentList = mapping.value[poIndex]![component];

  if (isChecked === 'indeterminate') { return; }
  if (isChecked) {
    if (!currentList.includes(compValue)) {
      currentList.push(compValue);
    }
  } else {
    mapping.value[poIndex]![component] = currentList.filter(id => id !== compValue);
  }
};

const wkMappingDiff = computed(() => editingProgrammeStore.checkMappingDiff(props.coursetype, 'wk'))
const wpMappingDiff = computed(() => editingProgrammeStore.checkMappingDiff(props.coursetype, 'wp'))
const eaMappingDiff = computed(() => editingProgrammeStore.checkMappingDiff(props.coursetype, 'ea'))

const resetMapping = (component: "wk" | "wp" | "ea") => {
  editingProgrammeStore.resetMappingDiff(props.coursetype, component);
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="font-bold">{{ title }}</div>

    <div class="font-semibold flex flex-row items-center gap-1 h-9">
      PO to WK Mapping
      <Button v-if="wkMappingDiff"
        variant="ghost"
        class="reset-button"
        @click="resetMapping('wk')"
      >
        <RotateCcwIcon />
      </Button>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="align-bottom text-center w-0">PO</TableHead>
          <TableHead class="align-bottom text-center"
            v-for="(wk, wkIndex) in school?.components?.wks"
            :key="wkIndex"
          >
            <VerticalText :label="`WK${Number(wkIndex) + 1}`" :content="wk.attribute" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(po, poIndex) in programme.poList" :key="poIndex" class="text-center">
          <TableCell class="w-0">PO{{ poIndex + 1 }}</TableCell>
           <TableCell v-for="(_, wkIndex) in school?.components?.wks" :key="wkIndex">
            <Checkbox
              :id="`po-${poIndex}-wk-${wkIndex}`"
              :modelValue="mapping[poIndex]!.wk.includes(Number(wkIndex) + 1)"
              @update:modelValue="(checked) => handleMappingChange(poIndex, 'wk', Number(wkIndex) + 1, checked)"
            />
           </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="font-semibold flex flex-row items-center gap-1 h-9">
      PO to WP/EA Mapping
      <Button v-if="wpMappingDiff || eaMappingDiff"
        variant="ghost"
        class="reset-button"
        @click="() => { resetMapping('wp'); resetMapping('ea'); }"
      >
        <RotateCcwIcon />
      </Button>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="align-bottom text-center w-0">PO</TableHead>
          <TableHead class="w-0 bg-border"></TableHead>
          <TableHead class="align-bottom text-center"
            v-for="(wp, wpIndex) in school?.components?.wps"
            :key="wpIndex"
          >
            <VerticalText :label="`WP${Number(wpIndex) + 1}`" :content="wp.attribute" />
          </TableHead>
          <TableHead class="w-0 bg-border"></TableHead>
          <TableHead class="align-bottom text-center"
            v-for="(ea, eaIndex) in school?.components?.eas"
            :key="eaIndex"
          >
            <VerticalText :label="`EA${Number(eaIndex) + 1}`" :content="ea.attribute" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(po, poIndex) in programme.poList" :key="poIndex" class="text-center">
          <TableCell class="w-0">PO{{ poIndex + 1 }}</TableCell>
          <TableCell class="w-0 bg-border"></TableCell>
          <TableCell v-for="(_, wpIndex) in school?.components?.wps" :key="wpIndex">
            <Checkbox
              :id="`po-${poIndex}-wp-${wpIndex}`"
              :modelValue="mapping[poIndex]!.wp.includes(Number(wpIndex) + 1)"
              @update:modelValue="(checked) => handleMappingChange(poIndex, 'wp', Number(wpIndex) + 1, checked)"
            />
           </TableCell>
           <TableCell class="w-0 bg-border"></TableCell>
           <TableCell v-for="(_, eaIndex) in school?.components?.eas" :key="eaIndex">
            <Checkbox
              :id="`po-${poIndex}-ea-${eaIndex}`"
              :modelValue="mapping[poIndex]!.ea.includes(Number(eaIndex) + 1)"
              @update:modelValue="(checked) => handleMappingChange(poIndex, 'ea', Number(eaIndex) + 1, checked)"
            />
           </TableCell>
        </TableRow>
      </TableBody>
    </Table>

  </div>
</template>
