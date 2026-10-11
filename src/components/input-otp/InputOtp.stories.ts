import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Label from '@/components/label/Label.vue'

import InputOtp from './InputOtp.vue'

const meta: Meta<typeof InputOtp> = {
  title: 'Form/InputOtp',
  component: InputOtp,
  argTypes: {
    inputId: {
      control: 'text',
      description:
        'Атрибут id для первого поля ввода. Используется для связи с меткой и тестирования.',
    },
    length: {
      control: 'number',
      description: 'Количество полей ввода.',
    },
    modelValue: {
      control: 'text',
      description: 'Значение кода.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Размер компонента.',
    },
    shape: {
      control: 'select',
      options: ['square', 'circle'],
      description: 'Фигура компонента.',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключенное состояние.',
    },
    error: {
      control: 'boolean',
      description: 'Состояние ошибки.',
    },
    success: {
      control: 'boolean',
      description: 'Состояние успеха.',
    },
    autofocus: {
      control: 'boolean',
      description: 'Автофокус на первом поле.',
    },
    invalid: {
      control: 'boolean',
      description: 'Состояние ошибки.',
    },
    numeric: {
      control: 'boolean',
      description: 'Только цифры.',
    },
    type: {
      control: 'select',
      options: ['text', 'password'],
      description: 'Тип ввода.',
    },
  },
}

export default meta
type Story = StoryObj<typeof InputOtp>

export const Default: Story = {
  render: args => ({
    components: { InputOtp, Label },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Код подтверждения" :input-id="args.inputId || 'input-otp-story'" />
        <InputOtp v-bind="args" :input-id="args.inputId || 'input-otp-story'" />
      </div>
    `,
  }),
  args: {
    length: 6,
    size: 'medium',
  },
}
