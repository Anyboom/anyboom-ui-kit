import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Radio from './Radio.vue'

const meta = {
  title: 'Form/Radio',
  component: Radio,
  argTypes: {
    label: {
      control: 'text',
      description: 'Текстовая подпись, отображаемая рядом с радио-кнопкой.',
    },
    disabled: {
      control: 'boolean',
      description:
        'Отключает радио-кнопку. При `true` кнопка становится неактивной и недоступной для выбора.',
    },
    value: {
      control: 'text',
      description:
        'Уникальное значение радио-кнопки. Используется для идентификации выбранного варианта в группе.',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Размер элемента.',
    },
  },
  args: {
    label: 'Вариант',
    value: 'option1',
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
