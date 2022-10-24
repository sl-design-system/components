const config = require('../../.stylelintrc.cjs');

// Disable this rule so empty themes do not fail linting
config.rules['block-no-empty'] = null;

module.exports = config;
