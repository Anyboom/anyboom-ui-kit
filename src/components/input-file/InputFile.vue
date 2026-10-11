<script setup lang="ts">
import type { UploadedFile } from '@/components/input-file/uploaded-file.ts'
import XBoldIcon from '@iconify-vue/ph/x-bold'

import { computed, reactive, ref, useId } from 'vue'
import Button from '@/components/button/Button.vue'

interface Props {
  multiple?: boolean
  inputId?: string
  allowedExtensions?: Array<string>
  allowedMimeTypes?: Array<string>
  maxFileSize?: number
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  inputId: undefined,
  maxFileSize: 5 * 1024 * 1024,
  ariaLabel: '',
  allowedMimeTypes: () => [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
  ],
  allowedExtensions: () => [
    'doc',
    'docx',
    'pdf',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'txt',
  ],
})

const emit = defineEmits<Emits>()

interface Emits {
  'update:modelValue': [files: UploadedFile[]]
}

const filesMap = reactive<Map<string, UploadedFile>>(new Map())
const errorMessage = ref<string>('')
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()

const files = computed<UploadedFile[]>(() => Array.from(filesMap.values()))

const autoId = useId()
const fieldId = computed(() => props.inputId ?? autoId)

defineExpose({
  inputId: fieldId,
})

const acceptString = computed(() =>
  props.allowedExtensions.map(ext => `.${ext}`).join(','),
)

function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0)
    return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

function isValidExtension(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? props.allowedExtensions.includes(extension) : false
}

function isValidMimeType(mimeType: string): boolean {
  return props.allowedMimeTypes.includes(mimeType)
}

function isValidSize(size: number): boolean {
  return size <= props.maxFileSize
}

function filterValidFiles(files: File[]): { valid: File[] } {
  const valid: File[] = []

  for (const file of files) {
    const isFormatValid
      = isValidExtension(file.name) || isValidMimeType(file.type)
    const isSizeValid = isValidSize(file.size)

    if (isFormatValid && isSizeValid) {
      valid.push(file)
    }
  }

  const hasNoValidFiles = valid.length === 0
  const hasPartialUpload = valid.length !== files.length && files.length > 0

  errorMessage.value = ''

  if (hasNoValidFiles) {
    errorMessage.value = 'Нет файлов с поддерживаемыми расширениями'
  }
  else if (hasPartialUpload) {
    errorMessage.value = `Загружено только ${valid.length} из ${files.length} файлов. Разрешены: ${props.allowedExtensions.join(', ')}. Максимальный размер: ${formatBytes(props.maxFileSize)}`
  }

  return { valid }
}

function reset(): void {
  filesMap.clear()
  errorMessage.value = ''
  isDragging.value = false
  emit('update:modelValue', files.value)
}

function removeFile(id: string): void {
  filesMap.delete(id)
  emit('update:modelValue', files.value)
}

async function addFiles(data: File[]): Promise<UploadedFile[]> {
  const { valid: validFiles } = filterValidFiles(data)

  if (validFiles.length === 0) {
    return []
  }

  let filesToProcess = validFiles

  if (!props.multiple) {
    filesToProcess = validFiles.slice(0, 1)

    if (!props.multiple && filesMap.size > 0) {
      reset()
    }
  }

  const addedFiles: UploadedFile[] = []

  for (const file of filesToProcess) {
    const arrayBuffer = await file.arrayBuffer()

    const fileData: UploadedFile = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      buffer: arrayBuffer,
      blob: file,
      timestamp: Date.now(),
      extension: file.name.split('.').pop()?.toLowerCase() || '',
    }

    filesMap.set(fileData.id, fileData)
    addedFiles.push(fileData)
  }

  emit('update:modelValue', files.value)

  return addedFiles
}

function onDragOver(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = true
}

function onDragLeave(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = false
}

async function onDrop(event: DragEvent): Promise<void> {
  event.preventDefault()
  isDragging.value = false

  const files = Array.from(event.dataTransfer?.files ?? [])

  if (files.length === 0) {
    return
  }

  await addFiles(files)
}

async function onFileInputChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])

  if (files.length === 0) {
    return
  }

  await addFiles(files)
  input.value = ''
}

function triggerFileSelect(): void {
  fileInput.value?.click()
}
</script>

