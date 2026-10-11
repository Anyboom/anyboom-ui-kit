import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PlusIcon from '@iconify-vue/ph/plus'

import IconButton from './IconButton.vue'

const meta = {
  title: 'Button/IconButton',
  component: IconButton,
  argTypes: {
    default: {
      control: false,
      description: 'Слот для содержимого. Ожидается иконка или SVG элемент.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент IconButton поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-icon-button-default-icon\` | Цвет иконки | \`var(--anyboom-icon-neutral-default)\` |
| \`--anyboom-icon-button-hover-icon\` | Цвет иконки при наведении | \`var(--anyboom-icon-neutral-hover)\` |
| \`--anyboom-icon-button-hover-background\` | Фон при наведении | \`var(--anyboom-surface-secondary)\` |
| \`--anyboom-icon-button-active-icon\` | Цвет иконки при нажатии | \`var(--anyboom-icon-neutral-active)\` |
| \`--anyboom-icon-button-active-background\` | Фон при нажатии | \`var(--anyboom-surface-tertiary)\` |

Токены определены в \`src/styles/components/_icon-button.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
} as Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { IconButton, PlusIcon },
    setup() {
      return { args }
    },
    template: `
      <IconButton v-bind="args">
        <PlusIcon height="16px" />
      </IconButton>
    `,
  }),
}
