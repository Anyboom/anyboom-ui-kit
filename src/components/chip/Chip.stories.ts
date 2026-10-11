import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Chip from './Chip.vue'

const meta: Meta<typeof Chip> = {
  title: 'Misc/Chip',
  component: Chip,
  argTypes: {
    variant: {
      control: 'select',
      options: ['dismissable', 'link', 'filter'],
      description: 'Вариант оформления чипа',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Размер чипа',
    },
    removable: {
      control: 'boolean',
      description: 'Возможность удаления (показывает крестик)',
    },
    selected: {
      control: 'boolean',
      description: 'Состояние "выбран"',
    },
    label: {
      control: 'text',
      description: 'Текст метки',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент Chip поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-chip-dismissable-background\` | Фон чипа dismissable | \`var(--anyboom-surface-light)\` |
| \`--anyboom-chip-dismissable-border\` | Цвет рамки чипа dismissable | \`var(--anyboom-border-strong)\` |
| \`--anyboom-chip-dismissable-text\` | Цвет текста чипа dismissable | \`var(--anyboom-text-primary)\` |
| \`--anyboom-chip-dismissable-icon\` | Цвет иконки чипа dismissable | \`var(--anyboom-icon-neutral-default)\` |
| \`--anyboom-chip-link-background\` | Фон чипа link | \`var(--anyboom-surface-positive-light)\` |
| \`--anyboom-chip-link-border\` | Цвет рамки чипа link | \`var(--anyboom-border-positive)\` |
| \`--anyboom-chip-link-text\` | Цвет текста чипа link | \`var(--anyboom-text-positive)\` |
| \`--anyboom-chip-link-icon\` | Цвет иконки чипа link | \`var(--anyboom-icon-positive)\` |
| \`--anyboom-chip-filter-default-background\` | Фон чипа filter (по умолчанию) | \`var(--anyboom-surface-light)\` |
| \`--anyboom-chip-filter-default-border\` | Цвет рамки чипа filter (по умолчанию) | \`var(--anyboom-border-strong)\` |
| \`--anyboom-chip-filter-default-text\` | Цвет текста чипа filter (по умолчанию) | \`var(--anyboom-text-primary)\` |
| \`--anyboom-chip-filter-default-icon\` | Цвет иконки чипа filter (по умолчанию) | \`var(--anyboom-icon-neutral-default)\` |
| \`--anyboom-chip-filter-active-background\` | Фон активного чипа filter | \`var(--anyboom-surface-positive)\` |
| \`--anyboom-chip-filter-active-text\` | Цвет текста активного чипа filter | \`var(--anyboom-text-inverse)\` |
| \`--anyboom-chip-filter-active-icon\` | Цвет иконки активного чипа filter | \`var(--anyboom-icon-inverse)\` |

Токены определены в \`src/styles/components/_chip.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: {
    label: 'Чип',
  },
}
