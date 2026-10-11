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
      options: ['small', 'medium'],
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
  parameters: {
    docs: {
      description: {
        component: `
Компонент InputOtp поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-input-primary-background\` | Фон поля | \`var(--anyboom-surface-primary)\` |
| \`--anyboom-input-primary-border\` | Цвет рамки поля | \`var(--anyboom-border-default)\` |
| \`--anyboom-input-primary-border-hover\` | Цвет рамки поля при наведении | \`var(--anyboom-border-extra-strong)\` |
| \`--anyboom-input-primary-border-focus\` | Цвет рамки поля в фокусе | \`var(--anyboom-border-focus)\` |
| \`--anyboom-input-primary-text\` | Цвет текста | \`var(--anyboom-text-primary)\` |
| \`--anyboom-input-negative-border\` | Цвет рамки при ошибке | \`var(--anyboom-border-negative)\` |
| \`--anyboom-input-negative-text\` | Цвет текста при ошибке | \`var(--anyboom-text-negative)\` |
| \`--anyboom-input-positive-border\` | Цвет рамки при успехе | \`var(--anyboom-border-positive)\` |
| \`--anyboom-input-positive-text\` | Цвет текста при успехе | \`var(--anyboom-text-positive)\` |
| \`--anyboom-input-disabled-background\` | Фон отключённого поля | \`var(--anyboom-surface-primary)\` |
| \`--anyboom-input-disabled-border\` | Цвет рамки отключённого поля | \`var(--anyboom-border-default)\` |
| \`--anyboom-input-disabled-text\` | Цвет текста отключённого поля | \`var(--anyboom-text-tertiary)\` |

Токены определены в \`src/styles/components/_input.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
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
