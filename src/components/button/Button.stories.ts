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
        'success',
        'danger',
        'info',
        'warn',
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
    ariaLabel: {
      control: 'text',
      description:
        'Подпись для скринридеров. Обязательна для `iconOnly`-кнопок, где нет текста.',
    },
    default: {
      control: 'text',
      description:
        'Слот для содержимого кнопки. Может содержать текст или другие элементы.',
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
    ariaLabel: 'Архив',
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
