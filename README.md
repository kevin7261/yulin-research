# 雲林縣研究案統計分析平台

一個以 Vue 3 + D3.js +
Leaflet 打造的研究案資料視覺化平台，提供案件數、預算、地圖與網絡圖等多模組分析。專案以 Vue
CLI 建置，支援 GitHub Pages 一鍵部署，並內建 PNG 匯出（與畫面顯示顏色一致）。

— 線上頁面：`https://kevin7261.github.io/yulin-research`

## 功能與頁面

- 基本統計（`BasicStatsView.vue`）

  - 年度趨勢折線圖（可下載 PNG）
  - 委托案件數總覽（全部／學術／非學術／雲林），同高卡片佈局
  - 研究領域與中文關鍵詞的文字雲（可下載 PNG）

- 案件數統計（`CaseCountView.vue`）

  - 主管機關案件數統計（前 12 名），主圖高度已增加 +160px（bar 320、容器 480）
  - 主管機關 vs 執行單位關係網絡圖（D3 力導向）
  - 每個主管機關的小圖（Top 3 類別）
  - 所有圖表卡片右上角提供「下載 PNG」按鈕（灰 400）

- 平均金額統計（`CaseBudgetView.vue`）
  - 主管機關平均金額統計（前 12 名），主圖高度已增加 +160px（bar 320、容器 480）
  - 每個主管機關的小圖（Top 3 類別）
  - 所有圖表卡片右上角提供「下載 PNG」按鈕（灰 400）

所有下載按鈕均採一致寫法：

```html
<button
  class="btn btn-sm btn-outline-secondary position-absolute"
  style="top: 8px; right: 8px; z-index: 2; color: var(--my-color-gray-400); border-color: var(--my-color-gray-400)"
  title="下載 PNG"
  @click="exportContainerSvgAsPng('<容器ID>', '<檔名>.png')"
>
  <i class="fa-solid fa-download"></i>
  下載 PNG }
</button>
```

## 技術棧

- Vue 3（Composition API）
- Vue Router、Pinia（狀態管理）
- D3.js（圖表）
- Leaflet（地圖）
- Bootstrap 5（樣式）
- Font Awesome（Icon，使用套件方式匯入）

## 專案結構

```
src/
├── assets/
│   └── css/
│       ├── common.css        # 全站共用樣式
│       └── variables.css     # CSS 變數（含灰階：--my-color-gray-400）
├── stores/
│   └── dataStore.js          # 資料載入與集中管理（Pinia）
├── utils/
│   └── exportImage.js        # 圖表 SVG → PNG 匯出工具（保留顏色）
├── views/
│   ├── BasicStatsView.vue    # 基本統計頁
│   ├── CaseBudgetView.vue    # 平均金額統計頁
│   └── CaseCountView.vue     # 案件數統計頁
├── router/
│   └── index.js              # 路由設定
├── App.vue
└── main.js                   # 入口，匯入 Bootstrap、Leaflet、Font Awesome CSS

public/
└── data/
    ├── 計畫年度.json
    ├── 計畫主管機關_normalize.json
    ├── 執行單位名稱_normalize.json
    ├── 執行單位名稱_normalize_&_計畫主管機關_normalize.json
    ├── 執行單位名稱_locations.json
    ├── 研究領域.json
    ├── 中文關鍵詞.json
    └── 全部.json
```

## 安裝與開發

環境需求：

- Node.js ≥ 16、npm ≥ 8（建議使用 LTS）

安裝：

```bash
git clone https://github.com/kevin7261/yulin-research.git
cd yulin-research
npm install
```

開發啟動（預設 `http://localhost:8080`）：

```bash
npm run serve
```

建置生產版：

```bash
npm run build
```

格式化與 Lint：

```bash
npm run prettier       # 套用 Prettier
npm run lint           # 檢查 ESlint
npm run lint:fix       # 自動修正
```

## 部署（GitHub Pages）

`package.json` 已設定：

- `homepage`: `https://kevin7261.github.io/yulin-research`
- `predeploy`: `npm run build`
- `deploy`: 以 `gh-pages` 將 `dist/` 發佈

