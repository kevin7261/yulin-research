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
  <div class="home-container">
    <!-- 標題 -->
    <div class="w-100">
      <h1 class="my-title-xl-black text-center py-4 mb-0">雲林縣研究案統計</h1>
    </div>

    <!-- 分頁導航 -->
    <div class="d-flex justify-content-center p-3">
      <div class="d-flex align-items-center rounded-pill shadow my-blur gap-2 p-2 w-100">
        <button
          class="btn rounded-pill border-0 my-btn-transparent my-font-size-xs text-nowrap w-100 my-cursor-pointer"
          :class="{ 'my-btn-blue': activeTab === 'count' }"
          @click="switchTab('count')"
        >
          各單位委托案件數
        </button>
        <button
          class="btn rounded-pill border-0 my-btn-transparent my-font-size-xs text-nowrap w-100 my-cursor-pointer"
          :class="{ 'my-btn-blue': activeTab === 'amount' }"
          @click="switchTab('amount')"
        >
          平均金額
        </button>
        {{ activeTab }}
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
