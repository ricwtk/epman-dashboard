<script setup lang="ts">
import { getEditingSchoolAndStore } from '@/composables/school';
const { school } = getEditingSchoolAndStore();
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, MinusIcon } from 'lucide-vue-next';

const props = defineProps<{
  title: string,
  shortlabel: string,
  component: string,
}>();

const addItem = () => {
  school.value.components![props.component].push({
    attribute: '',
    descriptor: ''
  });
}

const removeItem = (index: number) => {
  school.value.components![props.component].splice(index, 1);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="font-medium">{{ title }}</div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead class="w-0 text-center">#</TableHead>
          <TableHead>Attribute</TableHead>
          <TableHead>Descriptor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(item, index) in school.components![component]" :key="index">
          <TableCell>
            <Button variant="destructive" @click="removeItem(Number(index))">
              <MinusIcon />
            </Button>
          </TableCell>
          <TableCell class="text-center">{{ `${shortlabel}${Number(index) + 1}` }}</TableCell>
          <TableCell>
            <Input v-model="item.attribute"></Input>
          </TableCell>
          <TableCell>
            <Textarea v-model="item.descriptor"></Textarea>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colspan="4">
            <Button variant="default" class="w-full" @click="addItem">
              <PlusIcon />
              Add {{ shortlabel }}
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
