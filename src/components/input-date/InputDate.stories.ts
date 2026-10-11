import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CalendarBlankIcon from '@iconify-vue/ph/calendar-blank'
import CalendarDotsIcon from '@iconify-vue/ph/calendar-dots'
import { ref } from 'vue'

import Label from '@/components/label/Label.vue'

import InputDate from './InputDate.vue'

const meta = {
  title: 'Form/InputDate',
  component: InputDate,
  argTypes: {
    inputId: {
      control: 'text',
      description:
        'Атрибут id для поля ввода даты. Используется для связи с меткой и тестирования.',
    },
    modelValue: {
      control: 'date',
      description:
        'Выбранное значение. В режиме `single` — дата, в режиме `range` — массив [ОТ, ДО]. Привязано через v-model.',
    },
    mode: {
      control: 'radio',
      options: ['single', 'range'],
      description:
        'Режим выбора: `single` — одна дата, `range` — период (ОТ и ДО).',
    },
    placeholder: {
      control: 'text',
      description:
        'Текст-подсказка, отображаемый в поле ввода, когда дата не выбрана.',
    },
    disabled: {
      control: 'boolean',
      description:
        'Отключает поле выбора даты. При `true` компонент становится неактивным и недоступным для взаимодействия.',
    },
    readonly: {
      control: 'boolean',
      description:
        'Делает поле выбора даты доступным только для чтения. Пользователь не может изменять значение, но может его копировать.',
    },
    minDate: {
      control: 'date',
      description:
        'Минимальная дата, доступная для выбора. Пользователь не сможет выбрать дату раньше указанной.',
    },
    maxDate: {
      control: 'date',
      description:
        'Максимальная дата, доступная для выбора. Пользователь не сможет выбрать дату позже указанной.',
    },
  },
  args: {
    placeholder: 'Выберите дату...',
  },
} satisfies Meta<typeof InputDate>

export default meta
type Story = StoryObj<typeof meta>
type Args = NonNullable<Story['args']>

function withVModel(args: Args) {
  return {
    components: { InputDate, Label },
    setup() {
      const date = ref(args.modelValue || null)
      return { args, date }
    },
    template: `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <Label text="Дата" :input-id="args.inputId || 'input-date-story'" />
      <InputDate v-model="date" v-bind="args" :input-id="args.inputId || 'input-date-story'" />
    </div>
  `,
  }
}
export const Default: Story = {
  render: args => withVModel(args),
  args: {
    placeholder: 'Select date...',
    modelValue: null,
  },
}

export const WithPlaceholder: Story = {
  render: args => withVModel(args),
  args: {
    placeholder: 'Choose your birth date...',
    modelValue: null,
  },
}

export const WithDefaultDate: Story = {
  render: args => withVModel(args),
  args: {
    modelValue: new Date('2024-01-15'),
    placeholder: 'Select date...',
  },
}

export const Disabled: Story = {
  render: args => withVModel(args),
  args: {
    disabled: true,
    placeholder: 'Disabled date picker',
    modelValue: null,
  },
}

export const Readonly: Story = {
  render: args => withVModel(args),
  args: {
    readonly: true,
    placeholder: 'Read-only date picker',
    modelValue: null,
  },
}

export const WithMinDate: Story = {
  render: args => withVModel(args),
  args: {
    minDate: new Date('2024-06-01'),
    placeholder: 'Select date after June 1, 2024',
    modelValue: null,
  },
}

export const WithMaxDate: Story = {
  render: args => withVModel(args),
  args: {
    maxDate: new Date('2024-12-31'),
    placeholder: 'Select date before Dec 31, 2024',
    modelValue: null,
  },
}

export const RangeMode: Story = {
  render: args => withVModel(args),
  args: {
    mode: 'range',
    placeholder: 'Выберите период...',
    modelValue: null,
  },
}

export const WithDefaultRange: Story = {
  render: args => withVModel(args),
  args: {
    mode: 'range',
    modelValue: [new Date('2024-06-01'), new Date('2024-06-15')],
    placeholder: 'Выберите период...',
  },
}

export const WithMinAndMaxDate: Story = {
  render: args => withVModel(args),
  args: {
    minDate: new Date('2024-01-01'),
    maxDate: new Date('2024-12-31'),
    placeholder: 'Выберите дату в 2024 году',
    modelValue: null,
  },
}

export const WithIcons: Story = {
  render: args => ({
    components: { InputDate, Label, CalendarBlankIcon, CalendarDotsIcon },
    setup() {
      const date = ref(null)
      return { args, date }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Дата" :input-id="args.inputId || 'input-date-icons-story'" />
        <InputDate v-model="date" v-bind="args" :input-id="args.inputId || 'input-date-icons-story'">
          <template #icon-left>
            <CalendarBlankIcon height="1em" />
          </template>
          <template #icon-right>
            <CalendarDotsIcon height="1em" />
          </template>
        </InputDate>
      </div>
    `,
  }),
  args: {
    placeholder: 'Select date with icons',
    modelValue: null,
  },
}
