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
