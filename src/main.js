/**
 * 雲林縣研究案統計平台
 * 主要入口文件
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 導入 Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// 導入 Leaflet CSS
import 'leaflet/dist/leaflet.css';

// 導入 Font Awesome CSS（本地套件，避免 CDN/SRI 問題）
import '@fortawesome/fontawesome-free/css/all.min.css';

// 創建 Vue 應用
const app = createApp(App);

// 創建並註冊 Pinia
const pinia = createPinia();
app.use(pinia);

// 註冊路由
app.use(router);

// 掛載應用
app.mount('#app');

// eslint-disable-next-line no-console
console.log('雲林縣研究案統計平台已啟動');
