const webpackFinal = require('./webpack.final');

module.exports = {
  stories: [
    '../packages/**/src/**/*.stories.{js,jsx}',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/preset-typescript',
  ],
  webpackFinal,
};