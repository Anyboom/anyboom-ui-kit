import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PlusIcon from '@iconify-vue/ph/plus'
import { ref } from 'vue'

import Label from '@/components/label/Label.vue'

import InputText from './InputText.vue'

const meta = {
  title: 'Form/InputText',
  component: InputText,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Размер поля',
    },
    inputId: {
      control: 'text',
      description:
        'Атрибут id для HTML-элемента input. Используется для связи с меткой и тестирования.',
    },
    modelValue: {
      control: 'text',
      description: 'Текущее значение поля ввода. Привязано через v-model.',
    },
    placeholder: {
      control: 'text',
      description:
        'Текст-подсказка, отображаемый внутри поля, пока пользователь не начал ввод.',
    },
    disabled: {
      control: 'boolean',
      description:
        'Отключает поле ввода. При `true` поле становится неактивным и недоступным для взаимодействия.',
    },
    error: {
      control: 'boolean',
      description:
        'Активирует состояние ошибки. Визуально выделяет поле красным для индикации неверного ввода.',
    },
    success: {
      control: 'boolean',
      description: 'Активирует состояние успеха.',
    },
    mask: {
      control: 'text',
      description: 'Маска ввода для форматирования текста.',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description:
        'Тип поля ввода. Определяет поведение, валидацию и клавиатуру на мобильных устройствах.',
    },
    readonly: {
      control: 'boolean',
      description:
        'Делает поле доступным только для чтения. Пользователь не может изменять значение, но может его копировать.',
    },
    autofocus: {
      control: 'boolean',
      description:
        'Автоматически устанавливает фокус на поле при загрузке страницы.',
    },
    autocomplete: {
      control: 'text',
      description:
        'Атрибут autocomplete для подсказок браузера. Может принимать значения: \'on\', \'off\', \'username\', \'email\' и др.',
    },
    inputmode: {
      control: 'select',
      options: [
        'text',
        'none',
        'decimal',
        'numeric',
        'tel',
        'search',
        'email',
        'url',
      ],
      description:
        'Определяет тип виртуальной клавиатуры на мобильных устройствах. Влияет на раскладку и доступные символы.',
    },
    enterkeyhint: {
      control: 'select',
      options: ['enter', 'done', 'go', 'next', 'previous', 'search', 'send'],
      description:
        'Подсказка для кнопки Enter на виртуальной клавиатуре. Изменяет надпись на кнопке (например, \'Поиск\', \'Отправить\').',
    },
    defaultValue: {
      control: 'text',
      description:
        'Начальное значение поля при первом рендере. Используется для задания значения по умолчанию.',
    },
    ariaLabel: {
      control: 'text',
      description:
        'ARIA-метка для улучшения доступности. Используется скринридерами для озвучивания назначения поля.',
    },
    ariaDescribedby: {
      control: 'text',
      description:
        'ARIA-атрибут, указывающий на элемент с описанием поля. Обеспечивает дополнительный контекст для скринридеров.',
    },
  },
  args: {
    placeholder: 'Введите текст...',
    type: 'text',
  },
} satisfies Meta<typeof InputText>

export default meta
type Story = StoryObj<typeof meta>
type Args = NonNullable<Story['args']>

function withVModel(args: Args) {
  return {
    components: { InputText, Label },
    setup() {
      const value = ref(args.modelValue || '')
      return { args, value }
    },
    template: `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <Label text="Текстовое поле" :input-id="args.inputId || 'input-text-story'" />
      <InputText v-model="value" v-bind="args" :input-id="args.inputId || 'input-text-story'" />
      {{ value }}
    </div>
  `,
  }
}

export const Default: Story = {
  render: args => withVModel(args),
  args: {
    placeholder: 'Введите текст...',
    modelValue: '',
  },
}

export const WithPlaceholder: Story = {
  render: args => withVModel(args),
  args: {
    placeholder: 'Введите ваше имя...',
    modelValue: '',
  },
}

export const WithDefaultValue: Story = {
  render: args => withVModel(args),
  args: {
    defaultValue: 'Иван Иванов',
  },
}

export const Disabled: Story = {
  render: args => withVModel(args),
  args: {
    disabled: true,
    placeholder: 'Недоступное поле ввода',
    modelValue: '',
  },
}

export const Error: Story = {
  render: args => withVModel(args),
  args: {
    error: true,
    placeholder: 'Поле с ошибкой',
    modelValue: 'Некорректное значение',
  },
}

export const Readonly: Story = {
  render: args => withVModel(args),
  args: {
    readonly: true,
    modelValue: 'Поле только для чтения',
  },
}

export const Password: Story = {
  render: args => withVModel(args),
  args: {
    type: 'password',
    placeholder: 'Введите пароль...',
    modelValue: '',
  },
}

export const MaskPhone: Story = {
  render: args => withVModel(args),
  args: {
    mask: '#-(###)-###-####',
    placeholder: '7-(901)-023-3345',
    modelValue: '',
  },
}

export const WithIcons: Story = {
  render: args => ({
    components: { InputText, Label, PlusIcon },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label text="Текстовое поле" :input-id="args.inputId || 'input-text-icons-story'" />
        <InputText v-model="value" v-bind="args" :input-id="args.inputId || 'input-text-icons-story'">
          <template #icon-left>
            <PlusIcon height="1em" />
          </template>
          <template #icon-right>
            <PlusIcon height="1em" />
          </template>
        </InputText>
      </div>
    `,
  }),
  args: {
    placeholder: 'Поиск...',
    modelValue: '',
  },
}
