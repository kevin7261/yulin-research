<!--
  案件數統計分析視圖組件 (CaseCountView.vue)

  功能概述：
  本組件專門用於分析雲林縣研究案的案件數統計，提供多維度的數據視覺化分析。

  主要功能模組：
  1. 主管機關委托案件數統計圖表 - 顯示前12名主管機關的案件數排名
  2. 學術單位案件數分布地圖 - 台灣地圖上標記學術單位位置和案件數
  3. 主管機關下屬執行單位分析 - 12個小圖表顯示各機關的執行單位分布
  4. 主管機關與執行單位關係網絡圖 - 力導向圖顯示合作關係網絡

  數據來源：
  - 計畫主管機關_normalize.json：主管機關基本資料和統計數據
  - 執行單位名稱_normalize.json：執行單位基本資料和統計數據
  - 執行單位名稱_normalize_&_計畫主管機關_normalize.json：主管機關與執行單位的映射關係
  - 執行單位名稱_locations.json：執行單位的地理位置座標

  技術架構：
  - Vue 3 Composition API：組件邏輯管理
  - Pinia Store：數據狀態管理
  - D3.js：圖表繪製和數據視覺化
  - Leaflet.js：互動式地圖功能
  - Bootstrap：響應式UI框架
-->

<script>
  import { computed, onMounted, onUnmounted, nextTick } from 'vue';
  import { useDataStore } from '@/stores/dataStore';
  import * as d3 from 'd3';
  import L from 'leaflet';
  import { exportContainerSvgAsPng } from '@/utils/exportImage';

  export default {
    // 組件名稱：用於 Vue DevTools 調試和組件識別
    name: 'CaseCountView',

    setup() {
      // 初始化數據管理 Store
      // 使用 Pinia 的 useDataStore 來管理應用程式的數據狀態
      const dataStore = useDataStore();

      // ==================== 計算屬性 (Computed Properties) ====================
      // 計算屬性具有響應式特性，當依賴的數據變化時會自動重新計算
      // 同時具有緩存特性，只有依賴變化時才重新計算，提高性能
      // 這些屬性會根據原始數據自動生成圖表所需的數據結構

      /**
       * 主管機關小圖表數據結構計算屬性
       *
       * 功能說明：
       * 為前12名主管機關創建小圖表所需的數據結構，每個主管機關對應一個小圖表，
       * 顯示該機關下屬執行單位的統計信息。
       *
       * 數據流程：
       * 1. 從 dataStore 獲取前12名主管機關數據（包含下屬執行單位信息）
       * 2. 為每個主管機關創建標準化的圖表配置對象
       * 3. 返回包含12個圖表配置的陣列，供模板中的 v-for 指令使用
       *
       * 返回值結構：
       * 陣列中的每個對象包含：
       * - id: 唯一的DOM元素標識符，用於D3.js選擇器
       * - title: 圖表顯示標題（主管機關名稱）
       * - agencyData: 主管機關的基本統計數據
       * - subUnits: 該機關下屬的執行單位列表
       *
       * 使用場景：
       * 在模板中通過 v-for 指令動態生成12個小圖表，每個圖表顯示
       * 一個主管機關的執行單位分布情況。
       */
      const getSupervisorChartsData = computed(() => {
        // 步驟1：獲取前12名主管機關數據
        // getTop10AgenciesWithSubUnits 返回按案件數排序的主管機關數據
        // slice(0, 12) 截取前12個元素，確保不會超過12個圖表
        const top12AgenciesWithSubUnits = dataStore.getTop10AgenciesWithSubUnits.slice(0, 12);

        // 步驟2：數據結構轉換
        // 使用 map 方法將原始數據轉換為圖表所需的標準化格式
        return top12AgenciesWithSubUnits.map((agency, index) => ({
          // 生成唯一的圖表ID，格式：supervisor-chart-1, supervisor-chart-2, ...
          // 這個ID用於D3.js選擇器，確保每個圖表都能正確定位到對應的DOM元素
          id: `supervisor-chart-${index + 1}`,

          // 圖表標題：直接使用主管機關的完整名稱
          // 不需要截短，因為小圖表的標題區域足夠顯示完整名稱
          title: agency.name,

          // 主管機關的核心統計數據
          // 包含名稱、案件數、平均預算等關鍵指標
          agencyData: {
            name: agency.name, // 主管機關完整名稱
            委托案件數: agency.委托案件數, // 該機關的總案件數
            所有相符資料_JSON: agency.所有相符資料_JSON, // 該機關的平均預算金額
          },

          // 下屬執行單位列表
          // 使用 || 運算符提供默認值，防止數據缺失導致的錯誤
          // 如果 subUnits 存在則使用，否則使用空陣列
          subUnits: agency.subUnits || [],
        }));
      });

      /**
       * 調試信息計算屬性
       *
       * 功能說明：
       * 提供開發階段的問題診斷和數據驗證信息，幫助開發者了解組件的運行狀態。
       * 這些信息會顯示在模板中，用於監控數據載入狀態、錯誤信息和數據統計。
       *
       * 主要用途：
       * 1. 數據載入狀態監控：顯示載入中、載入完成或載入失敗的狀態
       * 2. 數據可用性檢查：確認是否有足夠的數據來渲染圖表
       * 3. 錯誤信息顯示：當數據載入失敗時，向用戶顯示具體的錯誤原因
       * 4. 數據量統計：顯示處理後的數據數量，用於驗證數據處理邏輯
       *
       * 返回值結構：
       * 包含四個關鍵狀態指標的對象，用於模板中的條件渲染和狀態顯示
       */
      const debugInfo = computed(() => ({
        // 數據可用性檢查
        // 通過檢查主管機關數據陣列的長度來判斷是否有可用數據
        // 返回值：true 表示有數據可顯示，false 表示無數據
        hasData: dataStore.supervisorAgencies.length > 0,

        // 篩選後的有效數據量
        // 顯示經過篩選和排序後的前10名主管機關數量
        // 用於驗證數據處理邏輯是否正確，以及確認圖表能顯示多少數據
        topUnitsCount: dataStore.getTopSupervisorAgencies.length,

        // 數據載入狀態
        // 從 dataStore 獲取當前的載入狀態
        // 返回值：true 表示正在載入數據，false 表示載入完成
        loading: dataStore.loading,

        // 錯誤信息
        // 從 dataStore 獲取載入過程中的錯誤信息
        // 返回值：有錯誤時為錯誤訊息字串，無錯誤時為 null
        error: dataStore.error,
      }));

      // ==================== 圖表繪製函數 (Chart Rendering Functions) ====================
      // 本區域包含所有與圖表繪製相關的函數，使用 D3.js 進行數據視覺化
      // 每個函數負責特定類型的圖表，包括主圖表、小圖表、地圖和網絡圖

      /**
       * 通用圖表繪製函數 - 根據傳入的配置和數據繪製條形圖
       *
       * 功能說明：
       * - 使用 D3.js 創建響應式 SVG 柱狀圖
       * - 支援動態數據量（主圖表8個，小圖表3個）
       * - 防止 bar 重疊的唯一標識符設計
       * - 在圖表上方顯示數值標籤
       * - 完整的座標軸和標題系統
       *
       * @param {Object} config - 圖表配置對象
       * @param {string} config.containerId - DOM 容器的 ID
       * @param {Array} config.data - 要顯示的數據陣列
       * @param {string} config.yAxisLabel - Y 軸標籤文字
       * @param {number} [config.containerHeight] - 容器總高度（可選）
       * @param {() => number} [config.getContainerHeight] - 以函數返回容器總高度（可選）
       * @param {() => number} [config.getChartHeight] - 以函數返回圖表 bar 區高度（可選）
       */
      const drawChart = (config) => {
        // ==================== 初始化和清理階段 ====================

        // 使用 D3.js 選擇器選取目標 DOM 容器
        // d3.select(): D3.js 的核心方法，類似 document.querySelector()
        // `#${config.containerId}`: 模板字串，生成 CSS 選擇器如 "#main-chart"
        const container = d3.select(`#${config.containerId}`);

        // 檢查容器是否存在於 DOM 中
        // container.empty(): 檢查選擇器是否找到元素
        // container.node(): 獲取實際的 DOM 節點
        // 如果容器不存在，記錄錯誤並提早返回，避免後續錯誤
        if (container.empty() || !container.node()) {
          // eslint-disable-next-line no-console
          console.error(`圖表容器 #${config.containerId} 不存在`);
          return; // 提早返回，停止函數執行
        }

        // 清除容器內的所有舊元素，防止重複渲染造成的視覺重疊
        // selectAll('*'): 選擇容器內的所有子元素
        // remove(): D3.js 方法，從 DOM 中移除選中的元素
        container.selectAll('*').remove();

        // ==================== 數據準備階段 ====================

        // 從配置對象中提取圖表數據
        // config.data: 包含要顯示的數據陣列，每個元素包含 name 和 value 屬性
        const chartData = config.data;

        // 從配置對象中提取 Y 軸標籤文字（現已移除Y軸標籤顯示）
        // config.yAxisLabel: 字串，原用於顯示在 Y 軸旁邊，現在不再使用

        // 數據有效性檢查：確保數據已載入且不為空
        // !chartData: 檢查數據是否為 null 或 undefined
        // chartData.length === 0: 檢查數據陣列是否為空
        // 如果數據無效，顯示載入中提示並提早返回
        if (!chartData || chartData.length === 0) {
          // 在容器中創建載入中提示元素
          container
            .append('div') // 添加一個 div 元素
            .attr('class', 'd-flex align-items-center justify-content-center h-100') // Bootstrap 類別：垂直水平置中，高度100%
            .style('color', '#666') // 設定文字顏色為灰色
            .text('載入中...'); // 設定提示文字
          return; // 提早返回，停止函數執行
        }

        // ==================== 圖表尺寸設定階段 ====================

        // 動態獲取容器的實際寬度，實現響應式設計
        // getBoundingClientRect(): 瀏覽器 API，獲取元素的位置和尺寸信息
        // .width: 提取寬度屬性，單位為像素
        const containerWidth = container.node().getBoundingClientRect().width;

        // 設定容器高度：優先使用函數回傳，否則使用傳入數值或預設320
        const containerHeight =
          (typeof config.getContainerHeight === 'function'
            ? config.getContainerHeight()
            : config.containerHeight) || 320;

        // 設定圖表的內邊距（margin），實現滿版顯示效果
        // 使用傳入的邊距設定，如果沒有傳入則使用滿版默認值
        // ||: 邏輯或運算符，提供默認配置對象
        const margin = config.margin || {
          top: 20, // 頂部邊距：為數值標籤預留最小空間
          right: 0, // 右側邊距：設為0實現右邊滿版
          bottom: 160, // 底部邊距：為X軸垂直文字預留160px空間
          left: 40, // 左側邊距：固定為32px以容納Y軸刻度數字
        };

        // 計算bar區域的實際高度：可由函數回傳，否則預設160px
        const barAreaHeight =
          (typeof config.getChartHeight === 'function' ? config.getChartHeight() : null) || 160;

        // 計算實際可用的繪圖區域大小
        // 從容器總寬度中減去左右邊距，得到圖表內容區域的寬度
        const width = containerWidth - margin.left - margin.right;
        // bar區域高度固定為160px，減去頂部邊距得到實際繪圖高度
        const height = barAreaHeight - margin.top;

        // ==================== SVG 容器創建階段 ====================

        // 創建 SVG 主容器元素，作為整個圖表的根元素
        const svg = container
          .append('svg') // 在選定的容器中添加 SVG 元素
          .attr('width', containerWidth) // 設定 SVG 的總寬度（包含邊距）
          .attr('height', containerHeight); // 設定 SVG 的總高度（包含邊距）

        // 創建主要繪圖群組（group），並應用邊距位移
        // 所有的圖表元素都會在這個群組內繪製
        // append('g'): 添加一個 SVG 群組元素
        // attr('transform', ...): 設定群組的位移變換
        // translate(${margin.left},${margin.top}): 將群組向右下移動，創造邊距效果
        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        // ==================== 比例尺設定階段（防止重疊的關鍵）====================

        // 判斷當前是否為主圖表，用於決定顯示的數據量
        // config.containerId === 'main-chart': 檢查容器 ID 是否為主圖表
        // 主圖表顯示8個項目，小圖表顯示3個項目
        const isMainChart = config.containerId === 'main-chart';

        // 設定最大柱子數量，根據圖表類型動態調整
        // 三元運算符: 條件 ? 真值 : 假值
        // 主圖表12個，小圖表6個，確保固定的視覺佈局
        const maxBars = isMainChart ? 12 : 6;

        // 從原始數據中截取前 N 名數據
        // slice(0, maxBars): JavaScript 陣列方法，截取從索引0開始的 maxBars 個元素
        // 確保只顯示指定數量的項目
        const topData = chartData.slice(0, maxBars);

        // 創建固定位置的數據結構，確保每個位置都有唯一的名稱
        // 這是防止柱子重疊的關鍵設計：為每個位置創建唯一標識符
        // 主圖表固定8個位置，小圖表固定3個位置
        // Array.from({ length: maxBars }, callback): 創建指定長度的陣列並填充
        const displayData = Array.from({ length: maxBars }, (_, i) => {
          // 檢查當前位置是否有實際數據
          if (topData[i]) {
            // 有數據的位置：展開原始數據並添加位置信息
            return {
              ...topData[i], // 使用展開運算符複製原始數據的所有屬性（name, value, fullName等）
              position: i, // 添加位置標識符，用於排序和定位，值為 0, 1, 2, ...
              uniqueName: `pos-${i}-${topData[i].name}`, // 創建唯一名稱，格式: pos-0-教育部, pos-1-科技部, ...
            };
          } else {
            // 沒有數據的位置：創建空位佔位符，確保固定的視覺佈局
            return {
              name: `空位${i + 1}`, // 空位顯示名稱，用於調試和識別
              value: 0, // 數值為0，不會顯示實際的柱子
              fullName: '', // 完整名稱為空字串
              isEmpty: true, // 標記為空位，用於後續過濾和處理
              position: i, // 位置標識符，與有數據的位置保持一致的索引
              uniqueName: `pos-${i}-empty`, // 空位的唯一名稱，格式: pos-3-empty, pos-4-empty, ...
            };
          }
        });

        // X 軸比例尺設定：實現 justify-content: space-around 效果
        const barWidth = 16; // 固定柱子寬度為16px

        // 實現 space-around 佈局的自定義比例尺
        const dataCount = displayData.length;
        const totalBarWidth = dataCount * barWidth; // 所有bar的總寬度
        const availableSpaceWidth = width - totalBarWidth; // 可用於間距的寬度
        const spaceUnit = availableSpaceWidth / (dataCount * 2); // 每個space-around單位的寬度

        // 創建自定義的位置映射函數
        const xScale = (uniqueName) => {
          const index = displayData.findIndex((d) => d.uniqueName === uniqueName);
          if (index === -1) return 0;
          // space-around: 每個元素前後都有 spaceUnit，再加上前面所有bar和space的寬度
          return spaceUnit + index * (barWidth + 2 * spaceUnit) + barWidth / 2;
        };

        // Y 軸比例尺設定：使用線性比例尺映射數值到 SVG 高度
        const maxValue = d3.max(topData, (d) => d.value) || 1; // 獲取數據最大值

        // 計算適合5的倍數刻度的最大值
        const getRoundedMax = (val) => {
          // 找到適當的間隔（5的倍數）
          let interval = 5;

          // 根據數值大小調整間隔
          if (val > 1000) {
            // 對於大於1000的數值，使用更大的5的倍數間隔
            interval = Math.ceil(val / 5000) * 250; // 250, 500, 750, 1000, 1250...
            if (interval < 500) interval = 500;
          } else if (val > 100) {
            interval = Math.ceil(val / 500) * 25; // 25, 50, 75, 100, 125...
            if (interval < 50) interval = 50;
          } else if (val > 50) {
            interval = 10; // 50-100 使用間隔10
          } else if (val > 25) {
            interval = 5; // 25-50 使用間隔5
          }

          // 確保間隔是5的倍數
          if (interval % 5 !== 0) {
            interval = Math.ceil(interval / 5) * 5;
          }

          // 確保最大值是間隔的倍數，且略大於實際最大值
          const roundedMax = Math.ceil(val / interval) * interval;

          // 確保至少有合理的刻度數量（2-5條線）
          if (roundedMax / interval < 2) {
            return interval * 2; // 至少2條刻度線
          }

          return roundedMax;
        };

        const roundedMaxValue = getRoundedMax(maxValue);
        const yScale = d3
          .scaleLinear() // 創建線性比例尺，用於連續數值數據
          .domain([0, roundedMaxValue]) // 定義域：從0到舍入後的最大值，確保刻度對齊
          .range([height, 0]); // 值域：從圖表底部到頂部（SVG坐標系Y軸向下，需要反轉）

        // 計算Y軸刻度：刻度值為5的倍數，最多5條線（包含0）
        const calculateYTicks = (roundedMax) => {
          const ticks = [0]; // 始終包含0作為基準線

          // 計算適當的間隔，確保為5的倍數
          let interval = 5;

          // 根據最大值調整間隔，確保最多5條線
          while (roundedMax / interval > 4) {
            interval += 5; // 增加間隔，保持5的倍數
          }

          // 生成刻度，從interval開始，每次增加interval
          for (let i = interval; i <= roundedMax; i += interval) {
            ticks.push(i);
            if (ticks.length >= 5) break; // 最多5條線
          }

          return ticks;
        };

        const yTicks = calculateYTicks(roundedMaxValue);

        // ==================== 移除互動功能階段 ====================
        // 根據用戶需求，移除了原有的 tooltip 互動功能
        // 不再創建 tooltip 元素，簡化圖表顯示，專注於數據呈現

        // ==================== 柱狀圖繪製階段（無重疊設計）====================

        // 使用 D3.js 的數據綁定模式創建柱狀圖的矩形元素
        // 這是 D3.js 的核心概念：數據驅動文檔（Data-Driven Documents）
        g.selectAll('.bar') // 選擇所有具有 'bar' 類別的元素（初始為空）
          .data(displayData) // 將 displayData 陣列與選中的元素綁定
          .enter() // 處理數據多於元素的情況，為每個新數據項創建元素
          .append('rect') // 在 SVG 中添加矩形元素，用於繪製柱子
          .attr('class', 'bar') // 為每個矩形添加 'bar' CSS 類別，便於樣式控制
          // 位置和尺寸設定（確保無重疊的關鍵設計）
          .attr('x', (d) => xScale(d.uniqueName) - barWidth / 2) // X 座標：置中對齊固定寬度柱子
          .attr('y', (d) => yScale(d.value)) // Y 座標：使用數值通過 yScale 計算位置（SVG 坐標系）
          .attr('width', barWidth) // 寬度：使用固定的32px寬度
          .attr('height', (d) => height - yScale(d.value)) // 高度：從圖表底部到數值對應的 Y 位置
          .attr('fill', 'var(--my-color-blue)'); // 填充顏色：使用 CSS 自定義屬性，便於主題切換

        // ==================== 數值標籤添加階段 ====================
        // 在每個柱子的上方顯示具體數值，但只顯示有實際數據的項目
        // 過濾掉空位和數值為0的項目，避免顯示無意義的標籤
        // filter(): JavaScript 陣列方法，根據條件篩選元素
        // !d.isEmpty: 不是空位
        // d.value > 0: 數值大於0
        const labelData = displayData.filter((d) => !d.isEmpty && d.value > 0);

        // 使用 D3.js 數據綁定創建數值標籤的文字元素
        g.selectAll('.bar-label') // 選擇所有具有 'bar-label' 類別的元素
          .data(labelData) // 綁定過濾後的標籤數據（只包含有效數據）
          .enter() // 為新數據項創建對應的元素
          .append('text') // 在 SVG 中添加文字元素
          .attr('class', 'bar-label') // 設定 CSS 類別，便於樣式控制
          .attr('x', (d) => {
            // X 座標計算：將標籤精確置於對應柱子的水平中央
            // xScale(d.uniqueName): 使用唯一名稱獲取柱子中心點的 X 座標
            // 由於使用 scalePoint 和固定寬度，直接返回中心點位置
            return xScale(d.uniqueName);
          })
          .attr('y', (d) => {
            // Y 座標計算：將標籤放置在柱子頂部的上方
            // yScale(d.value): 使用數值獲取柱子頂部的 Y 座標
            // - 5: 向上偏移5像素，讓標籤與柱子頂部保持適當距離，避免視覺重疊
            // 注意：SVG 座標系中 Y 軸向下為正，所以減法表示向上移動
            return yScale(d.value) - 5;
          })
          .attr('text-anchor', 'middle') // SVG 文字錨點：設定為中央對齊，配合 X 座標實現完美置中
          .style('font-size', '12px') // CSS 樣式：設定字體大小為12像素，確保可讀性
          .style('fill', '#333') // CSS 樣式：設定文字顏色為深灰色 (#333)，提供良好的對比度
          .style('font-weight', 'bold') // CSS 樣式：設定粗體字重，增強數值的視覺重要性
          .text((d) => d3.format(',')(d.value)); // 文字內容：使用 d3.format(',') 格式化數值，添加千分位逗號

        // ==================== 座標軸和網格線繪製階段 ====================

        // 繪製水平虛線網格：根據Y軸刻度繪製虛線，包含刻度0
        g.selectAll('.grid-line')
          .data(yTicks) // 綁定所有Y軸刻度數據（包括0）
          .enter()
          .append('line') // 添加線條元素
          .attr('class', 'grid-line') // 設定CSS類別
          .attr('x1', 0) // 線條起點X座標：圖表左邊
          .attr('x2', width) // 線條終點X座標：圖表右邊
          .attr('y1', (d) => yScale(d)) // 線條起點Y座標：根據刻度值計算
          .attr('y2', (d) => yScale(d)) // 線條終點Y座標：與起點相同，形成水平線
          .attr('stroke', '#bdbdbd') // 統一使用 gray-400 顏色 (#bdbdbd)
          .attr('stroke-width', 1) // 設定線條寬度
          .attr('stroke-dasharray', '3,3') // 設定虛線樣式：3像素實線，3像素空白
          .attr('opacity', (d) => (d === 0 ? 0.8 : 0.4)); // 刻度0更明顯，其他更淡

        // X 軸繪製：顯示主管機關或執行單位的名稱標籤
        const xAxisGroup = g
          .append('g') // 在主繪圖群組中添加新的群組元素，用於容納 X 軸
          .attr('transform', `translate(0,${height})`); // 變換設定：將 X 軸群組移動到圖表底部

        // 由於使用自定義 xScale 函數，不需要調用 d3.axisBottom
        // 刻度線已設定為 tickSize(0)，所以不需要額外創建

        // 移除預設的 X 軸文字，改為自訂垂直文字
        xAxisGroup.selectAll('text').remove();

        // 自訂 X 軸垂直文字：支援換行和垂直排列
        displayData.forEach((dataItem) => {
          if (!dataItem.isEmpty && dataItem.name) {
            // 添加 dataItem.name 的檢查
            const x = xScale(dataItem.uniqueName); // 取得 bar 的 x 位置
            const text = dataItem.name;

            // 為每個機關名稱創建垂直文字群組
            const textGroup = xAxisGroup.append('g').attr('transform', `translate(${x}, 20)`); // 置中對齊 bar，向下偏移20px

            // 將文字按每10個字符分割成多行
            const lines = [];
            for (let i = 0; i < text.length; i += 10) {
              lines.push(text.substring(i, i + 10));
            }

            // 根據行數決定水平排列方式
            const totalLines = lines.length;

            lines.forEach((line, lineIndex) => {
              // 計算每行的水平偏移：將多行置中排列
              const lineOffset =
                totalLines === 1
                  ? 0
                  : totalLines === 2
                    ? lineIndex === 0
                      ? -8
                      : 8
                    : totalLines === 3
                      ? lineIndex === 0
                        ? -12
                        : lineIndex === 1
                          ? 0
                          : 12
                      : // 4行或更多時，均勻分布
                        (lineIndex - (totalLines - 1) / 2) * 8;

              // 在每行內垂直排列字符
              line.split('').forEach((char, charIndex) => {
                textGroup
                  .append('text')
                  .text(char)
                  .attr('x', lineOffset) // 水平偏移以實現多行排列
                  .attr('y', charIndex * (12 + 0.6)) // 字體大小12px + letter-spacing 0.6px
                  .style('font-size', '12px')
                  .style('font-family', 'Arial, sans-serif')
                  .style('fill', '#333')
                  .style('text-anchor', 'middle'); // 水平置中
              });
            });
          }
        });

        // Y 軸繪製：數值顯示在圖表內部，實現滿版效果
        g.append('g') // 在主繪圖群組中添加新的群組元素，用於容納 Y 軸
          .call(
            d3
              .axisLeft(yScale)
              .tickValues(yTicks) // 使用自定義的刻度值
              .tickSize(0) // 移除垂直刻度線
              .tickFormat((d) => {
                // 自定義格式化函數：顯示原始數字，添加千分位逗號
                return d3.format(',')(d); // 使用千分位逗號格式化，不顯示k或M
              }) // 格式化：顯示原始數字，添加千分位逗號
          )
          .style('font-size', '11px') // CSS 樣式：設定 Y 軸刻度文字的字體大小
          .select('.domain')
          .remove(); // 移除Y軸主線

        // Y軸數值標籤保持在左側正常位置
        g.selectAll('.tick text')
          .style('fill', '#666') // 設定文字顏色
          .style('font-weight', 'normal'); // 設定字重

        // 移除Y軸標籤：根據用戶需求，不再顯示Y軸標籤
      };

      /**
       * 小圖表批次繪製函數
       * 功能：遍歷所有主管機關，為每個主管機關創建對應的執行單位統計圖表
       *
       * 處理流程：
       * 1. 獲取前8名主管機關的數據
       * 2. 為每個主管機關提取其下前3名執行單位
       * 3. 調用通用圖表繪製函數創建小圖表
       *
       * 設計特點：
       * - 統一使用 drawChart 函數，確保視覺一致性
       * - 動態數據轉換，適配不同的數據結構
       * - 批次處理，提高渲染效率
       */
      const drawSupervisorCharts = () => {
        // 獲取計算屬性的值：前12名主管機關及其子單位數據
        // .value: Vue 3 Composition API 中獲取計算屬性實際值的語法
        const chartsData = getSupervisorChartsData.value;

        // 添加防護性檢查
        if (!chartsData || chartsData.length === 0) {
          return;
        }

        // 遍歷每個主管機關的數據，為其創建對應的小圖表
        // forEach(): JavaScript 陣列方法，對每個元素執行指定的函數
        chartsData.forEach((chartData) => {
          // 添加防護性檢查
          if (!chartData || !chartData.subUnits) {
            return;
          }

          // 數據格式轉換：將子單位數據轉換為圖表所需的格式
          // 只取前6名執行單位，符合用戶需求
          // slice(0, 6): 截取前6個子單位
          // map(): 將每個子單位轉換為標準的圖表數據格式
          const subUnitsData = chartData.subUnits
            .slice(0, 6)
            .map((unit) => {
              // 添加防護性檢查
              if (!unit || !unit.name_sub) {
                return null;
              }

              return {
                name: unit.name_sub, // 添加name屬性，drawChart函數需要這個屬性
                uniqueName: unit.name_sub,
                value: unit.委托案件數 || 0, // 使用委托案件數，提供默認值
                extra: {
                  count: unit.委托案件數 || 0, // 使用委托案件數，提供默認值
                  budget: Math.round(unit.本期經費平均_千元 || 0), // 使用本期經費平均_千元，提供默認值
                },
              };
            })
            .filter(Boolean); // 過濾掉 null 值

          // 如果沒有有效的子單位數據，跳過這個圖表
          if (subUnitsData.length === 0) {
            return;
          }

          // 小圖表配置對象：定義圖表的所有參數和設定
          const chartConfig = {
            // 容器ID：對應HTML中的元素ID，用於D3.js選擇器定位
            containerId: chartData.id,
            // 圖表數據：轉換後的執行單位數據陣列
            data: subUnitsData,
            // Y軸標籤：根據用戶需求，設為空字串不顯示
            yAxisLabel: '',
            // 容器高度：與主圖表完全一致（160px bar區域 + 160px文字區域）
            containerHeight: 320,
            // Tooltip模板：定義懸停提示的HTML內容（雖然已移除互動功能，但保留配置）
            tooltipTemplate: (d) => `
              <strong>${d.fullName}</strong><br/>
              案件數: ${d.value}<br/>
              平均預算: ${d.extra.budget}萬元<br/>
              主管機關: ${d.extra.agencyName}
            `,
          };

          // 調用通用圖表繪製函數：使用統一的繪圖邏輯創建小圖表
          // 傳入配置對象，確保所有小圖表具有一致的視覺風格
          drawChart(chartConfig);
        });
      };

      // ==================== 數據準備函數區域 ====================

      /**
       * 主圖表數據準備函數
       * 功能：從數據存儲中提取並轉換主管機關數據，準備用於主圖表顯示
       *
       * 處理邏輯：
       * 1. 從 dataStore 獲取排序後的主管機關數據
       * 2. 截取前8名（根據用戶最新需求調整）
       * 3. 轉換數據格式以適配圖表繪製函數
       * 4. 處理名稱長度以適應 X 軸顯示
       *
       * @returns {Array} 轉換後的圖表數據陣列
       */
      const prepareMainChartData = () => {
        const topAgencies = dataStore.getTopSupervisorAgencies;

        // 添加防護性檢查
        if (!topAgencies || topAgencies.length === 0) {
          return [];
        }

        return topAgencies
          .map((agency) => {
            // 確保 agency 和必要屬性存在
            if (!agency || !agency.name) {
              return null;
            }

            return {
              name: agency.name, // 添加name屬性用於顯示
              uniqueName: agency.name,
              value: agency.委托案件數 || 0, // 使用委托案件數，提供默認值
              extra: {
                count: agency.委托案件數 || 0, // 使用委托案件數，提供默認值
                budget: agency.本期經費平均_千元 || 0, // 使用本期經費平均_千元，提供默認值
              },
            };
          })
          .filter(Boolean); // 過濾掉 null 值
      };

      // ==================== 關係圖數據準備函數區域 ====================

      /**
       * 準備關係圖的節點和連結數據
       * 功能：從主管機關與執行單位映射數據中提取節點和邊的關係
       *
       * 數據過濾原則：
       * 只包含 "學術單位":"TRUE" 的數據，確保網絡圖只顯示學術相關的合作關係
       *
       * 數據處理流程：
       * 1. 數據過濾：從所有主管機關中篩選出學術單位（"學術單位":"TRUE"）
       * 2. 關係映射：收集與學術單位主管機關有關的所有映射關係
       * 3. 節點創建：為學術單位主管機關和相關執行單位創建節點數據
       * 4. 連結建立：基於映射關係創建節點間的連結，表示合作關係
       * 5. 數據驗證：確保所有連結都指向實際存在的節點，避免渲染錯誤
       *
       * 節點類型定義：
       * - 主管機關節點（type: 'agency'）：藍色圓圈，代表學術單位主管機關
       * - 執行單位節點（type: 'unit'）：橘色圓圈，代表與學術單位合作的執行單位
       *
       * 數據結構設計：
       * 每個節點包含完整的統計信息（案件數、預算、項目數等），
       * 每個連結包含關係強度信息（基於案件數或預算金額）。
       *
       * 返回值結構：
       * {
       *   nodes: Array,  // 節點數據陣列，包含主管機關和執行單位
       *   links: Array   // 連結數據陣列，表示節點間的合作關係
       * }
       *
       * 使用場景：
       * 為 D3.js 力導向網絡圖提供標準化的數據輸入，實現主管機關與
       * 執行單位合作關係的視覺化展示。
       */
      const prepareNetworkGraphData = () => {
        // 1. 獲取主管機關數據，找出所有學術單位
        const supervisorAgencies = dataStore.supervisorAgencies;
        if (!supervisorAgencies || supervisorAgencies.length === 0) {
          console.log('沒有主管機關數據');
          return { nodes: [], links: [] };
        }

        // 2. 創建學術單位集合
        const academicAgencies = new Set();
        supervisorAgencies.forEach((agency) => {
          if (agency.學術單位 === 'TRUE') {
            academicAgencies.add(agency.name);
          }
        });

        console.log('學術單位主管機關:', [...academicAgencies]);

        // 3. 獲取映射關係數據
        const mappingData = dataStore.supervisorExecutingMapping;
        if (!mappingData || mappingData.length === 0) {
          console.log('沒有映射關係數據');
          return { nodes: [], links: [] };
        }

        // 4. 過濾出只與學術單位有關的映射關係
        const academicMappings = mappingData.filter((item) => academicAgencies.has(item.name));

        console.log('過濾前映射數據數量:', mappingData.length);
        console.log('過濾後學術單位映射數量:', academicMappings.length);

        if (academicMappings.length === 0) {
          console.log('沒有學術單位的映射關係');
          return { nodes: [], links: [] };
        }

        // 5. 收集所有相關的執行單位，但只保留真正的學術單位
        const academicUnits = new Set();
        academicMappings.forEach((item) => {
          // 檢查執行單位本身是否為學術單位
          const unitData = dataStore.executingUnits.find((unit) => unit.name === item.name_sub);
          if (unitData && unitData.學術單位 === 'TRUE') {
            academicUnits.add(item.name_sub);
          }
        });

        // 6. 創建節點數據
        let nodes = [];

        // 添加學術單位主管機關節點
        academicAgencies.forEach((agencyName) => {
          // 計算該主管機關的統計數據
          const agencyMappings = academicMappings.filter((item) => item.name === agencyName);
          const totalCount = agencyMappings.reduce((sum, item) => sum + (item.委托案件數 || 0), 0);
          const totalBudget = agencyMappings.reduce(
            (sum, item) => sum + (item.本期經費平均_千元 || 0),
            0
          );
          const projectCount = agencyMappings.length;

          nodes.push({
            id: `agency-${agencyName}`,
            name: agencyName,
            type: 'agency',
            totalCount: totalCount,
            totalBudget: totalBudget,
            projectCount: projectCount,
            meanBudget: projectCount > 0 ? totalBudget / projectCount : 0,
            isAcademic: true, // 標記為學術單位
            academicStatus: 'TRUE', // 學術單位狀態
          });
        });

        // 添加與學術單位有關係的執行單位節點
        academicUnits.forEach((unitName) => {
          // 計算該執行單位的統計數據
          const unitMappings = academicMappings.filter((item) => item.name_sub === unitName);
          const totalCount = unitMappings.reduce((sum, item) => sum + (item.委托案件數 || 0), 0);
          const totalBudget = unitMappings.reduce(
            (sum, item) => sum + (item.本期經費平均_千元 || 0),
            0
          );
          const projectCount = unitMappings.length;

          // 從執行單位數據中獲取學術單位狀態
          const unitData = dataStore.executingUnits.find((item) => item.name === unitName);
          const unitAcademicStatus = unitData ? unitData.學術單位 : 'FALSE';

          nodes.push({
            id: `unit-${unitName}`,
            name: unitName,
            type: 'unit',
            totalCount: totalCount,
            totalBudget: totalBudget,
            projectCount: projectCount,
            meanBudget: projectCount > 0 ? totalBudget / projectCount : 0,
            isAcademic: unitAcademicStatus === 'TRUE',
            academicStatus: unitAcademicStatus, // 使用 JSON 數據中的學術單位狀態
          });
        });

        // 7. 創建連結數據，只保留目標執行單位是學術單位的連結
        let links = academicMappings
          .filter((item) => academicUnits.has(item.name_sub)) // 只保留目標執行單位在學術單位集合中的連結
          .map((item) => ({
            source: `agency-${item.name}`,
            target: `unit-${item.name_sub}`,
            value: item.委托案件數 || 0, // 案件數頁面使用委托案件數
          }));

        // 8. 合併案件數為 1 的執行單位節點為「其他」
        //    策略：
        //    - 找出 type==='unit' 且 totalCount === 1 的節點
        //    - 將其從 nodes/links 中移除，並建立單一聚合節點 'unit-其他'
        //    - 將所有指向這些節點的連結，依來源 agency 聚合加總為連到 'unit-其他' 的單一連結
        const unitNodesToMerge = new Set(
          nodes.filter((n) => n.type === 'unit' && Number(n.totalCount) === 1).map((n) => n.id)
        );

        if (unitNodesToMerge.size > 0) {
          // 聚合目標節點的統計量
          let aggTotalCount = 0;
          let aggTotalBudget = 0;
          let aggProjectCount = 0;

          nodes
            .filter((n) => unitNodesToMerge.has(n.id))
            .forEach((n) => {
              aggTotalCount += Number(n.totalCount) || 0;
              aggTotalBudget += Number(n.totalBudget) || 0;
              aggProjectCount += Number(n.projectCount) || 0;
            });

          // 依來源 agency 聚合連結權重
          const linkAggBySource = new Map(); // key: sourceId, val: sumValue
          links
            .filter((l) => unitNodesToMerge.has(l.target))
            .forEach((l) => {
              const prev = linkAggBySource.get(l.source) || 0;
              linkAggBySource.set(l.source, prev + (Number(l.value) || 0));
            });

          // 過濾掉原本指向要合併節點的連結
          const keptLinks = links.filter((l) => !unitNodesToMerge.has(l.target));

          // 若有聚合量，建立「其他」節點與新連結
          if (aggProjectCount > 0 || aggTotalCount > 0) {
            const otherNodeId = 'unit-其他';
            const otherNode = {
              id: otherNodeId,
              name: '其他',
              type: 'unit',
              totalCount: aggTotalCount,
              totalBudget: aggTotalBudget,
              projectCount: aggProjectCount,
              meanBudget: aggProjectCount > 0 ? aggTotalBudget / aggProjectCount : 0,
              isAcademic: true,
              academicStatus: 'TRUE',
            };

            // 產生聚合後的連結（每個 agency 只有一條連到「其他」）
            const aggregatedLinks = Array.from(linkAggBySource.entries()).map(
              ([sourceId, sumValue]) => ({
                source: sourceId,
                target: otherNodeId,
                value: sumValue || 1,
              })
            );

            // 更新 nodes 與 links（不提前 return，後續還要套用門檻過濾）
            const keptNodes = nodes.filter((n) => !unitNodesToMerge.has(n.id));
            keptNodes.push(otherNode);
            nodes = keptNodes;
            links = keptLinks.concat(aggregatedLinks);
          }
        }

        // 9. 門檻過濾：只繪製「委托案件數 > 10」的節點，並同步過濾連結
        const MIN_COUNT = 10;
        const allowedNodeIds = new Set(
          nodes.filter((n) => Number(n.totalCount) > MIN_COUNT).map((n) => n.id)
        );
        nodes = nodes.filter((n) => allowedNodeIds.has(n.id));
        links = links.filter((l) => allowedNodeIds.has(l.source) && allowedNodeIds.has(l.target));

        return { nodes, links };
      };

      // 學術單位案件數分布圖表功能已移除，恢復為地圖功能

      /**
       * 關係網絡圖繪製函數
       *
       * 功能說明：
       * 使用 D3.js 力導向布局算法創建主管機關與執行單位的關係網絡圖，
       * 通過節點和連結的視覺化展示，幫助用戶理解學術單位之間的合作關係
       * 和網絡結構。這個圖表是整個分析系統的核心視覺化組件之一。
       *
       * 技術實現架構：
       * - 布局引擎：D3.js 力導向模擬，實現節點的自動布局和動態調整
       * - 視覺化設計：SVG 繪製，支持縮放、拖拽等互動操作
       * - 數據驅動：基於 prepareNetworkGraphData 函數處理的標準化數據
       * - 響應式設計：自動適應容器尺寸，支持不同螢幕分辨率
       *
       * 視覺設計特點：
       * - 節點類型編碼：藍色圓圈代表主管機關，橘色圓圈代表執行單位
       * - 大小編碼：圓圈大小與案件數成正比，直觀反映業務規模
       * - 連結設計：灰色線條表示合作關係，線條粗細反映關係強度
       * - 布局算法：力導向布局自動優化節點位置，避免重疊
       *
       * 互動功能：
       * - 節點拖拽：用戶可以拖拽節點調整位置，優化視覺效果
       * - 懸停效果：滑鼠懸停時顯示詳細的統計信息
       * - 縮放平移：支持圖表的縮放和平移操作，便於查看細節
       * - 動態更新：節點位置會根據力導向算法自動調整，形成最佳布局
       *
       * 性能優化：
       * - 節點數量控制：只顯示學術單位相關的節點，避免圖表過於複雜
       * - 動畫優化：使用 D3.js 的過渡動畫，提升用戶體驗
       * - 記憶體管理：及時清理舊的圖表元素，防止記憶體洩漏
       */
      const drawNetworkGraph = () => {
        // 獲取圖表數據：節點和連結關係
        const graphData = prepareNetworkGraphData();

        // 數據驗證：如果沒有節點，顯示提示信息
        if (!graphData.nodes || graphData.nodes.length === 0) {
          const container = d3.select('#network-graph');
          container.html('<div class="text-center text-muted p-5">暫無關係數據</div>');
          return;
        }

        // 清除舊的圖表內容
        const container = d3.select('#network-graph');
        container.selectAll('*').remove();

        // 獲取容器尺寸：動態適應容器大小
        const containerRect = container.node().getBoundingClientRect();
        const width = containerRect.width;
        const height = 600; // 固定高度，與CSS設定一致

        // 創建 SVG 容器：關係圖的根元素
        const svg = container.append('svg').attr('width', width).attr('height', height);

        // 創建主繪圖群組：所有圖形元素的容器
        const g = svg.append('g');

        // 添加縮放功能：允許用戶縮放和平移圖表
        const zoom = d3
          .zoom()
          .scaleExtent([0.1, 3]) // 縮放範圍：0.1x 到 3x
          .on('zoom', (event) => {
            // 應用變換：縮放和平移
            g.attr('transform', event.transform);
          });

        // 將縮放行為綁定到 SVG 元素
        svg.call(zoom);

        // 設定力導向模擬：控制節點和連結的物理行為
        const simulation = d3
          .forceSimulation(graphData.nodes)
          .force(
            'link',
            d3
              .forceLink(graphData.links)
              .id((d) => d.id) // 使用節點 ID 來匹配連結
              .distance(100)
          ) // 連結的理想長度
          .force('charge', d3.forceManyBody().strength(-300)) // 節點間的排斥力
          .force('center', d3.forceCenter(width / 2, height / 2)) // 將圖形置於中心
          .force(
            'collision',
            d3.forceCollide().radius((d) => {
              // 計算節點半徑：讓節點面積與案件數成正比
              // 目標：1500案件數對應50×50×π = 2500π平方像素
              // 所以1案件數 = 1平方像素
              // 面積 = 案件數，半徑 = √(面積/π)
              const scaleMultiplier = 1.0; // 放大倍數：1.0 = 原始大小，2.0 = 放大2倍，0.5 = 縮小2倍
              const area = d.totalCount * scaleMultiplier; // 面積 = 案件數 × 放大倍數
              const radius = Math.sqrt(area / Math.PI);
              return Math.max(5, Math.min(radius, 100)); // 最小半徑5px（直徑10px），最大半徑100px（直徑200px）
            })
          ); // 防止節點重疊，調整碰撞半徑與圓圈大小一致

        // 繪製連結線：表示主管機關與執行單位的關係
        const links = g
          .append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(graphData.links)
          .enter()
          .append('line')
          .attr('stroke', '#999') // 灰色線條
          .attr('stroke-opacity', 0.6) // 半透明效果
          .attr('stroke-width', 2); // 固定線條寬度

        // 繪製節點：主管機關和執行單位的圓圈
        const nodes = g
          .append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(graphData.nodes)
          .enter()
          .append('circle')
          .attr('r', (d) => {
            // 計算節點半徑：讓節點面積與案件數成正比
            // 目標：1500案件數對應50×50×π = 2500π平方像素
            // 所以1案件數 = 1平方像素
            // 面積 = 案件數，半徑 = √(面積/π)
            const scaleMultiplier = 5.0; // 放大倍數：1.0 = 原始大小，2.0 = 放大2倍，0.5 = 縮小2倍
            const area = d.totalCount * scaleMultiplier; // 面積 = 案件數 × 放大倍數
            const radius = Math.sqrt(area / Math.PI);
            return Math.max(5, Math.min(radius, 100)); // 最小半徑5px（直徑10px），最大半徑100px（直徑200px）
          })
          .attr('fill', (d) => (d.type === 'agency' ? '#4a90e2' : '#f5a623')) // 藍色：機關，橘色：單位
          .attr('stroke', '#fff') // 白色邊框
          .attr('stroke-width', 2) // 邊框寬度
          .style('cursor', 'pointer') // 滑鼠游標變為手型
          .call(
            d3
              .drag() // 添加拖拽功能
              .on('start', dragstarted) // 拖拽開始
              .on('drag', dragged) // 拖拽進行中
              .on('end', dragended)
          ); // 拖拽結束

        // 添加節點標籤：顯示機關或單位名稱
        const labels = g
          .append('g')
          .attr('class', 'labels')
          .selectAll('text')
          .data(graphData.nodes)
          .enter()
          .append('text')
          .text((d) => {
            // 截短過長的名稱：超過10個字符則截斷並加省略號
            return d.name.length > 10 ? d.name.substring(0, 10) + '...' : d.name;
          })
          .attr('font-size', '12px')
          .attr('font-family', 'Arial, sans-serif')
          .attr('fill', '#333')
          .attr('text-anchor', 'middle') // 文字置中對齊
          .attr('dy', '0.35em') // 垂直置中調整
          .style('pointer-events', 'none'); // 標籤不響應滑鼠事件

        // 創建自定義 tooltip 元素
        const tooltip = d3
          .select('body')
          .append('div')
          .attr('class', 'network-tooltip')
          .style('position', 'absolute')
          .style('padding', '10px')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('border-radius', '5px')
          .style('font-size', '12px')
          .style('line-height', '1.4')
          .style('pointer-events', 'none')
          .style('opacity', 0)
          .style('z-index', '1000');

        // 添加滑鼠事件：懸停顯示詳細資訊
        nodes
          .on('mouseover', function (event, d) {
            // 高亮當前節點
            d3.select(this)
              .transition()
              .duration(200)
              .attr('stroke-width', 3)
              .attr('stroke', '#333');

            // 準備顯示的資訊
            const typeText = d.type === 'agency' ? '主管機關' : '執行單位';

            let tooltipContent = `
              <div style="font-weight: bold; margin-bottom: 5px;">${typeText}</div>
              <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">${d.name}</div>
              <div>案件數: <span style="color: #4a90e2;">${d.totalCount}</span></div>
              <div>平均金額: <span style="color: #50e3c2;">${Math.round(d.totalBudget / d.projectCount || 0).toLocaleString()}</span>(千元)</div>
            `;

            // 如果是執行單位，顯示額外資訊
            if (d.type === 'unit') {
              tooltipContent += `<div style="margin-top: 5px; color: #f5a623;">🏫 學術機構</div>`;
            }

            // 顯示 tooltip
            tooltip
              .html(tooltipContent)
              .style('opacity', 1)
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 10 + 'px');
          })
          .on('mousemove', function (event) {
            // 跟隨滑鼠移動
            tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 10 + 'px');
          })
          .on('mouseout', function () {
            // 恢復節點樣式
            d3.select(this)
              .transition()
              .duration(200)
              .attr('stroke-width', 2)
              .attr('stroke', '#fff');

            // 隱藏 tooltip
            tooltip.transition().duration(200).style('opacity', 0);
          });

        // 力導向模擬的每一幀更新：更新節點和連結位置
        simulation.on('tick', () => {
          // 更新連結線的位置
          links
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y);

          // 更新節點圓圈的位置
          nodes.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

          // 更新標籤文字的位置
          labels.attr('x', (d) => d.x).attr('y', (d) => d.y);
        });

        // 拖拽事件處理函數：拖拽開始時重新啟動模擬
        function dragstarted(event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; // 固定 X 座標
          d.fy = d.y; // 固定 Y 座標
        }

        // 拖拽進行中：更新節點位置
        function dragged(event, d) {
          d.fx = event.x; // 更新固定的 X 座標
          d.fy = event.y; // 更新固定的 Y 座標
        }

        // 拖拽結束：釋放節點固定位置
        function dragended(event, d) {
          if (!event.active) simulation.alphaTarget(0); // 停止模擬的熱重啟
          d.fx = null; // 釋放 X 座標固定
          d.fy = null; // 釋放 Y 座標固定
        }
      };

      // ==================== 地圖初始化函數區域 ====================

      /**
       * 台灣地圖初始化函數
       * 功能：使用 Leaflet.js 創建互動式地圖，顯示學術單位執行單位的地理分布
       *
       * 地圖特色：
       * - 以台灣為中心的地理視圖
       * - 圓圈標記代表執行單位位置
       * - 圓圈大小反映案件數量
       * - 點擊圓圈顯示詳細信息
       * - 滿版顯示設計（左右下邊緣對齊容器）
       *
       * 數據篩選：
       * - 只顯示包含「大學」或「學院」關鍵字的執行單位
       * - 過濾掉沒有地理座標的單位
       */
      /**
       * 台灣地圖初始化函數
       *
       * 功能說明：
       * 創建互動式台灣地圖，在地圖上標記所有學術單位（學術單位）的地理位置，
       * 並通過圓圈大小視覺化顯示各單位的案件數規模。這為用戶提供了
       * 學術單位地理分布的直觀視圖，幫助理解研究案的地理分布模式。
       *
       * 技術實現架構：
       * - 地圖引擎：使用 Leaflet.js 創建互動式地圖
       * - 地圖服務：基於 OpenStreetMap 的免費地圖服務
       * - 視覺化設計：圓圈大小與案件數成正比，實現數據的視覺化表達
       * - 互動功能：支持縮放、拖拽、懸停效果和點擊彈出視窗
       *
       * 數據處理邏輯：
       * 1. 從 dataStore 獲取學術單位數據（"學術單位":"TRUE"）
       * 2. 結合地理位置數據，過濾出有座標信息的單位
       * 3. 根據案件數計算圓圈大小，實現數據的視覺化表達
       * 4. 為每個單位創建互動式標記，包含詳細的統計信息
       *
       * 視覺設計特點：
       * - 圓圈標記：使用紅色圓圈標記學術單位位置
       * - 大小編碼：圓圈大小反映委托案件數的相對規模
       * - 透明度設計：半透明填充，確保地圖底層可見
       * - 懸停效果：滑鼠懸停時圓圈變大變深，提升用戶體驗
       *
       * 彈出視窗內容：
       * 點擊圓圈時顯示包含單位名稱、委托案件數和平均金額的詳細信息
       */
      const initMap = () => {
        // 防止重複初始化：檢查地圖容器是否已存在 Leaflet 實例
        const mapContainer = document.getElementById('taiwan-map');

        // 檢查容器是否存在
        if (!mapContainer) {
          console.warn('地圖容器 taiwan-map 不存在');
          return;
        }

        // Leaflet 實例檢查：_leaflet_id 是 Leaflet 自動添加的內部屬性
        // 如果存在則表示已經初始化過地圖實例
        if (mapContainer._leaflet_id) {
          // 清理舊的 Leaflet 實例：重置內部 ID 和清空容器內容
          mapContainer._leaflet_id = null; // 重置 Leaflet 內部標識
          mapContainer.innerHTML = ''; // 清空容器內的所有 HTML 內容
        }

        // 創建地圖實例，設定中心點為台灣中部，移除版權和縮放控制
        const map = L.map('taiwan-map', {
          zoomControl: false, // 移除縮放按鈕
          attributionControl: false, // 移除版權bar
        }).setView([23.8, 120.9], 7);

        // 添加 OpenStreetMap 圖層（無版權標示）
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '', // 移除版權文字
        }).addTo(map);

        // 獲取包含"大學"或"學院"並有地理位置的執行單位數據
        const universityUnits = dataStore.getUniversityExecutingUnitsWithLocation;

        // 輸出除錯資訊
        console.log('地圖數據:', {
          總大學學院數: universityUnits.length,
          有地理位置的數量: universityUnits.filter((u) => u.hasLocation).length,
          樣本數據: universityUnits.slice(0, 3),
        });

        // 如果沒有數據，顯示提示訊息
        if (universityUnits.length === 0) {
          console.warn('沒有找到包含學術單位且有地理位置的執行單位數據');
          return;
        }

        // 在地圖上添加圓圈標記，大小反映案件數
        universityUnits.forEach((unit) => {
          // 跳過沒有地理位置的單位
          if (!unit.hasLocation) return;

          // 計算圓圈大小：基於案件數的相對大小
          // 使用對數比例確保視覺效果合理
          const scaleFactor = 10; // 縮放因子，調整整體大小
          const radius = Math.sqrt((unit.委托案件數 * scaleFactor) / Math.PI); // 使用委托案件數

          // 創建圓圈標記
          const circle = L.circle([unit.lat, unit.lng], {
            color: 'var(--my-color-red)', // 邊框顏色
            fillColor: 'var(--my-color-red)', // 填充顏色
            fillOpacity: 0.6, // 透明度
            radius: radius * 1000, // 轉換為公尺
            weight: 1, // 邊框寬度
          }).addTo(map);

          // 創建詳細的彈出視窗內容
          const popupContent = `
            <div>
              <strong>${unit.name}</strong><br/>
              <div>
                <div>委托案件數: ${unit.委托案件數.toLocaleString()}</div>
                <div>平均金額: ${Math.round(unit.本期經費平均_千元).toLocaleString()}(千元)</div>
              </div>
            </div>
          `;

          // 綁定彈出視窗
          circle.bindPopup(popupContent, {
            maxWidth: 300,
          });

          // 添加滑鼠懸停效果
          circle.on('mouseover', function () {
            this.setStyle({
              fillOpacity: 0.8,
              weight: 3,
            });
          });

          circle.on('mouseout', function () {
            this.setStyle({
              fillOpacity: 0.6,
              weight: 2,
            });
          });
        });
      };

      /**
       * 文字雲繪製函數
       *
       * 功能說明：
       * 使用 D3.js 創建學術單位的文字雲視覺化，文字大小反映各單位的委托案件數。
       * 這為用戶提供了另一種視角來理解學術單位的案件分布情況，文字越大表示案件數越多。
       *
       * 技術實現架構：
       * - 布局算法：使用 D3.js 的 d3-cloud 布局算法，實現文字的隨機分布
       * - 視覺化設計：文字大小與案件數成正比，實現數據的視覺化表達
       * - 互動功能：支持滑鼠懸停效果，顯示詳細的統計信息
       * - 響應式設計：自動適應容器尺寸，支持不同螢幕分辨率
       *
       * 數據處理邏輯：
       * 1. 從 dataStore 獲取學術單位數據（"學術單位":"TRUE"）
       * 2. 過濾出有案件數的單位，避免顯示零案件數的單位
       * 3. 根據案件數計算文字大小，實現數據的視覺化表達
       * 4. 使用 d3-cloud 算法計算文字的隨機位置，避免重疊
       *
       * 視覺設計特點：
       * - 文字大小編碼：文字大小與委托案件數成正比
       * - 顏色編碼：使用漸變色彩，案件數越多顏色越深
       * - 隨機布局：文字位置隨機分布，創造視覺上的動態感
       * - 懸停效果：滑鼠懸停時文字變大變深，提升用戶體驗
       *
       * 性能優化：
       * - 只顯示有案件數的學術單位，避免無意義的視覺元素
       * - 使用 D3.js 的過渡動畫，提升用戶體驗
       * - 及時清理舊的文字雲元素，防止記憶體洩漏
       */
      const drawWordCloud = () => {
        // 獲取文字雲容器
        const container = d3.select('#word-cloud');
        if (container.empty()) {
          console.warn('文字雲容器 #word-cloud 不存在');
          return;
        }

        // 清理容器
        container.selectAll('*').remove();

        // 獲取學術單位數據
        const academicUnits = dataStore.executingUnits.filter(
          (unit) => unit.學術單位 === 'TRUE' && unit.委托案件數 > 0
        );

        if (academicUnits.length === 0) {
          container
            .append('div')
            .attr('class', 'd-flex align-items-center justify-content-center h-100')
            .style('color', '#666')
            .text('無學術單位數據');
          return;
        }

        // 計算字級比例尺（壓縮動態範圍，避免字過大）
        const countsForScale = academicUnits.map((u) => u.委托案件數 || 0);
        const minCountForScale = d3.min(countsForScale) || 0;
        const maxCountForScale = d3.max(countsForScale) || 1;
        const sizeScale = d3
          .scalePow()
          .exponent(1.15)
          .domain([minCountForScale, maxCountForScale])
          .range([12, 44]);

        // 準備文字雲數據（套用縮小後字級）
        const wordData = academicUnits.map((unit) => ({
          text: unit.name,
          size: Math.max(10, Math.round(sizeScale(unit.委托案件數 || 0))),
          count: unit.委托案件數,
          budget: unit.本期經費平均_千元 || 0,
        }));

        // 創建 SVG 容器
        const containerWidth = container.node().getBoundingClientRect().width;
        const containerHeight = 400;

        const svg = container
          .append('svg')
          .attr('width', containerWidth)
          .attr('height', containerHeight);

        // CSS 顏色變數陣列
        const cssColors = [
          'var(--my-color-red)',
          'var(--my-color-pink)',
          'var(--my-color-deeporange)',
          'var(--my-color-orange)',
          'var(--my-color-amber)',
          'var(--my-color-yellow)',
          'var(--my-color-lime)',
          'var(--my-color-light-green)',
          'var(--my-color-green)',
          'var(--my-color-teal)',
          'var(--my-color-cyan)',
          'var(--my-color-lightblue)',
          'var(--my-color-blue)',
          'var(--my-color-bluegrey)',
          'var(--my-color-indigo)',
          'var(--my-color-deeppurple)',
          'var(--my-color-purple)',
          'var(--my-color-brown)',
        ];

        // 以螺旋搜尋與實際文字矩形碰撞檢測的防重疊布局
        const words = [];
        const placedRects = [];

        // 測量特定字級的文字實際寬高
        const measureText = (text, fontSize) => {
          const tempSvg = d3
            .select('body')
            .append('svg')
            .attr('width', 0)
            .attr('height', 0)
            .style('position', 'absolute')
            .style('left', '-9999px')
            .style('top', '-9999px');
          const tempText = tempSvg
            .append('text')
            .style('font-size', `${fontSize}px`)
            .style('font-family', 'Arial, Microsoft JhengHei, sans-serif')
            .text(text);
          const bbox = tempText.node().getBBox();
          tempSvg.remove();
          return { width: bbox.width, height: bbox.height };
        };

        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const marginPad = 2;

        const rectsIntersect = (a, b) =>
          !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);

        const sortedWordData = [...wordData].sort((a, b) => b.size - a.size);

        sortedWordData.forEach((word) => {
          let placed = false;

          // 嘗試縮小字級以增加可放置機會
          for (let trySize = word.size; trySize >= 10 && !placed; trySize -= 2) {
            const { width, height } = measureText(word.text, trySize);

            // 螺旋搜尋位置
            for (let t = 0; t < 2000 && !placed; t++) {
              const angle = 0.35 * t;
              const radius = 2 + 2 * angle;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);

              const rect = {
                left: x - width / 2 - marginPad,
                right: x + width / 2 + marginPad,
                top: y - height / 2 - marginPad,
                bottom: y + height / 2 + marginPad,
              };

              // 邊界檢查
              if (
                rect.left < 0 ||
                rect.right > containerWidth ||
                rect.top < 0 ||
                rect.bottom > containerHeight
              ) {
                continue;
              }

              // 與已放置文字碰撞檢測
              const hasCollision = placedRects.some((r) => rectsIntersect(rect, r));
              if (!hasCollision) {
                // 朝中心方向作微移擠壓，盡量貼近中心
                let curX = x;
                let curY = y;
                let curRect = { ...rect };
                for (let s = 0; s < 80; s++) {
                  const vx = centerX - curX;
                  const vy = centerY - curY;
                  const vlen = Math.hypot(vx, vy) || 1;
                  const step = 1; // 每步1px
                  const nx = curX + (vx / vlen) * step;
                  const ny = curY + (vy / vlen) * step;
                  const nrect = {
                    left: nx - width / 2 - marginPad,
                    right: nx + width / 2 + marginPad,
                    top: ny - height / 2 - marginPad,
                    bottom: ny + height / 2 + marginPad,
                  };
                  const outOfBounds =
                    nrect.left < 0 ||
                    nrect.right > containerWidth ||
                    nrect.top < 0 ||
                    nrect.bottom > containerHeight;
                  const collide = placedRects.some((r) => rectsIntersect(nrect, r));
                  if (outOfBounds || collide) break;
                  curX = nx;
                  curY = ny;
                  curRect = nrect;
                }

                const placedWord = {
                  text: word.text,
                  size: trySize,
                  budget: word.budget,
                  count: word.count,
                  x: curX,
                  y: curY,
                  color: cssColors[Math.floor(Math.random() * cssColors.length)],
                };
                words.push(placedWord);
                placedRects.push(curRect);
                placed = true;
              }
            }
          }
        });

        // 繪製文字雲
        svg
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', (d) => `${d.size}px`)
          .style('font-family', 'Arial, Microsoft JhengHei, sans-serif')
          .style('font-weight', 'bold')
          .style('fill', (d) => d.color)
          .style('cursor', 'pointer')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('x', (d) => d.x)
          .attr('y', (d) => d.y)
          // 移除旋轉以簡化碰撞判定
          .text((d) => d.text)
          .on('mouseover', function (event, d) {
            // 懸停效果
            d3.select(this).style('fill', 'var(--my-color-red)');

            // 顯示 tooltip
            const tooltip = d3
              .select('body')
              .append('div')
              .attr('class', 'word-cloud-tooltip')
              .style('position', 'absolute')
              .style('background', 'rgba(0, 0, 0, 0.8)')
              .style('color', 'white')
              .style('padding', '8px 12px')
              .style('border-radius', '4px')
              .style('font-size', '12px')
              .style('pointer-events', 'none')
              .style('z-index', '1000');

            tooltip.html(`
              <div><strong>${d.text}</strong></div>
              <div>委托案件數: ${d.count.toLocaleString()}</div>
              <div>平均金額: ${Math.round(d.budget).toLocaleString()}(千元)</div>
            `);
          })
          .on('mousemove', function (event) {
            // 跟隨滑鼠移動 tooltip
            d3.select('.word-cloud-tooltip')
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 10 + 'px');
          })
          .on('mouseout', function (event, d) {
            // 恢復原始狀態
            d3.select(this).style('font-size', `${d.size}px`).style('fill', d.color);

            // 移除 tooltip
            d3.select('.word-cloud-tooltip').remove();
          });
      };

      // ==================== 生命週期鉤子 (Lifecycle Hooks) ====================
      // 本區域包含 Vue 組件的生命週期管理函數，負責組件的初始化、數據載入、
      // 圖表渲染和清理工作。這些鉤子確保組件在不同生命週期階段的正確行為。

      /**
       * 組件掛載生命週期鉤子
       *
       * 功能說明：
       * 在組件 DOM 掛載完成後執行的初始化邏輯，這是組件生命週期中最關鍵的階段。
       * 負責載入所有必要的數據、初始化各種圖表組件，並確保整個分析系統
       * 能夠正常運行。這個鉤子使用異步處理，確保數據載入的完整性和可靠性。
       *
       * 執行流程設計：
       * 1. 數據載入階段：從 dataStore 載入所有必要的數據源
       *    - 主管機關數據：包含基本信息和統計數據
       *    - 執行單位數據：包含單位信息和地理位置
       *    - 映射關係數據：主管機關與執行單位的合作關係
       *    - 地理位置數據：執行單位的座標信息
       *
       * 2. DOM 更新等待：使用 nextTick 確保 Vue 的響應式更新完成
       *    - 等待模板渲染完成
       *    - 確保所有 DOM 容器都已準備就緒
       *    - 避免在容器未準備好時進行圖表渲染
       *
       * 3. 圖表初始化階段：按順序初始化各種視覺化組件
       *    - 主圖表：主管機關委托案件數統計圖表
       *    - 小圖表：12個主管機關下屬執行單位分析圖表
       *    - 地圖：台灣地圖上的學術單位分布
       *    - 網絡圖：主管機關與執行單位的關係網絡
       *
       * 4. 錯誤處理和調試：提供詳細的載入狀態信息和錯誤處理
       *    - 記錄載入過程中的關鍵信息
       *    - 輸出數據統計信息，便於問題診斷
       *    - 處理載入失敗的情況，提供用戶友好的錯誤提示
       *
       * 技術特點：
       * - 異步處理：使用 async/await 確保數據載入的順序性和可靠性
       * - 錯誤處理：完善的錯誤捕獲和處理機制
       * - 性能優化：並行載入數據源，提升載入速度
       * - 狀態管理：與 Pinia store 緊密集成，實現數據的統一管理
       */
      onMounted(async () => {
        // 開發調試信息：記錄組件初始化開始
        // eslint-disable-next-line no-console
        console.log('案件數統計頁面已初始化');

        // 數據載入階段：從 dataStore 載入所有必要的數據
        // await: 等待異步操作完成，確保數據準備就緒
        // loadAllData(): dataStore 中的方法，載入主管機關、執行單位等所有數據
        await dataStore.loadAllData();

        // 開發調試信息：輸出載入狀態資訊，協助問題診斷
        // eslint-disable-next-line no-console
        console.log('資料載入狀態:', {
          // 原始主管機關數據的數量
          主管機關數量: dataStore.supervisorAgencies.length,
          // 主管機關與執行單位映射關係的數量
          映射資料數量: dataStore.supervisorExecutingMapping.length,
          // 經過處理的前N名主管機關數量
          前十名主管機關: dataStore.getTopSupervisorAgencies.length,
          // 當前載入狀態（布林值）
          載入中: dataStore.loading,
          // 載入過程中的錯誤信息（如果有）
          錯誤: dataStore.error,
        });

        // DOM 更新等待：確保 Vue 的響應式更新完成後再進行 DOM 操作
        // nextTick(): Vue 3 提供的方法，等待下一個 DOM 更新週期
        // 這確保所有的模板渲染和條件顯示都已完成，DOM 容器已準備就緒
        const redrawAll = () => {
          // 主圖表初始化：創建配置對象並調用繪圖函數
          const mainChartConfig = {
            // DOM 容器 ID：對應模板中的主圖表容器
            containerId: 'main-chart',
            // 圖表數據：調用數據準備函數獲取前8名主管機關數據
            data: prepareMainChartData(),
            // Y 軸標籤：根據用戶需求，設為空字串不顯示
            yAxisLabel: '',
            // 提高主圖高度：bar 區 320、容器總高 480（原本 160/320）
            getChartHeight: () => 320,
            getContainerHeight: () => 480,
          };
          // 調用主圖表繪製函數：使用配置對象創建主統計圖表
          drawChart(mainChartConfig);

          // 調用小圖表批次繪製函數：為每個主管機關創建執行單位圖表
          drawSupervisorCharts();

          // 調用地圖初始化函數：創建台灣地圖並添加學術單位標記
          initMap();

          // 調用關係圖繪製函數：創建主管機關與執行單位的網絡關係圖
          drawNetworkGraph();

          // 調用文字雲繪製函數：創建學術單位案件數文字雲
          drawWordCloud();
        };

        nextTick(() => {
          redrawAll();
          let resizeTimer = null;
          const onResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
              // 清空主要容器避免重疊
              d3.select('#main-chart').selectAll('*').remove();
              redrawAll();
            }, 200);
          };
          window.addEventListener('resize', onResize);
          CaseCount_onResize = onResize;
        });
      });

      /**
       * 組件卸載生命週期鉤子
       *
       * 功能說明：
       * 在組件從 DOM 中移除前執行的清理工作，這是組件生命週期的最後階段。
       * 負責清理組件運行過程中創建的各種資源，防止記憶體洩漏和 DOM 污染，
       * 確保組件能夠安全地卸載，並且不會影響其他組件或頁面的正常運行。
       *
       * 清理工作的重要性：
       * 1. 記憶體管理：清理 D3.js 創建的大型數據結構和事件監聽器
       * 2. DOM 清理：移除可能殘留在全域範圍的 DOM 元素
       * 3. 事件清理：解除事件綁定，防止事件監聽器洩漏
       * 4. 資源釋放：釋放圖表相關的計算資源和緩存
       *
       * 清理策略設計：
       * - 主動清理：在組件卸載時主動清理所有創建的資源
       * - 選擇性清理：針對特定的元素類別進行清理，避免影響其他組件
       * - 安全清理：使用 try-catch 包裝清理邏輯，確保清理過程不會出錯
       * - 完整性檢查：清理完成後進行檢查，確保沒有遺漏的資源
       *
       * 注意事項：
       * 由於在圖表重繪時使用了 selectAll('*').remove()，大部分 DOM 元素的
       * 清理工作已經在重繪過程中自動完成。這個鉤子主要負責清理那些可能
       * 殘留在全域範圍或需要特殊處理的資源。
       */
      let CaseCount_onResize = null;
      onUnmounted(() => {
        // 清理 D3.js 創建的全域圖表標籤元素
        // selectAll('.bar-label'): 選擇所有具有 'bar-label' 類別的元素
        // remove(): 從 DOM 中移除選中的元素，釋放記憶體
        // 這確保組件卸載時不會留下孤立的 DOM 元素
        d3.selectAll('.bar-label').remove();

        // 清理網絡圖的 tooltip 元素，避免記憶體洩漏
        d3.selectAll('.network-tooltip').remove();

        // 清理文字雲的 tooltip 元素，避免記憶體洩漏
        d3.selectAll('.word-cloud-tooltip').remove();
        if (CaseCount_onResize) window.removeEventListener('resize', CaseCount_onResize);
      });

      // ==================== 返回對象 (Return Object) ====================
      // 在 Vue 3 Composition API 中，setup 函數必須返回一個對象，
      // 這個對象包含模板中需要使用的所有響應式數據、計算屬性和方法。
      // 返回的對象會與模板進行響應式綁定，當數據變化時，模板會自動更新。

      return {
        // 數據管理 Store 實例
        // 提供給模板使用的 Pinia store 實例，包含所有數據載入、處理和狀態管理功能
        // 模板可以通過 dataStore.loading、dataStore.supervisorAgencies 等方式訪問數據狀態
        dataStore,

        // 調試信息計算屬性
        // 提供給模板的調試和狀態顯示數據，包含載入狀態、錯誤信息、數據統計等關鍵信息
        // 用於模板中的條件渲染，顯示載入中、錯誤或數據狀態
        debugInfo,

        // 主管機關小圖表數據計算屬性
        // 提供前12名主管機關的圖表配置數據，每個主管機關對應一個小圖表
        // 模板中的 v-for 指令使用此數據來動態生成12個小圖表，顯示各機關的執行單位分布
        getSupervisorChartsData,
        exportContainerSvgAsPng,
      };
    }, // setup 函數結束
  }; // Vue 組件配置對象結束
