<script>
  import { onMounted, nextTick, onUnmounted, computed } from 'vue';
  import * as d3 from 'd3';
  import L from 'leaflet';
  import { useDataStore } from '@/stores/dataStore';

  export default {
    name: 'BudgetAnalysisView',
    setup() {
      const dataStore = useDataStore();

      const smallChartData = [
        [
          { name: '2020', value: 1200 },
          { name: '2021', value: 1800 },
          { name: '2022', value: 2500 },
          { name: '2023', value: 3200 },
        ],
        [
          { name: '農業', value: 2800 },
          { name: '科技', value: 5200 },
          { name: '教育', value: 1800 },
          { name: '環保', value: 1500 },
        ],
        [
          { name: '北部', value: 3500 },
          { name: '中部', value: 2800 },
          { name: '南部', value: 2200 },
          { name: '東部', value: 1200 },
        ],
        [
          { name: '政府', value: 4200 },
          { name: '企業', value: 3800 },
          { name: '學術', value: 2800 },
          { name: '其他', value: 1500 },
        ],
      ];

      const drawMainChart = () => {
        const container = d3.select('#main-chart');
        container.selectAll('*').remove();

        // 使用平均預算資料，只取前5名
        const maxBars = 5;
        const topData = dataStore.getExecutingUnitsByBudget.slice(0, maxBars);

        // 創建固定5個位置的數據結構，確保每個位置都有唯一的名稱
        const chartData = Array.from({ length: maxBars }, (_, i) => {
          if (topData[i]) {
            const shortName =
              topData[i].name.length > 8
                ? topData[i].name.substring(0, 8) + '...'
                : topData[i].name;
            return {
              name: shortName,
              value: Math.round(topData[i].mean_budget),
              fullName: topData[i].name,
              position: i,
              uniqueName: `pos-${i}-${shortName}`,
            };
          } else {
            return {
              name: `空位${i + 1}`,
              value: 0,
              fullName: '',
              isEmpty: true,
              position: i,
              uniqueName: `pos-${i}-empty`,
            };
          }
        });

        const yAxisLabel = '平均預算 (萬元)';

        if (chartData.length === 0) {
          container
            .append('div')
            .attr('class', 'd-flex align-items-center justify-content-center h-100')
            .style('color', '#666')
            .text('載入中...');
          return;
        }

        const containerWidth = container.node().getBoundingClientRect().width;
        const containerHeight = 320;
        const margin = { top: 20, right: 30, bottom: 80, left: 70 };
        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        const svg = container
          .append('svg')
          .attr('width', containerWidth)
          .attr('height', containerHeight);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3
          .scaleBand()
          .domain(chartData.map((d) => d.uniqueName))
          .range([0, width])
          .padding(0.3);

        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(topData, (d) => Math.round(d.mean_budget)) || 1])
          .range([height, 0]);

        // 移除互動功能，不再創建 tooltip

        g.selectAll('.bar')
          .data(chartData)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => xScale(d.uniqueName))
          .attr('y', (d) => yScale(d.value))
          .attr('width', xScale.bandwidth())
          .attr('height', (d) => height - yScale(d.value))
          .attr('fill', 'var(--my-color-green)');

        // 添加數值標籤，但只顯示有數據的項目
        const labelData = chartData.filter((d) => !d.isEmpty && d.value > 0);

        console.log('預算圖表標籤數據:', labelData);

        g.selectAll('.bar-label')
          .data(labelData)
          .enter()
          .append('text')
          .attr('class', 'bar-label')
          .attr('x', (d) => xScale(d.uniqueName) + xScale.bandwidth() / 2)
          .attr('y', (d) => yScale(d.value) - 5)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', '#333')
          .style('font-weight', 'bold')
          .text((d) => d.value.toLocaleString());

        // X軸
        g.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(xScale))
          .selectAll('text')
          .style('text-anchor', 'middle')
          .attr('dx', '0')
          .attr('dy', '1em')
          .style('font-size', '11px')
          .text((d) => {
            // 只顯示實際有數據的項目，空位不顯示文字
            const dataItem = chartData.find((item) => item.uniqueName === d);
            return dataItem && !dataItem.isEmpty ? dataItem.name : '';
          });

        // Y軸
        g.append('g').call(d3.axisLeft(yScale)).style('font-size', '11px');

        // Y軸標籤
        g.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - margin.left)
          .attr('x', 0 - height / 2)
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', '#666')
          .text(yAxisLabel);
      };

      const drawSmallChart = (containerId, data) => {
        const container = d3.select(`#${containerId}`);
        container.selectAll('*').remove();

        // 只取前5名，創建固定5個位置的數據結構
        const maxBars = 5;
        const topData = data.slice(0, maxBars);
        const displayData = Array.from({ length: maxBars }, (_, i) => {
          if (topData[i]) {
            return {
              ...topData[i],
              position: i,
              uniqueName: `pos-${i}-${topData[i].name}`,
            };
          } else {
            return {
              name: `空位${i + 1}`,
              value: 0,
              isEmpty: true,
              position: i,
              uniqueName: `pos-${i}-empty`,
            };
          }
        });

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
          .domain(displayData.map((d) => d.uniqueName))
          .range([0, width])
          .padding(0.3);

        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(topData, (d) => d.value) || 1])
          .range([height, 0]);

        g.selectAll('.bar')
          .data(displayData)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => xScale(d.uniqueName))
          .attr('y', (d) => yScale(d.value))
          .attr('width', xScale.bandwidth())
          .attr('height', (d) => height - yScale(d.value))
          .attr('fill', 'var(--my-color-orange)');

        // 添加數值標籤，但只顯示有數據的項目
        const smallLabelData = displayData.filter((d) => !d.isEmpty && d.value > 0);

        g.selectAll('.bar-label')
          .data(smallLabelData)
          .enter()
          .append('text')
          .attr('class', 'bar-label')
          .attr('x', (d) => xScale(d.uniqueName) + xScale.bandwidth() / 2)
          .attr('y', (d) => yScale(d.value) - 3)
          .attr('text-anchor', 'middle')
          .style('font-size', '10px')
          .style('fill', '#333')
          .style('font-weight', 'bold')
          .text((d) => d.value.toLocaleString());

        g.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(xScale))
          .selectAll('text')
          .style('text-anchor', 'middle')
          .attr('dx', '0')
          .attr('dy', '1em')
          .style('font-size', '11px')
          .text((d) => {
            // 只顯示實際有數據的項目，空位不顯示文字
            const dataItem = displayData.find((item) => item.uniqueName === d);
            return dataItem && !dataItem.isEmpty ? dataItem.name : '';
          });
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

        // 預算相關的圓圈資料（模擬）
        const locations = [
          { name: '台北', lat: 25.03, lng: 121.56, value: 4500 },
          { name: '台中', lat: 24.15, lng: 120.68, value: 3200 },
          { name: '高雄', lat: 22.63, lng: 120.27, value: 2800 },
          { name: '雲林', lat: 23.7, lng: 120.54, value: 3800 },
          { name: '花蓮', lat: 23.98, lng: 121.6, value: 1500 },
        ];

        locations.forEach((location) => {
          const radius = Math.sqrt(location.value / 100) * 3;
          L.circle([location.lat, location.lng], {
            color: 'var(--my-color-orange)',
            fillColor: 'var(--my-color-orange)',
            fillOpacity: 0.6,
            radius: radius * 1000,
          })
            .addTo(map)
            .bindPopup(`${location.name}: ${location.value.toLocaleString()}萬元`);
        });
      };

      onMounted(async () => {
        // eslint-disable-next-line no-console
        console.log('預算分析頁面已初始化');

        // 載入所有資料
        await dataStore.loadAllData();

        // eslint-disable-next-line no-console
        console.log('資料載入狀態:', {
          執行單位數量: dataStore.executingUnits.length,
          前十名預算: dataStore.getExecutingUnitsByBudget.length,
          載入中: dataStore.loading,
          錯誤: dataStore.error,
        });

        nextTick(() => {
          drawMainChart();
          drawSmallCharts();
          initMap();
        });
      });

      // 清理函數
      onUnmounted(() => {
        // 清理 D3 創建的元素
        d3.selectAll('.bar-label').remove();
      });

      // 計算屬性來顯示除錯資訊
      const debugInfo = computed(() => ({
        hasData: dataStore.executingUnits.length > 0,
        topUnitsCount: dataStore.getExecutingUnitsByBudget.length,
        loading: dataStore.loading,
        error: dataStore.error,
      }));

      return {
        dataStore,
        debugInfo,
      };
    },
  };
