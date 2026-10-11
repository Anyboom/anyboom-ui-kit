import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MagnifyingGlassIcon from '@iconify-vue/ph/magnifying-glass'
import PulseIcon from '@iconify-vue/ph/pulse'
import { ref } from 'vue'

import Label from '@/components/label/Label.vue'

import InputNumber from './InputNumber.vue'

const meta = {
  title: 'Form/InputNumber',
  component: InputNumber,
  argTypes: {
    modelValue: {
      control: 'number',
      description: 'Текущее числовое значение поля. Привязано через v-model.',
    },
    required: {
      control: 'boolean',
      description:
        'Делает поле обязательным для заполнения. При отсутствии значения поле отображает состояние ошибки.',
    },
    placeholder: {
      control: 'text',
      description:
        'Текст-подсказка, отображаемый внутри поля, пока пользователь не начал ввод.',
    },
    disabled: {
      control: 'boolean',
      description:
        'Отключает поле ввода. При true поле становится неактивным и недоступным для взаимодействия.',
    },
    error: {
      control: 'boolean',
      description:
        'Активирует состояние ошибки. Визуально выделяет поле для индикации неверного ввода.',
    },
    hidden: {
      control: 'boolean',
      description:
        'Скрывает поле визуально, но оставляет его в DOM. Используется для условного отображения.',
    },
    min: {
      control: 'number',
      description:
        'Минимально допустимое значение. Пользователь не сможет ввести число меньше указанного.',
    },
    max: {
      control: 'number',
      description:
        'Максимально допустимое значение. Пользователь не сможет ввести число больше указанного.',
    },
    step: {
      control: 'number',
      description:
        'Шаг изменения значения при использовании кнопок увеличения/уменьшения или клавиш со стрелками.',
    },
    integer: {
      control: 'boolean',
      description:
        'Ограничивает ввод только целыми числами. При true дробные числа не допускаются.',
    },
    minFractionDigits: {
      control: 'number',
      description:
        'Минимальное количество знаков после запятой. При необходимости дополняет число нулями.',
    },
    maxFractionDigits: {
      control: 'number',
      description:
        'Максимальное количество знаков после запятой. Округляет число до указанного количества знаков.',
    },
    useGrouping: {
      control: 'boolean',
      description:
        'Включает группировку разрядов (тысяч). Например, 1000000 становится 1 000 000.',
    },
    decimalSeparator: {
      control: 'text',
      description:
        'Символ десятичного разделителя. По умолчанию \'.\'. Для русской локали обычно используют \',\'.',
    },
    groupingSeparator: {
      control: 'text',
      description:
        'Символ разделителя групп разрядов. По умолчанию пробел. Может быть \'.\' или \',\' в зависимости от локали.',
    },
    prefix: {
      control: 'text',
      description:
        'Текст перед значением. Обычно используется для валют (например, \'$\', \'€\', \'₽\').',
    },
    suffix: {
      control: 'text',
      description:
        'Текст после значения. Используется для обозначения единиц измерения (например, \'кг\', \'шт\', \'%\').',
    },
    showButtons: {
      control: 'boolean',
      description:
        'Показывает кнопки увеличения/уменьшения значения для быстрого изменения.',
    },
    buttonLayout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description:
        'Расположение кнопок: `horizontal` — горизонтально, `vertical` — вертикально.',
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
    defaultValue: {
      control: 'number',
      description:
        'Начальное значение поля при первом рендере. Используется для задания числа по умолчанию.',
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
    placeholder: 'Введите число...',
    step: 1,
    integer: false,
    useGrouping: false,
    decimalSeparator: '.',
    groupingSeparator: ' ',
    prefix: '',
    suffix: '',
    showButtons: false,
    buttonLayout: 'horizontal',
  },
} satisfies Meta<typeof InputNumber>

export default meta
type Story = StoryObj<typeof meta>
type Args = NonNullable<Story['args']>

function withVModel(args: Args) {
  return {
    components: { InputNumber, Label },
    setup() {
      const value = ref<number | null>(
        args.modelValue === null ? null : Number(args.modelValue),
      )
      return { args, value }
    },
    template: `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <Label text="Числовое поле" :input-id="args.inputId || 'input-number-story'" />
      <InputNumber v-model="value" v-bind="args" :input-id="args.inputId || 'input-number-story'" />
    </div>
  `,
  }
}

export const Default: Story = {
  render: args => withVModel(args),
  args: {
    placeholder: 'Введите число...',
    modelValue: null,
  },
}

export const WithPlaceholder: Story = {
  render: args => withVModel(args),
  args: {
    placeholder: 'Введите значение...',
    modelValue: null,
  },
}

export const WithDefaultValue: Story = {
  render: args => withVModel(args),
  args: {
    defaultValue: 42,
    placeholder: 'Значение по умолчанию 42',
    modelValue: null,
  },
}

export const WithMinMax: Story = {
  render: args => withVModel(args),
  args: {
    min: 0,
    max: 100,
    placeholder: '0 - 100',
    modelValue: 50,
  },
}

export const WithStep: Story = {
  render: args => withVModel(args),
  args: {
    step: 5,
    placeholder: 'Шаг 5',
    modelValue: 0,
  },
}

export const Integer: Story = {
  render: args => withVModel(args),
  args: {
    integer: true,
    placeholder: 'Только целые числа',
    modelValue: null,
  },
}

export const WithDecimalPrecision: Story = {
  render: args => withVModel(args),
  args: {
    minFractionDigits: 2,
    maxFractionDigits: 2,
    placeholder: '2 знака после запятой',
    modelValue: 3.14,
  },
}

export const WithGrouping: Story = {
  render: args => withVModel(args),
  args: {
    useGrouping: true,
    groupingSeparator: ' ',
    placeholder: 'С группировкой разрядов',
    modelValue: 1234567,
  },
}

export const WithPrefix: Story = {
  render: args => withVModel(args),
  args: {
    prefix: '$',
    placeholder: 'С префиксом',
    modelValue: 100,
  },
}

export const WithSuffix: Story = {
  render: args => withVModel(args),
  args: {
    suffix: ' кг',
    placeholder: 'С суффиксом',
    modelValue: 75,
  },
}

export const WithPrefixAndSuffix: Story = {
  render: args => withVModel(args),
  args: {
    prefix: '€ ',
    suffix: ' EUR',
    placeholder: 'С префиксом и суффиксом',
    modelValue: 99.99,
  },
}

export const WithHorizontalButtons: Story = {
  render: args => withVModel(args),
  args: {
    showButtons: true,
    buttonLayout: 'horizontal',
    placeholder: 'С горизонтальными кнопками',
    modelValue: 0,
  },
}

export const WithVerticalButtons: Story = {
  render: args => withVModel(args),
  args: {
    showButtons: true,
    buttonLayout: 'vertical',
    placeholder: 'С вертикальными кнопками',
    modelValue: 0,
  },
}

export const WithButtonsAndLimits: Story = {
  render: args => withVModel(args),
  args: {
    showButtons: true,
    buttonLayout: 'horizontal',
    min: 0,
    max: 100,
    step: 5,
    placeholder: '0 - 100, шаг 5',
    modelValue: 50,
  },
}

export const Disabled: Story = {
  render: args => withVModel(args),
  args: {
    disabled: true,
    placeholder: 'Недоступное поле ввода',
    modelValue: null,
  },
}

export const Error: Story = {
  render: args => withVModel(args),
  args: {
    error: true,
    placeholder: 'Состояние ошибки',
    modelValue: 42,
  },
}

export const Readonly: Story = {
  render: args => withVModel(args),
  args: {
    readonly: true,
    placeholder: 'Поле только для чтения',
    modelValue: null,
  },
}

export const WithIcons: Story = {
  render: args => ({
    components: { InputNumber, Label, MagnifyingGlassIcon, PulseIcon },
    setup() {
      const value = ref<number | null>(null)
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
        <Label text="Числовое поле" :input-id="args.inputId || 'input-number-icons-story'" />
        <InputNumber v-model="value" v-bind="args" :input-id="args.inputId || 'input-number-icons-story'">
          <template #icon-left>
            <MagnifyingGlassIcon height="1em" />
          </template>
          <template #icon-right>
            <PulseIcon height="1em" />
          </template>
        </InputNumber>
        <div style="font-size: 12px; color: #666; padding: 8px; background: #f5f5f5; border-radius: 4px;">
          <strong>Значение:</strong> {{ value !== null && value !== undefined ? value : 'null' }}
        </div>
      </div>
      `,
  }),
  args: {
    placeholder: 'С иконками',
    modelValue: null,
  },
}

export const PriceInput: Story = {
  render: args => withVModel(args),
  args: {
    prefix: '$',
    minFractionDigits: 2,
    maxFractionDigits: 2,
    useGrouping: true,
    groupingSeparator: ',',
    placeholder: 'Введите цену...',
    min: 0,
    modelValue: 99.99,
  },
}
