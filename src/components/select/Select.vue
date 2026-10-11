<script setup lang="ts">
import type { OptionGroup } from '@/components/select/option-group.ts'
import type { Option } from '@/components/select/option.ts'
import type { SelectMode } from '@/components/select/select-mode.ts'
import CaretDownIcon from '@iconify-vue/ph/caret-down'
import MinusIcon from '@iconify-vue/ph/minus'

import PlusIcon from '@iconify-vue/ph/plus'
import XIcon from '@iconify-vue/ph/x'
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import Badge from '@/components/badge/Badge.vue'
import Checkbox from '@/components/checkbox/Checkbox.vue'
import Chip from '@/components/chip/Chip.vue'
import InputText from '@/components/input-text/InputText.vue'
import Radio from '@/components/radio/Radio.vue'
import Spinner from '@/components/spinner/Spinner.vue'

interface Props {
  modelValue?: Option | Option[] | null
  options?: Option[] | OptionGroup[]
  mode?: SelectMode
  inputId?: string
  searchable?: boolean
  placeholder?: string
  optionLabel?: string
  optionGroupLabel?: string
  optionGroupChildren?: string
  disabled?: boolean
  error?: boolean
  dataKey?: string
  grouped?: boolean
  loading?: boolean
  selectAllGroup?: boolean
  showClear?: boolean
  showCounter?: boolean
}

interface Emits {
  'update:modelValue': [value: Option | Option[] | null]
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'multiple',
  inputId: undefined,
  searchable: false,
  placeholder: 'Выберите элементы',
  optionLabel: 'label',
  optionGroupLabel: 'name',
  optionGroupChildren: 'options',
  disabled: false,
  error: false,
  dataKey: 'value',
  grouped: false,
  loading: false,
  options: () => [],
  selectAllGroup: false,
  showClear: false,
  showCounter: false,
})

const emit = defineEmits<Emits>()

