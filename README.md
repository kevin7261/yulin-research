# 雲林縣研究案統計

一個基於 Vue.js 3 的研究案統計數據展示平台。

[![Vue.js](https://img.shields.io/badge/Vue.js-3.2.13-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)

## 🎯 專案概述

本系統提供雲林縣研究案的統計資料展示，協助研究人員和管理者了解研究案的進展與分布情況。

### 🌟 核心特色

- **📊 數據統計**: 直觀的統計數據展示
- **📱 響應式設計**: 適配各種裝置的現代化介面
- **⚡ 高效能**: 基於 Vue.js 3 的輕量級應用

## 🛠️ 技術架構

### 前端技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **Vue.js 3** | 3.2.13 | 核心前端框架，使用 Composition API |
| **Vue Router** | 4.5.1 | 單頁應用路由管理 |

### 開發工具

| 工具 | 版本 | 功能 |
|------|------|------|
| **Vue CLI** | 5.0.8 | 專案建構與開發工具 |
| **ESLint** | 8.57.0 | 程式碼品質檢查 |
| **Prettier** | 3.5.3 | 程式碼格式化 |
| **Babel** | 7.12.16 | JavaScript 編譯器 |

## 🚀 開發環境設置

### 系統需求

- Node.js 16.0 或更高版本
- npm 或 yarn 套件管理器

### 安裝步驟

1. **克隆專案**

```bash
git clone https://github.com/kevin7261/yulin-research.git
cd yulin-research
```

2. **安裝依賴**

```bash
npm install
```

3. **啟動開發伺服器**

```bash
npm run serve
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

# 自動修復程式碼格式
npm run lint:fix

# 格式化程式碼
npm run format

# 部署到 GitHub Pages
npm run deploy
```

## 📂 專案結構

```
src/
├── views/              # 頁面組件
│   └── HomeView.vue    # 首頁
├── router/             # 路由配置
│   └── index.js        # 路由設定
├── assets/             # 靜態資源
│   └── logo.png        # 專案標誌
├── App.vue             # 根組件
└── main.js             # 應用入口
```

## 🎨 設計特色

### 視覺設計
- 現代化的漸層背景
- 透明玻璃效果卡片設計
- 流暢的動畫過渡效果

### 響應式設計
- 支援桌面、平板、手機各種尺寸
- 自適應網格佈局
- 觸控友好的操作體驗

## 🌐 部署

### GitHub Pages 部署

專案已配置 GitHub Pages 自動部署：

1. 推送代碼到 main 分支
2. 執行部署指令：
   ```bash
   npm run deploy
   ```
3. 網站將自動部署到：`https://kevin7261.github.io/yulin-research/`

### 手動部署

```bash
# 建構專案
npm run build

# 部署 dist 資料夾到您的網頁伺服器
```

## 📄 授權條款

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

## 📞 聯絡資訊

- **專案維護者**: [Kevin Cheng](https://github.com/kevin7261)
- **專案首頁**: [GitHub Repository](https://github.com/kevin7261/yulin-research)
- **線上展示**: [GitHub Pages](https://kevin7261.github.io/yulin-research)
- **問題回報**: [GitHub Issues](https://github.com/kevin7261/yulin-research/issues)

---

📅 **最後更新**: 2024年12月
🔖 **版本**: 0.1.0
📝 **文檔版本**: 1.0.0