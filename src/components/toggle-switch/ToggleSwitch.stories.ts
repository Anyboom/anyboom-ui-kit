import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ToggleSwitch from './ToggleSwitch.vue'

const meta: Meta<typeof ToggleSwitch> = {
  title: 'Form/ToggleSwitch',
  component: ToggleSwitch,
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Текущее состояние переключателя',
    },
    label: {
      control: 'text',
      description: 'Текст подписи',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает переключатель',
    },
    readonly: {
      control: 'boolean',
      description:
        'Режим «только чтение»: состояние отображается, но изменить его нельзя.',
    },
    error: {
      control: 'boolean',
      description:
        'Состояние ошибки: подсвечивает переключатель и указывает `aria-invalid`.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Размер переключателя',
    },
  },
  args: {
    modelValue: false,
    disabled: false,
    size: 'medium',
  },
}

export default meta
type Story = StoryObj<typeof ToggleSwitch>

export const Default: Story = {
  args: {
    modelValue: false,
    label: 'Переключатель',
  },
  render: args => ({
    components: { ToggleSwitch },
    setup() {
      return { args }
    },
    template: '<ToggleSwitch v-model="args.modelValue" v-bind="args" />',
  }),
}

export const Readonly: Story = {
  ...Default,
  args: {
    ...Default.args,
    readonly: true,
  },
}

export const Error: Story = {
  ...Default,
  args: {
    ...Default.args,
    error: true,
  },
}
