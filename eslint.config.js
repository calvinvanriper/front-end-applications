import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        console: 'readonly',
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: 'off',
      'no-unused-vars': 'warn',
    },
  },
];
