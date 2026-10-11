import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { MenuItem } from '@/components/menu/MenuItem.ts'
import AddressBookIcon from '@iconify-vue/ph/address-book'

import { h } from 'vue'

import Menu from './Menu.vue'

const meta: Meta<typeof Menu> = {
  title: 'Menu/Menu',
  component: Menu,
  argTypes: {
    items: {
      control: 'object',
      description: 'Массив пунктов меню',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент Menu поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-menu-background\` | Фон меню | \`var(--anyboom-surface-primary)\` |
| \`--anyboom-menu-border\` | Цвет рамки меню | \`var(--anyboom-border-default)\` |

Токены пункта меню (MenuItem):

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-menu-item-text\` | Цвет текста пункта меню | \`var(--anyboom-text-primary)\` |
| \`--anyboom-menu-item-text-hover\` | Цвет текста пункта при наведении | \`var(--anyboom-text-primary)\` |
| \`--anyboom-menu-item-text-active\` | Цвет текста активного пункта | \`var(--anyboom-text-positive)\` |
| \`--anyboom-menu-item-icon\` | Цвет иконки пункта | \`var(--anyboom-icon-neutral-default)\` |
| \`--anyboom-menu-item-icon-active\` | Цвет иконки активного пункта | \`var(--anyboom-icon-positive)\` |
| \`--anyboom-menu-item-background\` | Фон пункта | \`var(--anyboom-surface-primary)\` |
| \`--anyboom-menu-item-background-hover\` | Фон пункта при наведении | \`var(--anyboom-surface-secondary)\` |
| \`--anyboom-menu-item-background-active\` | Фон активного пункта | \`var(--anyboom-surface-positive-light)\` |

Токены определены в \`src/styles/components/_menu.scss\` и \`_menu-item.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Menu>

const baseItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Главная',
    iconLeft: h(AddressBookIcon, { height: '16px' }),
    iconRight: h(AddressBookIcon, { height: '16px' }),
    active: true,
  },
  {
    id: 'products',
    label: 'Товары',
  },
  {
    id: 'about',
    label: 'О нас',
    href: '/about',
  },
  {
    id: 'contact',
    label: 'Контакты',
  },
  {
    id: 'blog',
    label: 'Блог',
  },
  {
    id: 'settings',
    label: 'Настройки',
    disabled: true,
  },
]

export const Default: Story = {
  args: {
    items: baseItems,
  },
}
