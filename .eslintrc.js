module.exports = {
  root: true,
  env: {},
  parserOptions: {
    parser: 'babel-eslint',
  },
  root: true,
  env: {
    browser: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off"
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
        extensions: ['.ts'],
      },
    },
  },
}