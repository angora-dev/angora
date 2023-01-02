module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-angora`
  extends: ['angora'],
  settings: {
    next: {
      rootDir: ['packages/*/'],
    },
  },
};
