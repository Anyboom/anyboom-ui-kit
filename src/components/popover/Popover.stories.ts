import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from '@/components/button/Button.vue'
import InputText from '@/components/input-text/InputText.vue'

import Popover from './Popover.vue'

const meta: Meta<typeof Popover> = {
  title: 'Overlay/Popover',
  component: Popover,
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description:
        'Предпочтительное расположение относительно триггера. При `autoPlacement` используется как приоритет.',
    },
    offset: {
      control: 'number',
      description: 'Отступ от триггера в пикселях.',
    },
    autoPlacement: {
      control: 'boolean',
      description:
        'Автоматически выбирает сторону с достаточным пространством во вьюпорте.',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает открытие popover.',
    },
    trigger: {
      control: 'text',
      description: 'Слот триггера',
    },
    default: {
      control: 'text',
      description: 'Содержимое',
    },
  },
}

export default meta
type Story = StoryObj<typeof Popover>

function withPopover(args: {
  placement?: 'top' | 'bottom' | 'left' | 'right'
  offset?: number
  autoPlacement?: boolean
  disabled?: boolean
}) {
  return {
    components: { Popover, Button, InputText },
    setup() {
      return { args }
    },
    template: `
    <Popover v-bind="args">
      <template #trigger>
        <Button>Открыть popover</Button>
      </template>
      <template #default>
        <InputText placeholder="Внутри popover" />
      </template>
    </Popover>
  `,
  }
}

export const Default: Story = {
  render: args => withPopover(args),
  args: {
    placement: 'bottom',
    offset: 8,
    autoPlacement: true,
    disabled: false,
  },
}

export const Top: Story = {
  render: args => withPopover(args),
  args: {
    ...Default.args,
    placement: 'top',
    autoPlacement: false,
  },
}

export const Right: Story = {
  render: args => withPopover(args),
  args: {
    ...Default.args,
    placement: 'right',
    autoPlacement: false,
  },
}

export const Disabled: Story = {
  render: args => withPopover(args),
  args: {
    ...Default.args,
    disabled: true,
  },
}
