<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import type { ProgrammesWithCourse, SchoolsByCode } from '@/services/dataService';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { SquareArrowOutUpRightIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { navigateToSchoolExternal, navigateToProgrammeExternal } from '@/utils/navigationHelpers';
import EmptyComponent from '@/components/EmptyComponent.vue';

defineProps<{
  programmes: ProgrammesWithCourse;
  schools: SchoolsByCode;
  editing: boolean;
  editable?: boolean;
}>();

defineEmits(['update:editing']);
</script>

<template>
  <ContentCard :editable="false" :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme Allocation
    </template>
    <template #body="{ editing }">
      <EmptyComponent v-if="Object.keys(programmes).length === 0">
        <template #title>
          Not Programme Allocation
        </template>
        <template #description>
          Course is not allocated in any structure of any programme
        </template>
      </EmptyComponent>
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead class="w-0">School</TableHead>
            <TableHead class="w-0">Programme</TableHead>
            <TableHead>Structures</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(prog, progKey) in programmes" :key="progKey">
            <TableCell>
              <ButtonGroup class="gap-0!">
                <ButtonGroupText class="justify-center">
                  <span class="truncate" :title="prog.school">{{ schools[prog.school]?.name }}</span>
                </ButtonGroupText>
                <Button variant="outline" size="icon" @click="navigateToSchoolExternal(prog.school)"><SquareArrowOutUpRightIcon /></Button>
              </ButtonGroup>
            </TableCell>
            <TableCell>
              <ButtonGroup class="gap-0!">
                <ButtonGroupText class="justify-center">
                  <span class="truncate" :title="prog.name">{{ prog.name }}</span>
                </ButtonGroupText>
                <Button variant="outline" size="icon" @click="navigateToProgrammeExternal(progKey)"><SquareArrowOutUpRightIcon /></Button>
              </ButtonGroup>
            </TableCell>
            <TableCell>
              <div v-for="(struct, structKey) in prog.structures" :key="structKey"
                class="flex flex-wrap gap-1"
              >
                <ButtonGroup class="gap-0!">
                  <ButtonGroupText class="w-25 justify-center">
                    <span class="truncate" :title="structKey">{{ structKey }}</span>
                  </ButtonGroupText>
                  <ButtonGroupText class="w-25 justify-center">
                    <span class="truncate" :title="struct">{{ struct }}</span>
                  </ButtonGroupText>
                   <Button variant="outline" size="icon" @click="navigateToProgrammeExternal(progKey)"><SquareArrowOutUpRightIcon /></Button>
                </ButtonGroup>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
