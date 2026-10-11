import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ref } from 'vue'
import Rating from './Rating.vue'

const meta: Meta<typeof Rating> = {
  title: 'Form/Rating',
  component: Rating,
  argTypes: {
    modelValue: {
      control: { type: 'number', step: 1 },
      description: 'Текущее значение рейтинга',
    },
    stars: {
      control: { type: 'number', step: 1 },
      description: 'Общее количество звезд',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает компонент',
    },
    readonly: {
      control: 'boolean',
      description: 'Делает компонент доступным только для чтения',
    },
  },
}

export default meta
type Story = StoryObj<typeof Rating>
type Args = NonNullable<Story['args']>

function withVModel(args: Args) {
  return {
    components: { Rating },
    setup() {
      const value = ref(args.modelValue || 0)
      const props = { ...args }
      delete props.modelValue
      return { props, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Rating v-model="value" v-bind="props" />
        <div>Текущее значение: {{ value }}</div>
      </div>
    `,
  }
}

export const Default: Story = {
  render: args => withVModel(args),
  args: {
    modelValue: 0,
  },
}

export const Readonly: Story = {
  render: args => withVModel(args),
  args: {
    modelValue: 3,
    readonly: true,
  },
}

export const Disabled: Story = {
  render: args => withVModel(args),
  args: {
    modelValue: 4,
    disabled: true,
  },
}