const selectedItems = computed({
  get() {
    const value = props.modelValue ?? null

    if (props.mode === 'multiple') {
      return Array.isArray(value) ? value : []
    }
    else {
      return Array.isArray(value) ? null : value
    }
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const isOpen = ref(false)
const searchQuery = ref('')
const visibleGroups = ref<string[]>([])
const dropdownRef = ref<HTMLElement | null>(null)

const autoId = useId()
const fieldId = computed(() => props.inputId ?? autoId)

defineExpose({
  inputId: fieldId,
})

if (props.grouped) {
  visibleGroups.value = (props.options as OptionGroup[]).map(group =>
    getGroupLabel(group),
  )
}

/**
 * Получает текст для отображения опции.
 * @param {Option} option - Опция.
 * @returns {string} Текст для отображения.
 */
function getOptionLabel(option: Option): string {
  return String(
    // eslint-disable-next-line ts/no-use-before-define -- объявлен ниже в setup-скрипте, вызов происходит после инициализации
    flatOptions.value.find(
      flatOption => flatOption[props.dataKey] === option[props.dataKey],
    )?.[props.optionLabel]
    || option[props.optionLabel]
    || option.value,
  )
}

/**
 * Получает название группы.
 * @param {OptionGroup} group - Группа опций.
 * @returns {string} Название группы.
 */
function getGroupLabel(group: OptionGroup): string {
  return String(group[props.optionGroupLabel] || group.name)
}

/**
 * Получает дочерние элементы группы.
 * @param {OptionGroup} group - Группа опций.
 * @returns {Option[]} Массив опций группы.
 */
function getGroupChildren(group: OptionGroup): Option[] {
  return (group[props.optionGroupChildren] as Option[]) || []
}

/**
 * Получает уникальный ключ элемента.
 * @param {Option} item - Элемент.
 * @returns {string | number} Уникальный ключ.
 */
function getItemKey(item: Option): string | number {
  return props.dataKey
    ? (item[props.dataKey] as string | number)
    : JSON.stringify(item)
}

/**
 * Обработчик клика вне компонента.
 * @param {MouseEvent} event - Событие клика.
 */
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

/**
 * Плоский список всех опций (для негруппированного режима).
 */
const flatOptions = computed<Option[]>(() => {
  if (props.grouped) {
    return (props.options as OptionGroup[]).flatMap(group =>
      getGroupChildren(group),
    )
  }
  return props.options as Option[]
})

/**
 * Отфильтрованные опции (для негруппированного режима).
 */
const filteredOptions = computed(() => {
  if (!searchQuery.value)
    return flatOptions.value
  return flatOptions.value.filter(option =>
    getOptionLabel(option)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase()),
  )
})

/**
 * Отфильтрованные группы (для группированного режима).
 */
const filteredGroups = computed(() => {
  if (!props.grouped) {
    return []
  }

  if (!searchQuery.value) {
    return props.options as OptionGroup[]
  }

  return (props.options as OptionGroup[])
    .map(group => ({
      ...group,
      [props.optionGroupChildren]: getGroupChildren(group).filter(option =>
        getOptionLabel(option)
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()),
      ),
    }))
    .filter(group => getGroupChildren(group).length > 0)
})

/**
 * Переключает открытие/закрытие dropdown.
 */
function toggleDropdown() {
  if (props.disabled || props.loading) {
    return
  }

  isOpen.value = !isOpen.value

  if (isOpen.value) {
    searchQuery.value = ''
  }
}

/**
 * Проверяет, открыта ли группа.
 * @param {string} groupName - Название группы.
 * @returns {boolean} Видимость группы.
 */
function isGroupVisible(groupName: string): boolean {
  return visibleGroups.value.includes(groupName)
}

/**
 * Переключает видимость группы.
 * @param {string} groupName - Название группы.
 */
function toggleGroup(groupName: string) {
  if (isGroupVisible(groupName)) {
    visibleGroups.value = visibleGroups.value.filter(
      name => name !== groupName,
    )
  }
  else {
    visibleGroups.value = [...visibleGroups.value, groupName]
  }
}

/**
 * Проверяет, выбран ли элемент.
 * @param {Option} option - Опция для проверки.
 * @returns {boolean} Выбрана ли опция.
 */
function isSelected(option: Option): boolean {
  const optionKey = getItemKey(option)

  if (props.mode === 'multiple') {
    const selected = selectedItems.value as Option[]
    return selected.some(item => getItemKey(item) === optionKey)
  }
  else {
    const selected = selectedItems.value as Option | null
    return selected ? getItemKey(selected) === optionKey : false
  }
}

/**
 * Проверяет, все ли элементы группы выбраны (только для multiple).
 * @param {OptionGroup} group - Группа для проверки.
 * @returns {boolean} Все ли элементы выбраны.
 */
function isAllGroupSelected(group: OptionGroup): boolean {
  if (props.mode !== 'multiple' || !props.grouped || !props.selectAllGroup)
    return false
  const groupOptions = getGroupChildren(group)
  return (
    groupOptions.length > 0
    && groupOptions.every(option => isSelected(option))
  )
}

/**
 * Переключает выбор всей группы (только для multiple).
 * @param {OptionGroup} group - Группа для переключения.
 */
function toggleGroupSelection(group: OptionGroup) {
  if (
    props.disabled
    || props.loading
    || props.mode !== 'multiple'
    || !props.selectAllGroup
  ) {
    return
  }

  const groupOptions = getGroupChildren(group)
  const allSelected = isAllGroupSelected(group)
  const selected = selectedItems.value as Option[]

  if (allSelected) {
    selectedItems.value = selected.filter(
      item =>
        !groupOptions.some(option => getItemKey(option) === getItemKey(item)),
    )
  }
  else {
    const newItems = groupOptions.filter(option => !isSelected(option))
    selectedItems.value = [...selected, ...newItems]
  }
}

/**
 * Переключает выбор элемента.
 * @param {Option} option - Опция для переключения.
 * @param {MouseEvent} event - Событие клика.
 */
function toggleOption(option: Option, event: MouseEvent) {
  event.stopPropagation()

  if (props.disabled || props.loading) {
    return
  }

  if (props.mode === 'multiple') {
    const selected = selectedItems.value as Option[]

    if (isSelected(option)) {
      selectedItems.value = selected.filter(
        item => getItemKey(item) !== getItemKey(option),
      )
    }
    else {
      selectedItems.value = [...selected, option]
    }
  }
  else {
    selectedItems.value = isSelected(option) ? null : option
    isOpen.value = false
  }
}

/**
 * Удаляет выбранный элемент (только для multiple).
 * @param {Option} item - Элемент для удаления.
 */
function deselectItem(item: Option) {
  if (props.disabled || props.loading || props.mode !== 'multiple') {
    return
  }

  const selected = selectedItems.value as Option[]
  selectedItems.value = selected.filter(
    i => getItemKey(i) !== getItemKey(item),
  )
}

/**
 * Удаляет все выбранные элементы (только для multiple).
 */
function removeItems() {
  if (props.mode !== 'multiple') {
    selectedItems.value = null
  }
  else {
    selectedItems.value = []
  }
}

/**
 * Текст для отображения выбранных элементов.
 */
const selectedLabels = computed(() => {
  if (props.mode === 'multiple') {
    const selected = selectedItems.value as Option[]
    return selected?.map(item => getOptionLabel(item)).join(', ')
  }
  else {
    const selected = selectedItems.value as Option | null
    return selected ? getOptionLabel(selected) : ''
  }
})

/**
 * Отображать ли счетчик (только для multiple).
 */
const showCounterVisible = computed(() => {
  return props.mode === 'multiple' && props.showCounter
})

/**
 * Отображать ли кнопку очистки.
 */
const showClearVisible = computed(() => {
  if (props.mode === 'multiple') {
    const selected = selectedItems.value as Option[]
    return props.showClear && selected?.length > 0
  }
  else {
    return props.showClear && selectedItems.value !== null
  }
})

/**
 * Есть ли выбранные элементы.
 */
const hasSelectedItems = computed(() => {
  if (props.mode === 'multiple') {
    const selected = selectedItems.value as Option[]
    return selected?.length > 0
  }
  else {
    return selectedItems.value !== null
  }
})
</script>

<template>
  <div
    ref="dropdownRef"
    class="select"
    :class="{
      select_disabled: disabled,
      select_error: error,
      select_loading: loading,
      select_open: isOpen,
      select_single: mode === 'single',
      select_multiple: mode === 'multiple',
    }"
  >
    <button
      :id="fieldId"
      type="button"
      class="select__header"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleDropdown"
    >
      <template v-if="loading">
        <span class="select__loading-text">Загрузка...</span>
      </template>
      <template v-else>
        <span v-if="!hasSelectedItems" class="select__placeholder">
          {{ placeholder }}
        </span>
        <span v-else class="select__selected-labels">
          {{ selectedLabels }}
        </span>
      </template>

      <div class="select__icons-wrapper">
        <Badge v-if="showCounterVisible" severity="secondary">
          {{ (selectedItems as Option[]).length }}
        </Badge>
        <span
          v-if="showClearVisible"
          class="select__clear-icon"
          @click.stop="removeItems"
        >
          <XIcon height="1em" />
        </span>
        <span
          class="select__dropdown-icon"
          :class="{
            'select__dropdown-icon_open': isOpen,
          }"
        >
          <template v-if="loading">
            <Spinner />
          </template>
          <template v-else>
            <CaretDownIcon height="1em" />
          </template>
        </span>
      </div>
    </button>

    <div v-if="isOpen && !disabled && !loading" class="select__dropdown">
      <div v-if="searchable" class="select__search">
        <InputText
          v-model="searchQuery"
          placeholder="Поиск..."
          size="small"
          :disabled="disabled"
          @click.stop
        />
      </div>

      <!-- Превью выбранных элементов только для мультиселекта -->
      <div
        v-if="mode === 'multiple' && hasSelectedItems"
        class="select__selected-preview"
      >
        <Chip
          v-for="item in selectedItems as Option[]"
          :key="getItemKey(item)"
          removable
          @remove.stop.prevent="deselectItem(item)"
        >
          {{ getOptionLabel(item) }}
        </Chip>
      </div>

      <div class="select__options">
        <!-- Режим с группами -->
        <template v-if="grouped">
          <div
            v-for="(group, groupIndex) in filteredGroups"
            :key="groupIndex"
            class="select__group"
          >
            <div
              class="select__group-header"
              @click="toggleGroup(getGroupLabel(group))"
            >
              <span class="select__group-name">
                {{ getGroupLabel(group) }}
              </span>
              <div class="select__group-controls">
                <Checkbox
                  v-if="mode === 'multiple' && selectAllGroup"
                  :disabled="disabled"
                  :model-value="isAllGroupSelected(group)"
                  @update:model-value="toggleGroupSelection(group)"
                  @click.stop
                />
                <PlusIcon
                  v-show="!isGroupVisible(getGroupLabel(group))"
                  class="select__group-toggle"
                  height="1em"
                />
                <MinusIcon
                  v-show="isGroupVisible(getGroupLabel(group))"
                  class="select__group-toggle"
                  height="1em"
                />
              </div>
            </div>

            <div
              v-if="isGroupVisible(getGroupLabel(group))"
              class="select__group-options"
            >
              <div
                v-for="(option, optionIndex) in getGroupChildren(group)"
                :key="optionIndex"
                class="select__option"
                :class="{
                  select__option_selected: isSelected(option),
                  select__option_disabled: disabled,
                }"
                @click="toggleOption(option, $event)"
              >
                <!-- Чекбокс отображается только в мультиселекте -->
                <Checkbox
                  v-if="mode === 'multiple'"
                  class="select__checkbox"
                  :disabled="disabled"
                  :model-value="isSelected(option)"
                  :label="getOptionLabel(option)"
                  binary
                  readonly
                  @click.prevent
                />

                <!-- Радиокнопка для одиночного выбора -->
                <Radio
                  v-else
                  :model-value="!isSelected(option)"
                  :label="getOptionLabel(option)"
                  @click.prevent
                />
              </div>
            </div>
          </div>
        </template>

        <!-- Обычный режим (без групп) -->
        <template v-else>
          <div
            v-for="(option, optionIndex) in filteredOptions"
            :key="optionIndex"
            class="select__option"
            :class="{
              select__option_selected: isSelected(option),
              select__option_disabled: disabled,
            }"
            @click="toggleOption(option, $event)"
          >
            <!-- Чекбокс отображается только в мультиселекте -->
            <Checkbox
              v-if="mode === 'multiple'"
              class="select__checkbox"
              :disabled="disabled"
              :model-value="isSelected(option)"
              :label="getOptionLabel(option)"
              binary
              readonly
              @click.prevent
            />

            <!-- Радиокнопка для одиночного выбора -->
            <Radio
              v-else
              :model-value="!isSelected(option)"
              :label="getOptionLabel(option)"
              @click.prevent
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/mixins";

