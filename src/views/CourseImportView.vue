<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import NavIndicator from '@/components/NavIndicator.vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-vue-next';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { extractInfo } from '@/utils/importHelpers';
import { parseCourseOutline } from '@/utils/parseCourseOutline.js'
import { formatRevision, formatId } from '@/utils/common';

const files = ref<{
  object: File;
  isReading: boolean;
  inQueue: boolean;
  hasError: boolean;
  message: string;
  content: any;
}[]>([])
const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const isDragging = ref(false)
const isReading = computed(() => files.value.some(f => f.isReading))

const launchFileUpload = () => { fileInput.value?.click() }
const onDrop = (e: DragEvent) => {
  isDragging.value = false
  handleFiles(e.dataTransfer?.files || null)
}
const onFileChange = (e: Event) => { handleFiles((e.target as HTMLInputElement).files) }
const handleFiles = (uploadedFiles: FileList | null) => {
  if (!uploadedFiles) return
  addToFiles(uploadedFiles)
  checkValidity()
  processFiles()
}
const addToFiles = (uploadedFiles: FileList) => {
  files.value.push(...Array.from(uploadedFiles).map(f => ({
    object: f,
    isReading: false,
    inQueue: true,
    hasError: false,
    message: "",
    content: null
  })))
}
const checkValidity = () => {
  files.value.forEach(file => {
    if (file.inQueue) {
      if (file.object.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        file.hasError = true
        file.message = `${file.object.name} is not a valid .docx file`
        file.inQueue = false
      }
    }
  })
}
const processFiles = () => {
  files.value.forEach(async (file) => {
    if (file.inQueue) {
      try {
        file.isReading = true
        const arrayBuffer = await file.object.arrayBuffer()
        file.content = await parseCourseOutline(arrayBuffer, { isBrowser: true })
        file.content.revision = formatRevision()
        file.content.id = formatId(file.content)
      } catch {
        file.hasError = true
        file.message = "Error extracting information"
      }
      file.isReading = false
    }
  })
}
</script>

<template>
  <NavIndicator :items="[
    { label: 'Courses', path: '/courses' },
    { label: 'Import', path: '/courses/import' },
  ]"></NavIndicator>

  <ContentCard :editable="false"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <template #title>
      Course Import
    </template>
    <template #body>
      <div class="relative">
        <LoadingComponent :show="isReading" class="z-50"/>
        <input
          type="file"
          multiple
          class="hidden"
          ref="fileInput"
          accept=".docx"
          @change="onFileChange"
        />
        <Empty class="border-dashed border"
          :class="isDragging ? 'border-green-500 bg-green-50' : ''"
        >
          <EmptyHeader>
            <EmptyMedia variant="icon"
              :class="isDragging ? 'bg-green-400 text-green-900' : ''"
            >
              <UploadIcon />
            </EmptyMedia>
            <EmptyTitle>
              Upload Course Outlines
            </EmptyTitle>
            <EmptyDescription>
              Drop files or click to upload
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button @click="launchFileUpload"
              :class="isDragging ? 'bg-green-900' : ''"
            >Upload files</Button>
          </EmptyContent>
        </Empty>
      </div>
    </template>
  </ContentCard>

  <ContentCard :editable="false" v-if="files.length > 0">
    <template #title>
      Import list
    </template>
    <template #body>
      <Accordion type="single" collapsible class="w-full">
        <AccordionItem v-for="(file, fileIndex) in files" :value="`${fileIndex}-${file.object.name}`" :key="`${fileIndex}-${file.object.name}`">
          <AccordionTrigger>{{ file.object.name }}</AccordionTrigger>
          <AccordionContent>
            <ScrollArea class="h-96">
              {{ file.content }}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </template>
  </ContentCard>
</template>
