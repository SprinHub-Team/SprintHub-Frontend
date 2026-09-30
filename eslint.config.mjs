import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'error',

      'prefer-const': 'off',
      'no-unused-vars': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
      'no-empty': 'off',
      'no-irregular-whitespace': 'off',
      'no-case-declarations': 'off',
      'no-fallthrough': 'off',
      'no-mixed-spaces-and-tabs': 'off',
      'no-redeclare': 'off',
      'no-undef': 'off',
      'no-unreachable': 'off',
      'no-useless-escape': 'off',
    },
  },
);
