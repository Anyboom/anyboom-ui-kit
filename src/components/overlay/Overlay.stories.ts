import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Overlay from './Overlay.vue'

const meta: Meta<typeof Overlay> = {
  title: 'Overlay/Overlay',
  component: Overlay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Компонент Overlay поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-overlay-default\` | Цвет фона оверлея | \`var(--anyboom-color-gray-900)\` |

Токены определены в \`src/styles/components/_overlay.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Overlay>

export const Default: Story = {}
