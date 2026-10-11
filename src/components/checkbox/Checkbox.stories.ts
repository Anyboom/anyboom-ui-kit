import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Checkbox from './Checkbox.vue'

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  args: {
    label: 'Элемент',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description:
        'Отключает чекбокс. При `true` чекбокс становится неактивным и недоступным для изменения.',
    },
    label: {
      control: 'text',
      description: 'Текстовая подпись, отображаемая рядом с чекбоксом.',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Размер элемента.',
    },
  },
} as Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
