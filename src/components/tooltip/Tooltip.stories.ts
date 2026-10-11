import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from '@/components/button/Button.vue'

import Tooltip from './Tooltip.vue'

const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  argTypes: {
    content: {
      control: 'text',
      description: 'Текстовое содержимое подсказки',
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Позиция подсказки относительно триггера',
    },
    delay: {
      control: 'number',
      description: 'Задержка перед появлением (в миллисекундах)',
    },
    hideDelay: {
      control: 'number',
      description: 'Задержка перед скрытием (в миллисекундах)',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключить подсказку',
    },
    autoPlacement: {
      control: 'boolean',
      description: 'Автоматически подбирать лучшую позицию',
    },
    offset: {
      control: 'number',
      description: 'Отступ от триггера (в пикселях)',
    },
    interactive: {
      control: 'boolean',
      description: 'Интерактивный режим (можно наводить и кликать внутри)',
    },
    triggerOnClick: {
      control: 'boolean',
      description: 'Показывать подсказку по клику вместо наведения',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент Tooltip поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-tooltip-text\` | Цвет текста подсказки | \`var(--anyboom-text-primary)\` |
| \`--anyboom-tooltip-background\` | Фон подсказки | \`var(--anyboom-surface-primary)\` |

Токены определены в \`src/styles/components/_tooltip.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    content: 'Это подсказка',
  },
  render: args => ({
    components: { Tooltip, Button },
    setup() {
      return { args }
    },
    template: `
      <Tooltip v-bind="args">
        <Button>
          Наведи на меня
        </Button>
      </Tooltip>
    `,
  }),
}
