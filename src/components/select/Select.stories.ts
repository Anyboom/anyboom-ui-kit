import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { OptionGroup } from './option-group.ts'

import type { Option } from './option.ts'

import { ref } from 'vue'
import Label from '@/components/label/Label.vue'
import Select from './Select.vue'

const meta = {
  title: 'Form/Select',
  component: Select,
  argTypes: {
    inputId: {
      control: 'text',
      description:
        'Атрибут id для триггера селекта. Используется для связи с меткой и тестирования.',
    },
    options: {
      control: 'object',
      description:
        'Массив опций для выбора. Может быть плоским списком или сгруппированным.',
    },
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
      description:
        'Режим выбора: `single` — выбор одного варианта, `multiple` — выбор нескольких вариантов.',
    },
    searchable: {
      control: 'boolean',
      description:
        'Включает поиск по опциям. Позволяет фильтровать список по введённому тексту.',
    },
    placeholder: {
      control: 'text',
      description:
        'Текст-подсказка, отображаемый в поле, когда ничего не выбрано.',
    },
    optionLabel: {
      control: 'text',
      description:
        'Название свойства в объекте опции, которое используется для отображения текста.',
    },
    optionGroupLabel: {
      control: 'text',
      description:
        'Название свойства в объекте группы, которое используется для отображения заголовка группы.',
    },
    optionGroupChildren: {
      control: 'text',
      description:
        'Название свойства в объекте группы, которое содержит массив дочерних опций.',
    },
    disabled: {
      control: 'boolean',
      description:
        'Отключает компонент селекта. При true список становится неактивным и недоступным для взаимодействия.',
    },
    error: {
      control: 'boolean',
      description:
        'Активирует состояние ошибки. Визуально выделяет поле красным для индикации неверного ввода.',
    },
    dataKey: {
      control: 'text',
      description:
        'Название свойства, используемого в качестве уникального ключа для каждой опции.',
    },
    grouped: {
      control: 'boolean',
      description:
        'Включает режим группировки опций. Опции должны передаваться со структурой групп.',
    },
    loading: {
      control: 'boolean',
      description:
        'Отображает состояние загрузки. Полезно при асинхронной подгрузке опций.',
    },
    selectAllGroup: {
      control: 'boolean',
      description:
        'Добавляет кнопку \'Выбрать всё\' в каждой группе. Работает только в режиме `multiple`',
    },
    showClear: {
      control: 'boolean',
      description:
        'Показывает кнопку очистки выбранного значения. Появляется при наличии выбранного значения.',
    },
    showCounter: {
      control: 'boolean',
      description:
        'Отображает счётчик выбранных элементов. Полезно в режиме `multiple` для понимания количества выбранных опций.',
    },
  },
  args: {
    placeholder: 'Выберите вариант...',
    mode: 'single',
    searchable: false,
    grouped: false,
    loading: false,
    selectAllGroup: false,
    showClear: false,
    showCounter: false,
    optionLabel: 'label',
    optionGroupLabel: 'name',
    optionGroupChildren: 'options',
    dataKey: 'value',
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент Select поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-select-menu-background\` | Фон выпадающего меню | \`var(--anyboom-surface-primary)\` |
| \`--anyboom-select-menu-border\` | Цвет рамки выпадающего меню | \`var(--anyboom-border-default)\` |

Также Select использует токены полей ввода \`--anyboom-input-*\` (см. документацию InputText).

Токены определены в \`src/styles/components/_select.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>
type Args = NonNullable<Story['args']>

const sampleOptions: Option[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
]

const sampleOptionsWithLabels: Option[] = [
  { label: 'John Doe', value: 1, id: 1, email: 'john@example.com' },
  { label: 'Jane Smith', value: 2, id: 2, email: 'jane@example.com' },
  { label: 'Bob Johnson', value: 3, id: 3, email: 'bob@example.com' },
]

const sampleGroups: OptionGroup[] = [
  {
    name: 'Fruits',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' },
    ],
  },
  {
    name: 'Vegetables',
    options: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Broccoli', value: 'broccoli' },
      { label: 'Spinach', value: 'spinach' },
    ],
  },
  {
    name: 'Berries',
    options: [
      { label: 'Strawberry', value: 'strawberry' },
      { label: 'Blueberry', value: 'blueberry' },
      { label: 'Raspberry', value: 'raspberry' },
    ],
  },
]

function withVModel(args: Args) {
  return {
    components: { Select, Label },
    setup() {
      const selected = ref(args.modelValue || null)
      return { args, selected }
    },
    template: `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <Label text="Категория" :input-id="args.inputId || 'select-story'" />
      <Select v-model="selected" v-bind="args" :input-id="args.inputId || 'select-story'" />
    </div>
  `,
  }
}

export const Default: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    placeholder: 'Select a fruit...',
  },
}

export const WithPlaceholder: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    placeholder: 'Choose your favorite fruit...',
  },
}

export const SingleSelect: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    mode: 'single',
    placeholder: 'Select a fruit...',
  },
}

export const MultipleSelect: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    mode: 'multiple',
    placeholder: 'Select fruits...',
  },
}

export const Searchable: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    mode: 'single',
    searchable: true,
    placeholder: 'Search and select...',
  },
}

export const SearchableMultiple: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    mode: 'multiple',
    searchable: true,
    placeholder: 'Search and select fruits...',
  },
}

export const Disabled: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    disabled: true,
    placeholder: 'Disabled select',
  },
}

export const Error: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    error: true,
    placeholder: 'Select with error',
  },
}

export const Loading: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    loading: true,
    placeholder: 'Loading...',
  },
}

export const WithShowClear: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    mode: 'single',
    showClear: true,
    placeholder: 'Select with clear button',
  },
}

export const WithShowClearMultiple: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    mode: 'multiple',
    showClear: true,
    placeholder: 'Select fruits with clear button',
  },
}

export const WithCounter: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptions,
    mode: 'multiple',
    showCounter: true,
    placeholder: 'Select fruits with counter',
  },
}

export const Grouped: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleGroups,
    mode: 'single',
    grouped: true,
    placeholder: 'Select from groups...',
  },
}

export const GroupedMultiple: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleGroups,
    mode: 'multiple',
    grouped: true,
    placeholder: 'Select from groups...',
  },
}

export const GroupedWithSelectAll: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleGroups,
    mode: 'multiple',
    grouped: true,
    selectAllGroup: true,
    placeholder: 'Select from groups with select all...',
  },
}

export const GroupedSearchable: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleGroups,
    mode: 'single',
    grouped: true,
    searchable: true,
    placeholder: 'Search in groups...',
  },
}

export const WithCustomLabel: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptionsWithLabels,
    optionLabel: 'email',
    mode: 'single',
    placeholder: 'Select by email...',
  },
}

export const WithCustomDataKey: Story = {
  render: args => withVModel(args),
  args: {
    options: sampleOptionsWithLabels,
    optionLabel: 'label',
    dataKey: 'id',
    mode: 'single',
    placeholder: 'Select with custom data key...',
  },
}
