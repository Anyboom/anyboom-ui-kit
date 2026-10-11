import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ArchiveIcon from '@iconify-vue/ph/archive'

import Badge from './Badge.vue'

const meta: Meta<typeof Badge> = {
  title: 'Misc/Badge',
  component: Badge,
  argTypes: {
    severity: {
      control: 'select',
      options: [
        'warn',
        'secondary',
        'success',
        'info',
        'danger',
      ],
      description: 'Тип бейджа',
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Basic: Story = {
  render: args => ({
    components: { Badge, ArchiveIcon },
    setup() {
      return { args }
    },
    template: `
      <Badge v-bind="args">
        <ArchiveIcon height="1em"/>
        Бейдж
      </Badge>
    `,
  }),
}
