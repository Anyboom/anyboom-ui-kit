import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { UploadedFile } from '@/components/input-file/uploaded-file.ts'

import { ref } from 'vue'
import Label from '@/components/label/Label.vue'

import InputFile from './InputFile.vue'

const meta = {
  title: 'File/InputFile',
  component: InputFile,
  argTypes: {
    inputId: {
      control: 'text',
      description:
        'Атрибут id для HTML-элемента input. Используется для связи с меткой и тестирования.',
    },
    multiple: {
      control: 'boolean',
      description:
        'Разрешает выбор нескольких файлов одновременно. При `true` пользователь может выбрать несколько файлов за раз.',
    },
    allowedExtensions: {
      control: 'object',
      description:
        'Массив разрешённых расширений файлов. Файлы с другими расширениями будут отклонены.',
    },
    allowedMimeTypes: {
      control: 'object',
      description:
        'Массив разрешённых MIME-типов файлов. Используется для более точной валидации.',
    },
    maxFileSize: {
      control: 'number',
      description:
        'Максимально допустимый размер файла в байтах. При превышении файл будет отклонён.',
    },
  },
  args: {
    multiple: false,
    maxFileSize: 5 * 1024 * 1024,
  },
} satisfies Meta<typeof InputFile>

export default meta
type Story = StoryObj<typeof meta>
type Args = NonNullable<Story['args']>

function withVModel(args: Args) {
  return {
    components: { InputFile, Label },
    setup() {
      const files = ref<UploadedFile[]>([])
      return { args, files }
    },
    template: `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <Label text="Вложения" :input-id="args.inputId || 'input-file-story'" />
      <InputFile v-model="files" v-bind="args" :input-id="args.inputId || 'input-file-story'" />
    </div>
  `,
  }
}

export const Default: Story = {
  render: args => withVModel(args),
}

export const MultipleFiles: Story = {
  render: args => withVModel(args),
  args: {
    multiple: true,
  },
}

export const WithCustomExtensions: Story = {
  render: args => withVModel(args),
  args: {
    allowedExtensions: ['jpg', 'png', 'gif', 'webp'],
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
}

export const WithSmallMaxSize: Story = {
  render: args => withVModel(args),
  args: {
    maxFileSize: 1024 * 100,
  },
}

export const WithDocumentsOnly: Story = {
  render: args => withVModel(args),
  args: {
    allowedExtensions: ['pdf', 'doc', 'docx', 'txt'],
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
  },
}

export const WithImagesOnly: Story = {
  render: args => withVModel(args),
  args: {
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ],
  },
}
