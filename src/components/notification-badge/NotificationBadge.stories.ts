import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Avatar from '@/components/avatar/Avatar.vue'

import NotificationBadge from './NotificationBadge.vue'

const meta: Meta<typeof NotificationBadge> = {
  title: 'Misc/NotificationBadge',
  component: NotificationBadge,
  argTypes: {
    value: {
      description: 'Числовое значение на бейдже',
    },
    severity: {
      control: 'select',
      options: ['active', 'negative'],
      description: 'Визуальный стиль бейджа',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Компонент NotificationBadge поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-badge-info-background\` | Фон бейджа active | \`var(--anyboom-surface-info-light)\` |
| \`--anyboom-badge-info-border\` | Цвет рамки и фона бейджа active | \`var(--anyboom-border-info-hover)\` |
| \`--anyboom-badge-negative-background\` | Фон бейджа negative | \`var(--anyboom-surface-negative-light)\` |
| \`--anyboom-badge-negative-border\` | Цвет рамки и фона бейджа negative | \`var(--anyboom-border-negative)\` |

Токены определены в \`src/styles/components/_badge.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof NotificationBadge>

export const Default: Story = {
  render: args => ({
    components: { NotificationBadge, Avatar },
    setup() {
      return { args }
    },
    template: `
      <NotificationBadge v-bind="args">
        <Avatar image="https://i.pravatar.cc/150?img=12" />
      </NotificationBadge>
    `,
  }),
  args: {
    value: 1,
    severity: 'active',
  },
}
