import * as d3 from 'd3';

// 土地利用顏色分類函數
function getColorForZone(zone) {
  const zoneLower = zone.toLowerCase();

  // 住宅區系列 - 橙色系
  if (zoneLower.includes('住') || zoneLower.includes('宅')) {
    if (zoneLower.includes('住1') || zoneLower.includes('第一類')) return 'rgba(255, 178, 102, 0.8)';
    if (zoneLower.includes('住2')) return 'rgba(255, 152, 51, 0.8)';
    if (zoneLower.includes('住3')) return 'rgba(255, 128, 25, 0.8)';
    if (zoneLower.includes('住4')) return 'rgba(230, 108, 15, 0.8)';
    if (zoneLower.includes('住6')) return 'rgba(204, 85, 0, 0.8)';
    if (zoneLower.includes('住商')) return 'rgba(255, 204, 153, 0.8)';
    if (zoneLower.includes('第二類')) return 'rgba(255, 152, 51, 0.8)';
    if (zoneLower.includes('第三類')) return 'rgba(255, 128, 25, 0.8)';
    return 'rgba(255, 178, 102, 0.8)'; // 預設住宅區顏色
  }

  // 商業區系列 - 藍色系
  if (zoneLower.includes('商')) {
    if (zoneLower.includes('商1')) return 'rgba(102, 178, 255, 0.8)';
    if (zoneLower.includes('商2')) return 'rgba(51, 152, 255, 0.8)';
    if (zoneLower.includes('商3')) return 'rgba(25, 128, 255, 0.8)';
    if (zoneLower.includes('商4')) return 'rgba(15, 108, 230, 0.8)';
    if (zoneLower.includes('商特')) return 'rgba(153, 204, 255, 0.8)';
    return 'rgba(102, 178, 255, 0.8)'; // 預設商業區顏色
  }

  // 工業區系列 - 灰色系
  if (zoneLower.includes('工')) {
    if (zoneLower.includes('工2')) return 'rgba(150, 150, 150, 0.8)';
    if (zoneLower.includes('工3')) return 'rgba(120, 120, 120, 0.8)';
    return 'rgba(180, 180, 180, 0.8)'; // 預設工業區顏色
  }

  // 綠地/公園系列 - 綠色系
  if (zoneLower.includes('公園') || zoneLower.includes('綠地') || zoneLower.includes('風景') ||
      zoneLower.includes('保護') || zoneLower.includes('國家公園')) {
    if (zoneLower.includes('公園綠地')) return 'rgba(102, 204, 102, 0.8)';
    if (zoneLower.includes('風景')) return 'rgba(76, 175, 76, 0.8)';
    if (zoneLower.includes('保護')) return 'rgba(51, 153, 51, 0.8)';
    if (zoneLower.includes('國家公園')) return 'rgba(25, 128, 25, 0.8)';
    return 'rgba(102, 204, 102, 0.8)';
  }

  // 交通系列 - 深藍/紫色系
  if (zoneLower.includes('交通') || zoneLower.includes('停車') || zoneLower.includes('鐵路') ||
      zoneLower.includes('機場') || zoneLower.includes('高速公路')) {
    if (zoneLower.includes('停車')) return 'rgba(153, 102, 204, 0.8)';
    if (zoneLower.includes('交通')) return 'rgba(128, 77, 179, 0.8)';
    if (zoneLower.includes('鐵路')) return 'rgba(102, 51, 153, 0.8)';
    if (zoneLower.includes('機場')) return 'rgba(77, 26, 128, 0.8)';
    if (zoneLower.includes('高速公路')) return 'rgba(51, 0, 102, 0.8)';
    return 'rgba(128, 77, 179, 0.8)';
  }

  // 公共設施系列 - 黃色系
  if (zoneLower.includes('學校') || zoneLower.includes('機關') || zoneLower.includes('醫院') ||
      zoneLower.includes('市場') || zoneLower.includes('廣場')) {
    if (zoneLower.includes('學校')) return 'rgba(255, 204, 102, 0.8)';
    if (zoneLower.includes('機關')) return 'rgba(255, 187, 51, 0.8)';
    if (zoneLower.includes('醫院')) return 'rgba(255, 170, 0, 0.8)';
    if (zoneLower.includes('市場')) return 'rgba(230, 153, 0, 0.8)';
    if (zoneLower.includes('廣場')) return 'rgba(204, 136, 0, 0.8)';
    return 'rgba(255, 204, 102, 0.8)';
  }

  // 特殊用地系列 - 紅色系
  if (zoneLower.includes('墓地') || zoneLower.includes('古蹟') || zoneLower.includes('娛樂')) {
    if (zoneLower.includes('墓地')) return 'rgba(179, 77, 77, 0.8)';
    if (zoneLower.includes('古蹟')) return 'rgba(153, 51, 51, 0.8)';
    if (zoneLower.includes('娛樂')) return 'rgba(204, 102, 102, 0.8)';
    return 'rgba(179, 77, 77, 0.8)';
  }

  // 水利/環保系列 - 青色系
  if (zoneLower.includes('行水') || zoneLower.includes('堤防') || zoneLower.includes('污水') ||
      zoneLower.includes('垃圾') || zoneLower.includes('自來水')) {
    return 'rgba(102, 204, 204, 0.8)';
  }

  // 能源系列 - 紫紅色系
  if (zoneLower.includes('加油') || zoneLower.includes('儲油') || zoneLower.includes('變電') || zoneLower.includes('煤氣')) {
    return 'rgba(204, 102, 153, 0.8)';
  }

  // 農業區 - 淺綠色
  if (zoneLower.includes('農業')) {
    return 'rgba(153, 255, 153, 0.8)';
  }

  // 其他/未分類 - 淺灰色
  return 'rgba(200, 200, 200, 0.8)';
}

