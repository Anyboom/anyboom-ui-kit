import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Spinner from './Spinner.vue'

const meta = {
  title: 'Misc/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'custom'],
      description: 'Размер спиннера',
    },
    speed: {
      control: 'select',
      options: ['slow', 'normal', 'fast'],
      description: 'Скорость анимации',
    },
    thickness: {
      control: 'select',
      options: ['thin', 'medium', 'thick'],
      description: 'Толщина линии',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент Spinner поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-spinner-background\` | Цвет фонового кольца | \`var(--anyboom-surface-tertiary)\` |
| \`--anyboom-spinner-border\` | Цвет активной дуги | \`var(--anyboom-border-contrast)\` |

Токены определены в \`src/styles/components/_spinner.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div style="display: flex; align-items: center; gap: 24px; padding: 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <Spinner size="small" />
          <span style="font-size: 12px; color: #666;">Маленький</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <Spinner size="medium" />
          <span style="font-size: 12px; color: #666;">Средний</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <Spinner size="large" />
          <span style="font-size: 12px; color: #666;">Большой</span>
        </div>
      </div>
    `,
  }),
}

export const Speeds: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div style="display: flex; align-items: center; gap: 32px; padding: 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <Spinner speed="slow" />
          <span style="font-size: 12px; color: #666;">Медленный</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <Spinner speed="normal" />
          <span style="font-size: 12px; color: #666;">Обычный</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <Spinner speed="fast" />
          <span style="font-size: 12px; color: #666;">Быстрый</span>
        </div>
      </div>
    `,
  }),
}

export const Thickness: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div style="display: flex; align-items: center; gap: 32px; padding: 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <Spinner thickness="thin" />
          <span style="font-size: 12px; color: #666;">Тонкий</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <Spinner thickness="medium" />
          <span style="font-size: 12px; color: #666;">Средний</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <Spinner thickness="thick" />
          <span style="font-size: 12px; color: #666;">Толстый</span>
        </div>
      </div>
    `,
  }),
}
