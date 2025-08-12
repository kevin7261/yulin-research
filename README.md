# 雲林縣研究案統計平台

[![Vue.js](https://img.shields.io/badge/Vue.js-3.2.13-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Vue Router](https://img.shields.io/badge/Vue%20Router-4.5.1-4FC08D?style=flat-square&logo=vue.js)](https://router.vuejs.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.1.7-4FC08D?style=flat-square&logo=vue.js)](https://pinia.vuejs.org/)
[![D3.js](https://img.shields.io/badge/D3.js-7.8.5-FF6B6B?style=flat-square&logo=d3.js)](https://d3js.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat-square&logo=leaflet)](https://leafletjs.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.2-7952B3?style=flat-square&logo=bootstrap)](https://getbootstrap.com/)

一個基於 Vue.js
3 的雲林縣研究案統計數據展示平台，提供豐富的數據視覺化功能和互動式分析工具。

## 🎯 專案概述

### 🌟 專案目標

本系統旨在為雲林縣研究案提供全面的統計資料展示平台，協助研究人員、管理者和政策制定者：

- 了解研究案的整體分布和進展情況
- 分析主管機關與執行單位的合作關係
- 追蹤研究案的地理分布和預算分配
- 提供數據驅動的決策支持

### 🎨 核心特色

- **📊 多維度數據分析**: 案件數統計、平均金額分析、地理分布等
- **🔄 互動式數據視覺化**: 基於 D3.js 的動態圖表和 Leaflet 地圖
- **📱 現代化響應式設計**: 適配各種裝置的專業級介面
- **⚡ 高效能架構**: 基於 Vue.js 3 Composition API 的輕量級應用
- **🗺️ 地理資訊整合**: 台灣地圖上的研究案分布展示
- **🔗 關係網絡分析**: 主管機關與執行單位的合作關係圖

## 🏗️ 技術架構

### 前端技術棧

| 技術           | 版本   | 用途             | 說明                                     |
| -------------- | ------ | ---------------- | ---------------------------------------- |
| **Vue.js 3**   | 3.2.13 | 核心前端框架     | 使用 Composition API，提供響應式組件系統 |
| **Vue Router** | 4.5.1  | 單頁應用路由管理 | 實現頁面間無刷新導航                     |
| **Pinia**      | 2.1.7  | 狀態管理         | 替代 Vuex，提供更簡潔的狀態管理方案      |
| **D3.js**      | 7.8.5  | 數據視覺化       | 創建互動式圖表、網絡圖和數據驅動文檔     |
| **Leaflet**    | 1.9.4  | 地圖組件         | 輕量級開源地圖庫，支援互動式地圖功能     |
| **Bootstrap**  | 5.3.2  | UI 框架          | 提供響應式網格系統和預設組件樣式         |

### 開發工具與構建系統

| 工具         | 版本    | 功能               | 配置說明                           |
| ------------ | ------- | ------------------ | ---------------------------------- |
| **Vue CLI**  | 5.0.8   | 專案建構與開發工具 | 提供開發伺服器、熱重載、構建優化   |
| **Webpack**  | 5.x     | 模組打包器         | 處理 JavaScript、CSS、圖片等資源   |
| **Babel**    | 7.12.16 | JavaScript 編譯器  | 支援 ES6+ 語法，確保瀏覽器兼容性   |
| **ESLint**   | 8.57.0  | 程式碼品質檢查     | 強制執行編碼規範，提高代碼品質     |
| **Prettier** | 3.5.3   | 程式碼格式化       | 自動格式化代碼，保持一致的代碼風格 |
| **PostCSS**  | 8.x     | CSS 後處理器       | 支援 CSS 變數、自動前綴等功能      |

### 數據處理與存儲

| 技術                    | 用途         | 實現方式                                   |
| ----------------------- | ------------ | ------------------------------------------ |
| **JSON 數據源**         | 靜態數據存儲 | 從 public/data/ 目錄載入預處理的 JSON 文件 |
| **Pinia Store**         | 狀態管理     | 管理應用全局狀態、數據載入和緩存           |
| **Computed Properties** | 數據計算     | 響應式計算屬性，自動更新相關數據           |
| **Local Storage**       | 本地緩存     | 可選的用戶偏好設置和數據緩存               |

## 🚀 開發環境設置

### 系統需求

- **Node.js**: 16.0 或更高版本（推薦 18.x LTS）
- **npm**: 8.0 或更高版本，或使用 yarn
- **Git**: 用於版本控制
- **現代瀏覽器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 環境檢查

```bash
# 檢查 Node.js 版本
node --version

# 檢查 npm 版本
npm --version

# 檢查 Git 版本
git --version
```

### 詳細安裝步驟

#### 1. 克隆專案

```bash
# 使用 HTTPS 克隆
git clone https://github.com/kevin7261/yulin-research.git

# 或使用 SSH（如果已配置）
git clone git@github.com:kevin7261/yulin-research.git

# 進入專案目錄
cd yulin-research
```

#### 2. 安裝依賴套件

```bash
# 使用 npm 安裝
npm install

# 或使用 yarn（如果已安裝）
yarn install

# 檢查安裝結果
npm list --depth=0
```

#### 3. 啟動開發伺服器

```bash
# 啟動開發伺服器
npm run serve

# 或使用 yarn
yarn serve
```

#### 4. 開啟瀏覽器

開發伺服器啟動後，在瀏覽器中開啟：

```
http://localhost:8080
```

### 開發工具配置

#### VS Code 推薦擴展

```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

#### 瀏覽器開發者工具

- **Vue DevTools**: 安裝 Vue.js devtools 擴展
- **D3.js 調試**: 使用瀏覽器控制台檢查 D3 元素
- **網絡監控**: 檢查數據載入和 API 請求

## 📂 專案結構詳解

```
yulin-research/
├── public/                          # 靜態資源目錄
│   ├── data/                        # 數據文件目錄
│   │   ├── 執行單位名稱_locations.json      # 執行單位地理位置數據
│   │   ├── 執行單位名稱_normalize.json      # 執行單位標準化數據
│   │   ├── 計畫主管機關_normalize.json      # 主管機關標準化數據
│   │   └── 計畫主管機關_執行單位名稱_normalize.json  # 映射關係數據
│   ├── favicon.ico                  # 網站圖標
│   ├── index.html                   # HTML 模板
│   └── 404.html                     # 404 錯誤頁面
├── src/                             # 源代碼目錄
│   ├── assets/                      # 靜態資源
│   │   ├── css/                     # 樣式文件
│   │   │   ├── common.css           # 通用樣式
│   │   │   └── variables.css        # CSS 變數定義
│   │   └── logo.png                 # 專案標誌
│   ├── components/                  # 可重用組件
│   ├── router/                      # 路由配置
│   │   └── index.js                 # 路由定義和導航守衛
│   ├── stores/                      # 狀態管理
│   │   └── dataStore.js             # 數據存儲和業務邏輯
│   ├── tabs/                        # 標籤頁組件
│   ├── utils/                       # 工具函數
│   ├── views/                       # 頁面組件
│   │   ├── HomeView.vue             # 首頁組件
│   │   ├── CaseCountView.vue        # 案件數統計頁面
│   │   └── CaseBudgetView.vue       # 平均金額統計頁面
│   ├── App.vue                      # 根組件
│   └── main.js                      # 應用入口點
├── .eslintrc.js                     # ESLint 配置
├── .gitignore                       # Git 忽略文件
├── babel.config.js                  # Babel 配置
├── jsconfig.json                    # JavaScript 配置
├── package.json                     # 專案依賴和腳本
├── vue.config.js                    # Vue CLI 配置
└── README.md                        # 專案說明文檔
```

### 核心文件說明

#### 1. 數據存儲層 (stores/dataStore.js)

```javascript
// 主要功能
-異步數據載入和錯誤處理 - 數據計算和統計邏輯 - 響應式狀態管理 - 數據過濾和排序;
```

#### 2. 路由配置 (router/index.js)

```javascript
// 路由結構
- /: 首頁
- /case-count: 案件數統計頁面
- /case-budget: 平均金額統計頁面
```

#### 3. 頁面組件 (views/)

```vue
// 組件架構 - HomeView.vue: 導航和概覽 - CaseCountView.vue: 案件數分析 -
CaseBudgetView.vue: 平均金額分析
```

## 🎨 功能模組詳解

### 1. 案件數統計模組 (CaseCountView.vue)

#### 功能描述

提供雲林縣研究案案件數的全面統計分析，包括主管機關排名、執行單位分布和地理信息。

#### 主要組件

- **主圖表**: 前12名主管機關的案件數統計
- **小圖表**: 每個主管機關下前6名執行單位的案件數
- **台灣地圖**: 大學/學院執行單位的地理分布
- **關係網絡圖**: 主管機關與執行單位的合作關係

#### 數據來源

- `計畫主管機關_normalize.json`: 主管機關基本數據
- `計畫主管機關_執行單位名稱_normalize.json`: 映射關係數據
- `執行單位名稱_locations.json`: 地理位置數據

#### 技術實現

```javascript
// 圖表繪製
const drawChart = (config) => {
  // D3.js 柱狀圖實現
  // 響應式設計
  // 互動式 tooltip
};

// 地圖初始化
const initMap = () => {
  // Leaflet.js 地圖實現
  // 圓圈標記大小反映案件數
  // 彈出視窗顯示詳細信息
};
```

### 2. 平均金額統計模組 (CaseBudgetView.vue)

#### 功能描述

專注於研究案平均金額的分析，提供預算分配的視覺化展示和統計分析。

#### 主要組件

- **主圖表**: 前12名主管機關的平均金額統計
- **小圖表**: 每個主管機關下前6名執行單位的平均金額
- **台灣地圖**: 大學/學院執行單位的平均金額地理分布
- **關係網絡圖**: 基於平均金額的節點大小關係圖

#### 數據處理邏輯

```javascript
// 平均金額計算
const meanBudget = totalBudget / projectCount;

// 節點大小計算
const radius = Math.max(0.5, Math.min(Math.sqrt(meanBudget) * 0.5 + 6, 50));
```

#### 刻度優化

- 自動計算適合的刻度間隔
- 確保刻度值為整數
- 動態調整刻度數量（2-5條線）

### 3. 數據存儲與管理 (stores/dataStore.js)

#### 核心功能

- **異步數據載入**: 從 JSON 文件載入數據
- **數據計算**: 統計計算和排序邏輯
- **狀態管理**: 載入狀態、錯誤處理
- **響應式更新**: 自動觸發相關組件更新

#### 主要 Getters

```javascript
// 案件數相關
getTopSupervisorAgencies; // 按案件數排序的主管機關
getTop10AgenciesWithSubUnits; // 主管機關及其執行單位

// 平均金額相關
getTopSupervisorAgenciesByBudget; // 按平均金額排序的主管機關
getTop10AgenciesWithSubUnitsByBudget; // 按平均金額排序的主管機關及其執行單位

// 地理位置相關
getUniversityExecutingUnitsWithLocation; // 大學/學院地理位置數據
```

#### 數據載入流程

```javascript
const loadAllData = async () => {
  await Promise.all([
    loadSupervisorAgencies(), // 載入主管機關數據
    loadExecutingUnits(), // 載入執行單位數據
    loadSupervisorExecutingMapping(), // 載入映射關係數據
    loadExecutingUnitsLocations(), // 載入地理位置數據
  ]);
};
```

## 🎨 設計系統與 UI/UX

### 視覺設計原則

#### 1. 色彩系統

```css
:root {
  --my-color-blue: #4a90e2; /* 主要藍色 */
  --my-color-red: #e74c3c; /* 主要紅色 */
  --my-color-green: #27ae60; /* 主要綠色 */
  --my-color-orange: #f39c12; /* 主要橙色 */
  --my-color-purple: #9b59b6; /* 主要紫色 */
  --my-color-teal: #50e3c2; /* 主要青色 */
}
```

#### 2. 字體系統

```css
/* 標題字體 */
.my-title-lg-black {
  font-size: 2rem;
  font-weight: 700;
}
.my-title-md-black {
  font-size: 1.5rem;
  font-weight: 600;
}
.my-title-sm-black {
  font-size: 1.25rem;
  font-weight: 600;
}

/* 正文字體 */
body {
  font-family: 'Arial', 'Microsoft JhengHei', sans-serif;
}
```

#### 3. 間距系統

```css
/* 使用 Bootstrap 的間距類別 */
.mt-4 {
  margin-top: 1.5rem;
}
.mb-3 {
  margin-bottom: 1rem;
}
.py-3 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
```

### 響應式設計

#### 斷點設定

```css
/* 小螢幕 (手機) */
@media (max-width: 576px) {
  /* 樣式調整 */
}

/* 中等螢幕 (平板) */
@media (min-width: 577px) and (max-width: 991px) {
  /* 樣式調整 */
}

/* 大螢幕 (桌面) */
@media (min-width: 992px) {
  /* 樣式調整 */
}
```

#### 網格系統

```html
<!-- Bootstrap 網格系統 -->
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">
    <!-- 響應式列寬 -->
  </div>
</div>
```

## 📊 數據視覺化技術

### D3.js 圖表實現

#### 1. 柱狀圖組件

```javascript
// 核心繪製函數
const drawChart = (config) => {
  // SVG 容器創建
  const svg = container.append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight)

  // 比例尺設定
  const xScale = // 自定義 X 軸比例尺
  const yScale = d3.scaleLinear()
    .domain([0, roundedMaxValue])
    .range([height, 0])

  // 柱狀圖繪製
  g.selectAll('.bar')
    .data(displayData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.uniqueName) - barWidth / 2)
    .attr('y', d => yScale(d.value))
    .attr('width', barWidth)
    .attr('height', d => height - yScale(d.value))
}
```

#### 2. 關係網絡圖

```javascript
// 力導向布局
const simulation = d3.forceSimulation(graphData.nodes)
  .force('link', d3.forceLink(graphData.links).distance(100))
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(d => /* 碰撞半徑 */))

// 節點繪製
const nodes = g.append('g')
  .selectAll('circle')
  .data(graphData.nodes)
  .enter()
  .append('circle')
  .attr('r', d => /* 節點半徑計算 */)
  .attr('fill', d => d.type === 'agency' ? '#4a90e2' : '#f5a623')
```

#### 3. 互動功能

```javascript
// 拖拽功能
.call(d3.drag()
  .on('start', dragstarted)
  .on('drag', dragged)
  .on('end', dragended))

// Tooltip 顯示
.on('mouseover', function(event, d) {
  tooltip.style('opacity', 1)
    .html(/* tooltip 內容 */)
})
```

### Leaflet 地圖實現

#### 1. 地圖初始化

```javascript
const initMap = () => {
  // 創建地圖實例
  const map = L.map('taiwan-map', {
    zoomControl: false,
    attributionControl: false,
  }).setView([23.8, 120.9], 7);

  // 添加圖層
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
  }).addTo(map);
};
```

#### 2. 標記點繪製

```javascript
// 圓圈標記
const circle = L.circle([unit.lat, unit.lng], {
  color: 'var(--my-color-red)',
  fillColor: 'var(--my-color-red)',
  fillOpacity: 0.6,
  radius: radius * 1000, // 轉換為公尺
  weight: 1,
}).addTo(map);

