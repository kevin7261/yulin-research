# 🏥 臺北市長照資源空間分析系統

一個基於 Vue.js 3 和 Leaflet 的互動式長期照護資源地理資訊系統，專為臺北市長照資源空間配置分析而設計。

[![Vue.js](https://img.shields.io/badge/Vue.js-3.2.13-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.0-199900?style=flat-square&logo=leaflet)](https://leafletjs.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-7952B3?style=flat-square&logo=bootstrap)](https://getbootstrap.com/)
[![Pinia](https://img.shields.io/badge/Pinia-2.1.0-FFD859?style=flat-square)](https://pinia.vuejs.org/)

## 🎯 專案概述

本系統整合了臺北市長期照護機構、醫療設施、人口統計等多維度空間資料，提供視覺化分析平台，協助政策制定者、研究人員和民眾了解臺北市長照資源的空間分布與需求配置。

### 🌟 核心價值

- **🔍 資源可視化**: 將複雜的長照資源資料轉化為直觀的地圖視覺化
- **📊 空間分析**: 提供多層次的空間分析工具，支援決策制定
- **🎯 需求分析**: 結合人口統計資料分析長照需求與供給關係
- **📱 響應式設計**: 適配桌面與行動裝置的現代化介面

## 🛠️ 技術架構

### 前端技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **Vue.js 3** | 3.2.13 | 核心前端框架，使用 Composition API |
| **Pinia** | 2.1.0 | 狀態管理，替代 Vuex 的輕量級解決方案 |
| **Leaflet** | 1.9.0 | 開源地圖庫，提供互動式地圖功能 |
| **Bootstrap 5** | 5.3.0 | UI 框架，響應式佈局與組件 |
| **D3.js** | 7.8.0 | 資料視覺化，用於統計圖表繪製 |
| **FontAwesome** | 6.7.2 | 圖標庫 |

### 開發工具

| 工具 | 版本 | 功能 |
|------|------|------|
| **Vue CLI** | 5.0.8 | 專案建構與開發工具 |
| **ESLint** | 8.57.0 | 程式碼品質檢查 |
| **Prettier** | 3.5.3 | 程式碼格式化 |
| **Babel** | 7.12.16 | JavaScript 編譯器 |

### 支援的資料格式

- **CSV**: 表格型資料，支援座標欄位自動識別
- **GeoJSON**: 地理空間資料，支援點、線、面要素
- **Excel**: XLSX 格式支援（透過 SheetJS）

## ✨ 核心功能

### 🗺️ 互動式地圖系統

#### 多圖層管理
- **分組管理**: 圖層按功能分組（長照機構、醫療設施、人口統計等）
- **顏色編碼**: 每個圖層具有獨特的顏色標識，便於視覺區分
- **開關控制**: 現代化的開關 UI 控制圖層顯示/隱藏
- **圖層順序**: 支援圖層堆疊順序調整

#### 地圖操作
- **縮放控制**: 滑鼠滾輪、按鈕縮放
- **平移**: 拖拽地圖平移
- **定位**: 一鍵回到預設視圖或縮放至所有圖層範圍
- **底圖切換**: 支援多種底圖（OSM、Google、Esri、CartoDB 等）

#### 分析工具
- **點擊分析**: 在地圖上點擊添加分析點
- **範圍分析**: 自動繪製 2 公里分析圓圈
- **右鍵選單**: 快速刪除分析點功能

### 📊 資料視覺化與分析

#### 儀表板系統
- **統計摘要**: 顯示圖層總數量、行政區分布等統計資訊
- **橫向長條圖**: 使用 D3.js 繪製行政區數量分布圖表
- **響應式圖表**: 圖表隨容器大小自動調整

#### 資料表格
- **分頁顯示**: 多圖層分頁式資料表格
- **排序功能**: 支援各欄位升序/降序排序
- **搜尋過濾**: 即時搜尋過濾資料
- **位置定位**: 點擊「顯示位置」按鈕在地圖上高亮顯示

#### 屬性查看
- **詳細資訊**: 點擊地圖要素顯示詳細屬性資訊
- **彈出視窗**: 美觀的彈出視窗顯示要素資訊
- **高亮效果**: 選中要素的視覺高亮效果

### 🎛️ 響應式佈局系統

#### 桌面版佈局（≥1200px）
- **三面板設計**: 左側控制面板 + 中央地圖區域 + 右側資訊面板
- **可調整面板**: 支援拖拽調整面板寬度
- **分割視圖**: 上下分割的地圖與資料表格視圖

#### 行動版佈局（<1200px）
- **垂直堆疊**: 上下堆疊的地圖與控制面板
- **可調整高度**: 支援垂直拖拽調整面板高度
- **觸控友好**: 針對觸控操作優化的 UI 元素

#### 適配特性
- **斷點響應**: 自動偵測螢幕尺寸切換佈局
- **流暢過渡**: 佈局切換的平滑動畫效果
- **狀態保持**: 切換佈局時保持地圖狀態

## 📁 資料圖層詳細說明

### 🏥 長期照護機構

#### 台北市政府社會局資料
- **114年度臺北市社區照顧關懷據點**: 社區照顧關懷據點分布位置
- **114年臺北市社區整體照顧服務體系C級單位**: C級照顧服務單位
- **臺北市老人福利機構名冊**: 立案老人福利機構分布
- **社區喘息服務(C+單位)**: 提供社區喘息服務的據點

#### 台北市政府衛生局資料
- **長照2.0住宿式喘息(GA05)及住宿式短照(SC05)服務單位**: 66個服務單位
- **長照2.0居家式喘息(GA09)及居家式短照(SC09)服務單位**: 142個服務單位
- **長照2.0巷弄長照站喘息(C+)(GA07)及巷弄長照站短照(SC07)服務單位**: 25個服務單位
- **長照2.0社區式喘息及社區式短照服務單位**: 41個服務單位
- **臺北市社區整合型服務中心(A單位)**: A級服務中心
- **臺北市立案一般護理之家**: 立案護理之家
- **臺北市立案住宿式長照機構**: 住宿式長照機構

#### 其他長照資源
- **據點清單名冊**: 各類長照據點統整清單
- **臺北市公辦民營老人福利機構**: 公辦民營機構

### 🏥 醫療設施

#### 醫療院所
- **112年12月醫療院所分布圖_全國_醫院**: 臺北市內醫院分布（43家）
- **112年12月醫療院所分布圖_全國_診所**: 臺北市內診所分布（3,817家）
- **健保特約醫事機構-藥局**: 健保特約藥局分布（1,085家）

### 🚌 交通設施

- **busstop**: 公車站牌位置資料（3,414個站點）
- **TpeMrtStations**: 臺北捷運車站位置（132個車站）

### 🛒 生活機能

- **全國5大超商資料集**: 便利商店分布位置（3,017家）

### 📊 人口統計資料（村里級）

#### 年齡結構統計
- **113年12月行政區三段年齡組性別人口統計**:
  - 幼年人口（0-14歲）
  - 青壯年人口（15-64歲）
  - 老年人口（65歲以上）

- **113年12月行政區五歲年齡組性別人口統計**:
  - 0-4歲、5-9歲、10-14歲...等五歲為一組的詳細年齡結構

- **113年12月行政區十歲年齡組性別人口統計**:
  - 0-9歲、10-19歲、20-29歲...等十歲為一組的年齡結構

#### 經濟統計
- **臺北市_村里_綜稅綜合所得總額**: 村里級綜合所得統計資料

#### 行政區劃
- **臺北市區界圖**: 臺北市12個行政區界線

## 🚀 開發環境設置

### 系統需求

- Node.js 16.0 或更高版本
- npm 或 yarn 套件管理器

### 安裝步驟

1. **克隆專案**

```bash
git clone [專案網址]
cd yulin-research
```

2. **安裝依賴**

```bash
npm install
```

3. **啟動開發伺服器**

```bash
npm run dev
```

4. **開啟瀏覽器**

```
http://localhost:8080
```

### 其他指令

```bash
# 建構生產版本
npm run build

# 執行程式碼檢查
npm run lint

# 執行測試
npm run test
```

## 📂 專案結構

```
src/
├── views/              # 主要頁面組件
│   ├── HomeView.vue    # 主頁面 (整體佈局)
│   ├── LeftView.vue    # 左側控制面板
│   ├── MiddleView.vue  # 中央內容區域
│   ├── UpperView.vue   # 上方分頁容器
│   ├── MapTab.vue     # 地圖視圖
│   ├── DashboardTab.vue # 儀表板視圖
│   ├── BottomView.vue  # 底部面板
│   └── RightView.vue   # 右側資訊面板
├── tabs/              # 分頁組件
│   └── DataTableTab.vue # 資料表格分頁
├── stores/            # Pinia 狀態管理
│   └── dataStore.js   # 主要資料存儲
├── utils/             # 工具函數
│   └── dataProcessor.js # 資料處理工具
├── components/        # 可重用組件
└── assets/           # 靜態資源
```

## 🎨 設計特色

### 圖層顏色系統

- 每個圖層自動生成獨特的隨機顏色
- 顏色範圍控制在 RGB(100-255) 確保可視性
- 左側面板顯示圖層顏色指示器

### 互動體驗

- 現代化開關控制圖層顯示
- 平滑的地圖動畫與過渡效果
- 直觀的拖拽調整面板大小功能

### 資料整合

- 支援 CSV 和 GeoJSON 格式資料
- 智能的資料處理與統計計算
- 高效的圖層管理與快取機制

## 🔧 關鍵功能實現詳解

### 🗺️ 地圖系統架構

#### 圖層管理系統
```javascript
// 圖層資料結構
const layerStructure = {
  groupName: "長期照護機構",
  groupLayers: [
    {
      layerId: "hospital",
      layerName: "醫院",
      visible: false,
      colorName: "blue",
      type: "point",
      geoJsonData: null,
      csvData: null,
      isLoading: false,
      summary: {
        totalCount: 0,
        districtCount: []
      }
    }
  ]
}
```

#### 地圖初始化流程
1. **容器準備**: 檢查 DOM 容器是否就緒
2. **Leaflet 實例化**: 創建地圖實例並設定初始參數
3. **事件綁定**: 綁定縮放、移動、點擊等事件處理器
4. **底圖載入**: 根據使用者選擇載入對應底圖
5. **圖層同步**: 同步顯示已啟用的資料圖層

#### 圖層同步機制
```javascript
const syncLayers = () => {
  // 1. 獲取當前可見圖層
  const visibleLayers = dataStore.getAllLayers().filter(l => l.visible);

  // 2. 比較新舊圖層差異
  const newLayerIds = visibleLayers.map(l => l.layerId);
  const currentLayerIds = Object.keys(layerGroups);

  // 3. 移除不再顯示的圖層
  const layersToRemove = currentLayerIds.filter(id => !newLayerIds.includes(id));

  // 4. 添加新的圖層
  const newLayers = visibleLayers.filter(l => !currentLayerIds.includes(l.layerId));

  // 5. 自動縮放到新圖層範圍
  if (newLayers.length > 0) {
    autoFitBounds(newLayers);
  }
}
```

### 📊 資料處理流程

#### CSV 資料處理
```javascript
const processCSVData = (csvText, layerId) => {
  // 1. 解析 CSV 文字
  const rows = csvText.split('\n').map(row => row.split(','));
  const headers = rows[0];

  // 2. 轉換為物件陣列
  const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = row[index]?.trim() || '';
    });
    return obj;
  });

  // 3. 座標欄位識別與轉換
  const coordFields = identifyCoordinateFields(headers);

  // 4. 轉換為 GeoJSON 格式
  return convertToGeoJSON(data, coordFields, layerId);
}
```

#### GeoJSON 要素處理
```javascript
const createFeatureLayer = (layer) => {
  return L.geoJSON(layer.geoJsonData, {
    // 點要素樣式
    pointToLayer: (feature, latlng) => {
      const icon = L.divIcon({
        html: `<div class="rounded-circle" style="background-color: var(--my-color-${layer.colorName}); width: 8px; height: 8px;"></div>`,
        className: '',
        iconSize: [8, 8],
        iconAnchor: [4, 4]
      });
      return L.marker(latlng, { icon });
    },

    // 面要素樣式
    style: (feature) => ({
      fillColor: feature.properties.fillColor,
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6
    }),

    // 要素事件處理
    onEachFeature: (feature, layer) => {
      // 綁定彈出視窗
      layer.bindPopup(createPopupContent(feature));

      // 綁定滑鼠事件
      layer.on({
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
        click: handleFeatureClick
      });
    }
  });
}
```

### 🎨 視覺化系統

#### D3.js 橫向長條圖
```javascript
const drawHorizontalBarChart = (districtCount) => {
  // 1. 清除舊圖表
  d3.select(chartContainer.value).selectAll("*").remove();

  // 2. 設定圖表尺寸
  const margin = { top: 10, right: 30, bottom: 16, left: 60 };
  const width = containerWidth - margin.left - margin.right;
  const height = districtCount.length * 24 - margin.top - margin.bottom;

  // 3. 建立比例尺
  const xScale = d3.scaleLinear()
    .domain([0, maxTickValue])
    .range([0, width]);

  const yScale = d3.scaleBand()
    .domain(districtCount.map(d => d.name))
    .range([0, height])
    .padding(0.1);

  // 4. 繪製長條圖
  svg.selectAll('.bar')
    .data(districtCount)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', d => yScale(d.name))
    .attr('width', d => xScale(d.count))
    .attr('height', yScale.bandwidth())
    .attr('fill', 'var(--my-color-blue)');
}
```

#### 響應式設計實現
```javascript
// 視窗大小監聽
const handleResize = () => {
  const isDesktop = window.innerWidth >= 1200;

  if (isDesktop !== wasDesktop.value) {
    // 切換桌面/行動版佈局
    wasDesktop.value = isDesktop;

    // 重新初始化地圖
    nextTick(() => {
      if (mapRef.value) {
        mapRef.value.invalidateSize();
      }
    });
  }
};

// ResizeObserver 監聽容器變化
const setupResizeObserver = () => {
  if (mapContainer.value && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        // 防抖處理
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (mapInstance && isMapReady.value) {
            mapInstance.invalidateSize();
          }
        }, 150);
      }
    });
    resizeObserver.observe(mapContainer.value);
  }
};
```

### 🔄 狀態管理 (Pinia)

#### 主要資料存儲 (dataStore)
```javascript
export const useDataStore = defineStore('data', {
  state: () => ({
    layers: [], // 圖層資料
    selectedFeature: null, // 選中的要素
    analysisLayer: { // 分析圖層
      layerId: 'analysis-layer',
      visible: false,
      geoJsonData: { type: 'FeatureCollection', features: [] }
    }
  }),

  getters: {
    getAllLayers: (state) => {
      const allLayers = [];
      state.layers.forEach(group => {
        allLayers.push(...group.groupLayers);
      });
      if (state.analysisLayer.visible) {
        allLayers.push(state.analysisLayer);
      }
      return allLayers;
    }
  },

  actions: {
    async loadLayerData(layerId) {
      const layer = this.findLayerById(layerId);
      if (!layer || layer.geoJsonData) return;

      layer.isLoading = true;
      try {
        const data = await fetchLayerData(layerId);
        layer.geoJsonData = data;
        layer.summary = calculateSummary(data);
      } catch (error) {
        console.error(`載入圖層 ${layerId} 失敗:`, error);
      } finally {
        layer.isLoading = false;
      }
    }
  }
});
```

#### 設定存儲 (defineStore)
```javascript
export const useDefineStore = defineStore('define', {
  state: () => ({
    selectedBasemap: 'carto_light_labels',
    mapView: {
      center: [25.051474, 121.557989], // 台北市中心
      zoom: 11
    },
    basemaps: [
      { label: 'Carto Light', value: 'carto_light_labels', url: '...' },
      { label: 'OpenStreetMap', value: 'osm', url: '...' },
      // ... 其他底圖選項
    ]
  }),

  actions: {
    setMapView(center, zoom) {
      this.mapView.center = center;
      this.mapView.zoom = zoom;
    },

    setSelectedBasemap(value) {
      this.selectedBasemap = value;
    }
  }
});
```

## 🎯 使用指南

### 基本操作流程

#### 1. 啟用圖層
1. 在左側面板找到想要顯示的圖層
2. 點擊圖層名稱旁的開關按鈕
3. 等待資料載入完成（顯示載入指示器）
4. 地圖會自動縮放到該圖層的範圍

#### 2. 查看資料
1. 點擊地圖上的任意要素（點或面）
2. 彈出視窗顯示該要素的詳細資訊
3. 右側面板會同步顯示屬性資訊
4. 在資料表格分頁中可以查看完整資料列表

#### 3. 進行空間分析
1. 點擊地圖底部的「開始分析」按鈕
2. 在地圖上點擊想要分析的位置
3. 系統會自動添加分析點和 2 公里分析圓圈
4. 右鍵點擊分析點可以刪除

#### 4. 使用儀表板
1. 點擊上方的儀表板圖標切換到統計視圖
2. 查看當前圖層的統計摘要
3. 觀察行政區分布的橫向長條圖
4. 切換不同圖層分頁查看各圖層統計

### 進階功能

#### 自訂底圖
系統提供多種底圖選擇：
- **OpenStreetMap**: 開源社群地圖
- **Google Maps**: 街道圖和衛星圖
- **Esri**: 街道圖、地形圖、衛星圖
- **CartoDB**: 淺色、深色、航海主題
- **國土測繪中心**: 電子地圖、正射影像
- **特殊底圖**: 白色底圖、黑色底圖

#### 資料匯出
```javascript
// 匯出當前可見圖層資料
const exportVisibleLayers = () => {
  const visibleLayers = dataStore.getAllLayers().filter(l => l.visible);
  const exportData = visibleLayers.map(layer => ({
    layerName: layer.layerName,
    features: layer.geoJsonData.features,
    summary: layer.summary
  }));

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'long-term-care-data.json';
  a.click();
};
```

## 🐛 故障排除與常見問題

### 地圖相關問題

#### 問題：地圖無法顯示或載入失敗
**可能原因**：
- 網路連線問題
- 底圖服務暫時無法使用
- 瀏覽器快取問題

**解決方案**：
```javascript
// 1. 檢查網路連線
if (!navigator.onLine) {
  console.warn('網路連線中斷，請檢查網路設定');
}

// 2. 切換到備用底圖
defineStore.setSelectedBasemap('osm'); // 切換到 OpenStreetMap

// 3. 清除瀏覽器快取
// Chrome: F12 -> Network -> Disable cache
// 或在瀏覽器設定中清除快取
```

#### 問題：圖層載入失敗
**可能原因**：
- 資料檔案路徑錯誤
- 檔案格式不正確
- 座標系統不匹配

**解決方案**：
```javascript
// 檢查檔案路徑
const checkFileExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('檔案不存在:', url);
    return false;
  }
};

// 驗證 GeoJSON 格式
const validateGeoJSON = (data) => {
  return data &&
         data.type === 'FeatureCollection' &&
         Array.isArray(data.features);
};
```

#### 問題：地圖位置偏移或座標錯誤
**可能原因**：
- 座標系統不一致（TWD97 vs WGS84）
- 經緯度順序顛倒

**解決方案**：
```javascript
// 座標系統轉換 (使用 proj4)
import proj4 from 'proj4';

// 定義 TWD97 座標系統
proj4.defs('EPSG:3826', '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs');

// 轉換座標
const convertCoordinates = (x, y, fromCRS = 'EPSG:3826', toCRS = 'EPSG:4326') => {
  return proj4(fromCRS, toCRS, [x, y]);
};
```

### 效能相關問題

#### 問題：大量資料導致瀏覽器卡頓
**解決方案**：
```javascript
// 1. 實作資料分頁
const CHUNK_SIZE = 1000;
const processDataInChunks = async (data) => {
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    await processChunk(chunk);

    // 讓瀏覽器有時間處理其他任務
    await new Promise(resolve => setTimeout(resolve, 10));
  }
};

// 2. 使用虛擬滾動
const useVirtualScroll = (items, itemHeight = 50) => {
  const containerHeight = 400;
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  return {
    visibleItems: computed(() => {
      const start = scrollTop.value / itemHeight;
      return items.slice(start, start + visibleCount);
    })
  };
};
```

#### 問題：記憶體洩漏
**預防措施**：
```javascript
// 組件卸載時清理資源
onUnmounted(() => {
  // 清理地圖實例
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  // 清理事件監聽器
  window.removeEventListener('resize', handleResize);

  // 清理觀察器
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  // 清理計時器
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
```

### 資料相關問題

#### 問題：CSV 檔案解析錯誤
**常見問題**：
- 編碼問題（UTF-8 vs Big5）
- 分隔符號不一致
- 引號處理錯誤

**解決方案**：
```javascript
// 自動偵測編碼
const detectEncoding = (buffer) => {
  const uint8Array = new Uint8Array(buffer);

  // 檢查 BOM
  if (uint8Array[0] === 0xEF && uint8Array[1] === 0xBB && uint8Array[2] === 0xBF) {
    return 'UTF-8';
  }

  // 簡單的中文字元檢測
  const text = new TextDecoder('utf-8').decode(buffer);
  const chineseRegex = /[\u4e00-\u9fff]/;

  if (chineseRegex.test(text)) {
    return 'UTF-8';
  }

  return 'Big5';
};

// 強化的 CSV 解析
const parseCSV = (text) => {
  const lines = text.split('\n');
  const result = [];

  for (const line of lines) {
    if (line.trim() === '') continue;

    const row = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    row.push(current.trim());
    result.push(row);
  }

  return result;
};
```

## 🔒 安全性考量

### XSS 防護
```javascript
// 清理使用者輸入
const sanitizeHTML = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// 在彈出視窗中使用
const createPopupContent = (feature) => {
  const properties = feature.properties;
  const safeContent = Object.entries(properties)
    .map(([key, value]) => {
      const safeKey = sanitizeHTML(key);
      const safeValue = sanitizeHTML(value);
      return `<div><strong>${safeKey}:</strong> ${safeValue}</div>`;
    })
    .join('');

  return safeContent;
};
```

### CORS 處理
```javascript
// 開發環境代理設定 (vue.config.js)
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://data.gov.tw',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
```

## 📈 效能優化建議

### 1. 圖層載入優化
```javascript
// 延遲載入非關鍵圖層
const lazyLoadLayers = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const layerId = entry.target.dataset.layerId;
        loadLayerData(layerId);
        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('.layer-item').forEach(item => {
    observer.observe(item);
  });
};
```

### 2. 地圖渲染優化
```javascript
// 使用 Canvas 渲染器提升效能
const mapOptions = {
  preferCanvas: true,
  renderer: L.canvas({ tolerance: 5 })
};

// 簡化複雜幾何圖形
const simplifyGeometry = (geojson, tolerance = 0.001) => {
  return turf.simplify(geojson, { tolerance, highQuality: false });
};
```

### 3. 快取策略
```javascript
// Service Worker 快取靜態資源
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/data/')) {
    event.respondWith(
      caches.open('data-cache').then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response;
          }

          return fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
```

## 📚 參考資源

### 官方文檔
- [Vue.js 3 官方文檔](https://vuejs.org/)
- [Leaflet 官方文檔](https://leafletjs.com/)
- [Pinia 官方文檔](https://pinia.vuejs.org/)
- [Bootstrap 5 官方文檔](https://getbootstrap.com/)
- [D3.js 官方文檔](https://d3js.org/)

### 地理資訊相關
- [GeoJSON 規範](https://geojson.org/)
- [Proj4js 座標轉換](http://proj4js.org/)
- [Turf.js 空間分析](https://turfjs.org/)

### 政府開放資料
- [政府資料開放平臺](https://data.gov.tw/)
- [臺北市資料大平臺](https://data.taipei/)
- [內政部國土測繪中心](https://www.nlsc.gov.tw/)

## 📄 授權條款

MIT License

Copyright (c) 2024 Long-term Care Web Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🤝 貢獻指南

### 如何貢獻

1. **Fork 專案**到你的 GitHub 帳號
2. **創建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交變更** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **開啟 Pull Request**

### 程式碼規範

- 使用 ESLint 和 Prettier 確保程式碼品質
- 遵循 Vue.js 3 Composition API 最佳實踐
- 添加適當的註解和文檔
- 確保所有測試通過

### 問題回報

使用 GitHub Issues 回報問題時，請包含：
- 問題的詳細描述
- 重現步驟
- 預期行為與實際行為
- 螢幕截圖（如適用）
- 瀏覽器和作業系統資訊

## 📞 聯絡資訊

- **專案維護者**: [Kevin Cheng](https://github.com/kevin7261)
- **專案首頁**: [GitHub Repository](https://github.com/kevin7261/yulin-research)
- **線上展示**: [GitHub Pages](https://kevin7261.github.io/yulin-research)
- **問題回報**: [GitHub Issues](https://github.com/kevin7261/yulin-research/issues)

## 🙏 致謝

感謝以下組織和個人對本專案的支持：

- **臺北市政府**提供開放資料
- **Vue.js 社群**提供優秀的前端框架
- **Leaflet 社群**提供強大的地圖庫
- **開源社群**的無私貢獻

---

📅 **最後更新**: 2024年12月
🔖 **版本**: 0.1.0
📝 **文檔版本**: 1.0.0
