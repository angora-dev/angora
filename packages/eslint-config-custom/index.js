module.exports = {
  plugins: ['prettier', 'simple-import-sort'],
  extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^react', '^@?\\w'],
          // Global alias
          ['^@angora'],
          // Anything that does not start with a dot.
          ['^[^.\\u0000]'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
          // Side effect imports.
          ['^\\u0000'],
        ],
      },
    ],
  },
};