<template>
  <div class="input-file">
    <div
      class="input-file__drop-zone"
      :class="{
        'input-file__drop-zone_dragging': isDragging,
      }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click="triggerFileSelect"
    >
      <div class="input-file__drop-zone-content">
        <div class="input-file__text-wrapper">
          <p class="input-file__primary-text">
            Перетащите документы сюда или загрузите с компьютера
          </p>
          <p class="input-file__secondary-text">
            Поддерживаемые форматы: {{ props.allowedExtensions.join(", ") }}
          </p>
          <p class="input-file__secondary-text">
            Максимальный размер: {{ formatBytes(props.maxFileSize) }}
          </p>
        </div>

        <input
          :id="fieldId"
          ref="fileInput"
          type="file"
          class="input-file__input"
          :accept="acceptString"
          :multiple="multiple"
          :aria-label="ariaLabel || undefined"
          @change="onFileInputChange"
        >

        <Button type="button" @click="triggerFileSelect">
          Выбрать файлы
        </Button>
      </div>
    </div>

    <div v-if="errorMessage" class="input-file__error-message">
      <span class="input-file__error-text">{{ errorMessage }}</span>
    </div>

    <div v-if="files.length > 0" class="input-file__files-section">
      <div class="input-file__files-header">
        <h3 class="input-file__files-title">
          Загруженные файлы ({{ files.length }})
        </h3>
        <Button
          v-if="files.length > 0"
          size="small"
          variant="filled"
          severity="danger"
          @click="reset"
        >
          Очистить все
        </Button>
      </div>

      <div class="input-file__files-list">
        <div v-for="file in files" :key="file.id" class="input-file__file-item">
          <div class="input-file__file-info">
            <div class="input-file__file-details">
              <div class="input-file__file-name" :title="file.name">
                {{ file.name }}
              </div>
              <div class="input-file__file-meta">
                <span class="input-file__file-size">
                  {{ formatBytes(file.size) }}
                </span>
                <span class="input-file__file-type">
                  {{ file.extension.toUpperCase() }}
                </span>
              </div>
            </div>
          </div>

          <div class="input-file__file-actions">
            <Button
              variant="text"
              severity="danger"
              icon-only
              @click="removeFile(file.id)"
            >
              <XBoldIcon height="1em" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins";

.input-file {
  &__drop-zone {
    border: 2px dashed var(--anyboom-border-default);
    border-radius: var(--anyboom-radius-small);
    background: var(--anyboom-surface-secondary);
    cursor: pointer;
    margin-bottom: var(--anyboom-spacing-2);

    &:hover {
      border-color: var(--anyboom-border-extra-strong);
      background: var(--anyboom-surface-primary);
    }

    &_dragging {
      border-color: var(--anyboom-border-focus);
    }
  }

  &__drop-zone-content {
    padding: var(--anyboom-spacing-10) var(--anyboom-spacing-5);
    text-align: center;
  }

  &__text-wrapper {
    margin-bottom: var(--anyboom-spacing-5);
  }

  &__primary-text {
    @include mixins.apply-text("body-lg-medium");

    color: var(--anyboom-text-primary);
    margin: 0 0 var(--anyboom-spacing-2) 0;
  }

  &__secondary-text {
    @include mixins.apply-text("body-sm");

    color: var(--anyboom-text-secondary);
    margin: var(--anyboom-spacing-1) 0;
  }

  &__input {
    display: none;
  }

  &__error-message {
    background: var(--anyboom-surface-danger);
    padding: var(--anyboom-spacing-3) var(--anyboom-spacing-4);
    border-radius: var(--anyboom-radius-small);
    margin-bottom: var(--anyboom-spacing-2);
    display: flex;
    align-items: center;
    gap: var(--anyboom-spacing-2);
  }

  &__error-text {
    @include mixins.apply-text("body-sm");

    color: var(--anyboom-text-inverse);
  }

  &__files-section {
    background: var(--anyboom-surface-primary);
    border-radius: var(--anyboom-radius-small);
    border: 1px solid var(--anyboom-border-default);
    overflow: hidden;
  }

  &__files-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--anyboom-spacing-4) var(--anyboom-spacing-5);
    background: var(--anyboom-surface-secondary);
    border-bottom: 1px solid var(--anyboom-border-default);
  }

  &__files-title {
    @include mixins.apply-text("body-base");

    margin: 0;
    color: var(--anyboom-text-primary);
  }

  &__files-list {
    max-height: 400px;
    overflow-y: auto;
  }

  &__file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--anyboom-spacing-3) var(--anyboom-spacing-5);
    border-bottom: 1px solid var(--anyboom-border-default);

    &:hover {
      background: var(--anyboom-surface-secondary);
    }
  }

  &__file-info {
    display: flex;
    align-items: center;
    gap: var(--anyboom-spacing-3);
    flex: 1;
    min-width: 0;
  }

  &__file-details {
    flex: 1;
    min-width: 0;
  }

  &__file-name {
    @include mixins.apply-text("body-sm-medium");

    color: var(--anyboom-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: var(--anyboom-spacing-1);
  }

  &__file-meta {
    display: flex;
    gap: var(--anyboom-spacing-3);
  }

  &__file-size,
  &__file-type {
    @include mixins.apply-text("body-xs");

    color: var(--anyboom-text-secondary);
  }

  &__file-actions {
    flex-shrink: 0;
  }
}
</style>
