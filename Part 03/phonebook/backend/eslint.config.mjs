import globals from 'globals';
import pluginJs from '@eslint/js';


export default [
  {
    ignores: ['dist', 'node_modules']
  },
  {
    rules: {
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
          'error', 'always'
      ],
      'arrow-spacing': [
          'error', { 'before': true, 'after': true }
      ],
      'no-unused-vars': [
        'error', { 'argsIgnorePattern': '^_' }
      ],
      'no-console': 0
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
];