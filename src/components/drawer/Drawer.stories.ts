import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Button from '@/components/button/Button.vue'
import InputText from '@/components/input-text/InputText.vue'
import Label from '@/components/label/Label.vue'

import Drawer from './Drawer.vue'

const meta: Meta<typeof Drawer> = {
  title: 'Overlay/Drawer',
  component: Drawer,
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Открыт ли drawer. Привязано через v-model.',
    },
    title: {
      control: 'text',
      description: 'Заголовок.',
    },
    position: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'С какой стороны экрана выезжает панель.',
    },
    size: {
      control: 'text',
      description:
        'Размер: для `left`/`right` — ширина, для `top`/`bottom` — высота (например, `400px`).',
    },
    closable: {
      control: 'boolean',
      description: 'Показывать кнопку закрытия.',
    },
    maskClosable: {
      control: 'boolean',
      description: 'Закрывать по клику на оверлей.',
    },
    escClosable: {
      control: 'boolean',
      description: 'Закрывать по нажатию Escape.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент Drawer поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-modal-text\` | Цвет текста (используются токены Modal) | \`var(--anyboom-text-primary)\` |
| \`--anyboom-modal-background\` | Фон панели (используются токены Modal) | \`var(--anyboom-surface-primary)\` |

Токены определены в \`src/styles/components/_modal.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Drawer>

function withDrawer(args: {
  title?: string
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: string
  closable?: boolean
  maskClosable?: boolean
  escClosable?: boolean
}) {
  return {
    components: { Drawer, Button, InputText, Label },
    setup() {
      const isOpen = ref(false)
      return { args, isOpen }
    },
    template: `
    <Button @click="isOpen = true">Открыть drawer</Button>

    <Drawer v-bind="args" v-model="isOpen">
      <template #default>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <Label size="small" text="Название проекта" input-id="drawer-project-name" required="none" />
          <InputText input-id="drawer-project-name" placeholder="Введите название..." />
        </div>
      </template>

      <template #footer>
        <Button variant="text" severity="secondary" @click="isOpen = false">
          Отмена
        </Button>
        <Button @click="isOpen = false">Сохранить</Button>
      </template>
    </Drawer>
  `,
  }
}

export const Default: Story = {
  render: args => withDrawer(args),
  args: {
    modelValue: false,
    title: 'Новый проект',
    position: 'right',
    size: '400px',
    closable: true,
    maskClosable: true,
    escClosable: true,
  },
}

export const Left: Story = {
  render: args => withDrawer(args),
  args: {
    ...Default.args,
    position: 'left',
  },
}

export const Top: Story = {
  render: args => withDrawer(args),
  args: {
    ...Default.args,
    position: 'top',
    size: '300px',
  },
}

export const Bottom: Story = {
  render: args => withDrawer(args),
  args: {
    ...Default.args,
    position: 'bottom',
    size: '300px',
  },
}

export const WithoutClose: Story = {
  render: args => withDrawer(args),
  args: {
    ...Default.args,
    closable: false,
    maskClosable: false,
    escClosable: false,
  },
}

export const WithoutTitle: Story = {
  render: args => withDrawer(args),
  args: {
    ...Default.args,
    title: undefined,
  },
}
