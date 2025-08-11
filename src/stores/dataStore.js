/**
 * 雲林縣研究案統計平台 - 數據管理 Store
 *
 * 使用 Pinia 管理應用程式的數據狀態，提供統一的數據存取和處理介面
 *
 * 主要功能：
 * 1. 管理執行單位數據（執行單位名稱_normalize.json）
 * 2. 管理主管機關數據（計畫主管機關_normalize.json）
 * 3. 管理主管機關與執行單位的映射關係（計畫主管機關_執行單位名稱_normalize.json）
 * 4. 提供數據查詢、統計和排序功能
 * 5. 處理異步數據載入和錯誤處理
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDataStore = defineStore('data', () => {
  // ==================== 響應式狀態定義 ====================

  /**
   * 執行單位數據陣列
   * 結構：[{ name: string, count: number, mean_budget: number }, ...]
   */
  const executingUnits = ref([]);

  /**
   * 主管機關數據陣列
   * 結構：[{ name: string, count: number, mean_budget: number }, ...]
   */
  const supervisorAgencies = ref([]);

  /**
   * 主管機關-執行單位映射數據陣列
   * 結構：[{ name: string, name_sub: string, count: number, mean_budget: number }, ...]
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

  // ==================== 計算屬性（Getters）====================

  /**
   * 獲取前10名執行單位（按案件數排序）
   * @returns {ComputedRef<Array>} 排序後的前10名執行單位陣列
   */
  const getTopExecutingUnits = computed(() => {
    return executingUnits.value
      .slice() // 創建副本避免修改原始資料
      .sort((a, b) => b.count - a.count) // 按案件數降序排列
      .slice(0, 10); // 取前10名
  });

  /**
   * 獲取前10名執行單位（按平均預算排序）
   * @returns {ComputedRef<Array>} 按預算排序的前10名執行單位陣列
   */
  const getExecutingUnitsByBudget = computed(() => {
    return executingUnits.value
      .slice() // 創建副本避免修改原始資料
      .sort((a, b) => b.mean_budget - a.mean_budget) // 按平均預算降序排列
      .slice(0, 10); // 取前10名
  });

  /**
   * 計算所有執行單位的總案件數
   * @returns {ComputedRef<number>} 總案件數
   */
  const getTotalCount = computed(() => {
    return executingUnits.value.reduce((sum, unit) => sum + unit.count, 0);
  });

  /**
   * 計算所有執行單位的平均預算
   * @returns {ComputedRef<number>} 平均預算，若無資料則返回 0
   */
  const getAverageBudget = computed(() => {
    if (executingUnits.value.length === 0) return 0;
    const totalBudget = executingUnits.value.reduce((sum, unit) => sum + unit.mean_budget, 0);
    return totalBudget / executingUnits.value.length;
  });

  /**
   * 獲取前12名主管機關（按案件數排序）
   * @returns {ComputedRef<Array>} 排序後的前12名主管機關陣列
   */
  const getTopSupervisorAgencies = computed(() => {
    return supervisorAgencies.value
      .slice() // 創建副本避免修改原始資料
      .sort((a, b) => b.count - a.count) // 按案件數降序排列
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
      .sort((a, b) => b.count - a.count) // 按案件數降序排列
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
   * 獲取包含"大學"或"學院"的執行單位，並結合地理位置和預算數據
   * @returns {ComputedRef<Array>} 包含地理位置的大學/學院執行單位陣列
   */
  const getUniversityExecutingUnitsWithLocation = computed(() => {
    // 過濾出包含"大學"或"學院"的執行單位
    const universityUnits = executingUnits.value.filter(
      (unit) => unit.name.includes('大學') || unit.name.includes('學院')
    );

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

      // 更新響應式狀態
      supervisorAgencies.value = data;

      // 輸出載入成功資訊
      // eslint-disable-next-line no-console
      console.log('主管機關資料載入成功:', data.length, '筆資料');
      // eslint-disable-next-line no-console
      console.log('前5名主管機關:', data.slice(0, 5));
    } catch (err) {
      // 處理載入錯誤
      // eslint-disable-next-line no-console
      console.error('載入主管機關資料失敗:', err);
      error.value = err.message;
    }
  };

  /**
   * 載入主管機關-執行單位映射數據
   * 從 public/data/計畫主管機關_執行單位名稱_normalize.json 載入資料
   */
  const loadSupervisorExecutingMapping = async () => {
    try {
      // 發送 HTTP 請求載入 JSON 資料
      const response = await fetch('./data/計畫主管機關_執行單位名稱_normalize.json');

      // 檢查 HTTP 回應狀態
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 解析 JSON 資料
      const data = await response.json();

      // 更新響應式狀態
      supervisorExecutingMapping.value = data;

      // 輸出載入成功資訊
      // eslint-disable-next-line no-console
      console.log('主管機關-執行單位映射資料載入成功:', data.length, '筆資料');
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

      // 更新響應式狀態
      executingUnits.value = data;

      // 輸出載入成功資訊
      // eslint-disable-next-line no-console
      console.log('執行單位資料載入成功:', data.length, '筆資料');

      // 輸出包含大學/學院的單位數量
      const universityCount = data.filter(
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
    getTop10AgenciesWithSubUnits,
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
