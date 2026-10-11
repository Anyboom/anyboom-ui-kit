import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from '@/components/button/Button.vue'
import { useToast } from '@/components/toast/use-toast.ts'

import Toast from './Toast.vue'
import Toaster from './Toaster.vue'

const meta: Meta<typeof Toast> = {
  title: 'Messages/Toast',
  component: Toast,
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
        toast.danger('Произошла ошибка')
        toast.secondary('Второстепенное уведомление')
        toast.info('Информационное сообщение')
        toast.warn('Проверьте введённые данные')
        toast.primary('Основное уведомление')
      }

      return { show }
    },
    template: '<Toaster /> <Button @click=\'show\'>Кнопка</Button>',
  }),
}
