<script setup lang="ts">
import type { Tab } from '@/components/tabs/tab.ts'

import { ref, watch } from 'vue'

interface Props {
  modelValue?: string | number
  tabs: Tab[]
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

interface Emits {
  'update:modelValue': [value: string | number]
}

const activeTab = ref(props.modelValue || props.tabs[0]?.id || '')

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined && newVal !== activeTab.value) {
      activeTab.value = newVal
    }
  },
)

function setActiveTab(tabId: string | number) {
  const tab = props.tabs.find((tab: Tab) => tab.id === tabId)

  if (activeTab.value !== tabId && tab && !tab.disabled) {
    activeTab.value = tabId

    emit('update:modelValue', tabId)
  }
}
</script>

<template>
  <div class="anyboom-tabs">
    <div class="anyboom-tabs__header">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="anyboom-tabs__trigger"
        :class="{
          'anyboom-tabs__trigger_active': activeTab === tab.id,
        }"
        :disabled="tab.disabled"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="anyboom-tabs__content">
      <div
        v-for="tab in tabs"
        v-show="activeTab === tab.id"
        :key="tab.id"
        class="anyboom-tabs__panel"
      >
        <slot :name="tab.id">
          {{ tab.content }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/mixins";

.anyboom-tabs {
  &__header {
    display: flex;
    gap: var(--anyboom-spacing-2);
    border-bottom: 1px solid var(--anyboom-tabs-list-border);
  }

  &__trigger {
    padding: var(--anyboom-spacing-3);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    color: var(--anyboom-tabs-text);
    cursor: pointer;
    white-space: nowrap;

    @include mixins.apply-text("body-sm-medium");

    &_active {
      color: var(--anyboom-tabs-text-active);
      border-bottom-color: var(--anyboom-tabs-border-active);
    }
  }
}
</style>
