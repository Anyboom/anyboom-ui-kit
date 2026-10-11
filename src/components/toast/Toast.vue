<script setup lang="ts">
import type { Toast } from '@/components/toast/toast.ts'
import CheckCircleFillIcon from '@iconify-vue/ph/check-circle-fill'
import InfoFillIcon from '@iconify-vue/ph/info-fill'
import WarningDiamondFillIcon from '@iconify-vue/ph/warning-diamond-fill'
import WarningFillIcon from '@iconify-vue/ph/warning-fill'
import XIcon from '@iconify-vue/ph/x'

import { computed, onMounted, onUnmounted } from 'vue'
import Button from '@/components/button/Button.vue'

const props = withDefaults(defineProps<Toast>(), {
  severity: 'info',
  duration: 3000,
  closable: true,
  showIcon: true,
})

const emit = defineEmits<{
  close: [id?: string | number]
}>()

let timeoutId: ReturnType<typeof setTimeout> | null = null

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleFillIcon,
    primary: InfoFillIcon,
    secondary: InfoFillIcon,
    contrast: InfoFillIcon,
    info: InfoFillIcon,
    warn: WarningFillIcon,
    danger: WarningDiamondFillIcon,
  }

  return icons[props.severity] || InfoFillIcon
})

function onClose() {
  clearAutoClose()
  emit('close', props.id)
}

function startAutoClose() {
  if (props.duration && props.duration > 0) {
    timeoutId = setTimeout(onClose, props.duration)
  }
}

function clearAutoClose() {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

onMounted(() => {
  startAutoClose()
})

onUnmounted(() => {
  clearAutoClose()
})

defineExpose({
  close: onClose,
})
</script>

<template>
  <div class="toast" :class="[`toast_severity_${severity}`]">
    <div v-if="showIcon">
      <component :is="iconComponent" class="toast__icon" />
    </div>

    <div class="toast__body">
      <div v-if="title" class="toast__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="toast__message">
        <slot>{{ message }}</slot>
      </div>
    </div>

    <Button v-if="closable" variant="text" icon-only aria-label="Закрыть" class="toast__close" @click="onClose">
      <XIcon height="1em" />
    </Button>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins";

.toast {
  $this: &;

  position: relative;
  display: flex;
  gap: var(--anyboom-spacing-3);
  border-radius: var(--anyboom-radius-large);
  padding: var(--anyboom-spacing-5);
  min-width: 300px;
  max-width: 450px;

  &_severity {
    &_success {
      background: var(--anyboom-toast-success-background);
      border: 1px solid var(--anyboom-toast-success-border);

      #{$this}__icon {
        color: var(--anyboom-toast-success-icon);
      }

      #{$this}__title {
        color: var(--anyboom-toast-success-title);
      }

      #{$this}__message {
        color: var(--anyboom-toast-success-text);
      }

      #{$this}__close {
        color: var(--anyboom-toast-success-close-icon);
      }
    }
    &_primary {
      background: var(--anyboom-toast-primary-background);
      border: 1px solid var(--anyboom-toast-primary-border);

      #{$this}__icon {
        color: var(--anyboom-toast-primary-icon);
      }

      #{$this}__title {
        color: var(--anyboom-toast-primary-title);
      }

      #{$this}__message {
        color: var(--anyboom-toast-primary-text);
      }

      #{$this}__close {
        color: var(--anyboom-toast-primary-close-icon);
      }
    }
    &_info {
      background: var(--anyboom-toast-info-background);
      border: 1px solid var(--anyboom-toast-info-border);

      #{$this}__icon {
        color: var(--anyboom-toast-info-icon);
      }

      #{$this}__title {
        color: var(--anyboom-toast-info-title);
      }

      #{$this}__message {
        color: var(--anyboom-toast-info-text);
      }

      #{$this}__close {
        color: var(--anyboom-toast-info-close-icon);
      }
    }
    &_secondary {
      background: var(--anyboom-toast-secondary-background);
      border: 1px solid var(--anyboom-toast-secondary-border);

      #{$this}__icon {
        color: var(--anyboom-toast-secondary-icon);
      }

      #{$this}__title {
        color: var(--anyboom-toast-secondary-title);
      }

      #{$this}__message {
        color: var(--anyboom-toast-secondary-text);
      }

      #{$this}__close {
        color: var(--anyboom-toast-secondary-close-icon);
      }
    }
    &_contrast {
      background: var(--anyboom-toast-contrast-background);
      border: 1px solid var(--anyboom-toast-contrast-border);

      #{$this}__icon {
        color: var(--anyboom-toast-contrast-icon);
      }

      #{$this}__title {
        color: var(--anyboom-toast-contrast-title);
      }

      #{$this}__message {
        color: var(--anyboom-toast-contrast-text);
      }

      #{$this}__close {
        color: var(--anyboom-toast-contrast-close-icon);
      }
    }
    &_warn {
      background: var(--anyboom-toast-warn-background);
      border: 1px solid var(--anyboom-toast-warn-border);

      #{$this}__icon {
        color: var(--anyboom-toast-warn-icon);
      }

      #{$this}__title {
        color: var(--anyboom-toast-warn-title);
      }

      #{$this}__message {
        color: var(--anyboom-toast-warn-text);
      }

      #{$this}__close {
        color: var(--anyboom-toast-warn-close-icon);
      }
    }
    &_danger {
      background: var(--anyboom-toast-danger-background);
      border: 1px solid var(--anyboom-toast-danger-border);

      #{$this}__icon {
        color: var(--anyboom-toast-danger-icon);
      }

      #{$this}__title {
        color: var(--anyboom-toast-danger-title);
      }

      #{$this}__message {
        color: var(--anyboom-toast-danger-text);
      }

      #{$this}__close {
        color: var(--anyboom-toast-danger-close-icon);
      }
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--anyboom-spacing-1);
  }

  &__title {
    @include mixins.apply-text("heading-h4");
  }

  &__message {
    @include mixins.apply-text("body-sm");
  }

  &__close {
    flex-shrink: 1;
  }
}
</style>
