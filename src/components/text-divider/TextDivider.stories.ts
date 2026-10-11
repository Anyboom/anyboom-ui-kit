import type { Meta, StoryObj } from '@storybook/vue3-vite'

import TextDivider from './TextDivider.vue'

const meta: Meta<typeof TextDivider> = {
  title: 'Misc/TextDivider',
  component: TextDivider,
}

export default meta
type Story = StoryObj<typeof TextDivider>

export const Default: Story = {}

export const WithText: Story = {
  render: args => ({
    components: { TextDivider },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="color: #666;">Текст слева</span>
        <TextDivider v-bind="args" />
        <span style="color: #666;">Текст справа</span>
      </div>
    `,
  }),
}
