# 臺北市長照資訊系統 - 部署指南

## 前置作業
1. 確保已安裝 Node.js (建議版本 16 或以上)
2. 確保已安裝 npm 和 git
3. 確保已將專案推送到 GitHub

## 部署方式

### 方法一：使用 npm scripts (推薦)
```bash
npm run deploy
```

### 方法二：手動部署
```bash
npm run build
npx gh-pages -d dist --no-history
```

## GitHub Pages 設定
1. 到 GitHub 專案的 Settings > Pages
2. 選擇 Source: Deploy from a branch
3. 選擇 Branch: gh-pages
4. 選擇 Folder: / (root)
5. 點擊 Save

## 故障排除

### 問題：部署後網頁沒有更新
可能的原因和解決方案：

1. **瀏覽器緩存問題**
   - 按 Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac) 強制刷新
   - 或使用無痕模式瀏覽

2. **GitHub Pages 設定錯誤**
   - 檢查 GitHub Settings > Pages 是否設定為 gh-pages 分支
   - 確認不是設定為 GitHub Actions

3. **部署衝突**
   - 如果同時有 GitHub Actions 和 gh-pages 部署，請停用其中一個
   - 建議使用 gh-pages 手動部署，停用 GitHub Actions

4. **強制更新部署**
   ```bash
   # 先建置
   npm run build

   # 使用強制部署
   npx gh-pages -d dist --no-history
   ```

5. **清理 gh-pages 分支**
   ```bash
   # 刪除本地 gh-pages 分支
   git branch -D gh-pages

   # 重新部署
   npm run deploy
   ```

### 問題：GitHub Actions 部署失敗
1. 檢查 `.github/workflows/deploy.yml` 設定
2. 確認 GitHub 專案的 Settings > Actions > General > Workflow permissions 設定為 "Read and write permissions"

## 檢查部署狀態
- 網站網址: https://kevin7261.github.io/yulin-research/
- 檢查 GitHub 專案的 Actions 頁面查看部署狀態
- 檢查 Settings > Pages 頁面確認設定正確

## 注意事項
1. 每次部署前會自動執行 `npm run build`
2. 部署使用 `--no-history` 參數以避免歷史記錄衝突
3. 如果修改了 publicPath，記得更新 `vue.config.js` 中的設定