部署步驟：

```bash
npm run build
npm run deploy
```

注意：若為組織或自訂網域，請同步調整 `homepage` 與 Repo 的 Pages 設定。

## 資料來源與格式

所有 JSON 皆置於 `public/data/`，以 HTTP 直接存取。主要檔案與欄位（節錄）：

- `計畫主管機關_normalize.json`

  - 欄位：`主管機關`、`案件數`、`平均金額`、`學術單位` 等
  - 用途：主管機關 Top N 排序與主／小圖資料來源

- `執行單位名稱_normalize.json`

  - 欄位：`執行單位`、`案件數`、`平均金額`、`學術單位` 等
  - 用途：小圖與關係圖節點屬性

- `執行單位名稱_normalize_&_計畫主管機關_normalize.json`

  - 關聯表：主管機關 ↔ 執行單位（含案件數、預算等）
  - 用途：關係圖的 links 與節點關聯

- `執行單位名稱_locations.json`

  - 欄位：`執行單位`、`lat`、`lng`
  - 用途：Leaflet 地圖定位

- `計畫年度.json`
  - 欄位：年度與各分類統計（如 `全部`、`學術`、`非學術`、`雲林`）
  - 用途：基本統計頁年度趨勢與左側總覽計算

## 圖表與樣式規範

- 樣式來源：僅允許 `src/assets/css/common.css`、`src/assets/css/variables.css`
  與 Bootstrap；不新增其他自訂 CSS 檔。
- 顏色變數：灰 400 使用 `var(--my-color-gray-400)`。
- 數字顯示：一律顯示整數（無小數）。
- 下載按鈕：所有卡片右上角，class 與 inline style 完全一致（見前述範例）。
- RWD：本專案不強制做響應式；以固定桌面寬度展示為主。

### 匯出 PNG（顏色與畫面一致）

`src/utils/exportImage.js` 提供：

```js
export function exportContainerSvgAsPng(containerId, filename = 'chart.png')
```

使用說明：

- `containerId`：卡片內部包住 `svg` 的容器 ID（匯出時會自動偵測第一個 `svg`）。
- 匯出流程會複製原始 `svg` 並寫入 computed
  styles（含 fill/stroke/opacity 等），避免黑白或樣式遺失問題。
- 下載圖片會與螢幕呈現完全相同（含色彩與粗細）。

### 調整圖表高度

在 `CaseBudgetView.vue`、`CaseCountView.vue` 的 `drawChart`
支援兩個可選 callback：

- `getChartHeight(): number` 只調整 bar 區高度（預設 160）
- `getContainerHeight(): number` 調整整體容器高度（預設依各圖而定）

主圖（前 12 名）已套用：bar 320、容器 480；其他圖保持原設定。

## 常見問題（FAQ）

- 圖示不顯示？

  - 已改以套件方式在 `src/main.js` 匯入
    `@fortawesome/fontawesome-free/css/all.min.css`。請強制重新整理或清快取。

- 下載出來是黑白？

  - 已在 `exportImage.js` 於匯出前內嵌 computed
    styles，輸出顏色與畫面一致。若仍異常請回報特定圖表容器 ID。

- 下載按鈕位置不一致？

  - 三頁面已完全統一為卡片
    `position-relative`，按鈕為卡片直接子元素且固定右上角。若自訂卡片請複製相同寫法。

- 開發伺服器埠被占用？

  - 修改 `package.json` 的 `serve` 腳本或以 `--port` 指定其他埠。

- JSON 資料載不進來？
  - 檢查 `public/data/`
    檔名與欄位是否符合程式預期；瀏覽器 Console 是否有 404 或 JSON 格式錯誤。

## 開發規範

- 命名清楚、意圖明確；避免縮寫與單字母變數。
- 複雜流程需有易讀註解，函式需有說明與參數註解。
- 控制流程採「早回傳」與錯誤優先處理，避免深層巢狀結構。
- 保持程式碼整潔：請定期執行 `npm run format`。

## 版權與授權

本專案為內部／教學用途。若需對外散佈或二次開發，請先徵得維護者同意。

