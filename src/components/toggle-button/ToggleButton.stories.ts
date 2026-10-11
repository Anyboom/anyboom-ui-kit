import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StarIcon from '@iconify-vue/ph/star'
import StarFillIcon from '@iconify-vue/ph/star-fill'

import ToggleButton from './ToggleButton.vue'

const meta = {
  title: 'Form/ToggleButton',
  component: ToggleButton,
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Текущее состояние переключателя. Привязано через v-model.',
    },
    onLabel: {
      control: 'text',
      description: 'Текст, отображаемый в активном состоянии.',
    },
    offLabel: {
      control: 'text',
      description: 'Текст, отображаемый в неактивном состоянии.',
    },
    iconPos: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Расположение иконки относительно текста.',
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
      description: 'Размер кнопки.',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает переключатель.',
    },
    readonly: {
      control: 'boolean',
      description:
        'Делает переключатель доступным только для чтения: клики не меняют значение.',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA-метка для скринридеров.',
    },
    ariaDescribedby: {
      control: 'text',
      description: 'ARIA-атрибут со ссылкой на элемент с описанием.',
    },
  },
  args: {
    onLabel: 'Включено',
    offLabel: 'Выключено',
    iconPos: 'left',
    size: 'normal',
    disabled: false,
    readonly: false,
  },
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>
type Args = NonNullable<Story['args']>

function withVModel(args: Args) {
  return {
    components: { ToggleButton },
    setup() {
      return { args }
    },
    template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <ToggleButton v-model="args.modelValue" v-bind="args" />
      <div style="font-size: 12px; color: #666;">
        <strong>Значение:</strong> {{ args.modelValue }}
      </div>
    </div>
  `,
  }
}

export const Default: Story = {
  render: args => withVModel(args),
  args: {
    modelValue: false,
  },
}

export const ActiveByDefault: Story = {
  render: args => withVModel(args),
  args: {
    modelValue: true,
  },
}

export const IconOnly: Story = {
  render: args => ({
    components: { ToggleButton, StarFillIcon, StarIcon },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <ToggleButton v-model="args.modelValue" v-bind="args">
          <template #icon="{ active }">
            <StarFillIcon v-if="active" height="1em" />
            <StarIcon v-else height="1em" />
          </template>
        </ToggleButton>
        <div style="font-size: 12px; color: #666;">
          <strong>Значение:</strong> {{ args.modelValue }}
        </div>
      </div>
    `,
  }),
  args: {
    onLabel: '',
    offLabel: '',
    modelValue: false,
  },
}

export const WithIcons: Story = {
  render: args => ({
    components: { ToggleButton, StarFillIcon, StarIcon },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <ToggleButton v-model="args.modelValue" v-bind="args">
          <template #icon="{ active }">
            <StarFillIcon v-if="active" height="1em" />
            <StarIcon v-else height="1em" />
          </template>
        </ToggleButton>
        <div style="font-size: 12px; color: #666;">
          <strong>Значение:</strong> {{ args.modelValue }}
        </div>
      </div>
    `,
  }),
  args: {
    onLabel: 'В избранном',
    offLabel: 'В избранное',
    modelValue: false,
  },
}

export const Disabled: Story = {
  render: args => withVModel(args),
  args: {
    disabled: true,
    modelValue: true,
  },
}

export const Readonly: Story = {
  render: args => withVModel(args),
  args: {
    readonly: true,
    modelValue: true,
  },
}