// 彈出視窗
circle.bindPopup(`
  <div>
    <strong>${unit.name}</strong><br/>
    <div>案件數: ${unit.count.toLocaleString()}</div>
    <div>平均金額: ${Math.round(unit.mean_budget).toLocaleString()}(千元)</div>
  </div>
`);
```

## 🔧 開發指令詳解

### 基本開發指令

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run serve

# 構建生產版本
npm run build

# 程式碼檢查
npm run lint

# 自動修復程式碼格式
npm run lint:fix

# 程式碼格式化
npm run format
```

### 進階開發指令

```bash
# 檢查依賴更新
npm outdated

# 更新依賴
npm update

# 安全審計
npm audit

# 修復安全問題
npm audit fix

# 清理 node_modules
rm -rf node_modules package-lock.json
npm install
```

### 構建優化

```bash
# 分析構建包大小
npm run build --report

# 預覽生產版本
npm run preview

# 自定義構建配置
npm run build --mode production
```

## 🚀 部署指南

### GitHub Pages 自動部署

#### 1. 配置部署腳本

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

#### 2. 執行部署

```bash
# 構建專案
npm run build

# 部署到 GitHub Pages
npm run deploy
```

#### 3. 配置 GitHub Actions（可選）

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 其他部署選項

#### 1. Netlify 部署

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 部署
netlify deploy --prod --dir=dist
```

#### 2. Vercel 部署

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

#### 3. 傳統伺服器部署

```bash
# 構建專案
npm run build