## 維護者

- Maintainer: Kevin Cheng

— 最後更新：2025-08

# 雲林縣研究案統計分析平台

## 項目概述

雲林縣研究案統計分析平台是一個專門用於分析雲林縣研究案數據的 Web 應用程式，提供多維度的數據視覺化分析功能。該平台整合了主管機關、執行單位、案件統計、預算分析等多個數據維度，通過直觀的圖表、地圖和網絡圖幫助用戶深入理解研究案的分布模式、合作關係和發展趨勢。

## 主要功能模組

### 1. 主管機關案件數統計分析

- **主圖表**：顯示前12名主管機關的案件數排名，使用水平柱狀圖展示
- **數據排序**：按案件數從高到低自動排序，突出顯示最活躍的主管機關
- **響應式設計**：自動適應容器寬度，支持不同螢幕尺寸
- **互動功能**：滑鼠懸停顯示詳細統計信息

### 2. 大學/學院案件數分布地圖

- **台灣地圖**：基於 Leaflet.js 的互動式地圖
- **學術單位標記**：在地圖上標記所有學術單位（"學術單位":"TRUE"）的位置
- **視覺化編碼**：圓圈大小與委托案件數成正比，直觀反映業務規模
- **詳細信息**：點擊標記顯示單位名稱、委托案件數和平均金額
- **互動體驗**：支持縮放、拖拽、懸停效果

### 3. 主管機關下屬執行單位分析

- **12個小圖表**：為每個主管機關創建獨立的執行單位分析圖表
- **數據分布**：顯示各機關下屬執行單位的案件數和預算分布
- **動態生成**：使用 v-for 指令動態生成圖表，支持任意數量的主管機關
- **統一設計**：所有小圖表使用一致的視覺設計和交互模式

### 4. 主管機關與執行單位關係網絡圖

- **力導向布局**：使用 D3.js 力導向算法創建網絡關係圖
- **節點分類**：藍色圓圈代表主管機關，橘色圓圈代表執行單位
- **關係連結**：灰色線條表示合作關係，線條粗細反映關係強度
- **互動操作**：支持節點拖拽、圖表縮放、懸停顯示詳情
- **數據過濾**：只顯示學術單位相關的合作關係

## 技術架構

### 前端技術棧

- **Vue 3**：使用 Composition API 構建響應式組件
- **Pinia**：狀態管理，統一管理應用程式的數據狀態
- **D3.js**：數據視覺化庫，用於創建各種圖表
- **Leaflet.js**：互動式地圖庫，用於台灣地圖功能
- **Bootstrap 5**：響應式 UI 框架，提供現代化的用戶界面

### 數據管理架構

- **數據 Store**：使用 Pinia 管理所有數據的載入、處理和狀態
- **異步數據載入**：支持並行載入多個數據源，提升性能
- **數據過濾和轉換**：提供靈活的數據處理和轉換功能
- **響應式數據綁定**：數據變化時自動更新相關的視覺化組件

### 組件架構設計

- **模組化設計**：每個功能模組獨立封裝，便於維護和擴展
- **生命週期管理**：完善的組件初始化和清理機制
- **錯誤處理**：全面的錯誤捕獲和用戶友好的錯誤提示
- **性能優化**：圖表重繪優化、記憶體管理、DOM 清理

## 數據來源

### 主要數據文件

1. **計畫主管機關\_normalize.json**

   - 主管機關基本資料和統計數據
   - 包含機關名稱、委托案件數、預算金額、學術單位標記等

2. **執行單位名稱\_normalize.json**

   - 執行單位基本資料和統計數據
   - 包含單位名稱、委托案件數、預算金額、學術單位標記等

3. **執行單位名稱*normalize*&\_計畫主管機關\_normalize.json**

   - 主管機關與執行單位的映射關係
   - 包含合作關係、案件數、預算等關聯數據

4. **執行單位名稱\_locations.json**
   - 執行單位的地理位置座標
   - 用於地圖上的位置標記

### 數據結構特點

