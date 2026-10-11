import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Paginator from './Paginator.vue'

const meta: Meta<typeof Paginator> = {
  title: 'Data/Paginator',
  component: Paginator,
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Текущая активная страница',
    },
    totalItems: {
      control: { type: 'number', min: 0 },
      description: 'Общее количество элементов',
    },
    itemsPerPage: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Количество элементов на странице',
    },
  },
  args: {
    currentPage: 1,
    totalItems: 100,
    itemsPerPage: 10,
  },
}

export default meta
type Story = StoryObj<typeof Paginator>

export const Default: Story = {}
