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
  <div class="home-container">
    <!-- 主要內容區域 -->
    <main class="main-content">
      <div class="hero-section">
        <h1 class="main-title">雲林縣研究案統計</h1>
        <p class="subtitle">數據分析與統計平台</p>
      </div>

      <!-- 統計卡片區域 -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>總研究案件</h3>
          <div class="stat-number">--</div>
          <p class="stat-description">統計中...</p>
        </div>

        <div class="stat-card">
          <h3>進行中項目</h3>
          <div class="stat-number">--</div>
          <p class="stat-description">統計中...</p>
        </div>

        <div class="stat-card">
          <h3>已完成項目</h3>
          <div class="stat-number">--</div>
          <p class="stat-description">統計中...</p>
        </div>

        <div class="stat-card">
          <h3>本年度新增</h3>
          <div class="stat-number">--</div>
          <p class="stat-description">統計中...</p>
        </div>
      </div>
    </main>

    <!-- 頁腳 -->
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} 雲林縣研究案統計平台</p>
        <p>版權所有</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  .home-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .main-content {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .hero-section {
    text-align: center;
    color: white;
    margin-bottom: 3rem;
  }

  .main-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    font-weight: 300;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    width: 100%;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .stat-card h3 {
    color: #333;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .stat-number {
    font-size: 3rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 0.5rem;
  }

  .stat-description {
    color: #666;
    font-size: 0.9rem;
  }

  .app-footer {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 1.5rem 2rem;
    text-align: center;
  }

  .footer-content p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }

  /* 響應式設計 */
  @media (max-width: 768px) {
    .main-title {
      font-size: 2.5rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .main-content {
      padding: 1rem;
    }

    .stat-card {
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .main-title {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }
</style>
