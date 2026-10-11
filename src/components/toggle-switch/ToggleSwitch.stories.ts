import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ToggleSwitch from './ToggleSwitch.vue'

const meta: Meta<typeof ToggleSwitch> = {
  title: 'Form/ToggleSwitch',
  component: ToggleSwitch,
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Текущее состояние переключателя',
    },
    label: {
      control: 'text',
      description: 'Текст подписи',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает переключатель',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Размер переключателя',
    },
  },
  args: {
    modelValue: false,
    disabled: false,
    size: 'medium',
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент ToggleSwitch поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-toggle-switch-inactive-background\` | Фон выключенного переключателя | \`var(--anyboom-surface-tertiary)\` |
| \`--anyboom-toggle-switch-inactive-icon\` | Цвет ползунка выключенного переключателя | \`var(--anyboom-icon-inverse)\` |
| \`--anyboom-toggle-switch-inactive-hover-background\` | Фон выключенного переключателя при наведении | \`var(--anyboom-color-gray-300)\` |
| \`--anyboom-toggle-switch-inactive-hover-icon\` | Цвет ползунка выключенного при наведении | \`var(--anyboom-icon-inverse)\` |
| \`--anyboom-toggle-switch-text\` | Цвет текста подписи | \`var(--anyboom-text-primary)\` |
| \`--anyboom-toggle-switch-checked-background\` | Фон включённого переключателя | \`var(--anyboom-surface-brand)\` |
| \`--anyboom-toggle-switch-checked-icon\` | Цвет ползунка включённого переключателя | \`var(--anyboom-icon-inverse)\` |
| \`--anyboom-toggle-switch-checked-hover-background\` | Фон включённого переключателя при наведении | \`var(--anyboom-surface-brand-hover)\` |
| \`--anyboom-toggle-switch-checked-hover-icon\` | Цвет ползунка включённого при наведении | \`var(--anyboom-icon-inverse)\` |

Токены определены в \`src/styles/components/_toggle-switch.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ToggleSwitch>

export const Default: Story = {
  args: {
    modelValue: false,
    label: 'Переключатель',
  },
  render: args => ({
    components: { ToggleSwitch },
    setup() {
      return { args }
    },
    template: '<ToggleSwitch v-model="args.modelValue" v-bind="args" />',
  }),
}
