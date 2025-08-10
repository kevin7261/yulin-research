/**
 * 雲林縣研究案統計平台
 * 主要入口文件
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// 創建 Vue 應用
const app = createApp(App);

// 註冊路由
app.use(router);

// 掛載應用
app.mount('#app');

console.log('雲林縣研究案統計平台已啟動');