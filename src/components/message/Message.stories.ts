import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Message from './Message.vue'

const meta: Meta<typeof Message> = {
  title: 'Messages/Message',
  component: Message,
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outline', 'text'],
      description: 'Вариант отображения сообщения.',
    },
    severity: {
      control: 'select',
      options: ['primary', 'secondary', 'contrast', 'success', 'danger', 'info', 'warn'],
      description: 'Тип сообщения.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Размер сообщения.',
    },
    default: {
      control: 'text',
      description: 'Содержимое сообщения.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Message>

export const Default: Story = {
  args: {
    default: 'Информационное сообщение',
    variant: 'filled',
    severity: 'info',
    size: 'medium',
  },
}
