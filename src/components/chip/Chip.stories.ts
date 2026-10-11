import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Chip from './Chip.vue'

const meta: Meta<typeof Chip> = {
  title: 'Misc/Chip',
  component: Chip,
  argTypes: {
    variant: {
      control: 'select',
      options: ['dismissable', 'link', 'filter'],
      description: 'Вариант оформления чипа',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Размер чипа',
    },
    removable: {
      control: 'boolean',
      description: 'Возможность удаления (показывает крестик)',
    },
    selected: {
      control: 'boolean',
      description: 'Состояние "выбран"',
    },
    label: {
      control: 'text',
      description: 'Текст метки',
    },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: {
    label: 'Чип',
  },
}
