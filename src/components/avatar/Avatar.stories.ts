import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Avatar from './Avatar.vue'

const meta: Meta<typeof Avatar> = {
  title: 'Misc/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'normal', 'large', 'xlarge', 'xxlarge'],
      description: 'Размер',
    },
    image: {
      control: 'text',
      description: 'URL изображения',
    },
    label: {
      control: 'text',
      description: 'Текстовая подпись',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Компонент Avatar поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-avatar-border\` | Цвет рамки аватара с изображением | \`var(--anyboom-border-strong)\` |
| \`--anyboom-avatar-icon-border\` | Цвет рамки аватара с текстовой подписью | \`var(--anyboom-border-default)\` |
| \`--anyboom-avatar-text\` | Цвет текста подписи | \`var(--anyboom-text-primary)\` |

Токены определены в \`src/styles/components/_avatar.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    label: 'ДВ',
    size: 'normal',
  },
}

export const WithImage: Story = {
  args: {
    image: 'https://i.pravatar.cc/150?img=12',
    size: 'normal',
  },
}
