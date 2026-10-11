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
  parameters: {
    docs: {
      description: {
        component: `
Компонент Checkbox поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-checkbox-inactive-background\` | Фон невыбранного чекбокса | \`var(--anyboom-control-inactive-background)\` |
| \`--anyboom-checkbox-inactive-border\` | Цвет рамки невыбранного чекбокса | \`var(--anyboom-control-inactive-border)\` |
| \`--anyboom-checkbox-inactive-hover-background\` | Фон невыбранного чекбокса при наведении | \`var(--anyboom-control-inactive-hover-background)\` |
| \`--anyboom-checkbox-inactive-hover-border\` | Цвет рамки невыбранного чекбокса при наведении | \`var(--anyboom-control-inactive-hover-border)\` |
| \`--anyboom-checkbox-text\` | Цвет текста подписи | \`var(--anyboom-text-primary)\` |
| \`--anyboom-checkbox-checked-background\` | Фон выбранного чекбокса | \`var(--anyboom-surface-brand)\` |
| \`--anyboom-checkbox-checked-icon\` | Цвет иконки выбранного чекбокса | \`var(--anyboom-icon-inverse)\` |
| \`--anyboom-checkbox-checked-hover-background\` | Фон выбранного чекбокса при наведении | \`var(--anyboom-surface-brand-hover)\` |
| \`--anyboom-checkbox-checked-hover-icon\` | Цвет иконки выбранного чекбокса при наведении | \`var(--anyboom-icon-inverse)\` |

Токены определены в \`src/styles/components/_checkbox.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
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
