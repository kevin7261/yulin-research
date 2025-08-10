const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/yulin-research/',
  transpileDependencies: true,
  devServer: {
    port: 8080,
    host: 'localhost',
  },
});