# 上傳 dist 目錄到伺服器
scp -r dist/* user@server:/var/www/html/
```

## 🧪 測試與品質保證

### 程式碼品質工具

#### 1. ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
```

#### 2. Prettier 配置

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

#### 3. 瀏覽器兼容性

```json
// package.json
{
  "browserslist": ["> 1%", "last 2 versions", "not dead"]
}
```

### 性能優化

#### 1. 代碼分割

```javascript
// 路由懶加載
const CaseCountView = () => import('../views/CaseCountView.vue');
const CaseBudgetView = () => import('../views/CaseBudgetView.vue');
```

#### 2. 圖片優化

```html
<!-- 使用 WebP 格式 -->
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.png" alt="描述" />
</picture>
```

#### 3. 緩存策略

```javascript
// 數據緩存
const cachedData = ref(new Map());

const getCachedData = (key) => {
  if (cachedData.value.has(key)) {
    return cachedData.value.get(key);
  }
  // 載入新數據並緩存
};
```

## 🔍 故障排除與調試

### 常見問題解決

#### 1. 數據載入失敗

```javascript
// 檢查網絡請求
console.log('數據載入狀態:', {
  主管機關數量: dataStore.supervisorAgencies.length,
  映射資料數量: dataStore.supervisorExecutingMapping.length,
  載入中: dataStore.loading,
  錯誤: dataStore.error,
});
```

#### 2. 圖表不顯示

```javascript
// 檢查 DOM 元素
const container = d3.select(`#${config.containerId}`);
if (container.empty() || !container.node()) {
  console.error(`圖表容器 #${config.containerId} 不存在`);
  return;
}
```

#### 3. 地圖初始化失敗

```javascript
// 檢查 Leaflet 實例
if (mapContainer._leaflet_id) {
  mapContainer._leaflet_id = null;
  mapContainer.innerHTML = '';
}
```

### 調試工具

#### 1. Vue DevTools

- 安裝 Vue.js devtools 瀏覽器擴展
- 檢查組件狀態和 props
- 監控 Vuex/Pinia 狀態變化

#### 2. 瀏覽器開發者工具

```javascript
// 在控制台中檢查數據
console.log('Store 狀態:', dataStore.$state);
console.log('組件數據:', componentData);
```

#### 3. 網絡監控

- 檢查 XHR/Fetch 請求
- 驗證 JSON 數據格式
- 監控資源載入時間

## 📚 API 文檔

### 數據結構

#### 1. 主管機關數據

```json
{
  "name": "機關名稱",
  "count": 案件數量,
  "mean_budget": 平均預算金額
}
```

#### 2. 執行單位數據

```json
{
  "name": "單位名稱",
  "count": 案件數量,
  "mean_budget": 平均預算金額
}
```

#### 3. 映射關係數據

```json
{
  "name": "主管機關名稱",
  "name_sub": "執行單位名稱",
  "count": 案件數量,
  "mean_budget": 平均預算金額
}
```

#### 4. 地理位置數據

```json
{
  "name": "單位名稱",
  "lat": 緯度,
  "lng": 經度
}
```

### 計算屬性

#### 1. 案件數相關

```javascript
// 前12名主管機關（按案件數排序）
getTopSupervisorAgencies;

// 主管機關及其執行單位
getTop10AgenciesWithSubUnits;
```

#### 2. 平均金額相關

```javascript
// 前12名主管機關（按平均金額排序）
getTopSupervisorAgenciesByBudget;

// 主管機關及其執行單位（按平均金額排序）
getTop10AgenciesWithSubUnitsByBudget;
```

#### 3. 地理位置相關

```javascript
// 大學/學院地理位置數據
getUniversityExecutingUnitsWithLocation;
```

## 🤝 貢獻指南

### 開發流程

#### 1. 環境準備

```bash
# Fork 專案到你的 GitHub 帳號
# 克隆你的 Fork
git clone https://github.com/YOUR_USERNAME/yulin-research.git

# 添加上游遠程倉庫
git remote add upstream https://github.com/kevin7261/yulin-research.git
```

#### 2. 功能開發

```bash
# 創建功能分支
git checkout -b feature/AmazingFeature

# 開發功能
# 提交變更
git commit -m 'feat: 添加新功能'

# 推送到你的 Fork
git push origin feature/AmazingFeature
```

#### 3. 提交 Pull Request

- 在 GitHub 上開啟 Pull Request
- 描述你的變更和原因
- 等待代碼審查和合併

### 代碼規範

#### 1. 命名規範

```javascript
// 組件名稱：PascalCase
export default {
  name: 'CaseCountView',
};

// 變數名稱：camelCase
const chartData = ref([]);
const drawChart = () => {};

// 常量名稱：UPPER_SNAKE_CASE
const MAX_CHART_HEIGHT = 320;
const DEFAULT_INTERVAL = 5;
```

#### 2. 註解規範

```javascript
/**
 * 繪製柱狀圖函數
 * @param {Object} config - 圖表配置對象
 * @param {string} config.containerId - DOM 容器 ID
 * @param {Array} config.data - 圖表數據
 * @returns {void}
 */
