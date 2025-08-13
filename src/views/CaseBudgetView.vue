<!--
  平均金額分析視圖組件

  功能描述：
  1. 顯示前10名主管機關的平均金額統計（主圖表）
  2. 顯示每個主管機關下的前10名執行單位（10個小圖表）
  3. 顯示台灣地圖分布（地圖組件）
  4. 提供響應式設計和互動式 tooltip

  數據來源：
  - 計畫主管機關_normalize.json：主管機關數據
  - 計畫主管機關_執行單位名稱_normalize.json：映射關係數據
-->

<script>
  import { computed, onMounted, onUnmounted, nextTick } from 'vue';
  import { useDataStore } from '@/stores/dataStore';
  import * as d3 from 'd3';
  import L from 'leaflet';

  export default {
    // 組件名稱：用於 Vue DevTools 調試和組件識別
    name: 'CaseBudgetView',

    setup() {
      const dataStore = useDataStore();

      // ==================== 計算屬性區域 ====================
      // 計算屬性具有響應式特性，當依賴的數據變化時會自動重新計算
      // 同時具有緩存特性，只有依賴變化時才重新計算，提高性能

      /**
       * 小圖表數據結構計算屬性
       * 功能：為前12名主管機關創建小圖表所需的數據結構
       * 每個主管機關對應一個小圖表，顯示其下的執行單位統計
       *
       * 返回值：包含12個圖表配置對象的陣列
       * 每個對象包含：id（唯一標識）、title（顯示標題）、agencyData（機關資料）、subUnits（子單位列表）
       */
      const getSupervisorChartsData = computed(() => {
        // 從 dataStore 獲取前12名主管機關數據
        // getTop10AgenciesWithSubUnitsByBudget: store 中的 getter，返回按平均預算排序的主管機關數據
        // slice(0, 12): JavaScript 陣列方法，截取前12個元素
        const top12AgenciesWithSubUnits = dataStore.getTop10AgenciesWithSubUnitsByBudget.slice(
          0,
          12
        );

        // 使用 map 方法轉換數據結構，為每個主管機關創建圖表配置對象
        // map: JavaScript 陣列方法，對每個元素執行轉換函數，返回新陣列
        // (agency, index): 回調函數參數，agency 是當前主管機關數據，index 是索引
        return top12AgenciesWithSubUnits.map((agency, index) => ({
          // 為每個圖表生成唯一的 DOM 元素 ID
          // 格式：supervisor-chart-1, supervisor-chart-2, ...
          // 用於 D3.js 選擇器定位對應的 DOM 元素
          id: `supervisor-chart-${index + 1}`,

          // 生成顯示標題，如果名稱超過8個字符則截短並加省略號
          // 顯示完整的主管機關名稱作為標題
          title: agency.name,

          // 主管機關的完整數據對象，包含名稱、案件數、平均預算
          agencyData: {
            name: agency.name, // 完整主管機關名稱，未截短
            委托案件數: agency.委托案件數, // 該主管機關的案件總數
            所有相符資料_JSON: agency.所有相符資料_JSON, // 該主管機關的平均預算金額
          },

          // 該主管機關下的執行單位列表
          // 使用邏輯或運算符 || 提供默認值，防止 undefined 錯誤
          // 如果 agency.subUnits 存在則使用它，否則使用空陣列
          subUnits: agency.subUnits || [],
        }));
      });

      /**
       * 除錯資訊計算屬性
       * 功能：提供開發階段的問題診斷和數據驗證資訊
       * 用於在模板中顯示載入狀態、錯誤信息和數據統計
       *
       * 返回值：包含數據可用性、數據量、載入狀態和錯誤信息的對象
       */
      const debugInfo = computed(() => ({
        // 數據可用性檢查：判斷是否有主管機關數據
        // 布林值：通過檢查 supervisorAgencies 陣列長度是否大於0
        // length > 0 表示有數據，length === 0 表示無數據
        hasData: dataStore.supervisorAgencies.length > 0,

        // 篩選後數據量：前10名主管機關的數量
        // 數字：經過篩選和排序後的前10名主管機關數量
        // 用於驗證數據處理邏輯是否正確
        topUnitsCount: dataStore.getTopSupervisorAgencies.length,

        // 數據載入狀態：從 dataStore 獲取當前是否正在載入數據
        // 布林值：true 表示正在載入，false 表示載入完成
        loading: dataStore.loading,

        // 錯誤信息：從 dataStore 獲取載入過程中的錯誤信息
        // 字串或 null：有錯誤時為錯誤訊息，無錯誤時為 null
        error: dataStore.error,
      }));

      // ==================== 圖表繪製函數 ====================

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
       * @param {number} config.containerHeight - 容器高度（可選）
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

        // 設定容器高度，使用傳入值或默認值320像素（160px bar區域 + 160px文字區域）
        // ||: 邏輯或運算符，如果 config.containerHeight 存在則使用它，否則使用 320
        const containerHeight = config.containerHeight || 320;

        // 設定圖表的內邊距（margin），實現滿版顯示效果
        // 使用傳入的邊距設定，如果沒有傳入則使用滿版默認值
        // ||: 邏輯或運算符，提供默認配置對象
        const margin = config.margin || {
          top: 16, // 頂部邊距：為數值標籤預留最小空間
          right: 0, // 右側邊距：設為0實現右邊滿版
          bottom: 160, // 底部邊距：為X軸垂直文字預留160px空間
          left: 56, // 左側邊距：固定為32px以容納Y軸刻度數字
        };

        // 計算bar區域的實際高度（從總容器高度中減去文字區域）
        const barAreaHeight = 160; // bar區域固定高度160px

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

        // 計算適合平均預算金額的刻度最大值和間隔
        const getRoundedMax = (val) => {
          // 簡化邏輯：直接根據數值範圍選擇合適的間隔
          let interval;

          if (val > 100000) {
            // 大於10萬：使用5萬的倍數
            interval = 50000;
          } else if (val > 50000) {
            // 大於5萬：使用2萬的倍數
            interval = 20000;
          } else if (val > 20000) {
            // 大於2萬：使用1萬的倍數
            interval = 10000;
          } else if (val > 10000) {
            // 大於1萬：使用5000的倍數
            interval = 5000;
          } else if (val > 5000) {
            // 大於5000：使用1000的倍數
            interval = 1000;
          } else if (val > 1000) {
            // 大於1000：使用500的倍數
            interval = 500;
          } else {
            // 小於1000：使用100的倍數
            interval = 100;
          }

          // 計算最大值，確保是間隔的倍數
          const roundedMax = Math.ceil(val / interval) * interval;

          return { roundedMax, interval };
        };

        const { roundedMax: roundedMaxValue, interval } = getRoundedMax(maxValue);
        const yScale = d3
          .scaleLinear() // 創建線性比例尺，用於連續數值數據
          .domain([0, roundedMaxValue]) // 定義域：從0到舍入後的最大值，確保刻度對齊
          .range([height, 0]); // 值域：從圖表底部到頂部（SVG坐標系Y軸向下，需要反轉）

        // 計算Y軸刻度：生成均勻分布的刻度
        const calculateYTicks = (roundedMax, interval) => {
          const ticks = [0]; // 始終包含0作為基準線

          // 計算需要多少個刻度
          const numTicks = Math.ceil(roundedMax / interval);

          // 如果刻度數量太多，調整間隔
          let finalInterval = interval;
          if (numTicks > 4) {
            // 重新計算間隔，確保最多5條線（包含0）
            finalInterval = Math.ceil(roundedMax / 4);
            // 將間隔調整為更友好的數值
            if (finalInterval > 100000) {
              finalInterval = Math.ceil(finalInterval / 50000) * 50000;
            } else if (finalInterval > 50000) {
              finalInterval = Math.ceil(finalInterval / 20000) * 20000;
            } else if (finalInterval > 20000) {
              finalInterval = Math.ceil(finalInterval / 10000) * 10000;
            } else if (finalInterval > 10000) {
              finalInterval = Math.ceil(finalInterval / 5000) * 5000;
            } else if (finalInterval > 5000) {
              finalInterval = Math.ceil(finalInterval / 1000) * 1000;
            } else if (finalInterval > 1000) {
              finalInterval = Math.ceil(finalInterval / 500) * 500;
            } else {
              finalInterval = Math.ceil(finalInterval / 100) * 100;
            }
          }

          // 生成刻度，從finalInterval開始，每次增加finalInterval
          for (let i = finalInterval; i <= roundedMax; i += finalInterval) {
            ticks.push(i);
            if (ticks.length >= 5) break; // 最多5條線
          }

          return ticks;
        };

        const yTicks = calculateYTicks(roundedMaxValue, interval);

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
          .text((d) => d3.format(',')(Math.round(d.value))); // 文字內容：使用 Math.round 四捨五入到整數，再用 d3.format(',') 格式化數值，添加千分位逗號

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
          if (!dataItem.isEmpty) {
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
          // 只取前6名執行單位（按平均預算排序），符合用戶需求
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
                value: unit.本期經費平均_千元 || 0, // 使用本期經費平均_千元，提供默認值
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
              平均預算: ${Math.round(d.value)}<br/>
              平均預算: ${Math.round(d.extra.budget)}萬元<br/>
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
        const topAgencies = dataStore.getTopSupervisorAgenciesByBudget;

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
              value: agency.本期經費平均_千元 || 0, // 使用本期經費平均_千元，提供默認值
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
       * 數據結構：
       * - nodes: 包含主管機關和執行單位的節點陣列
       * - links: 包含它們之間連接關係的邊陣列
       *
       * 節點類型：
       * - 主管機關：type = 'agency', 藍色顯示
       * - 執行單位：type = 'unit', 橘色顯示
       *
       * @returns {Object} 包含 nodes 和 links 的數據對象
       */
      const prepareNetworkGraphData = () => {
        // 從數據存儲獲取主管機關與執行單位的映射關係
        // supervisorExecutingMapping: 包含 name, name_sub, 委托案件數, 所有相符資料_JSON 的關係數據
        const mappingData = dataStore.supervisorExecutingMapping;

        // 從數據存儲獲取主管機關數據，用於檢查學術單位標記
        const supervisorAgencies = dataStore.supervisorAgencies;

        // 如果沒有數據，返回空結構
        if (!mappingData || mappingData.length === 0) {
          return { nodes: [], links: [] };
        }

        // 創建主管機關學術單位標記的映射
        const agencyAcademicMap = new Map();
        supervisorAgencies.forEach((agency) => {
          agencyAcademicMap.set(agency.name, agency.學術單位 === 'TRUE');
        });

        // 過濾只包含學術單位的數據
        const academicMappingData = mappingData.filter((item) => {
          const isAcademic = agencyAcademicMap.get(item.name);
          return isAcademic === true; // 只保留學術單位為 TRUE 的數據
        });

        // 如果過濾後沒有數據，返回空結構
        if (academicMappingData.length === 0) {
          return { nodes: [], links: [] };
        }

        // 統計每個主管機關的總案件數和總預算
        const agencyStats = new Map();
        const unitStats = new Map();

        // 遍歷過濾後的映射數據，累積統計
        academicMappingData.forEach((item) => {
          // 主管機關統計
          if (!agencyStats.has(item.name)) {
            agencyStats.set(item.name, {
              totalCount: 0,
              totalBudget: 0,
              projectCount: 0,
            });
          }
          const agency = agencyStats.get(item.name);
          agency.totalCount += item.委托案件數 || 0; // 使用委托案件數
          agency.totalBudget += item.本期經費平均_千元 || 0; // 使用本期經費平均_千元
          agency.projectCount += 1;

          // 執行單位統計
          if (!unitStats.has(item.name_sub)) {
            unitStats.set(item.name_sub, {
              totalCount: 0,
              totalBudget: 0,
              projectCount: 0,
            });
          }
          const unit = unitStats.get(item.name_sub);
          unit.totalCount += item.委托案件數 || 0; // 使用委托案件數
          unit.totalBudget += item.本期經費平均_千元 || 0; // 使用本期經費平均_千元
          unit.projectCount += 1;
        });

        // 創建節點數據
        const nodes = [];

        // 添加主管機關節點（只添加學術單位）
        agencyStats.forEach((stats, name) => {
          // 再次確認這是學術單位
          const isAcademic = agencyAcademicMap.get(name);
          if (isAcademic === true) {
            nodes.push({
              id: `agency-${name}`,
              name: name,
              type: 'agency',
              totalCount: stats.totalCount,
              totalBudget: stats.totalBudget,
              projectCount: stats.projectCount,
              meanBudget: stats.totalBudget / stats.projectCount, // 計算平均金額
            });
          }
        });

        // 添加執行單位節點（只添加與學術單位有關係的執行單位）
        unitStats.forEach((stats, name) => {
          // 檢查這個執行單位是否與學術單位有關係
          const hasAcademicConnection = academicMappingData.some(item => item.name_sub === name);
          if (hasAcademicConnection) {
            nodes.push({
              id: `unit-${name}`,
              name: name,
              type: 'unit',
              totalCount: stats.totalCount,
              totalBudget: stats.totalBudget,
              projectCount: stats.projectCount,
              meanBudget: stats.totalBudget / stats.projectCount, // 計算平均金額
            });
          }
        });

        // 創建連結數據
        const links = academicMappingData.map((item) => ({
          source: `agency-${item.name}`,
          target: `unit-${item.name_sub}`,
          value: item.本期經費平均_千元 || 0, // 使用本期經費平均_千元
        }));

        return { nodes, links };
      };

      /**
       * 繪製關係網絡圖函數
       * 功能：使用 D3.js 力導向布局創建主管機關與執行單位的關係圖
       *
       * 視覺設計：
       * - 藍色圓圈：主管機關
       * - 橘色圓圈：執行單位
       * - 圓圈大小：根據總預算調整
       * - 灰色線條：表示合作關係
       * - 互動功能：拖拽節點、懸停顯示詳情
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
              // 計算節點半徑：讓節點面積與平均金額成正比
              // 目標：讓節點面積與平均金額成正比
              // 面積 = 平均金額，半徑 = √(面積/π)
              const scaleMultiplier = 0.1; // 放大倍數：1.0 = 原始大小，2.0 = 放大2倍，0.5 = 縮小2倍
              const area = d.meanBudget * scaleMultiplier; // 面積 = 平均金額 × 放大倍數
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
            // 計算節點半徑：讓節點面積與平均金額成正比
            // 目標：讓節點面積與平均金額成正比
            // 面積 = 平均金額，半徑 = √(面積/π)
            const scaleMultiplier = 1.0; // 放大倍數：1.0 = 原始大小，2.0 = 放大2倍，0.5 = 縮小2倍
            const area = d.meanBudget * scaleMultiplier; // 面積 = 平均金額 × 放大倍數
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
              <div>案件數: <span style="color: #4a90e2;">${d.projectCount}</span></div>
              <div>平均金額: <span style="color: #50e3c2;">${Math.round(d.meanBudget).toLocaleString()}</span>(千元)</div>
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
       * 功能：使用 Leaflet.js 創建互動式地圖，顯示大學/學院執行單位的地理分布
       *
       * 地圖特色：
       * - 以台灣為中心的地理視圖
       * - 圓圈標記代表執行單位位置
       * - 圓圈大小反映平均預算金額
       * - 點擊圓圈顯示詳細信息
       * - 滿版顯示設計（左右下邊緣對齊容器）
       *
       * 數據篩選：
       * - 只顯示包含「大學」或「學院」關鍵字的執行單位
       * - 過濾掉沒有地理座標的單位
       */
      const initMap = () => {
        // 防止重複初始化：檢查地圖容器是否已存在 Leaflet 實例
        // document.getElementById(): 瀏覽器 DOM API，根據 ID 獲取 HTML 元素
        const mapContainer = document.getElementById('taiwan-map');

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
        // eslint-disable-next-line no-console
        console.log('地圖數據:', {
          總大學學院數: universityUnits.length,
          有地理位置的數量: universityUnits.filter((u) => u.hasLocation).length,
          樣本數據: universityUnits.slice(0, 3),
        });

        // 如果沒有數據，顯示提示訊息
        if (universityUnits.length === 0) {
          // eslint-disable-next-line no-console
          console.warn('沒有找到包含大學/學院且有地理位置的執行單位數據');
          return;
        }

        // 計算圓圈大小的範圍：基於平均金額的統計
        const budgetValues = universityUnits.map((unit) => unit.本期經費平均_千元); // 使用本期經費平均_千元
        const minBudget = Math.min(...budgetValues);
        const maxBudget = Math.max(...budgetValues);

        // eslint-disable-next-line no-console
        console.log('平均預算金額範圍:', { 最小: minBudget, 最大: maxBudget });

        // 在地圖上添加圓圈標記，大小反映平均預算金額
        universityUnits.forEach((unit) => {
          // 跳過沒有地理位置的單位
          if (!unit.hasLocation) return;

          // 計算圓圈大小：基於平均金額的相對大小
          // 使用對數比例確保視覺效果合理
          const scaleFactor = 0.001; // 縮放因子，調整整體大小（平均金額通常較大）
          const radius = Math.sqrt((unit.本期經費平均_千元 * scaleFactor) / Math.PI); // 使用本期經費平均_千元

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
                <div>平均預算金額: ${Math.round(unit.本期經費平均_千元).toLocaleString()}</div>
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

      // ==================== 生命週期鉤子區域 ====================

      /**
       * 組件掛載生命週期鉤子
       * 功能：在組件 DOM 掛載完成後執行初始化邏輯
       *
       * 執行順序：
       * 1. 載入所有必要的數據（主管機關、執行單位、映射關係）
       * 2. 等待 DOM 更新完成
       * 3. 初始化主圖表
       * 4. 初始化所有小圖表
       * 5. 初始化台灣地圖
       *
       * 異步處理：使用 async/await 確保數據載入完成後再進行圖表渲染
       */
      onMounted(async () => {
        // 開發調試信息：記錄組件初始化開始
        // eslint-disable-next-line no-console
        console.log('平均金額統計頁面已初始化');

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
        nextTick(() => {
          // 主圖表初始化：創建配置對象並調用繪圖函數
          const mainChartConfig = {
            // DOM 容器 ID：對應模板中的主圖表容器
            containerId: 'main-chart',
            // 圖表數據：調用數據準備函數獲取前8名主管機關數據
            data: prepareMainChartData(),
            // Y 軸標籤：根據用戶需求，設為空字串不顯示
            yAxisLabel: '',
            // 容器高度：與地圖高度協調（160px bar區域 + 160px文字區域）
            containerHeight: 320,
          };
          // 調用主圖表繪製函數：使用配置對象創建主統計圖表
          drawChart(mainChartConfig);

          // 調用小圖表批次繪製函數：為每個主管機關創建執行單位圖表
          drawSupervisorCharts();

          // 調用地圖初始化函數：創建台灣地圖並添加大學/學院標記
          initMap();

          // 調用關係圖繪製函數：創建主管機關與執行單位的網絡關係圖
          drawNetworkGraph();
        });
      });

      /**
       * 組件卸載生命週期鉤子
       * 功能：在組件從 DOM 中移除前執行清理工作
       *
       * 清理項目：
       * - 移除 D3.js 創建的全域 DOM 元素
       * - 防止記憶體洩漏和 DOM 污染
       * - 確保組件重新掛載時不會出現衝突
       *
       * 注意：由於使用了容器內的 selectAll('*').remove()，
       * 大部分清理工作已在圖表重繪時自動完成
       */
      onUnmounted(() => {
        // 清理 D3.js 創建的全域圖表標籤元素
        // selectAll('.bar-label'): 選擇所有具有 'bar-label' 類別的元素
        // remove(): 從 DOM 中移除選中的元素，釋放記憶體
        // 這確保組件卸載時不會留下孤立的 DOM 元素
        d3.selectAll('.bar-label').remove();

        // 清理網絡圖的 tooltip 元素，避免記憶體洩漏
        d3.selectAll('.network-tooltip').remove();
      });

      // ==================== 返回對象：暴露給模板的響應式數據和方法 ====================
      // 在 Composition API 中，setup 函數必須返回一個對象
      // 包含模板中需要使用的所有響應式數據、計算屬性和方法

      return {
        // 數據管理 Store：提供給模板使用的 Pinia store 實例
        // 模板可以通過 dataStore.loading 等方式訪問數據狀態
        dataStore,

        // 除錯資訊：提供給模板的調試和狀態顯示數據
        // 包含載入狀態、錯誤信息、數據統計等信息
        debugInfo,

        // 小圖表數據：計算屬性，提供前12名主管機關的圖表配置數據
        // 模板中的 v-for 指令使用此數據來動態生成小圖表
        getSupervisorChartsData,
      };
    }, // setup 函數結束
  }; // Vue 組件配置對象結束
</script>

<template>
  <div class="case-budget-container">
    <div class="w-100 px-3">
      <div class="row">
        <div class="col-6">
          <div class="chart-container my-bgcolor-white rounded-4 border py-3">
            <div class="d-flex justify-content-center my-title-md-black">
              主管機關平均金額統計 (前12名)
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

            <div id="main-chart" style="min-height: 320px"></div>
          </div>
        </div>

        <div class="col-6">
          <div class="chart-container my-bgcolor-white rounded-4 border pt-3">
            <div class="d-flex justify-content-center my-title-md-black pb-3">
              大學/學院平均金額分布
            </div>
            <div id="taiwan-map" style="height: 320px; border-radius: 0 0 1rem 1rem"></div>
          </div>
        </div>
      </div>

      <div class="row">
        <div v-for="chartData in getSupervisorChartsData" :key="chartData.id" class="col-3 mt-4">
          <div class="chart-container my-bgcolor-white rounded-4 border py-3">
            <div class="d-flex justify-content-center my-title-md-black">
              {{ chartData.title }}
            </div>

            <div :id="chartData.id" style="min-height: 320px"></div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 mt-4">
          <div class="my-bgcolor-white rounded-4 border p-3">
            <div class="d-flex justify-content-center my-title-md-black mb-3">
              主管機關與執行單位關係網絡圖
            </div>

            <div id="network-graph" style="height: 600px; width: 100%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* 使用Bootstrap和common.css的樣式，高度設定使用內聯style */
</style>
