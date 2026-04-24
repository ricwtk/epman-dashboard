<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import NavIndicator from '@/components/NavIndicator.vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { Button } from '@/components/ui/button';
import { UploadIcon, EyeIcon, CheckIcon, XIcon, SaveIcon, ListXIcon } from 'lucide-vue-next';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import Overview from '@/components/courseimport/Overview.vue';
import { parseCourseOutline } from '@/utils/parseCourseOutline.js'
import { formatRevision, formatId } from '@/utils/common';
import { dataService } from '@/services/dataService';
import { useCourseStore } from '@/stores/course';

interface FileObject {
  object: File;
  isReading: boolean;
  inQueue: boolean;
  inSaveQueue: boolean;
  isSaving: boolean;
  isSaved: boolean;
  hasError: boolean;
  message: string;
  content: any;
  store: any;
}
const files = ref<FileObject[]>([])
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
    inSaveQueue: false,
    isSaving: false,
    isSaved: false,
    hasError: false,
    message: "",
    content: null,
    store: null
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
        file.inQueue = false
        const arrayBuffer = await file.object.arrayBuffer()
        file.content = await parseCourseOutline(arrayBuffer, { isBrowser: true })
        file.content.revision = formatRevision()
        file.content.id = formatId(file.content)
        file.store = useCourseStore(file.content.id)
        await file.store.loadCourseObject(file.content)
      } catch (e) {
        file.hasError = true
        file.message = "Error extracting information"
        console.error(e)
      }
      file.isReading = false
    }
  })
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}
const saveFile = async (file: FileObject) => {
  if (file) {
    file.isSaving = true
    file.inSaveQueue = false
    try {
      await dataService.saveCourse(file.content)
      file.isSaved = true
    } catch (e) {
      file.hasError = true
      file.message = String(e)
    }
    file.isSaving = false
  }
}
const saveAll = async () => {
  const unSavedFiles = files.value.filter(f => !f.isSaved)
  unSavedFiles.forEach(f => { f.inSaveQueue = true })
  await Promise.all(unSavedFiles.map(f => saveFile(f)))
}
</script>

<template>
  <NavIndicator :items="[
    { label: 'Course', path: '/course' },
    { label: 'Import', path: '/course/import' },
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
          <AccordionTrigger class="items-center">
            <Button variant="ghost" size="icon" title="remove file" @click.stop="removeFile(fileIndex)"><ListXIcon /></Button>
            <div class="relative w-10 h-full flex justify-center items-center">
              <LoadingComponent :show="file.inQueue||file.isReading||file.inSaveQueue||file.isSaving" style="backgroundColor: rgba(255, 255, 255, 0.7)"/>
              <Button variant="ghost" size="icon" @click.stop="saveFile(file)"><SaveIcon /></Button>
              <div class="absolute w-full h-full flex justify-center items-center" style="backgroundColor: rgba(255, 255, 255, 0.7)" v-if="file.hasError || file.isSaved">
                <XIcon v-if="file.hasError" :title="file.message" class="text-red-500 absolute "/>
                <CheckIcon v-if="file.isSaved" class="text-green-500 absolute "/>
              </div>
            </div>
            <div>{{ file.object.name }}</div>
            <div class="grow"></div>
            <div class="relative w-10 h-full flex justify-center items-center">
              <EyeIcon />
              <LoadingComponent :show="file.inQueue||file.isReading" style="backgroundColor: rgba(255, 255, 255, 0.7)"/>
              <div class="absolute w-full h-full flex justify-center items-center" style="backgroundColor: rgba(255, 255, 255, 0.7)" v-if="!file.inQueue && !file.isReading">
                <CheckIcon v-if="!file.hasError" class="text-green-500"/>
                <XIcon v-if="file.hasError" :title="file.message" class="text-red-500"/>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea class="h-96">
              <Overview :store-id="file.content.id"></Overview>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </template>
    <template #actions>
      <Button variant="secondary" @click="saveAll">Save all</Button>
    </template>
  </ContentCard>
</template>
