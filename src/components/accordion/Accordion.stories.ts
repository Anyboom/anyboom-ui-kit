import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Accordion from './Accordion.vue'

const meta: Meta<typeof Accordion> = {
  title: 'Panel/Accordion',
  component: Accordion,
  argTypes: {
    disabled: {
      control: 'boolean',
      description:
        'Отключает аккордеон: заголовок недоступен для взаимодействия.',
    },
    modelValue: {
      control: 'boolean',
      description:
        'Открыт ли аккордеон. Привязано через v-model — можно управлять снаружи.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Accordion>

function withAccordion(args: { disabled?: boolean, modelValue?: boolean }) {
  return {
    components: { Accordion },
    setup() {
      const open = ref(Boolean(args.modelValue))
      return { args, open }
    },
    template: `
    <Accordion v-bind="args" v-model="open">
      <template #title>Что такое Lorem Ipsum?</template>
      Lorem Ipsum — это текст-«рыба», часто используемый в печати и вёрстке. Lorem Ipsum является стандартной «рыбой» для этих целей уже с 1966 года, когда дизайнеры Letraset и Джеймс Мосли, библиотекарь и коллекционер каллиграфии, популяризировали его.
    </Accordion>
  `,
  }
}

export const Default: Story = {
  render: args => withAccordion(args),
  args: {
    disabled: false,
    modelValue: false,
  },
}

export const OpenByDefault: Story = {
  render: args => withAccordion(args),
  args: {
    disabled: false,
    modelValue: true,
  },
}

export const Disabled: Story = {
  render: args => withAccordion(args),
  args: {
    disabled: true,
    modelValue: false,
  },
}
