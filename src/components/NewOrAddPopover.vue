<script setup lang="ts">
// generic="T extends { name: string; code: string }">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FieldSet, FieldLegend, FieldDescription, Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-vue-next';
import { ref, watch, computed } from 'vue';

interface Info {
  name: string;
  code: string;
  [key: string]: any;
}
interface errorHandler {
  (name: string, code: string, bannedItem?: Info): string;
}
const props = defineProps<{
  bannedList: Info[],
  availableList: Info[],
  errorMessageFcn?: errorHandler,
  title?: string,
  description?: string,
}>()
const isPopoverOpen = ref(false)
const newName = ref("")
const newCode = ref("")

const emits = defineEmits<{
  (e: 'create', name: string, code: string): void
  (e: 'add', code: string): void
}>()
const newOrAdd = () => {
  if (canAdd.value) {
    emits('add', newCode.value);
  } else {
    emits('create', newName.value, newCode.value);
  }
  isPopoverOpen.value = false;
  newName.value = '';
  newCode.value = '';
}

const availableItem = computed(() => props.availableList.find((item) => item.code.toUpperCase() === newCode.value.toUpperCase()));
const bannedItem = computed(() => props.bannedList.find((item) => item.code.toUpperCase() === newCode.value.toUpperCase()));
const canAdd = computed(() => props.availableList.some((item) => item.code.toUpperCase() === newCode.value.toUpperCase()));
const canCreate = computed(() => props.bannedList.every((item) => item.code.toUpperCase() !== newCode.value.toUpperCase()));
const buttonEnabled = computed(() => {
  return newCode.value !== "" && (canAdd.value || canCreate.value);
});
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="icon"
      >
        <PlusIcon />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <form @submit.prevent="newOrAdd">
        <FieldSet class="gap-1">
          <FieldLegend class="mb-1">{{ title || 'Add' }}</FieldLegend>
          <FieldDescription>{{ description || 'Add or Create' }}</FieldDescription>
          <FieldGroup class="gap-2">
            <Field class="gap-1">
              <FieldLabel for="code">Code</FieldLabel>
              <Input id="code" v-model="newCode"
                class="uppercase"
                :variant="canCreate ? 'default' : 'error'"
              />
              <FieldError v-if="!canCreate">
                {{ errorMessageFcn ? errorMessageFcn(newName, newCode, bannedItem) : 'Code already exists' }}
              </FieldError>
            </Field>

            <Field class="gap-1" v-if="!canAdd">
              <FieldLabel for="name">Name</FieldLabel>
              <Input id="name" v-model="newName"/>
            </Field>

            <Field class="gap-1" v-if="canAdd">
              <ButtonGroup class="gap-0! w-full">
                <ButtonGroupText>{{ availableItem?.code }}</ButtonGroupText>
                <ButtonGroupText class="grow overflow-hidden">{{ availableItem?.name }}</ButtonGroupText>
              </ButtonGroup>
            </Field>

            <Field class="gap-1">
              <Button type="submit" :disabled="!buttonEnabled">
                <PlusIcon/>
                <span v-if="canAdd">Add</span>
                <span v-else>Create</span>
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </PopoverContent>
  </Popover>
</template>