const drawChart = (config) => {
  // 函數實現
};
```

#### 3. 錯誤處理

```javascript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('操作失敗:', error);
  // 適當的錯誤處理
}
```

## 📞 聯絡資訊與支持

### 專案維護者

- **姓名**: Kevin Cheng
- **GitHub**: [@kevin7261](https://github.com/kevin7261)
- **專案首頁**: [GitHub Repository](https://github.com/kevin7261/yulin-research)

### 獲取幫助

#### 1. 文檔資源

- **專案文檔**: 本 README.md
- **Vue.js 文檔**: [https://vuejs.org/](https://vuejs.org/)
- **D3.js 文檔**: [https://d3js.org/](https://d3js.org/)
- **Leaflet 文檔**: [https://leafletjs.com/](https://leafletjs.com/)

#### 2. 問題回報

- **GitHub Issues**:
  [問題回報頁面](https://github.com/kevin7261/yulin-research/issues)
- **功能請求**: 使用 "Feature Request" 標籤
- **Bug 回報**: 使用 "Bug" 標籤
- **文檔問題**: 使用 "Documentation" 標籤

#### 3. 討論與交流

- **GitHub Discussions**:
  [討論頁面](https://github.com/kevin7261/yulin-research/discussions)
- **Pull Request**: 歡迎代碼貢獻和改進建議

### 專案狀態

- **開發狀態**: 活躍開發中
- **最新版本**: v0.1.0
- **最後更新**: 2024年12月
- **維護狀態**: 積極維護

## 📄 授權條款

### MIT License

```
MIT License

