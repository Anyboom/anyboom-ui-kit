<script setup lang="ts">
interface Props {
  image?: string
  label?: string
  size?: 'xsmall' | 'small' | 'normal' | 'large' | 'xlarge' | 'xxlarge'
}

withDefaults(defineProps<Props>(), { size: 'normal' })
</script>

<template>
  <div class="avatar" :class="[`avatar_size_${size}`]">
    <img v-if="image" :src="image" class="avatar__image">
    <span v-else-if="label" class="avatar__label">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/mixins";

.avatar {
  $this: &;

  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;

  &:has(#{$this}__image) {
    border: 1px solid var(--anyboom-avatar-border);
  }

  &:has(#{$this}__label) {
    border: 1px solid var(--anyboom-avatar-icon-border);
  }

  &_size {
    &_xsmall {
      width: var(--anyboom-spacing-6);

      #{$this}__label {
        @include mixins.apply-text("body-xs-medium");
      }
    }
    &_small {
      width: var(--anyboom-spacing-8);

      #{$this}__label {
        @include mixins.apply-text("body-sm-medium");
      }
    }
    &_normal {
      width: var(--anyboom-spacing-10);

      #{$this}__label {
        @include mixins.apply-text("body-lg-medium");
      }
    }
    &_large {
      width: var(--anyboom-spacing-12);

      #{$this}__label {
        @include mixins.apply-text("body-xl-medium");
      }
    }
    &_xlarge {
      width: var(--anyboom-spacing-14);

      #{$this}__label {
        @include mixins.apply-text("body-xl-medium");
      }
    }
    &_xxlarge {
      width: var(--anyboom-spacing-16);

      #{$this}__label {
        @include mixins.apply-text("body-xl-medium");
      }
    }
  }

  &__image {
    width: 100%;
    height: 100%;
  }

  &__label {
    color: var(--anyboom-avatar-text);
  }
}
</style>
