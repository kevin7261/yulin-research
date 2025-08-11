<script>
  import { useRouter, useRoute } from 'vue-router';
  import { computed } from 'vue';

  export default {
    name: 'HomeView',
    setup() {
      const router = useRouter();
      const route = useRoute();

      // 根據當前路由判斷活躍的 tab
      const activeTab = computed(() => {
        if (route.path.includes('case-count')) return 'count';
        if (route.path.includes('budget-analysis')) return 'amount';
        return 'count'; // 預設
      });

      const switchTab = (tab) => {
        if (tab === 'count') {
          router.push('/case-count');
        } else if (tab === 'amount') {
          router.push('/budget-analysis');
        }
      };

      return {
        activeTab,
        switchTab,
      };
    },
  };
</script>

<template>
  <div class="home-container my-bgcolor-gray-50">
    <!-- 標題 -->
    <div class="header-section my-bgcolor-white border-bottom">
      <div class="w-100 px-3">
        <h1 class="my-title-xl-black text-center py-4 mb-0">雲林縣研究案統計</h1>
      </div>
    </div>

    <!-- 分頁導航 -->
    <div class="tabs-section my-bgcolor-white border-bottom">
      <div class="w-100 px-3 d-flex justify-content-center">
        <ul class="nav nav-tabs border-0 pt-3">
          <li class="nav-item">
            <button
              class="nav-link my-title-sm-gray border-0"
              :class="{ 'active my-bgcolor-blue my-color-white': activeTab === 'count' }"
              @click="switchTab('count')"
            >
              各單位委托案件數
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link my-title-sm-gray border-0"
              :class="{ 'active my-bgcolor-blue my-color-white': activeTab === 'amount' }"
              @click="switchTab('amount')"
            >
              平均金額
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- 路由內容區域 -->
    <div class="content-section flex-grow-1">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
  .home-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .content-section {
    overflow-y: auto;
  }

  .nav-link {
    background: none;
    padding: 0.75rem 1.5rem;
  }

  .nav-link:hover {
    background-color: var(--my-color-gray-100);
  }
</style>
