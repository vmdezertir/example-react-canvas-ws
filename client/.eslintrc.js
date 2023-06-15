module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['import', 'react', 'react-hooks', '@typescript-eslint', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
    react: {
      version: '18',
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],
    'object-curly-spacing': [2, 'always'],
    quotes: [2, 'single', { avoidEscape: true }],
    semi: [2, 'always', { omitLastInOneLineBlock: true }],
    'no-multiple-empty-lines': 'error',
    curly: ['error', 'all'],
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    'react/no-unescaped-entities': 'off',

    // react
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/no-children-prop': 'off',
    'react/react-in-jsx-scope': 'off',

    // react-hooks plugin
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-sort-props': [
      'warn',
      {
        shorthandLast: true,
        reservedFirst: true,
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
  },
};
