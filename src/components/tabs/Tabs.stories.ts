import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Tabs from './Tabs.vue'

const meta: Meta<typeof Tabs> = {
  title: 'Panel/Tabs',
  component: Tabs,
  argTypes: {
    tabs: {
      control: 'object',
    },
    modelValue: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Basic: Story = {
  args: {
    tabs: [
      { id: 'tab1', label: 'Вкладка 1' },
      { id: 'tab2', label: 'Вкладка 2' },
      { id: 'tab3', label: 'Вкладка 3' },
    ],
    modelValue: 'tab1',
  },
}

export const Disabled: Story = {
  args: {
    tabs: [
      { id: 'active', label: 'Активная' },
      { id: 'disabled', label: 'Отключенная', disabled: true },
      { id: 'active2', label: 'Активная 2' },
    ],
    modelValue: 'active',
  },
}
