import type { Preview } from '@storybook/vue3-vite'

import '@/styles/index.scss'
import '@/styles/reset.scss'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      name: 'Anyboom UI Kit',
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Form',
          'Button',
          'Data',
          'Panel',
          'Overlay',
          'File',
          'Menu',
          'Messages',
          'Misc',
        ],
      },
    },
  },
}

export default preview
