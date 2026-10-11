import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Message from './Message.vue'

const meta: Meta<typeof Message> = {
  title: 'Messages/Message',
  component: Message,
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outline', 'text'],
      description: 'Вариант отображения сообщения.',
    },
    severity: {
      control: 'select',
      options: ['secondary', 'contrast', 'positive', 'negative', 'info'],
      description: 'Тип сообщения.',
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
      description: 'Размер сообщения.',
    },
    default: {
      control: 'text',
      description: 'Содержимое сообщения.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент Message поддерживает следующие компонентные токены.

Токены строятся по шаблону \`--anyboom-message-{severity}-{variant}-{свойство}\`, где \`{severity}\` — secondary, positive, negative, info, contrast; \`{variant}\` — filled, outlined, text.

| Токен | Описание |
| --- | --- |
| \`--anyboom-message-{severity}-filled-background\` | Фон сообщения варианта \`filled\` |
| \`--anyboom-message-{severity}-filled-text\` | Цвет текста сообщения \`filled\` |
| \`--anyboom-message-{severity}-outlined-background\` | Фон сообщения \`outline\` |
| \`--anyboom-message-{severity}-outlined-text\` | Цвет текста сообщения \`outline\` |
| \`--anyboom-message-{severity}-outlined-border\` | Цвет рамки сообщения \`outline\` |
| \`--anyboom-message-{severity}-text-text\` | Цвет текста сообщения \`text\` |

Токены определены в \`src/styles/components/_message.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Message>

export const Default: Story = {
  args: {
    default: 'Информационное сообщение',
    variant: 'filled',
    severity: 'info',
    size: 'normal',
  },
}