- **標準化格式**：所有數據都經過標準化處理，確保一致性
- **學術單位標記**：使用 "學術單位":"TRUE"/"FALSE" 標記學術屬性
- **地理位置信息**：提供精確的經緯度座標，支持地圖功能
- **關聯關係**：完整的映射關係數據，支持網絡圖分析

## 安裝和部署

### 環境要求

- **Node.js**：版本 16.0 或更高
- **npm**：版本 8.0 或更高
- **現代瀏覽器**：支持 ES6+ 語法的瀏覽器

### 安裝步驟

1. **克隆項目**

   ```bash
   git clone [項目地址]
   cd yulin-research
   ```

2. **安裝依賴**

   ```bash
   npm install
   ```

3. **啟動開發服務器**

   ```bash
   npm run dev
   ```

4. **構建生產版本**
   ```bash
   npm run build
   ```

### 部署配置

- **開發環境**：使用 Vite 開發服務器，支持熱重載
- **生產環境**：構建靜態文件，可部署到任何 Web 服務器
- **數據文件**：確保 public/data/ 目錄下的 JSON 文件可訪問

## 使用指南

### 基本操作

1. **查看統計圖表**：頁面載入後自動顯示各種統計圖表
2. **地圖互動**：使用滑鼠縮放、拖拽地圖，點擊標記查看詳情
3. **網絡圖操作**：拖拽節點調整位置，懸停查看統計信息
4. **響應式設計**：調整瀏覽器窗口大小，圖表自動適應

### 數據解讀

- **案件數統計**：反映各主管機關的研究案活躍程度
- **地理分布**：了解學術單位的地理分布模式
- **合作關係**：分析主管機關與執行單位的合作網絡
- **預算分析**：了解研究案的資金分配情況

## 開發指南

### 代碼結構

```
src/
├── views/                 # 頁面組件
│   ├── CaseCountView.vue # 案件數統計頁面
│   └── CaseBudgetView.vue # 平均金額統計頁面
├── stores/               # 狀態管理
│   └── dataStore.js      # 數據管理 Store
├── components/           # 可重用組件
├── assets/              # 靜態資源
└── router/              # 路由配置
```

### 開發規範

- **註解標準**：所有函數和複雜邏輯都必須有詳細的註解說明
- **命名規範**：使用有意義的變數和函數名稱，遵循 Vue 組件命名規範
- **錯誤處理**：完善的錯誤捕獲和處理機制
- **性能優化**：注意記憶體管理和 DOM 操作優化

### 擴展開發

- **新增圖表類型**：在圖表繪製函數區域添加新的圖表類型
- **數據源擴展**：在 dataStore 中添加新的數據載入和處理邏輯
- **組件擴展**：創建新的 Vue 組件，遵循現有的架構模式

## 維護和更新

### 定期維護

- **數據更新**：定期更新 JSON 數據文件，確保數據的時效性
- **依賴更新**：定期更新 npm 依賴包，修復安全漏洞
- **性能監控**：監控應用程式的性能指標，優化加載速度

### 故障排除

- **數據載入問題**：檢查 JSON 文件格式和網絡連接
- **圖表渲染問題**：檢查瀏覽器控制台的錯誤信息
- **性能問題**：檢查數據量大小和圖表複雜度

## 版本歷史

### v1.0.0 (當前版本)

- 完整的案件數統計分析功能
- 台灣地圖上的學術單位分布
- 主管機關與執行單位關係網絡圖
- 響應式設計和現代化用戶界面

### 未來計劃

- 更多圖表類型和視覺化選項
- 數據導出和報表生成功能
- 用戶權限管理和多用戶支持
- 移動端優化和 PWA 支持

## 貢獻指南

歡迎貢獻代碼和改進建議！請遵循以下步驟：

1. Fork 項目
2. 創建功能分支
3. 提交更改
4. 發起 Pull Request

## 授權信息

本項目採用 [授權類型] 授權，詳見 LICENSE 文件。

## 聯繫方式

如有問題或建議，請通過以下方式聯繫：

- **項目維護者**：[姓名]
- **電子郵件**：[email]
- **項目地址**：[GitHub 地址]

---

_最後更新：2024年12月_
