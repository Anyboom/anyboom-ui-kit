<script setup lang="ts">
import type { InputDateDay } from '@/components/input-date/input-date-day.ts'

import type { Option } from '@/components/select/option.ts'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import InputNumber from '@/components/input-number/InputNumber.vue'
import InputText from '@/components/input-text/InputText.vue'
import Select from '@/components/select/Select.vue'
import { formatDate } from '@/utils/format-date.ts'

export type InputDateValue = Date | [Date, Date] | null

interface Props {
  modelValue?: InputDateValue
  mode?: 'single' | 'range'
  inputId?: string
  placeholder?: string
  disabled?: boolean
  minDate?: Date | null
  maxDate?: Date | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  mode: 'single',
  inputId: undefined,
  placeholder: '',
  disabled: false,
  minDate: null,
  maxDate: null,
})

const emit = defineEmits<Emits>()

interface Emits {
  (e: 'update:modelValue', value: InputDateValue): void
}

const months: Option[] = [
  { name: 'Январь', value: '0' },
  { name: 'Февраль', value: '1' },
  { name: 'Март', value: '2' },
  { name: 'Апрель', value: '3' },
  { name: 'Май', value: '4' },
  { name: 'Июнь', value: '5' },
  { name: 'Июль', value: '6' },
  { name: 'Август', value: '7' },
  { name: 'Сентябрь', value: '8' },
  { name: 'Октябрь', value: '9' },
  { name: 'Ноябрь', value: '10' },
  { name: 'Декабрь', value: '11' },
]

const weekdays: string[] = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const isOpen = ref<boolean>(false)
const selectedDate = ref<Date | null>(null)
const selectedEndDate = ref<Date | null>(null)
const currentDate = ref<Date>(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const datePickerRef = ref<HTMLDivElement | null>(null)

const selectedMonth = computed<Option>(() => {
  const monthValue = currentDate.value.getMonth().toString()
  const found = months.find(month => month.value === monthValue)
  return found || months[0]
})

function normalizeDate(data: Date | string | number) {
  return new Date(data).setHours(0, 0, 0, 0)
}

const displayValue = computed<string | undefined>(() => {
  if (props.mode === 'range') {
    if (selectedDate.value && selectedEndDate.value) {
      return `${formatDate(selectedDate.value.toString())} – ${formatDate(selectedEndDate.value.toString())}`
    }

    if (selectedDate.value) {
      return `${formatDate(selectedDate.value.toString())} –`
    }

    return undefined
  }

  if (selectedDate.value) {
    return formatDate(selectedDate.value.toString())
  }

  return undefined
})

function isDateInRange(date: Date): boolean {
  const target = normalizeDate(date)

  if (props.maxDate && target > normalizeDate(props.maxDate)) {
    return false
  }

  if (props.minDate && target < normalizeDate(props.minDate)) {
    return false
  }

  return true
}

const calendarDays = computed<InputDateDay[]>(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)

  let startDay = firstDayOfMonth.getDay()
  startDay = startDay === 0 ? 7 : startDay

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: InputDateDay[] = []
  const prevMonthDays = new Date(year, month, 0).getDate()

  for (let i = startDay - 1; i > 0; i--) {
    const date = new Date(year, month - 1, prevMonthDays - i + 1)
    date.setHours(0, 0, 0, 0)
    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: false,
      isDisabled: !isDateInRange(date),
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    date.setHours(0, 0, 0, 0)
    days.push({
      date,
      day: i,
      isCurrentMonth: true,
      isDisabled: !isDateInRange(date),
    })
  }

  const nextDays = 42 - days.length

  for (let i = 1; i <= nextDays; i++) {
    const date = new Date(year, month + 1, i)
    date.setHours(0, 0, 0, 0)
    days.push({
      date,
      day: i,
      isCurrentMonth: false,
      isDisabled: !isDateInRange(date),
    })
  }

  return days
})

function isSelected(day: InputDateDay): boolean {
  const dateStr = day.date.toDateString()

  if (props.mode === 'range') {
    return (
      dateStr === selectedDate.value?.toDateString()
      || dateStr === selectedEndDate.value?.toDateString()
    )
  }

  return dateStr === selectedDate.value?.toDateString()
}

function isInSelectedRange(day: InputDateDay): boolean {
  if (props.mode !== 'range') {
    return false
  }

  if (!selectedDate.value || !selectedEndDate.value) {
    return false
  }

  return (
    normalizeDate(day.date) > normalizeDate(selectedDate.value)
    && normalizeDate(day.date) < normalizeDate(selectedEndDate.value)
  )
}

function isToday(day: InputDateDay): boolean {
  return day.date.toDateString() === new Date().toDateString()
}

function selectDate(day: InputDateDay): void {
  if (day.isDisabled || props.disabled) {
    return
  }

  if (props.mode === 'range') {
    if (selectedDate.value && !selectedEndDate.value) {
      if (day.date < selectedDate.value) {
        selectedDate.value = day.date
        emit('update:modelValue', null)
      }
      else {
        selectedEndDate.value = day.date
        isOpen.value = false
        emit('update:modelValue', [selectedDate.value, day.date])
      }
    }
    else {
      selectedDate.value = day.date
      selectedEndDate.value = null
      emit('update:modelValue', null)
    }

    return
  }

  selectedDate.value = day.date
  isOpen.value = false

  emit('update:modelValue', selectedDate.value)
}