.select {
  $self: &;

  position: relative;
  width: 100%;
  max-width: 400px;

  &__icons-wrapper {
    display: flex;
    gap: var(--anyboom-spacing-2);
    align-items: center;
  }

  &__header {
    width: 100%;
    font: inherit;
    height: 100%;
    text-align: left;
    border: 1px solid var(--anyboom-input-primary-border);
    border-radius: var(--anyboom-radius-small);
    padding: var(--anyboom-spacing-3) var(--anyboom-spacing-4);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--anyboom-input-primary-background);

    &:focus-visible {
      outline: none;
      border-color: var(--anyboom-input-primary-border-focus);
    }

    #{$self}_error & {
      border: 1px solid var(--anyboom-input-danger-border);

      &:hover {
        border: 1px solid var(--anyboom-input-danger-border-hover);
      }

      &:focus {
        border-color: var(--anyboom-input-danger-border-focus);
        background: var(--anyboom-input-danger-background);
      }
    }

    #{$self}_disabled & {
      cursor: not-allowed;
      background-color: var(--anyboom-input-disabled-background);
      border-color: var(--anyboom-input-disabled-border);
    }

    &:hover {
      border-color: var(--anyboom-input-primary-border-hover);
    }
  }

  &__placeholder {
    color: var(--anyboom-input-primary-placeholder);

    @include mixins.apply-text("input-md");
  }

  &__selected-labels {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
    color: var(--anyboom-input-primary-text);

    @include mixins.apply-text("input-md");
  }

  &__loading-text {
    color: var(--anyboom-input-disabled-text);

    @include mixins.apply-text("input-md");
  }

  &__clear-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--anyboom-icon-neutral-default);

    @include mixins.apply-text("body-base");

    &:hover {
      color: var(--anyboom-icon-neutral-hover);
    }
  }

  &__dropdown-icon {
    display: flex;
    align-items: center;
    color: var(--anyboom-icon-neutral-default);

    @include mixins.apply-text("body-base");

    &:hover {
      color: var(--anyboom-icon-neutral-hover);
    }

    &_open {
      transform: rotate(-180deg);
    }
  }

  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid var(--anyboom-select-menu-border);
    border-radius: var(--anyboom-radius-small);
    background: var(--anyboom-select-menu-background);
    z-index: 1000;
    margin-top: var(--anyboom-spacing-1);
    max-height: 300px;
    overflow-y: auto;
  }

  &__search {
    position: sticky;
    top: 0;
    background: var(--anyboom-select-menu-background);
    padding: var(--anyboom-spacing-2);
    z-index: 1000;
    border-bottom: 1px solid var(--anyboom-select-menu-border);
  }

  &__selected-preview {
    display: flex;
    flex-wrap: wrap;
    gap: var(--anyboom-spacing-1);
    padding: var(--anyboom-spacing-2);
    border-bottom: 1px solid var(--anyboom-input-primary-border);
    max-height: 100px;
    overflow-y: auto;
  }

  &__remove-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: var(--anyboom-spacing-1);
    color: var(--anyboom-icon-neutral-default);

    &:hover {
      color: var(--anyboom-icon-neutral-hover);
    }

    &_disabled {
      cursor: not-allowed;
      color: var(--anyboom-icon-disabled);
    }
  }

  &__options {
    padding: var(--anyboom-spacing-2);
  }

  &__group {
    margin-bottom: var(--anyboom-spacing-2);
  }

  &__group-header {
    background: var(--anyboom-surface-secondary);
    padding: var(--anyboom-spacing-2);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--anyboom-radius-small);
    color: var(--anyboom-text-secondary);
  }

  &__group-controls {
    display: flex;
    align-items: center;
    gap: var(--anyboom-spacing-1);
  }

  &__group-toggle {
    color: var(--anyboom-icon-neutral-default);
  }

  &__group-options {
    margin-top: var(--anyboom-spacing-1);
    padding-left: var(--anyboom-spacing-2);
  }

  &__option {
    padding: var(--anyboom-spacing-2);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--anyboom-spacing-2);
    border-radius: var(--anyboom-radius-small);

    &:hover {
      background: var(--anyboom-surface-secondary);
    }

    &_selected {
      background: rgba(59, 130, 246, 0.1);
    }

    &_disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &_single {
    #{$self}__selected-labels {
      white-space: normal;
      word-break: break-word;
    }
  }
}
</style>
