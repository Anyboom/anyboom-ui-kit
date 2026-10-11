import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ArchiveIcon from '@iconify-vue/ph/archive'

import Badge from './Badge.vue'

const meta: Meta<typeof Badge> = {
  title: 'Misc/Badge',
  component: Badge,
  argTypes: {
    severity: {
      control: 'select',
      options: [
        'incomplete',
        'secondary',
        'success',
        'active',
        'negative',
        'non-actionable',
      ],
      description: 'Тип бейджа',
    },
  },
  parameters: {
    docs: {
      description: {
        component: ` 
Компонент Badge поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-badge-secondary-background\` | Фон бейджа secondary | \`var(--anyboom-surface-light)\` |
| \`--anyboom-badge-secondary-border\` | Цвет рамки бейджа secondary | \`var(--anyboom-border-strong)\` |
| \`--anyboom-badge-secondary-text\` | Цвет текста бейджа secondary | \`var(--anyboom-text-secondary)\` |
| \`--anyboom-badge-incomplete-background\` | Фон бейджа incomplete | \`var(--anyboom-color-amber-100)\` |
| \`--anyboom-badge-incomplete-border\` | Цвет рамки бейджа incomplete | \`var(--anyboom-border-warning)\` |
| \`--anyboom-badge-incomplete-text\` | Цвет текста бейджа incomplete | \`var(--anyboom-text-warning-active)\` |
| \`--anyboom-badge-success-background\` | Фон бейджа success | \`var(--anyboom-color-green-100)\` |
| \`--anyboom-badge-success-border\` | Цвет рамки бейджа success | \`var(--anyboom-border-positive-active)\` |
| \`--anyboom-badge-success-text\` | Цвет текста бейджа success | \`var(--anyboom-color-green-950)\` |
| \`--anyboom-badge-info-background\` | Фон бейджа info | \`var(--anyboom-surface-info-light)\` |
| \`--anyboom-badge-info-border\` | Цвет рамки бейджа info | \`var(--anyboom-border-info-hover)\` |
| \`--anyboom-badge-info-text\` | Цвет текста бейджа info | \`var(--anyboom-text-info-hover)\` |
| \`--anyboom-badge-negative-background\` | Фон бейджа negative | \`var(--anyboom-surface-negative-light)\` |
| \`--anyboom-badge-negative-border\` | Цвет рамки бейджа negative | \`var(--anyboom-border-negative)\` |
| \`--anyboom-badge-negative-text\` | Цвет текста бейджа negative | \`var(--anyboom-text-negative)\` |
| \`--anyboom-badge-non-actionable-background\` | Фон бейджа non-actionable | \`var(--anyboom-surface-primary)\` |
| \`--anyboom-badge-non-actionable-border\` | Цвет рамки бейджа non-actionable | \`var(--anyboom-border-strong)\` |
| \`--anyboom-badge-non-actionable-text\` | Цвет текста бейджа non-actionable | \`var(--anyboom-text-secondary)\` |

Токены определены в \`src/styles/components/_badge.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Basic: Story = {
  render: args => ({
    components: { Badge, ArchiveIcon },
    setup() {
      return { args }
    },
    template: `
      <Badge v-bind="args">
        <ArchiveIcon height="1em"/>
        Бейдж
      </Badge>
    `,
  }),
}
