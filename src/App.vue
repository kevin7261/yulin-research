<script>
import { ref } from 'vue';

export default {
  name: 'App',
  setup() {
    return {};
  },
};
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* 基本樣式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>