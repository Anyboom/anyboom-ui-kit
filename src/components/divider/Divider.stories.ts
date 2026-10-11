import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Divider from './Divider.vue'

const meta = {
  title: 'Panel/Divider',
  component: Divider,
  argTypes: {
    vertical: {
      control: 'boolean',
      description:
        'Вертикальная ориентация разделителя. При `true` разделитель становится вертикальным.',
    },
  },
} as Meta<typeof Divider>

export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: args => ({
    components: { Divider },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 20px; background: #f9fafb; border-radius: 8px;">
        <p style="margin: 0 0 16px 0;">Контент до разделителя</p>
        <Divider v-bind="args" />
        <p style="margin: 16px 0 0 0;">Контент после разделителя</p>
      </div>
    `,
  }),
}

export const Vertical: Story = {
  args: {
    vertical: true,
  },
  render: args => ({
    components: { Divider },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; align-items: center; gap: 20px; height: 60px; padding: 0 20px; background: #f9fafb; border-radius: 8px;">
        <span>Левый элемент</span>
        <Divider v-bind="args" />
        <span>Центральный элемент</span>
        <Divider v-bind="args" />
        <span>Правый элемент</span>
      </div>
    `,
  }),
}
