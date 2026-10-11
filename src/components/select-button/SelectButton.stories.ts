import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import SelectButton from './SelectButton.vue'

const meta = {
  title: 'Form/SelectButton',
  component: SelectButton,
  argTypes: {
    modelValue: {
      control: 'object',
      description:
        'Текущее выбранное значение. Для `multiple` — массив значений.',
    },
    options: {
      control: 'object',
      description:
        'Массив опций. Может содержать строки, числа или объекты с полями `label`/`value`.',
    },
    optionLabel: {
      control: 'text',
      description:
        'Ключ или функция для получения отображаемого текста объекта-опции. По умолчанию `label`.',
    },
    optionValue: {
      control: 'text',
      description:
        'Ключ или функция для получения значения опции. По умолчанию `value`.',
    },
    optionDisabled: {
      control: 'text',
      description:
        'Ключ или функция для определения недоступной опции. По умолчанию `disabled`.',
    },
    multiple: {
      control: 'boolean',
      description:
        'Режим множественного выбора. При true можно выбрать несколько опций.',
    },
    allowEmpty: {
      control: 'boolean',
      description:
        'Разрешает снять выделение с единственной выбранной опции в одиночном режиме. По умолчанию true.',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает весь компонент.',
    },
    ariaLabelledby: {
      control: 'text',
      description: 'ID элемента с подписью для группы кнопок (доступность).',
    },
  },
  args: {
    options: ['Один', 'Два', 'Три'],
    multiple: false,
    allowEmpty: true,
    disabled: false,
  },
} satisfies Meta<typeof SelectButton>

export default meta
type Story = StoryObj<typeof meta>
type Args = NonNullable<Story['args']>

function withVModel(args: Args) {
  return {
    components: { SelectButton },
    setup() {
      const value = ref<unknown>(args.modelValue ?? null)
      const { modelValue: _, ...componentArgs } = args
      return { args, value, componentArgs }
    },
    template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <SelectButton v-model="value" v-bind="componentArgs" />
      <div style="font-size: 12px; color: #666;">
        <strong>Значение:</strong> {{ JSON.stringify(value) }}
      </div>
    </div>
  `,
  }
}

export const Default: Story = {
  render: args => withVModel(args),
  args: {
    modelValue: 'Один',
  },
}

export const ObjectOptions: Story = {
  render: args => withVModel(args),
  args: {
    options: [
      { label: 'Месяц', value: 'month' },
      { label: 'Квартал', value: 'quarter' },
      { label: 'Год', value: 'year' },
    ],
    optionLabel: 'label',
    optionValue: 'value',
    modelValue: 'month',
  },
}

export const Multiple: Story = {
  render: args => withVModel(args),
  args: {
    options: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    multiple: true,
    allowEmpty: true,
    modelValue: ['Пн', 'Ср', 'Пт'],
  },
}

export const AllowEmptyFalse: Story = {
  render: args => withVModel(args),
  args: {
    options: ['Низкий', 'Средний', 'Высокий'],
    allowEmpty: false,
    modelValue: 'Средний',
  },
}

export const Disabled: Story = {
  render: args => withVModel(args),
  args: {
    disabled: true,
    modelValue: 'Два',
  },
}

export const DisabledOption: Story = {
  render: args => withVModel(args),
  args: {
    options: [
      { label: 'Активен', value: 'active' },
      { label: 'Неактивен', value: 'inactive', disabled: true },
      { label: 'Архив', value: 'archive' },
    ],
    optionLabel: 'label',
    optionValue: 'value',
    optionDisabled: 'disabled',
    modelValue: 'active',
  },
}

export const WithCustomItemSlot: Story = {
  render: args => ({
    components: { SelectButton },
    setup() {
      const value = ref<unknown>(args.modelValue ?? null)
      const { modelValue: _, ...componentArgs } = args
      return { args, value, componentArgs }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <SelectButton v-model="value" v-bind="componentArgs">
          <template #item="{ option, index }">
            <span style="font-weight: 700;">{{ index + 1 }}.</span>
            {{ option }}
          </template>
        </SelectButton>
        <div style="font-size: 12px; color: #666;">
          <strong>Значение:</strong> {{ JSON.stringify(value) }}
        </div>
      </div>
    `,
  }),
  args: {
    options: ['Карта', 'Список', 'Таблица'],
    modelValue: 'Карта',
  },
}
