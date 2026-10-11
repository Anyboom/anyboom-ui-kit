import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Rating from './Rating.vue'

const meta: Meta<typeof Rating> = {
  title: 'Form/Rating',
  component: Rating,
  argTypes: {
    modelValue: {
      control: { type: 'number', step: 1 },
      description: 'Текущее значение рейтинга',
    },
    stars: {
      control: { type: 'number', step: 1 },
      description: 'Общее количество звезд',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает компонент',
    },
    readonly: {
      control: 'boolean',
      description: 'Делает компонент доступным только для чтения',
    },
  },
}

export default meta
type Story = StoryObj<typeof Rating>

export const Default: Story = {}
