import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Label from '@/components/label/Label.vue'

import Textarea from './Textarea.vue'

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  argTypes: {
    inputId: {
      control: 'text',
      description:
        'Атрибут id для HTML-элемента textarea. Используется для связи с меткой и тестирования.',
    },
    modelValue: {
      control: 'text',
      description: 'Текущее значение текстового поля. Привязано через v-model.',
    },
    placeholder: {
      control: 'text',
      description:
        'Текст-подсказка, отображаемый внутри поля, пока пользователь не начал ввод.',
    },
    disabled: {
      control: 'boolean',
      description:
        'Отключает текстовое поле. При `true` поле становится неактивным и недоступным для взаимодействия.',
    },
    error: {
      control: 'boolean',
      description:
        'Активирует состояние ошибки. Визуально выделяет поле для индикации неверного ввода.',
    },
    maxlength: {
      control: 'number',
      description:
        'Максимально допустимое количество символов. Превышение ограничения блокирует дальнейший ввод.',
    },
    showCharCount: {
      control: 'boolean',
      description:
        'Показывает счётчик символов под полем. Отображает текущее количество и лимит (если задан).',
    },
    readonly: {
      control: 'boolean',
      description:
        'Делает поле доступным только для чтения. Пользователь не может изменять содержимое, но может его копировать.',
    },
    autofocus: {
      control: 'boolean',
      description:
        'Автоматически устанавливает фокус на поле при загрузке страницы.',
    },
    autocomplete: {
      control: 'text',
      description:
        'Атрибут autocomplete для подсказок браузера. Может принимать значения: \'on\', \'off\', \'username\', \'email\' и др.',
    },
    rows: {
      control: 'number',
      description:
        'Количество видимых строк текста. Определяет начальную высоту поля.',
    },
    wrap: {
      control: 'select',
      options: ['soft', 'hard', 'off'],
      description:
        'Поведение переноса текста: `soft` — мягкий перенос (только визуально), `hard` — жёсткий перенос (с сохранением переносов), `off` — без переноса.',
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description:
        'Управление возможностью изменения размера поля пользователем: `none` — нельзя, `vertical` — только по вертикали, `horizontal` — только по горизонтали, `both` — в обе стороны.',
    },
    autoHeight: {
      control: 'boolean',
      description:
        'Включает автоматическую подстройку высоты под содержимое. Поле растёт по мере ввода текста.',
    },
    maxHeight: {
      control: 'number',
      description:
        'Максимальная высота поля при `autoHeight`. При достижении этого значения появляется скролл.',
    },
    minHeight: {
      control: 'number',
      description:
        'Минимальная высота поля при `autoHeight`. Определяет начальную высоту в пикселях.',
    },
    defaultValue: {
      control: 'text',
      description:
        'Начальное значение поля при первом рендере. Используется для задания текста по умолчанию.',
    },
    ariaLabel: {
      control: 'text',
      description:
        'ARIA-метка для улучшения доступности. Используется скринридерами для озвучивания назначения поля.',
    },
    ariaDescribedby: {
      control: 'text',
      description:
        'ARIA-атрибут, указывающий на элемент с описанием поля. Обеспечивает дополнительный контекст для скринридеров.',
    },
  },
  args: {
    placeholder: 'Введите текст здесь...',
    rows: 3,
    wrap: 'soft',
    resize: 'none',
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { Textarea, Label },
    setup() {
      const value = ref(args.modelValue || '')
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Комментарий" :input-id="args.inputId || 'textarea-story'" />
        <Textarea v-model="value" v-bind="args" :input-id="args.inputId || 'textarea-story'" />
      </div>
    `,
  }),
  args: {
    modelValue: '',
  },
}

export const WithPlaceholder: Story = {
  render: args => ({
    components: { Textarea, Label },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Комментарий" :input-id="args.inputId || 'textarea-story'" />
        <Textarea v-model="value" v-bind="args" :input-id="args.inputId || 'textarea-story'" />
      </div>
    `,
  }),
  args: {
    placeholder: 'Type your message here...',
  },
}

export const WithDefaultValue: Story = {
  render: args => ({
    components: { Textarea, Label },
    setup() {
      const value = ref(args.defaultValue || '')
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Комментарий" :input-id="args.inputId || 'textarea-story'" />
        <Textarea v-model="value" v-bind="args" :input-id="args.inputId || 'textarea-story'" />
      </div>
    `,
  }),
  args: {
    defaultValue: 'This is a default value',
  },
}

export const WithLengthLimits: Story = {
  render: args => ({
    components: { Textarea, Label },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Комментарий" :input-id="args.inputId || 'textarea-story'" />
        <Textarea v-model="value" v-bind="args" :input-id="args.inputId || 'textarea-story'" />
      </div>
    `,
  }),
  args: {
    maxlength: 20,
    showCharCount: true,
    placeholder: '3-20 characters',
  },
}

export const Disabled: Story = {
  render: args => ({
    components: { Textarea, Label },
    setup() {
      const value = ref(args.modelValue || '')
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Комментарий" :input-id="args.inputId || 'textarea-story'" />
        <Textarea v-model="value" v-bind="args" :input-id="args.inputId || 'textarea-story'" />
      </div>
    `,
  }),
  args: {
    disabled: true,
    modelValue: 'This textarea is disabled',
  },
}

export const Readonly: Story = {
  render: args => ({
    components: { Textarea, Label },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Комментарий" :input-id="args.inputId || 'textarea-story'" />
        <Textarea v-model="value" v-bind="args" :input-id="args.inputId || 'textarea-story'" />
      </div>
    `,
  }),
  args: {
    readonly: true,
    modelValue: 'This textarea is read-only',
  },
}

export const AutoHeight: Story = {
  render: args => ({
    components: { Textarea, Label },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Комментарий" :input-id="args.inputId || 'textarea-story'" />
        <Textarea v-model="value" v-bind="args" :input-id="args.inputId || 'textarea-story'" />
      </div>
    `,
  }),
  args: {
    autoHeight: true,
    placeholder: 'Type here to see height auto-adjust',
    minHeight: 60,
    maxHeight: 200,
  },
}

export const ResizeVertical: Story = {
  render: args => ({
    components: { Textarea, Label },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Комментарий" :input-id="args.inputId || 'textarea-story'" />
        <Textarea v-model="value" v-bind="args" :input-id="args.inputId || 'textarea-story'" />
      </div>
    `,
  }),
  args: {
    resize: 'vertical',
    placeholder: 'Resize vertically',
  },
}
