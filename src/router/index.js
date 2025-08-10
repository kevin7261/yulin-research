/**
 * Vue Router 路由配置
 * 雲林縣研究案統計平台路由管理
 */

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

/**
 * 路由配置陣列
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: '雲林縣研究案統計',
    },
  },
];

/**
 * 路由器實例創建
 */
const router = createRouter({
  history: createWebHistory('/yulin-research/'),
  routes,
});

// 設置頁面標題
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '雲林縣研究案統計';
  next();
});

export default router;
