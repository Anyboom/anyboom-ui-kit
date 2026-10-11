import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ArchiveIcon from '@iconify-vue/ph/archive'

import Button from './Button.vue'

const meta = {
  title: 'Button/Button',
  component: Button,
  args: {
    default: 'Кнопка',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Отключает кнопку. При `true` кнопка становится неактивной.',
    },
    mono: {
      control: 'boolean',
      description: 'Включает моноширинный шрифт для кнопки.',
    },
    href: {
      control: 'text',
      description: 'Адрес ссылки. Если указан, кнопка работает как тег ссылки.',
    },
    target: {
      control: 'select',
      options: ['_blank', '_parent', '_top', '_self'],
      description:
        'Атрибут target для ссылки. Определяет, где открывать страницу.',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outline', 'text'],
      description: 'Вариант кнопки',
    },
    severity: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'contrast',
        'positive',
        'negative',
        'info',
      ],
      description: 'Стиль кнопки',
    },
    size: {
      control: 'radio',
      options: ['small', 'normal', 'large'],
      description: 'Размер кнопки',
    },
    iconOnly: {
      table: {
        readonly: true,
      },
      description: 'Указывает, что кнопка содержит только иконку',
    },
    default: {
      control: 'text',
      description:
        'Слот для содержимого кнопки. Может содержать текст или другие элементы.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент Button поддерживает следующие компонентные токены.

Токены строятся по шаблону \`--anyboom-button-{severity}-{variant}-{свойство}[-{состояние}]\`, где \`{severity}\` — primary, secondary, positive, negative, info, contrast; \`{variant}\` — filled, outlined, text.

| Токен | Описание |
| --- | --- |
| \`--anyboom-button-{severity}-filled-background\` | Фон кнопки варианта \`filled\` |
| \`--anyboom-button-{severity}-filled-background-hover\` | Фон кнопки \`filled\` при наведении |
| \`--anyboom-button-{severity}-filled-background-active\` | Фон кнопки \`filled\` при нажатии |
| \`--anyboom-button-{severity}-filled-text\` | Цвет текста кнопки \`filled\` |
| \`--anyboom-button-{severity}-outlined-background\` | Фон кнопки \`outline\` |
| \`--anyboom-button-{severity}-outlined-background-hover\` | Фон кнопки \`outline\` при наведении |
| \`--anyboom-button-{severity}-outlined-background-active\` | Фон кнопки \`outline\` при нажатии |
| \`--anyboom-button-{severity}-outlined-text\` | Цвет текста кнопки \`outline\` |
| \`--anyboom-button-{severity}-outlined-text-hover\` | Цвет текста кнопки \`outline\` при наведении |
| \`--anyboom-button-{severity}-outlined-text-active\` | Цвет текста кнопки \`outline\` при нажатии |
| \`--anyboom-button-{severity}-outlined-border\` | Цвет рамки кнопки \`outline\` |
| \`--anyboom-button-{severity}-outlined-border-hover\` | Цвет рамки кнопки \`outline\` при наведении |
| \`--anyboom-button-{severity}-outlined-border-active\` | Цвет рамки кнопки \`outline\` при нажатии |
| \`--anyboom-button-{severity}-text-text\` | Цвет текста кнопки \`text\` |
| \`--anyboom-button-{severity}-text-text-hover\` | Цвет текста кнопки \`text\` при наведении |
| \`--anyboom-button-{severity}-text-text-active\` | Цвет текста кнопки \`text\` при нажатии |

Токены отключённого состояния:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-button-disabled-filled-background\` | Фон отключённой кнопки \`filled\` | \`var(--anyboom-surface-disabled)\` |
| \`--anyboom-button-disabled-filled-text\` | Цвет текста отключённой кнопки \`filled\` | \`var(--anyboom-text-disabled)\` |
| \`--anyboom-button-disabled-outlined-background\` | Фон отключённой кнопки \`outline\` | \`var(--anyboom-surface-primary)\` |
| \`--anyboom-button-disabled-outlined-text\` | Цвет текста отключённой кнопки \`outline\` | \`var(--anyboom-text-disabled)\` |
| \`--anyboom-button-disabled-outlined-border\` | Цвет рамки отключённой кнопки \`outline\` | \`var(--anyboom-border-default)\` |
| \`--anyboom-button-disabled-text-text\` | Цвет текста отключённой кнопки \`text\` | \`var(--anyboom-text-disabled)\` |

Токены определены в \`src/styles/components/_button.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
} as Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const IconOnly: Story = {
  argTypes: {
    default: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    iconOnly: true,
    default: () => `<ArchiveIcon height="1em" />`,
  },
  render: args => ({
    components: { Button, ArchiveIcon },
    setup() {
      return { args }
    },
    template: `
      <Button v-bind="args">
        <ArchiveIcon height="1em" />
      </Button>
    `,
  }),
}
