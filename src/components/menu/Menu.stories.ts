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
