module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'space-before-function-paren': 'off',
    camelcase: 'off',
    'object-curly-spacing': 'off',
    'no-unused-vars': 'off',
    'multiline-ternary': 'off'
  }
}
