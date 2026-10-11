import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Avatar from './Avatar.vue'

const meta: Meta<typeof Avatar> = {
  title: 'Misc/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Размер',
    },
    image: {
      control: 'text',
      description: 'URL изображения',
    },
    label: {
      control: 'text',
      description: 'Текстовая подпись',
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    label: 'ДВ',
    size: 'medium',
  },
}

export const WithImage: Story = {
  args: {
    image: 'https://i.pravatar.cc/150?img=12',
    size: 'medium',
  },
}
