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
        <h1 class="main-title my-title-xl-black mb-3">雲林縣研究案統計</h1>
        <p class="subtitle my-title-lg-gray">數據分析與統計平台</p>
      </div>

      <!-- 統計卡片區域 -->
      <div class="stats-container">
        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <div class="stat-card my-bgcolor-white p-4 text-center">
              <h3 class="my-title-sm-gray mb-3">總研究案件</h3>
              <div class="stat-number my-color-blue">--</div>
              <p class="my-content-xs-gray">統計中...</p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="stat-card my-bgcolor-white p-4 text-center">
              <h3 class="my-title-sm-gray mb-3">進行中項目</h3>
              <div class="stat-number my-color-green">--</div>
              <p class="my-content-xs-gray">統計中...</p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="stat-card my-bgcolor-white p-4 text-center">
              <h3 class="my-title-sm-gray mb-3">已完成項目</h3>
              <div class="stat-number my-color-orange">--</div>
              <p class="my-content-xs-gray">統計中...</p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="stat-card my-bgcolor-white p-4 text-center">
              <h3 class="my-title-sm-gray mb-3">本年度新增</h3>
              <div class="stat-number my-color-purple">--</div>
              <p class="my-content-xs-gray">統計中...</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 頁腳 -->
    <footer class="app-footer my-bgcolor-gray-800 text-center p-3">
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

.hero-section {
  max-width: 800px;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2rem;
  font-weight: 300;
}

.stats-container {
  max-width: 1200px;
  width: 100%;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--my-color-gray-200);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.footer-content p:last-child {
  color: var(--my-color-gray-400) !important;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .main-content {
    padding: 1rem;
  }

  .stat-card {
    padding: 1.5rem !important;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }

  .stat-number {
    font-size: 2.5rem;
  }
}
</style>