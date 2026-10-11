import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Overlay from './Overlay.vue'

const meta: Meta<typeof Overlay> = {
  title: 'Overlay/Overlay',
  component: Overlay,
}

export default meta
type Story = StoryObj<typeof Overlay>

export const Default: Story = {}
