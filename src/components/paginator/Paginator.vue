<script setup lang="ts">
import CaretDoubleLeftIcon from '@iconify-vue/ph/caret-double-left'
import CaretDoubleRightIcon from '@iconify-vue/ph/caret-double-right'
import CaretLeftIcon from '@iconify-vue/ph/caret-left'
import CaretRightIcon from '@iconify-vue/ph/caret-right'
import { computed } from 'vue'

interface Props {
  currentPage: number
  itemsPerPage?: number
  totalItems: number
}

const { currentPage, totalItems, itemsPerPage = 10 } = defineProps<Props>()

const emit = defineEmits(['page-changed'])

const totalPages = computed(() => Math.ceil(totalItems / itemsPerPage))

const visiblePagesCount = 5

const visiblePages = computed<number[]>(() => {
  const pages = []
  const halfVisible = Math.floor(visiblePagesCount / 2)

  let startPage = Math.max(1, currentPage - halfVisible)
  const endPage = Math.min(totalPages.value, startPage + visiblePagesCount - 1)

  if (endPage - startPage + 1 < visiblePagesCount) {
    startPage = Math.max(1, endPage - visiblePagesCount + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

const showFirstPage = computed(() => {
  const item = visiblePages.value[0]

  if (item) {
    return item > 1
  }

  return false
})

const showLastPage = computed(() => {
  const item = visiblePages.value[visiblePages.value.length - 1]

  if (item) {
    return item < totalPages.value
  }

  return false
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== currentPage) {
    // eslint-disable-next-line vue/custom-event-name-casing -- публичное API события в kebab-case
    emit('page-changed', page)
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" class="app-paginator">
    <ul class="app-paginator__list">
      <li v-if="showFirstPage">
        <button class="app-paginator__button" @click="goToPage(1)">
          <CaretDoubleLeftIcon height="1em" />
        </button>
      </li>

      <li>
        <button
          class="app-paginator__button"
          :class="{ disabled: currentPage === 1 }"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <CaretLeftIcon height="1em" />
        </button>
      </li>

      <li v-for="page in visiblePages" :key="page">
        <button
          class="app-paginator__button"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>

      <li>
        <button
          class="app-paginator__button"
          :class="{ disabled: currentPage === totalPages }"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <CaretRightIcon height="1em" />
        </button>
      </li>

      <li v-if="showLastPage">
        <button class="app-paginator__button" @click="goToPage(totalPages)">
          <CaretDoubleRightIcon height="1em" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.app-paginator {
  margin: var(--anyboom-spacing-4) 0;

  &__list {
    display: flex;
    width: fit-content;

    border-radius: var(--anyboom-radius-small);
    overflow: hidden;
  }

  &__button {
    padding: var(--anyboom-spacing-2) var(--anyboom-spacing-4);
    background-color: white;
    color: var(--anyboom-input-primary-text);
    cursor: pointer;

    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;

    &.active {
      background-color: var(--anyboom-input-read-only-background);
      color: var(--anyboom-input-primary-text);
    }

    &.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:hover:not(.disabled) {
      background-color: var(--anyboom-input-read-only-background);
    }
  }
}
</style>
