const path = require('path')
const glob = require('glob');

const packages = glob.sync(path.join(__dirname, '..', 'packages', '*'));

const overrideRule = (rule) => {
  if (rule.test && rule.test.toString().match(/jsx/) && rule.enforce !== 'pre' && Array.isArray(rule.include)) {
    rule.include = [...rule.include, ...packages];
  }
  if (Array.isArray(rule.oneOf)) {
    rule.oneOf.forEach(overrideRule);
  }
};

module.exports = (config) => {
  config.module.rules.forEach(overrideRule);
  console.log(config)
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@react-genie-form/core': path.join(__dirname, '..', 'packages', 'core', 'src'),
    }
  }
  return config;
};