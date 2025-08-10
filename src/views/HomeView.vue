<script>
  import { ref, onMounted, nextTick } from 'vue';
  import * as d3 from 'd3';
  import L from 'leaflet';

  export default {
    name: 'HomeView',
    setup() {
      const activeTab = ref('count');

      // 示意數據
      const sampleData = [
        { name: '雲林縣', value: 45 },
        { name: '台北市', value: 38 },
        { name: '新北市', value: 32 },
        { name: '台中市', value: 28 },
        { name: '高雄市', value: 25 },
      ];

      const smallChartData = [
        [
          { name: '2020', value: 12 },
          { name: '2021', value: 18 },
          { name: '2022', value: 25 },
          { name: '2023', value: 32 },
        ],
        [
          { name: '農業', value: 28 },
          { name: '科技', value: 22 },
          { name: '教育', value: 18 },
          { name: '環保', value: 15 },
        ],
        [
          { name: '北部', value: 35 },
          { name: '中部', value: 28 },
          { name: '南部', value: 22 },
          { name: '東部', value: 12 },
        ],
        [
          { name: '進行中', value: 42 },
          { name: '已完成', value: 38 },
          { name: '暫停', value: 8 },
          { name: '取消', value: 5 },
        ],
      ];

      const switchTab = (tab) => {
        activeTab.value = tab;
        nextTick(() => {
          drawMainChart();
          drawSmallCharts();
          initMap();
        });
      };

             const drawMainChart = () => {
         const container = d3.select('#main-chart');
         container.selectAll('*').remove();

         const containerWidth = container.node().getBoundingClientRect().width;
         const containerHeight = 280;
         const margin = { top: 20, right: 30, bottom: 80, left: 50 };
         const width = containerWidth - margin.left - margin.right;
         const height = containerHeight - margin.top - margin.bottom;

         const svg = container
           .append('svg')
           .attr('width', containerWidth)
           .attr('height', containerHeight);

         const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

         const xScale = d3
           .scaleBand()
           .domain(sampleData.map((d) => d.name))
           .range([0, width])
           .padding(0.2);

         const yScale = d3
           .scaleLinear()
           .domain([0, d3.max(sampleData, (d) => d.value)])
           .range([height, 0]);

         g.selectAll('.bar')
           .data(sampleData)
           .enter()
           .append('rect')
           .attr('class', 'bar')
           .attr('x', (d) => xScale(d.name))
           .attr('y', (d) => yScale(d.value))
           .attr('width', xScale.bandwidth())
           .attr('height', (d) => height - yScale(d.value))
           .attr('fill', 'var(--my-color-blue)');

         g.append('g')
           .attr('transform', `translate(0,${height})`)
           .call(d3.axisBottom(xScale))
           .selectAll('text')
           .style('text-anchor', 'end')
           .attr('dx', '-.8em')
           .attr('dy', '.15em')
           .attr('transform', 'rotate(-45)');

         g.append('g').call(d3.axisLeft(yScale));
       };

             const drawSmallChart = (containerId, data) => {
         const container = d3.select(`#${containerId}`);
         container.selectAll('*').remove();

         const containerWidth = container.node().getBoundingClientRect().width;
         const containerHeight = 150;
         const margin = { top: 10, right: 20, bottom: 50, left: 30 };
         const width = containerWidth - margin.left - margin.right;
         const height = containerHeight - margin.top - margin.bottom;

         const svg = container
           .append('svg')
           .attr('width', containerWidth)
           .attr('height', containerHeight);

         const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

         const xScale = d3
           .scaleBand()
           .domain(data.map((d) => d.name))
           .range([0, width])
           .padding(0.3);

         const yScale = d3
           .scaleLinear()
           .domain([0, d3.max(data, (d) => d.value)])
           .range([height, 0]);

         g.selectAll('.bar')
           .data(data)
           .enter()
           .append('rect')
           .attr('class', 'bar')
           .attr('x', (d) => xScale(d.name))
           .attr('y', (d) => yScale(d.value))
           .attr('width', xScale.bandwidth())
           .attr('height', (d) => height - yScale(d.value))
           .attr('fill', 'var(--my-color-green)');

         g.append('g')
           .attr('transform', `translate(0,${height})`)
           .call(d3.axisBottom(xScale))
           .selectAll('text')
           .style('text-anchor', 'end')
           .attr('dx', '-.8em')
           .attr('dy', '.15em')
           .attr('transform', 'rotate(-45)');
       };

      const drawSmallCharts = () => {
        smallChartData.forEach((data, index) => {
          drawSmallChart(`small-chart-${index + 1}`, data);
        });
      };

      const initMap = () => {
        const mapContainer = document.getElementById('taiwan-map');
        if (mapContainer._leaflet_id) {
          mapContainer._leaflet_id = null;
          mapContainer.innerHTML = '';
        }

        const map = L.map('taiwan-map').setView([23.8, 120.9], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // 示意圓圈資料
        const locations = [
          { name: '台北', lat: 25.03, lng: 121.56, value: 45 },
          { name: '台中', lat: 24.15, lng: 120.68, value: 32 },
          { name: '高雄', lat: 22.63, lng: 120.27, value: 28 },
          { name: '雲林', lat: 23.7, lng: 120.54, value: 38 },
          { name: '花蓮', lat: 23.98, lng: 121.6, value: 15 },
        ];

        locations.forEach((location) => {
          const radius = Math.sqrt(location.value) * 3;
          L.circle([location.lat, location.lng], {
            color: 'var(--my-color-red)',
            fillColor: 'var(--my-color-red)',
            fillOpacity: 0.6,
            radius: radius * 1000,
          })
            .addTo(map)
            .bindPopup(`${location.name}: ${location.value}件`);
        });
      };

      onMounted(() => {
        console.log('雲林縣研究案統計平台已初始化');
        nextTick(() => {
          drawMainChart();
          drawSmallCharts();
          initMap();
        });
      });

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
      <div class="container">
        <h1 class="my-title-xl-black text-center py-4 mb-0">雲林縣研究案統計</h1>
      </div>
    </div>

    <!-- 分頁導航 -->
    <div class="tabs-section my-bgcolor-white border-bottom">
      <div class="container">
        <ul class="nav nav-tabs border-0 pt-3">
          <li class="nav-item">
            <button
              class="nav-link my-title-sm-gray border-0"
              :class="{ 'active my-bgcolor-blue my-color-white': activeTab === 'count' }"
              @click="switchTab('count')"
            >
              案件數
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

    <!-- 分頁內容 -->
    <div class="content-section flex-grow-1">
      <div class="container py-4">
        <!-- 案件數分頁 -->
        <div v-if="activeTab === 'count'">
          <!-- 上排：大圖表 + 地圖 (一排2個) -->
          <div class="row mb-4">
            <div class="col-md-6 mb-3">
              <div class="chart-container my-bgcolor-white border p-3">
                <h3 class="my-title-sm-black mb-3">總案件數分布</h3>
                <div id="main-chart" class="chart-area"></div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="map-container my-bgcolor-white border p-3">
                <h3 class="my-title-sm-black mb-3">地圖分布</h3>
                <div id="taiwan-map" class="map-area"></div>
              </div>
            </div>
          </div>

          <!-- 下排：4個小圖表 (一排2個) -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="small-chart-container my-bgcolor-white border p-3">
                <h4 class="my-title-xs-black mb-2">按年度</h4>
                <div id="small-chart-1" class="small-chart-area"></div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="small-chart-container my-bgcolor-white border p-3">
                <h4 class="my-title-xs-black mb-2">按類型</h4>
                <div id="small-chart-2" class="small-chart-area"></div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="small-chart-container my-bgcolor-white border p-3">
                <h4 class="my-title-xs-black mb-2">按地區</h4>
                <div id="small-chart-3" class="small-chart-area"></div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="small-chart-container my-bgcolor-white border p-3">
                <h4 class="my-title-xs-black mb-2">按狀態</h4>
                <div id="small-chart-4" class="small-chart-area"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 平均金額分頁 -->
        <div v-if="activeTab === 'amount'">
          <!-- 上排：大圖表 + 地圖 (一排2個) -->
          <div class="row mb-4">
            <div class="col-md-6 mb-3">
              <div class="chart-container my-bgcolor-white border p-3">
                <h3 class="my-title-sm-black mb-3">平均金額分布</h3>
                <div id="main-chart" class="chart-area"></div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="map-container my-bgcolor-white border p-3">
                <h3 class="my-title-sm-black mb-3">金額地圖分布</h3>
                <div id="taiwan-map" class="map-area"></div>
              </div>
            </div>
          </div>

          <!-- 下排：4個小圖表 (一排2個) -->
          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="small-chart-container my-bgcolor-white border p-3">
                <h4 class="my-title-xs-black mb-2">年度趨勢</h4>
                <div id="small-chart-1" class="small-chart-area"></div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="small-chart-container my-bgcolor-white border p-3">
                <h4 class="my-title-xs-black mb-2">類型比較</h4>
                <div id="small-chart-2" class="small-chart-area"></div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="small-chart-container my-bgcolor-white border p-3">
                <h4 class="my-title-xs-black mb-2">地區排名</h4>
                <div id="small-chart-3" class="small-chart-area"></div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="small-chart-container my-bgcolor-white border p-3">
                <h4 class="my-title-xs-black mb-2">資金來源</h4>
                <div id="small-chart-4" class="small-chart-area"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .home-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .chart-area {
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .map-area {
    min-height: 280px;
    width: 100%;
  }

  .small-chart-area {
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-link {
    background: none;
    padding: 0.75rem 1.5rem;
  }

  .nav-link:hover {
    background-color: var(--my-color-gray-100);
  }

  /* 響應式設計 */
  @media (max-width: 768px) {
    .chart-area,
    .map-area {
      min-height: 200px;
    }

    .small-chart-area {
      min-height: 120px;
    }
  }
</style>
