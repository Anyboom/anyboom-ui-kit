import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Avatar from '@/components/avatar/Avatar.vue'

import NotificationBadge from './NotificationBadge.vue'

const meta: Meta<typeof NotificationBadge> = {
  title: 'Misc/NotificationBadge',
  component: NotificationBadge,
  argTypes: {
    value: {
      description: 'Числовое значение на бейдже',
    },
    severity: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'contrast',
        'success',
        'danger',
        'info',
        'warn',
      ],
      description: 'Визуальный стиль бейджа',
    },
  },
}

export default meta
type Story = StoryObj<typeof NotificationBadge>

export const Default: Story = {
  render: args => ({
    components: { NotificationBadge, Avatar },
    setup() {
      return { args }
    },
    template: `
      <NotificationBadge v-bind="args">
        <Avatar image="https://i.pravatar.cc/150?img=12" />
      </NotificationBadge>
    `,
  }),
  args: {
    value: 1,
    severity: 'info',
  },
}