// 社區照顧關懷據點
export async function loadCommunityCareCenterData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      序號: headers.indexOf('序號'),
      行政區: headers.indexOf('行政區'),
      里別: headers.indexOf('里別'),
      據點名稱: headers.indexOf('據點名稱'),
      據點類型: headers.indexOf('據點類型'),
      據點地址: headers.indexOf('據點地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            行政區: row[headerIndices.行政區],
            里別: row[headerIndices.里別],
            據點名稱: row[headerIndices.據點名稱],
            據點類型: row[headerIndices.據點類型],
            據點地址: row[headerIndices.據點地址],
            聯絡電話: row[headerIndices.聯絡電話],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            據點名稱: row[headerIndices.據點名稱],
            據點地址: row[headerIndices.據點地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.據點名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.據點地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 社區整體照顧服務體系C級單位
export async function loadCLevelUnitData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      編號: headers.indexOf('編號'),
      據點名稱: headers.indexOf('據點名稱'),
      行政區: headers.indexOf('行政區'),
      里別: headers.indexOf('里別'),
      據點地址: headers.indexOf('據點地址'),
      電話: headers.indexOf('電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            編號: row[headerIndices.編號],
            據點名稱: row[headerIndices.據點名稱],
            行政區: row[headerIndices.行政區],
            里別: row[headerIndices.里別],
            據點地址: row[headerIndices.據點地址],
            電話: row[headerIndices.電話],
          };

          const popupData = {
            name: row[headerIndices.據點名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            據點名稱: row[headerIndices.據點名稱],
            據點地址: row[headerIndices.據點地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.據點名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.據點地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 社區照顧關懷據點辦理社區喘息服務(C+單位)
export async function loadRespiteCareCPlusUnitData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      編號: headers.indexOf('編號'),
      據點名稱: headers.indexOf('據點名稱'),
      行政區: headers.indexOf('行政區'),
      里別: headers.indexOf('里別'),
      據點地址: headers.indexOf('據點地址'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            編號: row[headerIndices.編號],
            據點名稱: row[headerIndices.據點名稱],
            行政區: row[headerIndices.行政區],
            里別: row[headerIndices.里別],
            據點地址: row[headerIndices.據點地址],
          };

          const popupData = {
            name: row[headerIndices.據點名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            據點名稱: row[headerIndices.據點名稱],
            據點地址: row[headerIndices.據點地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.據點名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.據點地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 公辦民營老人福利機構
export async function loadPublicElderlyWelfareInstitutionData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split('\t'));

    console.log('rows', rows);

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      機構名稱: headers.indexOf('機構名稱'),
      受託單位: headers.indexOf('受託單位'),
      地址: headers.indexOf('地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      連結網址: headers.indexOf('連結網址'),
      收住床數: headers.indexOf('收住床數'),
      服務對象: headers.indexOf('服務對象'),
      收費標準: headers.indexOf('收費標準'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            機構名稱: row[headerIndices.機構名稱],
            受託單位: row[headerIndices.受託單位],
            地址: row[headerIndices.地址],
            聯絡電話: row[headerIndices.聯絡電話],
            連結網址: row[headerIndices.連結網址],
            收住床數: row[headerIndices.收住床數],
            服務對象: row[headerIndices.服務對象],
            收費標準: row[headerIndices.收費標準],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 老人福利機構
export async function loadElderlyWelfareInstitutionData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      編號: headers.indexOf('編號'),
      屬性: headers.indexOf('屬性'),
      機構名稱: headers.indexOf('機構名稱'),
      區域別: headers.indexOf('區域別'),
      地址: headers.indexOf('地址'),
      電話: headers.indexOf('電話'),
      收容對象: headers.indexOf('收容對象'),
      核定床數_核定總床位數: headers.indexOf('核定床數-核定總床位數'),
      核定床數_長照床數: headers.indexOf('核定床數-長照床數'),
      核定床數_養護床數: headers.indexOf('核定床數-養護床數'),
      核定床數_失智床數: headers.indexOf('核定床數-失智床數'),
      核定床數_安養床數: headers.indexOf('核定床數-安養床數'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            編號: row[headerIndices.編號],
            屬性: row[headerIndices.屬性],
            機構名稱: row[headerIndices.機構名稱],
            區域別: row[headerIndices.區域別],
            地址: row[headerIndices.地址],
            電話: row[headerIndices.電話],
            收容對象: row[headerIndices.收容對象],
            核定床數_核定總床位數: row[headerIndices.核定床數_核定總床位數],
            核定床數_長照床數: row[headerIndices.核定床數_長照床數],
            核定床數_養護床數: row[headerIndices.核定床數_養護床數],
            核定床數_失智床數: row[headerIndices.核定床數_失智床數],
            核定床數_安養床數: row[headerIndices.核定床數_安養床數],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 社區整合型服務中心(A單位)
export async function loadCommunityIntegrationServiceCenterData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      序號: headers.indexOf('序號'),
      單位名稱: headers.indexOf('單位名稱'),
      行政區: headers.indexOf('行政區'),
      服務區域: headers.indexOf('服務區域'),
      服務地址_聯絡電話: headers.indexOf('服務地址/聯絡電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            單位名稱: row[headerIndices.單位名稱],
            行政區: row[headerIndices.行政區],
            服務區域: row[headerIndices.服務區域],
            服務地址_聯絡電話: row[headerIndices.服務地址_聯絡電話],
          };

          const popupData = {
            name: row[headerIndices.單位名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            單位名稱: row[headerIndices.單位名稱],
            服務地址_聯絡電話: row[headerIndices.服務地址_聯絡電話],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.單位名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.服務地址_聯絡電話;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 一般護理之家
export async function loadGeneralNursingHomeData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      開放床數: headers.indexOf('開放床數'),
      地址: headers.indexOf('地址'),
      電話: headers.indexOf('電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            開放床數: row[headerIndices.開放床數],
            地址: row[headerIndices.地址],
            電話: row[headerIndices.電話],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 住宿式長照機構
export async function loadResidentialLongTermCareData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      立案日期: headers.indexOf('立案日期'),
      評鑑資訊: headers.indexOf('評鑑資訊'),
      地址: headers.indexOf('地址'),
      電話: headers.indexOf('電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            開放床數: row[headerIndices.開放床數],
            立案日期: row[headerIndices.立案日期],
            評鑑資訊: row[headerIndices.評鑑資訊],
            地址: row[headerIndices.地址],
            電話: row[headerIndices.電話],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 住宿式喘息(GA05)及住宿式短照(SC05)服務單位
export async function load66Data(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      服務區別: headers.indexOf('服務區別'),
      郵遞區號: headers.indexOf('郵遞區號'),
      機構服務地址: headers.indexOf('機構(服務)地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      聯絡窗口: headers.indexOf('聯絡窗口'),
      住宿式短照服務: headers.indexOf('住宿式短照服務(SC05)'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            服務區別: row[headerIndices.服務區別],
            郵遞區號: row[headerIndices.郵遞區號],
            機構服務地址: row[headerIndices.機構服務地址],
            聯絡電話: row[headerIndices.聯絡電話],
            聯絡窗口: row[headerIndices.聯絡窗口],
            住宿式短照服務: row[headerIndices.住宿式短照服務],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            機構服務地址: row[headerIndices.機構服務地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.機構服務地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 居家式喘息(GA09)及居家式短照(SC09)服務單位
export async function load142Data(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      服務區別: headers.indexOf('服務區別'),
      郵遞區號: headers.indexOf('郵遞區號'),
      機構服務地址: headers.indexOf('機構(服務)地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      聯絡窗口: headers.indexOf('聯絡窗口'),
      住宿式短照服務: headers.indexOf('住宿式短照服務(SC05)'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            服務區別: row[headerIndices.服務區別],
            郵遞區號: row[headerIndices.郵遞區號],
            機構服務地址: row[headerIndices.機構服務地址],
            聯絡電話: row[headerIndices.聯絡電話],
            聯絡窗口: row[headerIndices.聯絡窗口],
            住宿式短照服務: row[headerIndices.住宿式短照服務],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            機構服務地址: row[headerIndices.機構服務地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.機構服務地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 巷弄長照站喘息(C+)(GA07)及巷弄長照站短照(SC07)服務單位
export async function load25Data(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      服務區別: headers.indexOf('服務區別'),
      郵遞區號: headers.indexOf('郵遞區號'),
      機構服務地址: headers.indexOf('機構(服務)地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      聯絡窗口: headers.indexOf('聯絡窗口'),
      巷弄長照站短照服務: headers.indexOf('巷弄長照站短照服務(SC07)'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            服務區別: row[headerIndices.服務區別],
            郵遞區號: row[headerIndices.郵遞區號],
            機構服務地址: row[headerIndices.機構服務地址],
            聯絡電話: row[headerIndices.聯絡電話],
            聯絡窗口: row[headerIndices.聯絡窗口],
            巷弄長照站短照服務: row[headerIndices.巷弄長照站短照服務],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            機構服務地址: row[headerIndices.機構服務地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.機構服務地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 社區式喘息(GA03/GA04/GA06)及社區式短照(SC03/SC04/SC06) 服務單位
export async function load41Data(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      序號: headers.indexOf('序號'),
      機構名稱: headers.indexOf('機構名稱'),
      服務區別: headers.indexOf('服務區別'),
      郵遞區號: headers.indexOf('郵遞區號'),
      機構服務地址: headers.indexOf('機構(服務)地址'),
      聯絡電話: headers.indexOf('聯絡電話'),
      聯絡窗口: headers.indexOf('聯絡窗口'),
      GA03: headers.indexOf('GA03'),
      GA04: headers.indexOf('GA04'),
      GA06: headers.indexOf('GA06'),
      SC03: headers.indexOf('SC03'),
      SC04: headers.indexOf('SC04'),
      SC06: headers.indexOf('SC06'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            序號: row[headerIndices.序號],
            機構名稱: row[headerIndices.機構名稱],
            服務區別: row[headerIndices.服務區別],
            郵遞區號: row[headerIndices.郵遞區號],
            機構服務地址: row[headerIndices.機構服務地址],
            聯絡電話: row[headerIndices.聯絡電話],
            聯絡窗口: row[headerIndices.聯絡窗口],
            GA03: row[headerIndices.GA03],
            GA04: row[headerIndices.GA04],
            GA06: row[headerIndices.GA06],
            SC03: row[headerIndices.SC03],
            SC04: row[headerIndices.SC04],
            SC06: row[headerIndices.SC06],
          };

          const popupData = {
            name: row[headerIndices.機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            機構名稱: row[headerIndices.機構名稱],
            機構服務地址: row[headerIndices.機構服務地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.機構服務地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 醫院/診所
export async function loadHospitalClinicData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      醫療院所: headers.indexOf('醫療院所'),
      縣市: headers.indexOf('縣市'),
      鄉鎮市區: headers.indexOf('鄉鎮市區'),
      地址: headers.indexOf('地址'),
      電話: headers.indexOf('電話'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            醫療院所: row[headerIndices.醫療院所],
            縣市: row[headerIndices.縣市],
            鄉鎮市區: row[headerIndices.鄉鎮市區],
            地址: row[headerIndices.地址],
            電話: row[headerIndices.電話],
          };

          const popupData = {
            name: row[headerIndices.醫療院所],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            醫療院所: row[headerIndices.醫療院所],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.醫療院所],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const district = feature.properties.propertyData.鄉鎮市區;
      if (district) {
        districtCounts[district] = (districtCounts[district] || 0) + 1;
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 健保特約藥局
export async function loadHealthcareFacilityPharmacyData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      醫事機構代碼: headers.indexOf('醫事機構代碼'),
      醫事機構名稱: headers.indexOf('醫事機構名稱'),
      醫事機構種類: headers.indexOf('醫事機構種類'),
      電話: headers.indexOf('電話'),
      地址: headers.indexOf('地址'),
      分區業務組: headers.indexOf('分區業務組'),
      特約類別: headers.indexOf('特約類別'),
      服務項目: headers.indexOf('服務項目'),
      診療科別: headers.indexOf('診療科別'),
      終止合約或歇業日期: headers.indexOf('終止合約或歇業日期'),
      固定看診時段: headers.indexOf('固定看診時段'),
      備註: headers.indexOf('備註'),
      縣市別代碼: headers.indexOf('縣市別代碼'),
      合約起日: headers.indexOf('合約起日'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            醫事機構代碼: row[headerIndices.醫事機構代碼],
            醫事機構名稱: row[headerIndices.醫事機構名稱],
            醫事機構種類: row[headerIndices.醫事機構種類],
            電話: row[headerIndices.電話],
            地址: row[headerIndices.地址],
            分區業務組: row[headerIndices.分區業務組],
            特約類別: row[headerIndices.特約類別],
            服務項目: row[headerIndices.服務項目],
            診療科別: row[headerIndices.診療科別],
            終止合約或歇業日期: row[headerIndices.終止合約或歇業日期],
            固定看診時段: row[headerIndices.固定看診時段],
            備註: row[headerIndices.備註],
            縣市別代碼: row[headerIndices.縣市別代碼],
            合約起日: row[headerIndices.合約起日],
          };

          const popupData = {
            name: row[headerIndices.醫事機構名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            醫事機構名稱: row[headerIndices.醫事機構名稱],
            地址: row[headerIndices.地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.醫事機構名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 三段年齡組性別人口統計
export async function loadPopulation3LevelsGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName; // fieldName 現在代表「人口數」

    const filePath = `/yulin-research/data/geojson/${layer.fileName}`;

    // 省略 console.log(a)

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // ▼▼▼▼▼ 步驟 1: 預先處理數據，計算面積與人口密度 ▼▼▼▼▼
    // 我們先遍歷一次所有 features，把面積和人口密度（作為新的 value）加上去
    geoJsonData.features.forEach(feature => {
      const properties = feature.properties;

      // 計算面積 (km²)
      const earthRadiusKm = 6371;
      const areaInSqKm = d3.geoArea(feature) * Math.pow(earthRadiusKm, 2);
      properties.area = areaInSqKm;

      // 取得人口數
      const population = parseFloat(properties[fieldName]);

      // 計算人口密度 (人/km²)
      // 避免除以 0 或無效數字
      let density = 0;
      if (areaInSqKm > 0 && !isNaN(population) && population > 0) {
        density = population / areaInSqKm;
      }

      // 將 feature 的核心 value 設為人口密度
      properties.value = density;
    });
    // ▲▲▲▲▲ 步驟 1: 結束 ▲▲▲▲▲


    // ▼▼▼▼▼ 步驟 2: 根據「人口密度」計算顏色範圍 ▼▼▼▼▼
    let minValue = 0;
    let maxValue = 0;

    // 從剛剛算好的人口密度 (feature.properties.value) 中取得最大最小值
    const densityValues = geoJsonData.features
      .map((f) => f.properties.value)
      .filter((v) => !isNaN(v) && isFinite(v)); // isFinite 可以過濾掉 Infinity

    if (densityValues.length > 0) {
        minValue = d3.min(densityValues);
        maxValue = d3.max(densityValues);
    }
    // ▲▲▲▲▲ 步驟 2: 結束 ▲▲▲▲▲


    // ----------------------------
    // 建立顏色比例尺 (這部分邏輯不變，但 domain 的依據已變為密度)
    const numColors = 5;
    const colors = d3.range(numColors).map(i => d3.interpolateBlues(i / (numColors - 1)));

    const step = (maxValue - minValue) / numColors;
    const thresholds = d3.range(1, numColors).map((i) => {
      return Math.round(minValue + i * step);
    });

    const colorScale = d3
      .scaleThreshold()
      .domain(thresholds)
      .range(colors);

    // ----------------------------

    // ▼▼▼▼▼ 步驟 3: 賦予顏色並整理最終輸出資料 ▼▼▼▼▼
    geoJsonData.features.forEach((feature, index) => {
      const properties = feature.properties;

      properties.id = index + 1;
      properties.layerId = layerId;
      properties.layerName = layer.layerName;
      properties.name = `${properties.COUNTY}${properties.TOWN}${properties.VILLAGE}`;

      // 注意：properties.value 已經是人口密度了，這裡不需要再計算

      properties.color = 'var(--my-color-white)';
      properties.fillColor = colorScale(properties.value);

      const propertyData = {
        里名: properties.name,
        人口密度: `${properties.value.toFixed(1)} 人/km²`,
        [fieldName]: properties[fieldName], // 原始人口數
        '面積(km²)': properties.area.toFixed(3),
        ...properties, // 包含所有原始屬性
      };

      const popupData = {
        里名: properties.name,
        人口密度: `${properties.value.toFixed(1)} 人/km²`,
      };

      const tableData = {
        '#': properties.id,
        color: colorScale(properties.value),
        里名: properties.name,
        [fieldName]: properties[fieldName], // 顯示原始人口數
        '人口密度 (人/km²)': properties.value.toFixed(1), // 新增密度欄位
      };

      properties.propertyData = propertyData;
      properties.popupData = popupData;
      properties.tableData = tableData;
    });
    // ▲▲▲▲▲ 步驟 3: 結束 ▲▲▲▲▲

    // ----------------------------

    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    // ▼▼▼▼▼ 步驟 4: 更新圖例以反映人口密度 ▼▼▼▼▼
    const legendData = colors.map((color, index) => {
      let label = '';
      let extent = [];
      const format = (d) => Math.round(d).toLocaleString(); // 讓數字加上千分位，更易讀

      if (index === 0) {
        const upperBound = thresholds[0];
        label = `< ${format(upperBound)}`;
        extent = [null, upperBound];
      } else if (index === colors.length - 1) {
        const lowerBound = thresholds[thresholds.length - 1];
        label = `> ${format(lowerBound)}`;
        extent = [lowerBound, null];
      } else {
        const lowerBound = thresholds[index - 1];
        const upperBound = thresholds[index];
        label = `${format(lowerBound)} - ${format(upperBound)}`;
        extent = [lowerBound, upperBound];
      }

      return {
        color: color,
        // 在圖例標籤後方加上單位
        label: `${label} (人/km²)`,
        extent: extent,
      };
    });
    // ▲▲▲▲▲ 步驟 4: 結束 ▲▲▲▲▲

    return {
      geoJsonData,
      tableData,
      summaryData,
      legendData,
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}

// 綜稅綜合所得總額
export async function loadIncomeGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName;

    const filePath = `/yulin-research/data/geojson/${layer.fileName}`;
    const a = fieldName || null;
    console.log(a);

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // ----------------------------

    let minValue = 0;
    let maxValue = 0;

    const values = geoJsonData.features
      .map((f) => parseFloat(f.properties[fieldName]))
      .filter((v) => !isNaN(v));

    minValue = d3.min(values);
    maxValue = d3.max(values);

    // ----------------------------

    // 建立一個使用內建「紅白藍」色帶的發散型比例尺
    // const colorScale = d3
    //   .scaleSequential()
    //   .domain([minValue, maxValue]) // 輸入範圍：[最小值, 最大值]
    //   .interpolator(d3.interpolateYlGnBu); // [關鍵] 直接使用 D3 內建的顏色產生器

    const colorScale = d3
      .scaleSequential()
      .domain([minValue, maxValue]) // 輸入範圍：[最小值, 最大值]
      // [關鍵] 使用 D3 內建的藍色插值函數
      .interpolator(d3.interpolateBlues);

    // ----------------------------

    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = feature.properties.FULL;
      feature.properties.value = parseFloat(feature.properties[fieldName]);
      feature.properties.color = 'var(--my-color-white)';
      feature.properties.fillColor = colorScale(feature.properties.value);

      const propertyData = {
        里名: feature.properties.name,
        ...feature.properties,
      };

      const popupData = {
        里名: feature.properties.name,
      };

      const tableData = {
        '#': feature.properties.id,
        color: colorScale(feature.properties.value),
        里名: feature.properties.name,
        [fieldName]: feature.properties[fieldName],
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
      feature.properties.tableData = tableData;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    // 為 scaleSequential 生成圖例
    const numLegendSteps = 5;
    const legendData = d3.range(numLegendSteps).map((i) => {
      const t = i / (numLegendSteps - 1); // 0 到 1 的比例
      const value = minValue + t * (maxValue - minValue); // 對應的數值
      const color = colorScale(value); // 對應的顏色

      let label = '';
      if (i === 0) {
        label = `${Math.round(minValue)}`;
      } else if (i === numLegendSteps - 1) {
        label = `${Math.round(maxValue)}`;
      } else {
        label = `${Math.round(value)}`;
      }

      return {
        color: color,
        label: label,
        extent: [value, value], // 對於連續比例尺，每個點代表一個值
      };
    });

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
      legendData, // 包含圖例資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}

// 4大超商
export async function loadConvenienceStoreData(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/yulin-research/data/csv/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // 將完整的 CSV 文字內容，首先按換行符號('\n')分割成陣列的每一行
    // 然後對每一行再用逗號(',')分割成欄位，最終形成一個二維陣列
    const rows = csvText.split('\n').map((row) => row.split(','));

    // 取得二維陣列的第一行(rows[0])作為標頭，並對每個標頭使用 trim() 去除前後可能存在的空白字元
    const headers = rows[0].map((h) => h.trim());

    const headerIndices = {
      公司統一編號: headers.indexOf('公司統一編號'),
      公司名稱: headers.indexOf('公司名稱'),
      分公司統一編號: headers.indexOf('分公司統一編號'),
      分公司名稱: headers.indexOf('分公司名稱'),
      分公司地址: headers.indexOf('分公司地址'),
      分公司狀態: headers.indexOf('分公司狀態'),
      分公司核准設立日期: headers.indexOf('分公司核准設立日期'),
      分公司最後核准變更日期: headers.indexOf('分公司最後核准變更日期'),
      lat: headers.indexOf('lat'),
      lon: headers.indexOf('lon'),
    };

    const geoJsonData = {
      type: 'FeatureCollection',
      features: rows
        .slice(1) // 使用 .slice(1) 方法，從索引 1 開始提取所有元素，即跳過第一行(標頭)
        .map((row, index) => {
          const lat = parseFloat(row[headerIndices.lat]);
          const lon = parseFloat(row[headerIndices.lon]);

          const id = index + 1;

          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`第 ${id} 行 ${row[headerIndices.address]} 的座標無效:`, {
              lat: row[headerIndices.lat],
              lon: row[headerIndices.lon],
            });
            return null;
          }

          const propertyData = {
            公司統一編號: row[headerIndices.公司統一編號],
            公司名稱: row[headerIndices.公司名稱],
            分公司統一編號: row[headerIndices.分公司統一編號],
            分公司名稱: row[headerIndices.分公司名稱],
            分公司地址: row[headerIndices.分公司地址],
            分公司狀態: row[headerIndices.分公司狀態],
            分公司核准設立日期: row[headerIndices.分公司核准設立日期],
          };

          const popupData = {
            name: row[headerIndices.分公司名稱],
          };

          const tableData = {
            '#': id,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue(`--my-color-${colorName}`)
              .trim(),
            公司名稱: row[headerIndices.公司名稱],
            分公司名稱: row[headerIndices.分公司名稱],
            分公司地址: row[headerIndices.分公司地址],
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {
              id: id,
              layerId: layerId,
              layerName: layer.layerName,
              name: row[headerIndices.公司名稱],
              fillColor: getComputedStyle(document.documentElement)
                .getPropertyValue(`--my-color-${colorName}`)
                .trim(),
              propertyData: propertyData,
              popupData: popupData,
              tableData: tableData,
            },
          };
        })
        .filter((feature) => feature !== null), // 使用 .filter() 方法過濾掉陣列中所有為 null 的項目 (即那些因座標無效而返回 null 的資料)
    };

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 統計各行政區的數量 - 從地址中提取行政區
    const districtCounts = {};
    geoJsonData.features.forEach(feature => {
      const address = feature.properties.propertyData.分公司地址;
      if (address) {
        // 從地址中提取行政區（假設地址格式為：臺北市XX區...）
        const districtMatch = address.match(/臺北市([^市]*?區)/);
        if (districtMatch) {
          const district = districtMatch[1];
          districtCounts[district] = (districtCounts[district] || 0) + 1;
        }
      }
    });

    // 轉換為陣列格式並排序
    const districtCount = Object.entries(districtCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // 按數量降序排列

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
      districtCount: districtCount,
    };

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
    };
  } catch (error) {
    console.error('❌ 數據載入失敗:', error);
    throw error;
  }
}

// 捷運站點
export async function loadMRTStationGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName;

    const filePath = `/yulin-research/data/geojson/${layer.fileName}`;
    const a = fieldName || null;
    console.log(a);

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // ----------------------------

    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = feature.properties.NAME;
      feature.properties.color = 'var(--my-color-white)';
      feature.properties.fillColor = null;

      const propertyData = {
        站名: feature.properties.name,
        ...feature.properties,
      };

      const popupData = {
        站名: feature.properties.name,
      };

      const tableData = {
        '#': feature.properties.id,
        color: layer.color,
        站名: feature.properties.name,
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
      feature.properties.tableData = tableData;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    const legendData = null;

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
      legendData, // 包含圖例資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}

// 公車站點
export async function loadBusStopGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName;

    const filePath = `/yulin-research/data/geojson/${layer.fileName}`;
    const a = fieldName || null;
    console.log(a);

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // ----------------------------

    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = feature.properties.BSM_CHINES;
      feature.properties.color = 'var(--my-color-white)';
      feature.properties.fillColor = null;

      const propertyData = {
        站名: feature.properties.name,
        ...feature.properties,
      };

      const popupData = {
        站名: feature.properties.name,
      };

      const tableData = {
        '#': feature.properties.id,
        color: layer.color,
        站名: feature.properties.name,
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
      feature.properties.tableData = tableData;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    const legendData = null;

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
      legendData, // 包含圖例資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}

// 土地利用
export async function loadLanduseGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName;

    const filePath = `/yulin-research/data/geojson/${layer.fileName}`;
    const a = fieldName || null;
    console.log(a);

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

        // ----------------------------

    // 取得所有不重複且排序後的 NEWLAYER 值
    const sortedUniqueValues = Array.from(
      new Set(geoJsonData.features.map(f => f.properties.NEWLAYER))
    ).sort((a, b) => Number(a) - Number(b));

    // ----------------------------


    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = feature.properties.ZONE;

      // 根據土地利用類型分配顏色
      const color = getColorForZone(feature.properties.ZONE);
      feature.properties.color = color;
      feature.properties.fillColor = color;

      const propertyData = {
        NEWLAYER: feature.properties.NEWLAYER,
        ...feature.properties,
      };

      const popupData = {
        NEWLAYER: feature.properties.NEWLAYER,
      };

      const tableData = {
        '#': feature.properties.id,
        color: color,
        name: feature.properties.name,
        ZONE: feature.properties.ZONE,
        NEWLAYER: feature.properties.NEWLAYER,
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
      feature.properties.tableData = tableData;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    // 創建 NEWLAYER 到 ZONE 名稱的映射
    const layerToZoneMap = {};
    geoJsonData.features.forEach(feature => {
      const layer = feature.properties.NEWLAYER;
      const zone = feature.properties.ZONE;
      if (!layerToZoneMap[layer]) {
        layerToZoneMap[layer] = zone;
      }
    });

        // 創建圖例數據
    const legendData = sortedUniqueValues.map((value) => {
      const zoneName = layerToZoneMap[value] || value; // 如果找不到對應的 ZONE，就使用 NEWLAYER 值
      const color = getColorForZone(zoneName);

      return {
        color: color,
        label: `${zoneName} (${value})`,
        extent: [value, value], // 對於分類數據，每個值對應一個範圍
      };
    });

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
      legendData, // 包含圖例資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}

// 臺北市區界圖
export async function loadTaipeiDistrictGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const fieldName = layer.fieldName;

    const filePath = `/yulin-research/data/geojson/${layer.fileName}`;
    const a = fieldName || null;
    console.log(a);

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // ----------------------------

    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = feature.properties.PTNAME;
      feature.properties.color = 'var(--my-color-red)';
      feature.properties.fillColor = null;

      const propertyData = {
        區名: feature.properties.name,
        ...feature.properties,
      };

      const popupData = {
        區名: feature.properties.name,
      };

      const tableData = {
        '#': feature.properties.id,
        color: layer.color,
        區名: feature.properties.name,
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
      feature.properties.tableData = tableData;
    });

    // 包含為表格量身打造的數據陣列
    const tableData = geoJsonData.features.map((feature) => ({
      ...feature.properties.tableData,
    }));

    // 包含摘要資訊
    const summaryData = {
      totalCount: geoJsonData.features.length,
    };

    const legendData = null;

    return {
      geoJsonData, // 包含原始且完整的 GeoJSON 數據
      tableData, // 包含為表格量身打造的數據陣列
      summaryData, // 包含摘要資訊
      legendData, // 包含圖例資訊
    };
  } catch (error) {
    console.error('❌ GeoJSON 數據載入或處理失敗:', error);
    throw error;
  }
}
