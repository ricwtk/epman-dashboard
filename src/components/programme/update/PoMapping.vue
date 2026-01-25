<script setup lang="ts">
import { getEditingProgrammeAndStore } from '@/composables/programme';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  title: string,
  component: string
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

const wkMapping = computed(() => {
  return programme.value.poList.map(po => {
    if (props.component == "examBased") {
      // return po.mapping.examBased.wk.
    }
  });
});

</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="font-bold">{{ title }}</div>

    <div class="font-semibold">PO to WK Mapping</div>

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
              :default-value="po.mapping.examBased.wk.includes(Number(wkIndex) + 1)"
              :id="`po${poIndex + 1}wk${Number(wkIndex) + 1}`"
              @change=""
            />
           </TableCell>
        </TableRow>
      </TableBody>
    </Table>

  </div>
</template>