</script>

<template>
  <div class="case-count-container">
    <div class="w-100 px-3">
      <div class="row">
        <div class="col-6">
          <div class="chart-container my-bgcolor-white rounded-4 border py-3 position-relative">
            <button
              class="btn btn-sm btn-outline-secondary position-absolute"
              style="
                top: 8px;
                right: 8px;
                z-index: 2;
                color: var(--my-color-gray-400);
                border-color: var(--my-color-gray-400);
              "
              title="下載 PNG"
              @click="exportContainerSvgAsPng('main-chart', '案件數_主圖表.png')"
            >
              <i class="fa-solid fa-download"></i>
            </button>
            <div class="d-flex justify-content-center my-title-md-black">
              主管機關委托案件數統計 (前12名)
            </div>
            <div v-if="debugInfo.error" class="alert alert-danger mb-3">
              載入錯誤：{{ debugInfo.error }}
            </div>
            <div v-if="debugInfo.loading" class="text-center text-muted mb-3">載入中...</div>

            <div
              v-if="!debugInfo.hasData && !debugInfo.loading && !debugInfo.error"
              class="text-center text-muted mb-3"
            >
              無資料
            </div>

            <div id="main-chart" style="min-height: 480px"></div>
          </div>
        </div>

        <div class="col-6">
          <div class="chart-container my-bgcolor-white rounded-4 border pt-3">
            <div class="d-flex justify-content-center my-title-md-black pb-3">
              學術單位案件數分布
            </div>
            <div id="taiwan-map" style="height: 480px; border-radius: 0 0 1rem 1rem"></div>
          </div>
        </div>
      </div>

      <div class="row">
        <div v-for="chartData in getSupervisorChartsData" :key="chartData.id" class="col-3 mt-4">
          <div class="chart-container my-bgcolor-white rounded-4 border py-3 position-relative">
            <button
              class="btn btn-sm btn-outline-secondary position-absolute"
              style="
                top: 8px;
                right: 8px;
                z-index: 2;
                color: var(--my-color-gray-400);
                border-color: var(--my-color-gray-400);
              "
              title="下載 PNG"
              @click="exportContainerSvgAsPng(chartData.id, chartData.title + '_小圖表.png')"
            >
              <i class="fa-solid fa-download"></i>
            </button>
            <div class="d-flex justify-content-center my-title-md-black">
              {{ chartData.title }}
            </div>
            <div :id="chartData.id" style="min-height: 320px"></div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 mt-4">
          <div class="my-bgcolor-white rounded-4 border p-3 position-relative">
            <button
              class="btn btn-sm btn-outline-secondary position-absolute"
              style="
                top: 8px;
                right: 8px;
                z-index: 2;
                color: var(--my-color-gray-400);
                border-color: var(--my-color-gray-400);
              "
              title="下載 PNG"
              @click="exportContainerSvgAsPng('network-graph', '案件數_關係圖.png')"
            >
              <i class="fa-solid fa-download"></i>
            </button>
            <div class="d-flex justify-content-center my-title-md-black mb-3">
              主管機關與執行單位關係網絡圖
            </div>

            <div id="network-graph" style="height: 600px; width: 100%"></div>
          </div>
        </div>
      </div>

      <!-- 文字雲獨立框 -->
      <div class="row">
        <div class="col-12 mt-4">
          <div class="my-bgcolor-white rounded-4 border p-3">
            <div class="d-flex justify-content-center my-title-md-black mb-3">
              學術單位案件數文字雲
            </div>
            <div id="word-cloud" style="height: 400px; width: 100%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* 使用Bootstrap和common.css的樣式，高度設定使用內聯style */
</style>
