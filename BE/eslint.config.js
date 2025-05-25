const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.eslintrc.js', 'eslint.config.js']
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2020
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'prettier': prettierPlugin
    },
    rules: {
      // TypeScript specific rules for NestJS - slightly relaxed to accommodate framework patterns
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_' 
      }],
      
      // Turn off some rules that conflict with NestJS patterns
      'no-unused-vars': 'off', // Let TypeScript handle this
      'no-useless-constructor': 'off', // NestJS uses empty constructors for DI
      
      // General code quality rules
      'max-len': ['error', { 'code': 100, 'ignoreUrls': true, 'ignoreStrings': true, 'ignoreTemplateLiterals': true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'object-shorthand': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'prefer-template': 'error',
      'spaced-comment': ['error', 'always'],
      
      // Prettier integration
      'prettier/prettier': ['error', {
        'singleQuote': true,
        'trailingComma': 'all',
        'printWidth': 100,
        'tabWidth': 2,
        'semi': true,
        'bracketSpacing': true,
        'arrowParens': 'avoid',
        'endOfLine': 'lf'
      }]
    }
  },
  prettierConfig
];