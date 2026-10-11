import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Radio from './Radio.vue'

const meta = {
  title: 'Form/Radio',
  component: Radio,
  argTypes: {
    label: {
      control: 'text',
      description: 'Текстовая подпись, отображаемая рядом с радио-кнопкой.',
    },
    disabled: {
      control: 'boolean',
      description:
        'Отключает радио-кнопку. При `true` кнопка становится неактивной и недоступной для выбора.',
    },
    value: {
      control: 'text',
      description:
        'Уникальное значение радио-кнопки. Используется для идентификации выбранного варианта в группе.',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'Размер элемента.',
    },
  },
  args: {
    label: 'Вариант',
    value: 'option1',
  },
  parameters: {
    docs: {
      description: {
        component: `
Компонент Radio поддерживает следующие компонентные токены:

| Токен | Описание | Значение по умолчанию |
| --- | --- | --- |
| \`--anyboom-radio-inactive-background\` | Фон невыбранной радио-кнопки | \`var(--anyboom-control-inactive-background)\` |
| \`--anyboom-radio-inactive-border\` | Цвет рамки невыбранной радио-кнопки | \`var(--anyboom-control-inactive-border)\` |
| \`--anyboom-radio-inactive-hover-background\` | Фон невыбранной радио-кнопки при наведении | \`var(--anyboom-control-inactive-hover-background)\` |
| \`--anyboom-radio-inactive-hover-border\` | Цвет рамки невыбранной радио-кнопки при наведении | \`var(--anyboom-control-inactive-hover-border)\` |
| \`--anyboom-radio-text\` | Цвет текста подписи | \`var(--anyboom-text-primary)\` |
| \`--anyboom-radio-checked-background\` | Фон выбранной радио-кнопки | \`var(--anyboom-control-checked-background)\` |
| \`--anyboom-radio-checked-border\` | Цвет рамки выбранной радио-кнопки | \`var(--anyboom-control-checked-border)\` |
| \`--anyboom-radio-checked-hover-background\` | Фон выбранной радио-кнопки при наведении | \`var(--anyboom-control-checked-hover-background)\` |
| \`--anyboom-radio-checked-hover-border\` | Цвет рамки выбранной радио-кнопки при наведении | \`var(--anyboom-control-checked-hover-border)\` |

Токены определены в \`src/styles/components/_radio.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
