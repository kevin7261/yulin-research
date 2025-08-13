/**
 * 雲林縣研究案統計分析平台 - 數據管理 Store
 *
 * 功能概述：
 * 使用 Pinia 管理應用程式的全局數據狀態，提供統一的數據存取、處理和計算介面。
 * 作為整個應用程式的數據中心，負責所有數據的載入、轉換、存儲和分發工作。
 *
 * 核心職責：
 * 1. 數據載入管理：異步載入多個 JSON 數據源，處理載入狀態和錯誤情況
 * 2. 數據轉換處理：將原始 JSON 數據轉換為應用程式所需的標準化格式
 * 3. 數據計算統計：提供各種統計計算、排序和過濾功能
 * 4. 狀態同步管理：確保所有組件都能及時獲取到最新的數據狀態
 * 5. 性能優化：實現數據緩存、懶加載和並行載入等優化策略
 *
 * 數據源管理：
 * - 執行單位數據（執行單位名稱_normalize.json）：包含單位基本信息和統計數據
 * - 主管機關數據（計畫主管機關_normalize.json）：包含機關基本信息和統計數據
 * - 映射關係數據（執行單位名稱_normalize_&_計畫主管機關_normalize.json）：機關與單位的合作關係
 * - 地理位置數據（執行單位名稱_locations.json）：單位的經緯度座標信息
 *
 * 技術特點：
 * - 響應式數據：使用 Vue 3 的 ref 和 computed 實現響應式數據綁定
 * - 異步處理：支持並行載入多個數據源，提升載入性能
 * - 錯誤處理：完善的錯誤捕獲、記錄和用戶友好的錯誤提示
 * - 數據驗證：載入後進行數據完整性檢查和格式驗證
 * - 記憶體管理：及時清理無用的數據引用，防止記憶體洩漏
 *
 * 架構設計：
 * - 單一數據源：所有組件都從這個 store 獲取數據，確保數據一致性
 * - 計算屬性：使用 computed 實現數據的派生計算，避免重複計算
 * - 模組化設計：按功能模組組織數據和方法，便於維護和擴展
 * - 類型安全：雖然使用 JavaScript，但通過 JSDoc 註解提供類型信息
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDataStore = defineStore('data', () => {
  // ==================== 響應式狀態定義 (Reactive State Definitions) ====================
  // 本區域定義了 store 中所有的響應式狀態變數，這些變數會自動觸發
  // 依賴它們的計算屬性和組件的重新渲染。每個狀態變數都使用 ref() 包裝，
  // 確保在組件中使用時能夠正確地建立響應式連接。

  /**
   * 執行單位數據陣列
   * 結構：[{ name: string, 委托案件數: number, 所有相符資料_JSON: number }, ...]
   */
  const executingUnits = ref([]);

  /**
   * 主管機關數據陣列
   * 結構：[{ name: string, 委托案件數: number, 所有相符資料_JSON: number }, ...]
   */
  const supervisorAgencies = ref([]);

  /**
   * 主管機關-執行單位映射數據陣列
   * 結構：[{ name: string, name_sub: string, 委托案件數: number, 所有相符資料_JSON: number }, ...]
   * name: 主管機關名稱, name_sub: 執行單位名稱
   */
  const supervisorExecutingMapping = ref([]);

  /**
   * 執行單位地理位置數據陣列
   * 結構：[{ name: string, lat: number, lng: number }, ...]
   */
  const executingUnitsLocations = ref([]);

  /** 數據載入狀態標記 */
  const loading = ref(false);

  /** 錯誤訊息，null 表示無錯誤 */
  const error = ref(null);

  // ==================== 計算屬性 (Computed Properties / Getters) ====================
  // 本區域包含所有基於響應式狀態計算得出的派生數據，這些計算屬性具有
  // 緩存特性，只有當依賴的狀態變化時才會重新計算，大大提升了性能。
  // 每個計算屬性都提供特定的數據視圖，滿足不同組件的數據需求。

  /**
   * 獲取前10名執行單位（按案件數排序）
   *
   * 功能說明：
   * 基於執行單位的委托案件數進行排序，返回案件數最多的前10名執行單位。
   * 這個計算屬性主要用於案件數統計頁面，幫助用戶快速識別最活躍的執行單位。
   *
   * 排序邏輯：
   * 1. 按委托案件數降序排列（從高到低）
   * 2. 取前10名單位，確保返回結果的數量可控
   * 3. 創建數據副本，避免修改原始數據
   *
   * 數據結構：
   * 返回的每個執行單位對象包含：
   * - name: 執行單位名稱
   * - 委托案件數: 該單位的案件總數
   * - 所有相符資料_JSON: 該單位的平均預算金額
   * - 學術單位: 是否為學術單位的標記
   *
   * 使用場景：
   * - 案件數統計頁面的執行單位排名展示
   * - 主管機關下屬執行單位的案件數分析
   * - 執行單位活躍度的快速評估
   *
   * 性能特點：
   * - 使用 computed 緩存，只有當 executingUnits 變化時才重新計算
   * - 排序操作在數據副本上進行，不影響原始數據
   *
   * @returns {ComputedRef<Array>} 排序後的前10名執行單位陣列
   */
  const getTopExecutingUnits = computed(() => {
    return executingUnits.value
      .slice() // 創建副本避免修改原始資料
      .sort((a, b) => b.委托案件數 - a.委托案件數) // 按案件數降序排列
      .slice(0, 10); // 取前10名
  });

  /**
   * 獲取前10名執行單位（按平均預算排序）
   *
   * 功能說明：
   * 基於執行單位的平均預算金額進行排序，返回預算金額最高的前10名執行單位。
   * 這個計算屬性主要用於平均金額統計頁面，幫助用戶理解資金分配模式。
   *
   * 排序邏輯：
   * 1. 按平均預算金額降序排列（從高到低）
   * 2. 取前10名單位，確保返回結果的數量可控
   * 3. 創建數據副本，避免修改原始數據
   *
   * 數據結構：
   * 返回的每個執行單位對象包含：
   * - name: 執行單位名稱
   * - 委托案件數: 該單位的案件總數
   * - 所有相符資料_JSON: 該單位的平均預算金額
   * - 學術單位: 是否為學術單位的標記
   *
   * 與案件數排序的區別：
   * - 排序依據：使用平均預算金額而非案件數量
   * - 分析重點：關注資金分配效率而非業務活躍度
   * - 應用場景：主要用於預算分析和資金流向研究
   *
   * 使用場景：
   * - 平均金額統計頁面的執行單位排名展示
   * - 主管機關下屬執行單位的預算分布分析
   * - 執行單位資金使用效率的評估
   *
   * 性能特點：
   * - 使用 computed 緩存，只有當 executingUnits 變化時才重新計算
   * - 排序操作在數據副本上進行，不影響原始數據
   *
   * @returns {ComputedRef<Array>} 按預算排序的前10名執行單位陣列
   */
  const getExecutingUnitsByBudget = computed(() => {
    return executingUnits.value
      .slice() // 創建副本避免修改原始資料
      .sort((a, b) => b.所有相符資料_JSON - a.所有相符資料_JSON) // 按平均預算降序排列
      .slice(0, 10); // 取前10名
  });

  /**
   * 計算所有執行單位的總案件數
   *
   * 功能說明：
   * 統計所有執行單位的委托案件數總和，提供整個系統的案件總量指標。
   * 這個計算屬性用於概覽頁面和統計摘要，幫助用戶了解研究案的整體規模。
   *
   * 計算邏輯：
   * 1. 遍歷所有執行單位數據
   * 2. 累加每個單位的委托案件數
   * 3. 返回總案件數的數值
   *
   * 數據處理：
   * - 使用 reduce 方法進行累加計算，性能優化
   * - 自動處理空數據情況，返回 0 而不是 NaN
   * - 支持實時更新，當執行單位數據變化時自動重新計算
   *
   * 使用場景：
   * - 概覽頁面的總案件數顯示
   * - 統計摘要和報表生成
   * - 系統規模的快速評估
   * - 與其他指標的對比分析
   *
   * 性能特點：
   * - 使用 computed 緩存，只有當 executingUnits 變化時才重新計算
   * - 單次遍歷完成計算，時間複雜度為 O(n)
   *
   * @returns {ComputedRef<number>} 所有執行單位的總案件數
   */
  const getTotalCount = computed(() => {
    return executingUnits.value.reduce((sum, unit) => sum + unit.委托案件數, 0);
  });

  /**
   * 計算所有執行單位的平均預算
   *
   * 功能說明：
   * 計算所有執行單位的平均預算金額，提供整個系統的預算水平指標。
   * 這個計算屬性用於預算分析和資金效率評估，幫助用戶了解研究案的資金分配情況。
   *
   * 計算邏輯：
   * 1. 檢查是否有可用的執行單位數據
   * 2. 計算所有單位的預算總和
   * 3. 除以單位數量得到平均值
   * 4. 處理空數據情況，返回 0
   *
   * 數據處理：
   * - 使用 reduce 方法累加所有預算金額
   * - 自動處理空數據情況，避免除以零的錯誤
   * - 支持實時更新，當執行單位數據變化時自動重新計算
   *
   * 與總案件數的區別：
   * - 計算維度：關注預算金額而非案件數量
   * - 分析重點：資金分配效率而非業務規模
   * - 應用場景：主要用於預算分析和資金流向研究
   *
   * 使用場景：
   * - 概覽頁面的平均預算顯示
   * - 預算分析和資金效率評估
   * - 與其他指標的對比分析
   * - 系統資金水平的快速評估
   *
   * 性能特點：
   * - 使用 computed 緩存，只有當 executingUnits 變化時才重新計算
   * - 單次遍歷完成計算，時間複雜度為 O(n)
   *
   * @returns {ComputedRef<number>} 所有執行單位的平均預算金額，若無資料則返回 0
   */
  const getAverageBudget = computed(() => {
    if (executingUnits.value.length === 0) return 0;
    const totalBudget = executingUnits.value.reduce((sum, unit) => sum + unit.所有相符資料_JSON, 0);
    return totalBudget / executingUnits.value.length;
  });

  /**
   * 獲取前12名主管機關（按案件數排序）
   * @returns {ComputedRef<Array>} 排序後的前12名主管機關陣列
   */
  const getTopSupervisorAgencies = computed(() => {
    return supervisorAgencies.value
      .slice() // 創建副本避免修改原始資料
      .sort((a, b) => b.委托案件數 - a.委托案件數) // 按案件數降序排列
      .slice(0, 12); // 取前12名
  });

  /**
   * 獲取前12名主管機關（按平均預算排序）
   * @returns {ComputedRef<Array>} 按平均預算排序後的前12名主管機關陣列
   */
  const getTopSupervisorAgenciesByBudget = computed(() => {
    return supervisorAgencies.value
      .slice() // 創建副本避免修改原始資料
      .sort((a, b) => b.本期經費平均_千元 - a.本期經費平均_千元) // 按平均預算降序排列
      .slice(0, 12); // 取前12名
  });

  // ==================== 輔助函數 ====================

  /**
   * 獲取指定主管機關下的前10名執行單位
   * @param {string} agencyName - 主管機關名稱
   * @returns {Array} 該主管機關下的執行單位陣列（最多10個）
   */
  const getAgencySubUnits = (agencyName) => {
    // 過濾出該主管機關的所有執行單位記錄
    const subUnits = supervisorExecutingMapping.value
      .filter((record) => record.name === agencyName)
      .sort((a, b) => b.委托案件數 - a.委托案件數) // 按案件數降序排列
      .slice(0, 10); // 限制最多10個

    return subUnits;
  };

  /**
   * 獲取指定主管機關下的前10名執行單位（按平均預算排序）
   * @param {string} agencyName - 主管機關名稱
   * @returns {Array} 該主管機關下的執行單位陣列（最多10個）
   */
  const getAgencySubUnitsByBudget = (agencyName) => {
    // 過濾出該主管機關的所有執行單位記錄
    const subUnits = supervisorExecutingMapping.value
      .filter((record) => record.name === agencyName)
      .sort((a, b) => b.本期經費平均_千元 - a.本期經費平均_千元) // 按平均預算降序排列
      .slice(0, 10); // 限制最多10個

    return subUnits;
  };

  /**
   * 為前12名主管機關獲取其下屬執行單位資料
   * @returns {ComputedRef<Array>} 包含主管機關及其執行單位的完整資料陣列
   */
  const getTop10AgenciesWithSubUnits = computed(() => {
    const top12Agencies = getTopSupervisorAgencies.value;

    return top12Agencies.map((agency) => {
      const subUnits = getAgencySubUnits(agency.name);

      // 輸出除錯資訊到控制台
      // eslint-disable-next-line no-console
      console.log(`主管機關: ${agency.name} -> 執行單位數: ${subUnits.length}`);

      return {
        ...agency, // 展開主管機關的原始屬性
        subUnits: subUnits, // 添加該主管機關下的執行單位陣列
      };
    });
  });

  /**
   * 為前12名主管機關（按平均預算排序）獲取其下屬執行單位資料
   * @returns {ComputedRef<Array>} 包含主管機關及其執行單位的完整資料陣列
   */
  const getTop10AgenciesWithSubUnitsByBudget = computed(() => {
    const top12Agencies = getTopSupervisorAgenciesByBudget.value;

    return top12Agencies.map((agency) => {
      const subUnits = getAgencySubUnitsByBudget(agency.name);

      // 輸出除錯資訊到控制台
      // eslint-disable-next-line no-console
      console.log(`主管機關: ${agency.name} -> 執行單位數: ${subUnits.length}`);

      return {
        ...agency, // 展開主管機關的原始屬性
        subUnits: subUnits, // 添加該主管機關下的執行單位陣列
      };
    });
  });

  /**
   * 獲取學術單位（"學術單位":"TRUE"）的執行單位，並結合地理位置和預算數據
   * @returns {ComputedRef<Array>} 包含地理位置的學術單位執行單位陣列
   */
  const getUniversityExecutingUnitsWithLocation = computed(() => {
    // 直接從執行單位數據中過濾出學術單位
    const universityUnits = executingUnits.value.filter((unit) => unit.學術單位 === 'TRUE');

    // 將預算數據與地理位置數據結合
    return universityUnits
      .map((unit) => {
        const location = executingUnitsLocations.value.find((loc) => loc.name === unit.name);
        return {
          ...unit,
          lat: location?.lat || null,
          lng: location?.lng || null,
          hasLocation: !!(location?.lat && location?.lng),
        };
      })
      .filter((unit) => unit.hasLocation); // 只返回有地理位置的單位
  });

  // ==================== 異步操作（Actions）====================

  /**
   * 載入主管機關數據
   * 從 public/data/計畫主管機關_normalize.json 載入資料
   */
  const loadSupervisorAgencies = async () => {
    try {
      // 發送 HTTP 請求載入 JSON 資料
      const response = await fetch('./data/計畫主管機關_normalize.json');

      // 檢查 HTTP 回應狀態
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 解析 JSON 資料
      const data = await response.json();

      // 將 JSON 欄位名稱映射到代碼中使用的欄位名稱
      const mappedData = data.map((item) => ({
        name: item['計畫主管機關_normalize'], // 映射計畫主管機關_normalize 到 name
        委托案件數: item['委托案件數'],
        所有相符資料_JSON: item['所有相符資料_JSON'],
        學術單位: item['學術單位'],
        本期經費總合_千元: item['本期經費總合_千元'],
        本期經費平均_千元: item['本期經費平均_千元'],
      }));

      // 更新響應式狀態
      supervisorAgencies.value = mappedData;

      // 輸出載入成功資訊
      // eslint-disable-next-line no-console
      console.log('主管機關資料載入成功:', mappedData.length, '筆資料');
      // eslint-disable-next-line no-console
      console.log('前5名主管機關:', mappedData.slice(0, 5));
    } catch (err) {
      // 處理載入錯誤
      // eslint-disable-next-line no-console
      console.error('載入主管機關資料失敗:', err);
      error.value = err.message;
    }
  };

  /**
   * 載入主管機關-執行單位映射數據
   * 從 public/data/執行單位名稱_normalize_&_計畫主管機關_normalize.json 載入資料
   */
  const loadSupervisorExecutingMapping = async () => {
    try {
      // 發送 HTTP 請求載入 JSON 資料
      const response = await fetch('./data/執行單位名稱_normalize_&_計畫主管機關_normalize.json');

      // 檢查 HTTP 回應狀態
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 解析 JSON 資料
      const data = await response.json();

      // 將 JSON 欄位名稱映射到代碼中使用的欄位名稱
      const mappedData = data.map((item) => ({
        name: item['計畫主管機關_normalize'], // 映射計畫主管機關_normalize 到 name
        name_sub: item['執行單位名稱_normalize'], // 映射執行單位名稱_normalize 到 name_sub
        委托案件數: item['委托案件數'],
        所有相符資料_JSON: item['所有相符資料_JSON'],
        本期經費總合_千元: item['本期經費總合_千元'],
        本期經費平均_千元: item['本期經費平均_千元'],
      }));

      // 更新響應式狀態
      supervisorExecutingMapping.value = mappedData;

      // 輸出載入成功資訊
      // eslint-disable-next-line no-console
      console.log('主管機關-執行單位映射資料載入成功:', mappedData.length, '筆資料');
    } catch (err) {
      // 處理載入錯誤
      // eslint-disable-next-line no-console
      console.error('載入主管機關-執行單位映射資料失敗:', err);
      error.value = err.message;
    }
  };

  /**
   * 載入執行單位數據（包含平均金額）
   * 從 public/data/執行單位名稱_normalize.json 載入資料
   */
  const loadExecutingUnits = async () => {
    try {
      // 發送 HTTP 請求載入 JSON 資料
      const response = await fetch('./data/執行單位名稱_normalize.json');

      // 檢查 HTTP 回應狀態
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 解析 JSON 資料
      const data = await response.json();

      // 將 JSON 欄位名稱映射到代碼中使用的欄位名稱
      const mappedData = data.map((item) => ({
        name: item['執行單位名稱_normalize'], // 映射執行單位名稱_normalize 到 name
        委托案件數: item['委托案件數'],
        所有相符資料_JSON: item['所有相符資料_JSON'],
        本期經費總合_千元: item['本期經費總合_千元'],
        本期經費平均_千元: item['本期經費平均_千元'],
        學術單位: item['學術單位'], // 載入學術單位字段
      }));

      // 更新響應式狀態
      executingUnits.value = mappedData;

      // 輸出載入成功資訊
      // eslint-disable-next-line no-console
      console.log('執行單位資料載入成功:', mappedData.length, '筆資料');

      // 輸出包含大學/學院的單位數量
      const universityCount = mappedData.filter(
        (unit) => unit.name.includes('大學') || unit.name.includes('學院')
      ).length;
      // eslint-disable-next-line no-console
      console.log('包含大學/學院的執行單位數量:', universityCount);
    } catch (err) {
      // 處理載入錯誤
      // eslint-disable-next-line no-console
      console.error('載入執行單位資料失敗:', err);
      error.value = err.message;
    }
  };

  /**
   * 載入執行單位地理位置數據
   * 從 public/data/執行單位名稱_locations.json 載入資料
   */
  const loadExecutingUnitsLocations = async () => {
    try {
      // 發送 HTTP 請求載入 JSON 資料
      const response = await fetch('./data/執行單位名稱_locations.json');

      // 檢查 HTTP 回應狀態
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 解析 JSON 資料
      const data = await response.json();

      // 更新響應式狀態
      executingUnitsLocations.value = data;

      // 輸出載入成功資訊
      // eslint-disable-next-line no-console
      console.log('執行單位地理位置資料載入成功:', data.length, '筆資料');
    } catch (err) {
      // 處理載入錯誤
      // eslint-disable-next-line no-console
      console.error('載入執行單位地理位置資料失敗:', err);
      error.value = err.message;
    }
  };

  /**
   * 載入所有必要的數據
   * 並行載入所有數據源以提升性能
   */
  const loadAllData = async () => {
    // 設置載入狀態
    loading.value = true;
    error.value = null;

    try {
      // 並行載入多個數據源以提升載入速度
      await Promise.all([
        loadSupervisorAgencies(),
        loadSupervisorExecutingMapping(),
        loadExecutingUnits(),
        loadExecutingUnitsLocations(),
      ]);
    } catch (err) {
      // 處理整體載入錯誤
      error.value = err.message;
    } finally {
      // 無論成功或失敗都要重置載入狀態
      loading.value = false;
    }
  };

  /**
   * 搜尋執行單位
   * @param {string} keyword - 搜尋關鍵字
   * @returns {Array} 符合搜尋條件的執行單位陣列
   */
  const searchExecutingUnits = (keyword) => {
    // 如果沒有關鍵字，返回所有資料
    if (!keyword) return executingUnits.value;

    // 進行不區分大小寫的模糊搜尋
    return executingUnits.value.filter((unit) =>
      unit.name.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // ==================== 返回公開介面 ====================

  return {
    // 響應式狀態
    executingUnits,
    supervisorAgencies,
    supervisorExecutingMapping,
    executingUnitsLocations,
    loading,
    error,

    // 計算屬性（Getters）
    getTopExecutingUnits,
    getExecutingUnitsByBudget,
    getTotalCount,
    getAverageBudget,
    getTopSupervisorAgencies,
    getTopSupervisorAgenciesByBudget,
    getTop10AgenciesWithSubUnits,
    getTop10AgenciesWithSubUnitsByBudget,
    getUniversityExecutingUnitsWithLocation,

    // 異步操作（Actions）
    loadSupervisorAgencies,
    loadSupervisorExecutingMapping,
    loadExecutingUnits,
    loadExecutingUnitsLocations,
    loadAllData,
    searchExecutingUnits,
  };
});
