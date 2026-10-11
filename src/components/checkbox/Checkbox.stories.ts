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
    readonly: {
      control: 'boolean',
      description:
        'Режим «только чтение»: значение отображается, но изменить его нельзя.',
    },
    error: {
      control: 'boolean',
      description:
        'Состояние ошибки: подсвечивает чекбокс и указывает `aria-invalid`.',
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

export const Readonly: Story = {
  args: {
    readonly: true,
  },
}

export const Error: Story = {
  args: {
    error: true,
  },
}
