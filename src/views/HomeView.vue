<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'HomeView',
  setup() {
    const currentYear = ref(new Date().getFullYear());

    onMounted(() => {
      console.log('雲林縣研究案統計平台已初始化');
    });

    return {
      currentYear,
    };
  },
};
</script>

<template>
  <div class="home-container my-bgcolor-gray-50">
    <!-- 主要內容區域 -->
    <main class="main-content d-flex flex-column justify-content-center align-items-center">
      <!-- 標題區域 -->
      <div class="hero-section text-center mb-5">
        <h1 class="my-title-xl-black mb-3">雲林縣研究案統計</h1>
        <p class="my-title-lg-gray">數據分析與統計平台</p>
      </div>

      <!-- 統計卡片區域 -->
      <div class="stats-container">
        <div class="row g-3">
          <div class="col-md-6 col-lg-3">
            <div class="stat-card my-bgcolor-white p-4 text-center border">
              <h3 class="my-title-sm-gray mb-3">總研究案件</h3>
              <div class="my-font-size-2xl my-color-blue mb-2">--</div>
              <p class="my-content-xs-gray">統計中...</p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="stat-card my-bgcolor-white p-4 text-center border">
              <h3 class="my-title-sm-gray mb-3">進行中項目</h3>
              <div class="my-font-size-2xl my-color-green mb-2">--</div>
              <p class="my-content-xs-gray">統計中...</p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="stat-card my-bgcolor-white p-4 text-center border">
              <h3 class="my-title-sm-gray mb-3">已完成項目</h3>
              <div class="my-font-size-2xl my-color-orange mb-2">--</div>
              <p class="my-content-xs-gray">統計中...</p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="stat-card my-bgcolor-white p-4 text-center border">
              <h3 class="my-title-sm-gray mb-3">本年度新增</h3>
              <div class="my-font-size-2xl my-color-purple mb-2">--</div>
              <p class="my-content-xs-gray">統計中...</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 頁腳 -->
    <footer class="my-bgcolor-gray-800 text-center p-3 mt-auto">
      <div class="footer-content">
        <p class="my-title-xs-white mb-1">&copy; {{ currentYear }} 雲林縣研究案統計平台</p>
        <p class="my-content-xs-gray">版權所有</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.stats-container {
  max-width: 1200px;
  width: 100%;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>