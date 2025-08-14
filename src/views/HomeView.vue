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
        if (route.path.includes('basic-stats')) return 'basic-stats';
        if (route.path.includes('case-count')) return 'case-count';
        if (route.path.includes('case-budget')) return 'case-budget';
        return 'basic-stats'; // 預設
      });

      const switchTab = (tab) => {
        if (tab === 'basic-stats') {
          router.push('/basic-stats');
        } else if (tab === 'case-count') {
          router.push('/case-count');
        } else if (tab === 'case-budget') {
          router.push('/case-budget');
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
  <div class="home-container">
    <!-- 標題 -->
    <div class="w-100">
      <h1 class="my-title-xl-black text-center py-4 mb-0">雲林縣研究案統計</h1>
    </div>

    <!-- 分頁導航 -->
    <div class="d-flex justify-content-center w-50 mx-auto pb-4">
      <div class="d-flex align-items-center rounded-pill shadow my-blur gap-2 p-2 w-100">
        <button
          class="btn rounded-pill border-0 my-btn-transparent my-font-size-xs text-nowrap w-100 my-cursor-pointer"
          :class="{ 'my-btn-blue': activeTab === 'basic-stats' }"
          @click="switchTab('basic-stats')"
        >
          基本統計
        </button>
        <button
          class="btn rounded-pill border-0 my-btn-transparent my-font-size-xs text-nowrap w-100 my-cursor-pointer"
          :class="{ 'my-btn-blue': activeTab === 'case-count' }"
          @click="switchTab('case-count')"
        >
          委托案件數
        </button>
        <button
          class="btn rounded-pill border-0 my-btn-transparent my-font-size-xs text-nowrap w-100 my-cursor-pointer"
          :class="{ 'my-btn-blue': activeTab === 'case-budget' }"
          @click="switchTab('case-budget')"
        >
          平均金額
        </button>
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
</style>
