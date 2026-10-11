import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from '@/components/button/Button.vue'
import { useToast } from '@/components/toast/use-toast.ts'

import Toast from './Toast.vue'
import Toaster from './Toaster.vue'

const meta: Meta<typeof Toast> = {
  title: 'Messages/Toast',
  component: Toast,
  parameters: {
    docs: {
      description: {
        component: `
Компонент Toast поддерживает следующие компонентные токены.

Токены строятся по шаблону \`--anyboom-toast-{severity}-{свойство}\`, где \`{severity}\` — brand, secondary, positive, warning, error, info.

| Токен | Описание |
| --- | --- |
| \`--anyboom-toast-{severity}-title\` | Цвет заголовка |
| \`--anyboom-toast-{severity}-text\` | Цвет основного текста |
| \`--anyboom-toast-{severity}-icon\` | Цвет иконки |
| \`--anyboom-toast-{severity}-background\` | Фон уведомления |
| \`--anyboom-toast-{severity}-border\` | Цвет рамки |
| \`--anyboom-toast-{severity}-close-icon\` | Цвет иконки закрытия |

Токены определены в \`src/styles/components/_toast.scss\` и могут быть переопределены через CSS-переменные.
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Toast>

export const Default: Story = {
  render: () => ({
    components: { Toaster, Button },
    setup() {
      const toast = useToast()

      function show() {
        toast.success('Успешно сохранено')
        toast.error('Произошла ошибка')
        toast.secondary('Второстепенное уведомление')
        toast.info('Информационное сообщение')
        toast.warning('Проверьте введённые данные')
        toast.primary('Основное уведомление')
      }

      return { show }
    },
    template: '<Toaster /> <Button @click=\'show\'>Кнопка</Button>',
  }),
}