</script>

<template>
  <div class="budget-analysis-container">
    <div class="w-100 p-3">
      <!-- 上排：大圖表 + 地圖 -->
      <div class="row mb-4">
        <div class="col-6 mb-3">
          <div class="chart-container my-bgcolor-white border p-3">
            <h3 class="my-title-sm-black mb-3">執行單位平均預算統計 (前5名)</h3>

            <!-- 除錯資訊 -->
            <div v-if="debugInfo.error" class="alert alert-danger mb-3">
              <strong>載入錯誤：</strong> {{ debugInfo.error }}
            </div>

            <div v-if="debugInfo.loading" class="text-center text-muted mb-3">載入中...</div>

            <div
              v-if="!debugInfo.hasData && !debugInfo.loading && !debugInfo.error"
              class="text-center text-muted mb-3"
            >
              無資料
            </div>

            <div id="main-chart" class="chart-area"></div>
          </div>
        </div>
        <div class="col-6 mb-3">
          <div class="map-container my-bgcolor-white border" style="position: relative">
            <div class="p-3 pb-0">
              <h3 class="my-title-sm-black mb-2">金額地圖分布</h3>
            </div>
            <div id="taiwan-map" style="height: 280px; width: 100%; margin: 0"></div>
          </div>
        </div>
      </div>

      <!-- 下排：4個小圖表 -->
      <div class="row">
        <div class="col-6 mb-3">
          <div class="small-chart-container my-bgcolor-white border p-3">
            <h4 class="my-title-xs-black mb-2">年度趨勢</h4>
            <div id="small-chart-1" class="small-chart-area"></div>
          </div>
        </div>
        <div class="col-6 mb-3">
          <div class="small-chart-container my-bgcolor-white border p-3">
            <h4 class="my-title-xs-black mb-2">類型比較</h4>
            <div id="small-chart-2" class="small-chart-area"></div>
          </div>
        </div>
        <div class="col-6 mb-3">
          <div class="small-chart-container my-bgcolor-white border p-3">
            <h4 class="my-title-xs-black mb-2">地區排名</h4>
            <div id="small-chart-3" class="small-chart-area"></div>
          </div>
        </div>
        <div class="col-6 mb-3">
          <div class="small-chart-container my-bgcolor-white border p-3">
            <h4 class="my-title-xs-black mb-2">資金來源</h4>
            <div id="small-chart-4" class="small-chart-area"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .budget-analysis-container {
    width: 100%;
  }

  .chart-area {
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .map-area {
    min-height: 320px;
    width: 100%;
  }

  .small-chart-area {
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
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
