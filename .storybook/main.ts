import { defineMain } from '@storybook/react-vite/node'

export default defineMain({
  framework: { name: '@storybook/react-vite', options: {} },
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  docs: {},
  core: { disableTelemetry: true },
})
