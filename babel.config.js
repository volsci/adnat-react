module.exports = {
  env: {
    development: {
      presets: [
        '@babel/env',
        '@babel/react',
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
      ],
    },
    test: {
      presets: [
        '@babel/env',
        '@babel/react',
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
      ],
    }
  }
};