function showCalendar(): void {
  if (!props.disabled) {
    isOpen.value = true
  }
}

function handleMonthChange(option: Option): void {
  const newMonth = parseInt(String(option.value))
  currentDate.value = new Date(currentDate.value.getFullYear(), newMonth, 1)
}

function handleYearChange(year: number): void {
  currentDate.value = new Date(year, currentDate.value.getMonth(), 1)
}

function handleClickOutside(event: MouseEvent): void {
  if (
    datePickerRef.value
    && !datePickerRef.value.contains(event.target as Node)
    && isOpen.value
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(
  [() => props.modelValue, () => props.mode],
  ([newVal]: [InputDateValue, 'single' | 'range']) => {
    if (props.mode === 'range' && Array.isArray(newVal)) {
      const [start, end] = newVal

      selectedDate.value = start ? new Date(start) : null
      selectedEndDate.value = end ? new Date(end) : null

      if (start) {
        currentDate.value = new Date(start)
      }
    }
    else if (newVal instanceof Date) {
      const date = new Date(newVal)

      selectedDate.value = date
      selectedEndDate.value = null
      currentDate.value = date
    }
    else {
      selectedDate.value = null
      selectedEndDate.value = null
    }
  },
  { immediate: true },
)
</script>

<template>
  <div ref="datePickerRef" class="input-date">
    <InputText
      :model-value="displayValue"
      :input-id="inputId"
      :placeholder="placeholder"
      :disabled="disabled"
      readonly
      @click="showCalendar"
    >
      <template v-if="$slots['icon-left']" #icon-left>
        <slot name="icon-left" />
      </template>
      <template v-if="$slots['icon-right']" #icon-right>
        <slot name="icon-right" />
      </template>
    </InputText>

    <div v-if="isOpen" class="input-date__overlay">
      <div class="input-date__overlay-header">
        <Select
          :model-value="selectedMonth"
          :options="months"
          option-label="name"
          data-key="value"
          mode="single"
          @update:model-value="(option) => handleMonthChange(option as Option)"
        />

        <InputNumber
          show-buttons
          :model-value="currentYear"
          :max="3000"
          :min="1900"
          @update:model-value="(val: number) => handleYearChange(val)"
        />
      </div>

      <div class="input-date__weekdays">
        <div v-for="day in weekdays" :key="day" class="input-date__weekday">
          {{ day }}
        </div>
      </div>

      <div class="input-date__days">
        <div
          v-for="day in calendarDays"
          :key="day.date.toISOString()"
          class="input-date__day"
          :class="{
            'input-date__day_other-month': !day.isCurrentMonth,
            'input-date__day_selected': isSelected(day),
            'input-date__day_in-range': isInSelectedRange(day),
            'input-date__day_today': isToday(day),
            'input-date__day_disabled': day.isDisabled,
          }"
          @click="selectDate(day)"
        >
          {{ day.day }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.input-date {
  position: relative;
  display: inline-block;
  width: 100%;

  &__overlay {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: var(--anyboom-spacing-1);
    background: var(--anyboom-surface-primary);
    border: 1px solid var(--anyboom-border-default);
    border-radius: var(--anyboom-radius-small);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 280px;
  }

  &__overlay-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    gap: var(--anyboom-spacing-2);
    padding: var(--anyboom-spacing-3);
    border-bottom: 1px solid var(--anyboom-border-default);

    :deep(.select),
    :deep(.input-text) {
      flex: 1;
    }
  }

  &__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: var(--anyboom-spacing-2);
    border-bottom: 1px solid var(--anyboom-border-default);
  }

  &__weekday {
    @include mixins.apply-text("body-xs");

    text-align: center;
    font-weight: 600;
    color: var(--anyboom-text-secondary);
    padding: var(--anyboom-spacing-1);
  }

  &__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: var(--anyboom-spacing-2);
    gap: 2px;
  }

  &__day {
    @include mixins.apply-text("body-sm");

    text-align: center;
    padding: var(--anyboom-spacing-2) var(--anyboom-spacing-1);
    cursor: pointer;
    border-radius: var(--anyboom-radius-tiny);
    transition: all 0.2s;

    &:hover:not(.input-date__day_disabled):not(.input-date__day_selected) {
      background: var(--anyboom-surface-secondary);
    }

    &_other-month {
      color: var(--anyboom-text-tertiary);
    }

    &_selected {
      background: var(--anyboom-surface-brand);
      color: var(--anyboom-text-inverse);

      &:hover {
        background: var(--anyboom-surface-brand-hover);
      }
    }

    &_in-range {
      background: var(--anyboom-surface-secondary);
      border-radius: 0;

      &:hover:not(.input-date__day_selected) {
        background: var(--anyboom-surface-tertiary);
      }
    }

    &_today {
      background: var(--anyboom-surface-secondary);
      font-weight: 600;
    }

    &_disabled {
      color: var(--anyboom-text-disabled);
      cursor: not-allowed;
      background: var(--anyboom-surface-disabled);
      text-decoration: line-through;

      &:hover {
        background: var(--anyboom-surface-disabled);
      }
    }
  }
}
</style>
