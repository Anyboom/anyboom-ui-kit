import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Button from '@/components/button/Button.vue'
import InputText from '@/components/input-text/InputText.vue'
import Label from '@/components/label/Label.vue'

import Modal from './Modal.vue'

const meta: Meta<typeof Modal> = {
  title: 'Overlay/Modal',
  component: Modal,
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Открыто ли модальное окно. Привязано через v-model.',
    },
    title: {
      control: 'text',
      description: 'Заголовок окна.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'fullscreen'],
      description:
        'Ширина окна: `small` — 400px, `medium` — 560px, `large` — 720px.',
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
Компонент Modal поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-modal-text\` | Цвет текста | \`var(--anyboom-text-primary)\` |
| \`--anyboom-modal-background\` | Фон окна | \`var(--anyboom-surface-primary)\` |

Токены определены в \`src/styles/components/_modal.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

function withModal(args: {
  title?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  closable?: boolean
  maskClosable?: boolean
  escClosable?: boolean
}) {
  return {
    components: { Modal, Button, InputText, Label },
    setup() {
      const isOpen = ref(false)
      return { args, isOpen }
    },
    template: `
    <Button @click="isOpen = true">Открыть модальное окно</Button>

    <Modal v-bind="args" v-model="isOpen">
      <template #default>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <Label size="small" text="Название проекта" input-id="modal-project-name" required="none" />
          <InputText input-id="modal-project-name" placeholder="Введите название..." />
        </div>
      </template>

      <template #footer>
        <Button variant="text" severity="secondary" @click="isOpen = false">
          Отмена
        </Button>
        <Button @click="isOpen = false">Создать</Button>
      </template>
    </Modal>
  `,
  }
}

export const Default: Story = {
  render: args => withModal(args),
  args: {
    modelValue: false,
    title: 'Новый проект',
    size: 'medium',
    closable: true,
    maskClosable: true,
    escClosable: true,
  },
}

export const Small: Story = {
  render: args => withModal(args),
  args: {
    ...Default.args,
    title: 'Подтверждение',
    size: 'small',
  },
}

export const Large: Story = {
  render: args => withModal(args),
  args: {
    ...Default.args,
    title: 'Подробная информация',
    size: 'large',
  },
}

export const WithoutClose: Story = {
  render: args => withModal(args),
  args: {
    ...Default.args,
    closable: false,
    maskClosable: false,
    escClosable: false,
  },
}

export const WithoutTitle: Story = {
  render: args => withModal(args),
  args: {
    ...Default.args,
    title: undefined,
  },
}
