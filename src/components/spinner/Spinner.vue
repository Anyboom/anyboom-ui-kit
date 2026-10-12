<!-- Spinner.vue -->
<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large'
  speed?: 'slow' | 'normal' | 'fast'
  thickness?: 'thin' | 'medium' | 'thick'
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  speed: 'normal',
  thickness: 'medium',
})
</script>

<template>
  <div
    class="anyboom-spinner"
    :class="[
      `anyboom-spinner_speed_${speed}`,
      `anyboom-spinner_thickness_${thickness}`,
      `anyboom-spinner_size_${size}`,
    ]"
  />
</template>

<style lang="scss">
.anyboom-spinner {
  display: inline-block;
  border-style: solid;
  border-color: var(--anyboom-spinner-background);
  border-radius: 50%;
  border-top-color: var(--anyboom-spinner-border);
  animation: spin 1s ease-in-out infinite;
  aspect-ratio: 1;

  &_speed {
    &_slow {
      animation-duration: 2s;
    }
    &_normal {
      animation-duration: 1s;
    }
    &_fast {
      animation-duration: 0.5s;
    }
  }

  &_size {
    &_small {
      width: 12px;
    }

    &_medium {
      width: 16px;
    }

    &_large {
      width: 24px;
    }
  }

  &_thickness {
    &_thin {
      border-width: 1.5px;
    }
    &_medium {
      border-width: 2px;
    }
    &_thick {
      border-width: 3px;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
