<script setup lang="ts">
import { ref, computed } from 'vue';
import { type Co, type Assessment } from '@/lib/course';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PlusIcon, MinusIcon, ListPlusIcon, ListMinusIcon } from 'lucide-vue-next';

const componentOptions = ['Written Assessment', 'Assignment', 'Lab'];

const colist = ref<Co[]>([{
  description: 'Outcome 1',
  bloomtax: ['c', 1],
  pos: [1],
  was: [1,2,4],
  wks: [2,3],
  wps: [5,6],
  eas: [],
  sdg: false
},{
  description: 'Outcome 2',
  bloomtax: ['c', 6],
  pos: [1],
  was: [1,2,4],
  wks: [2,3],
  wps: [],
  eas: [3],
  sdg: false
}])

const assessmentList = ref<Assessment[]>([
  {
    description: "Continuous Assessment",
    component: "Written Assessment",
    weightage: 40,
    cos: [1, 2],
    breakdown: [
      { description: "Lab Exercises", weightage: 20, co: 2, wps: [2] },
      { description: "Quiz", weightage: 20, co: 1, wps: [2], eas: [1, 2, 3] }
    ]
  },
  {
    description: "Final Examination",
    component: "Written Assessment",
    weightage: 60,
    cos: [1, 2],
    breakdown: [],
    wps: [4]
  }
])

const totalWeightage = computed(() => {
  return assessmentList.value.reduce((acc, assessment) => acc + assessment.weightage, 0);
});

</script>

<template>
  <div class="font-semibold">Assessment to CO mapping</div>

  <Table>
    <TableHeader>
      <TableRow>
        <TableHead></TableHead>
        <TableHead colspan="2">Method</TableHead>
        <TableHead>Component</TableHead>
        <TableHead class="text-center">Weightage</TableHead>
        <TableHead
          v-for="(co, coIndex) in colist"
          :key="coIndex"
          class="text-center"
        >
          {{ `CO${coIndex + 1}` }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-for="(assessment, assessmentIndex) in assessmentList" :key="assessmentIndex">
        <TableRow>
          <TableCell>
            <Button variant="destructive"><MinusIcon /></Button>
          </TableCell>
          <TableCell colspan="2">
            <Input v-model="assessment.description" class="text-sm" />
          </TableCell>
          <TableCell class="w-0 text-center">
            <Select v-model="assessment.component">
              <SelectTrigger class="w-35">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in componentOptions" :key="option" :value="option">
                  {{ option }}
                </SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell class="w-0 text-center">
            <Input v-model="assessment.weightage" class="text-sm" type="number" />
          </TableCell>
          <TableCell
            v-for="(co, coIndex) in colist"
            :key="coIndex"
            class="w-0 text-center"
          >
            <Checkbox :v-model="assessment.cos.includes(coIndex + 1)" />
          </TableCell>
        </TableRow>
        <TableRow v-for="(breakdown, index) in assessment.breakdown" :key="index">
          <TableCell></TableCell>
          <TableCell class="w-0">
            <Button variant="destructive"><ListMinusIcon /></Button>
          </TableCell>
          <TableCell>
            <Input v-model="breakdown.description" class="text-sm" />
          </TableCell>
          <TableCell class="w-0">
            <Input v-model="breakdown.weightage" class="text-sm w-20" type="number" />
          </TableCell>
          <TableCell></TableCell>
          <TableCell
            v-for="(co, coIndex) in colist"
            :key="coIndex"
            class="w-0 text-center"
          >
            <Checkbox :v-model="breakdown.co == coIndex + 1" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell></TableCell>
          <TableCell :colspan="colist.length+4">
            <Button variant="secondary" class="w-full text-xs" size="sm"><ListPlusIcon /> Add Breakdown</Button>
          </TableCell>
        </TableRow>
      </template>
      <TableRow>
        <TableCell :colspan="colist.length+5">
          <Button variant="default" class="w-full"><PlusIcon /> Add Assessment</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell class="text-right font-medium">Total</TableCell>
        <TableCell
          class="text-center font-medium"
          :class="totalWeightage === 100 ? '' : 'bg-destructive text-white'"
        >{{ totalWeightage }}</TableCell>
        <TableCell v-for="_ in colist.length"></TableCell>
      </TableRow>
    </TableBody>
  </Table>

  <div class="font-semibold">Assessment to WP/EA mapping</div>
</template>