Copyright (c) 2024 雲林縣研究案統計專案

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
```

### 授權說明

- **商業使用**: ✅ 允許
- **修改**: ✅ 允許
- **分發**: ✅ 允許
- **專利使用**: ✅ 允許
- **私人使用**: ✅ 允許

## 🔮 未來規劃

### 短期目標 (1-3個月)

- [ ] 添加更多圖表類型（餅圖、折線圖等）
- [ ] 實現數據導出功能（CSV、Excel）
- [ ] 添加數據篩選和搜索功能
- [ ] 優化移動端體驗

### 中期目標 (3-6個月)

- [ ] 實現用戶認證和權限管理
- [ ] 添加數據編輯和更新功能
- [ ] 實現實時數據同步
- [ ] 添加數據備份和恢復功能

### 長期目標 (6-12個月)

- [ ] 開發移動端應用
- [ ] 實現多語言支持
- [ ] 添加機器學習分析功能
- [ ] 實現與其他系統的數據集成

## 📊 專案統計

### 代碼統計

- **總行數**: 約 15,000+ 行
- **組件數量**: 10+ 個
- **頁面數量**: 3 個
- **工具函數**: 50+ 個

### 技術債務

- **代碼覆蓋率**: 待添加測試
- **文檔完整性**: 90%+
- **性能評分**: 90+ (Lighthouse)
- **可訪問性**: 待優化

---

## 📝 更新日誌

### v0.1.0 (2024-12-XX)

- ✨ 初始版本發布
- 🎯 實現案件數統計功能
- 💰 實現平均金額統計功能
- 🗺️ 添加台灣地圖分布
- 🔗 實現關係網絡圖
- 📱 響應式設計支持

---

📅 **最後更新**: 2024年12月🔖 **版本**: 0.1.0 📝 **文檔版本**: 2.0.0 👨‍💻
**維護者**: Kevin Cheng 🌐 **專案地址**:
[GitHub Repository](https://github.com/kevin7261/yulin-research) 🚀
**線上展示**: [GitHub Pages](https://kevin7261.github.io/yulin-research)
