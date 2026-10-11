import type { Meta, StoryObj } from '@storybook/vue3-vite'

import InputText from '@/components/input-text/InputText.vue'

import Label from './Label.vue'

const meta = {
  title: 'Form/Label',
  component: Label,
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium'],
      description: 'Размер лейбла',
    },
    required: {
      control: 'radio',
      options: ['none', 'optional', 'asterisk'],
      description: 'Тип обязательности поля',
    },
    inputId: {
      control: 'text',
      description: 'ID инпута, к которому привязан лейбл',
    },
    tooltip: {
      control: 'text',
      description: 'Текст тултипа',
    },
    text: {
      control: 'text',
      description: 'Текст лейбла',
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Имя пользователя',
    size: 'medium',
    required: 'none',
  },
}

export const Required: Story = {
  args: {
    text: 'Эл. почта',
    size: 'medium',
    required: 'asterisk',
  },
}

export const Optional: Story = {
  args: {
    text: 'Телефон',
    size: 'medium',
    required: 'optional',
  },
}

export const WithTooltip: Story = {
  args: {
    text: 'Пароль',
    size: 'medium',
    required: 'asterisk',
    tooltip: 'Пароль должен содержать минимум 8 символов',
  },
}

export const WithInput: Story = {
  render: args => ({
    components: { Label, InputText },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label v-bind="args" inputId="email-input" />
        <InputText input-id="email-input" />
      </div>
    `,
  }),
  args: {
    text: 'Эл. почта',
    size: 'medium',
    required: 'asterisk',
  },
}
