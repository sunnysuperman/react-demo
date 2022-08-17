module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 120,
  proseWrap: 'never',
  semi: true,
  tabWidth: 2,
  useTabs: false,
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  bracketSpacing: true,
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'strict',
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
  ],
};
