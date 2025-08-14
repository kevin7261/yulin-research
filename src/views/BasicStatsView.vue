<script>
  import { onMounted, onUnmounted } from 'vue';
  import * as d3 from 'd3';
  import { exportContainerSvgAsPng } from '@/utils/exportImage';

  export default {
    name: 'BasicStatsView',
    setup() {
      const drawYearLineChart = async () => {
        const container = d3.select('#year-line');
        container.selectAll('*').remove();
        const width = container.node().getBoundingClientRect().width;
        const height = 320;

        const svg = container.append('svg').attr('width', width).attr('height', height);

        // 顏色盤僅用於文字雲，折線圖有固定顏色

        const margin = { top: 16, right: 16, bottom: 32, left: 48 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        const data = await d3.json('/yulin-research/data/計畫年度.json');
        const parsed = data
          .map((d) => ({
            year: +d['計畫年度'],
            全部: +(d['委托案件數_全部'] ?? 0),
            學術: +(d['委托案件數_學術單位執行'] ?? 0),
            非學術: +(d['委托案件數_非學術單位執行'] ?? 0),
            雲林: +(d['委托案件數_雲林縣政府主管'] ?? 0),
          }))
          .sort((a, b) => a.year - b.year);

        const years = parsed.map((d) => d.year);
        const x = d3.scaleLinear().domain(d3.extent(years)).range([0, innerWidth]);

        // 與 bar 圖一致的 Y 軸刻度計算（最多 5 條，包含 0）
        const maxValue =
          d3.max(parsed, (d) => Math.max(d.全部 || 0, d.學術 || 0, d.雲林 || 0)) || 1;
        const getRoundedMax = (val) => {
          let interval = 5;
          if (val > 1000) {
            interval = Math.ceil(val / 5000) * 250;
            if (interval < 500) interval = 500;
          } else if (val > 100) {
            interval = Math.ceil(val / 500) * 25;
            if (interval < 50) interval = 50;
          } else if (val > 50) {
            interval = 10;
          } else if (val > 25) {
            interval = 5;
          }
          if (interval % 5 !== 0) {
            interval = Math.ceil(interval / 5) * 5;
          }
          const roundedMax = Math.ceil(val / interval) * interval;
          if (roundedMax / interval < 2) return interval * 2;
          return roundedMax;
        };
        const roundedMaxValue = getRoundedMax(maxValue);

        const calculateYTicks = (roundedMax) => {
          const ticks = [0];
          let interval = 5;
          while (roundedMax / interval > 4) {
            interval += 5;
          }
          for (let i = interval; i <= roundedMax; i += interval) {
            ticks.push(i);
            if (ticks.length >= 5) break;
          }
          return ticks;
        };
        const yTicks = calculateYTicks(roundedMaxValue);

        const y = d3.scaleLinear().domain([0, roundedMaxValue]).range([innerHeight, 0]);

        const yAxis = d3
          .axisLeft(y)
          .tickValues(yTicks)
          .tickSize(0)
          .tickFormat((d) => d3.format(',')(d));

        // X軸：每一年顯示一個刻度
        const xAxis = d3
          .axisBottom(x)
          .tickValues(years)
          .tickFormat((d) => d);

        const xAxisG = g.append('g').attr('transform', `translate(0,${innerHeight})`).call(xAxis);
        xAxisG.select('.domain').remove();
        xAxisG.selectAll('text').style('font-size', '10px');

        // Y軸
        g.append('g').call(yAxis).select('.domain').remove();

        // 灰色虛線水平網格，與 bar 圖一致
        g.selectAll('.grid-line')
          .data(yTicks)
          .enter()
          .append('line')
          .attr('class', 'grid-line')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('y1', (d) => y(d))
          .attr('y2', (d) => y(d))
          .attr('stroke', '#bdbdbd')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3')
          .attr('opacity', (d) => (d === 0 ? 0.8 : 0.4));

        // 準備 tooltip（先清掉既有的）
        d3.selectAll('.line-tooltip').remove();
        const tooltip = d3
          .select('body')
          .append('div')
          .attr('class', 'line-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px 12px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('opacity', 0);

        const makeLine = (key) =>
          d3
            .line()
            .x((d) => x(d.year))
            .y((d) => y(d[key] || 0));

        // 三條折線：全部(藍)、學術(綠)、雲林縣政府主管(橘)
        g.append('path')
          .datum(parsed)
          .attr('fill', 'none')
          .attr('stroke', 'var(--my-color-blue)')
          .attr('stroke-width', 2)
          .attr('d', makeLine('全部'));

        g.append('path')
          .datum(parsed)
          .attr('fill', 'none')
          .attr('stroke', 'var(--my-color-green)')
          .attr('stroke-width', 2)
          .attr('d', makeLine('學術'));

        g.append('path')
          .datum(parsed)
          .attr('fill', 'none')
          .attr('stroke', 'var(--my-color-orange)')
          .attr('stroke-width', 2)
          .attr('d', makeLine('雲林'));

        // 點
        const drawPoints = (key, color, label) => {
          g.selectAll(`circle.point-${key}`)
            .data(parsed)
            .enter()
            .append('circle')
            .attr('class', `point-${key}`)
            .attr('cx', (d) => x(d.year))
            .attr('cy', (d) => y(d[key] || 0))
            .attr('r', 2.5)
            .attr('fill', color)
            .style('cursor', 'default')
            .on('mouseover', function (event, d) {
              tooltip
                .style('opacity', 1)
                .html(
                  `<div><strong>${label}</strong></div><div>年度：${d.year}</div><div>數量：${
                    d[key]?.toLocaleString?.() || d[key]
                  }</div>`
                );
            })
            .on('mousemove', function (event) {
              tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 10 + 'px');
            })
            .on('mouseout', function () {
              tooltip.style('opacity', 0);
            });
        };
        drawPoints('全部', 'var(--my-color-blue)', '委托案件數_全部');
        drawPoints('學術', 'var(--my-color-green)', '委托案件數_學術單位執行');
        drawPoints('雲林', 'var(--my-color-orange)', '委托案件數_雲林縣政府主管');

        // 圖例（於容器下方的 legend 區塊）
        const legend = d3
          .select('#year-line-legend')
          .html('')
          .append('div')
          .attr('class', 'd-flex justify-content-center gap-4');
        const legendItems = [
          { label: '全部', color: 'var(--my-color-blue)' },
          { label: '學術單位執行', color: 'var(--my-color-green)' },
          { label: '雲林縣政府主管', color: 'var(--my-color-orange)' },
        ];
        const item = legend
          .selectAll('div.legend-item')
          .data(legendItems)
          .enter()
          .append('div')
          .attr('class', 'd-flex align-items-center legend-item');
        item
          .append('span')
          .style('display', 'inline-block')
          .style('width', '12px')
          .style('height', '12px')
          .style('border-radius', '2px')
          .style('margin-right', '6px')
          .style('background', (d) => d.color);
        item
          .append('span')
          .style('font-size', '12px')
          .text((d) => d.label);
      };

      const drawWordCloud = async (config) => {
        const container = d3.select(`#${config.containerId}`);
        container.selectAll('*').remove();
        const width = container.node().getBoundingClientRect().width;
        const height = 360;
        const svg = container.append('svg').attr('width', width).attr('height', height);

        const data = await d3.json(config.url);
        const items = data
          .map((d) => ({ text: d[config.textKey], value: +d[config.valueKey] }))
          .filter((d) => d.text && d.value > 0);

        // 縮放與排序
        const sizeScale = d3
          .scalePow()
          .exponent(1.1)
          .domain([0, d3.max(items, (d) => d.value)])
          .range([12, 42]);
        const words = items
          .map((d) => ({
            text: d.text,
            size: Math.max(10, Math.round(sizeScale(d.value))),
            value: d.value,
          }))
          .sort((a, b) => b.size - a.size);

        // 以現有專案採用的防重疊策略（螺旋+BBox）
        const placed = [];
        const rects = [];
        const measure = (text, fontSize) => {
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
          return { w: bbox.width, h: bbox.height };
        };

        const centerX = width / 2;
        const centerY = height / 2;
        const pad = 1;
        const intersect = (a, b) => !(a.r < b.l || a.l > b.r || a.b < b.t || a.t > b.b);

        words.forEach((w) => {
          let placedOk = false;
          for (let fs = w.size; fs >= 10 && !placedOk; fs -= 2) {
            const { w: tw, h: th } = measure(w.text, fs);
            for (let t = 0; t < 3000 && !placedOk; t++) {
              const ang = 0.35 * t;
              const rad = 2 + 2 * ang;
              let x = centerX + rad * Math.cos(ang);
              let y = centerY + rad * Math.sin(ang);
              let rect = {
                l: x - tw / 2 - pad,
                r: x + tw / 2 + pad,
                t: y - th / 2 - pad,
                b: y + th / 2 + pad,
              };
              if (rect.l < 0 || rect.r > width || rect.t < 0 || rect.b > height) continue;
              if (rects.some((r) => intersect(rect, r))) continue;

              // 中心擠壓
              for (let s = 0; s < 140; s++) {
                const vx = centerX - x;
                const vy = centerY - y;
                const len = Math.hypot(vx, vy) || 1;
                const nx = x + (vx / len) * 1;
                const ny = y + (vy / len) * 1;
                const nrect = {
                  l: nx - tw / 2 - pad,
                  r: nx + tw / 2 + pad,
                  t: ny - th / 2 - pad,
                  b: ny + th / 2 + pad,
                };
                const oob = nrect.l < 0 || nrect.r > width || nrect.t < 0 || nrect.b > height;
                if (oob || rects.some((r) => intersect(nrect, r))) break;
                x = nx;
                y = ny;
                rect = nrect;
              }

              // 使用 CSS 變數色盤（本地定義），避免未定義錯誤
              const palette = [
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
              placed.push({
                text: w.text,
                size: fs,
                x,
                y,
                color: palette[Math.floor(Math.random() * palette.length)],
              });
              rects.push(rect);
              placedOk = true;
            }
          }
        });

        // 全域微擠壓：多輪向中心微移，盡量減少空白
        const passes = Math.min(60, Math.max(20, Math.floor(6000 / (placed.length || 1))));
        for (let p = 0; p < passes; p++) {
          for (let i = 0; i < placed.length; i++) {
            const w = placed[i];
            const { w: tw, h: th } = measure(w.text, w.size);
            const vx = centerX - w.x;
            const vy = centerY - w.y;
            const len = Math.hypot(vx, vy) || 1;
            const nx = w.x + (vx / len) * 1;
            const ny = w.y + (vy / len) * 1;
            const nrect = {
              l: nx - tw / 2 - pad,
              r: nx + tw / 2 + pad,
              t: ny - th / 2 - pad,
              b: ny + th / 2 + pad,
            };
            const out = nrect.l < 0 || nrect.r > width || nrect.t < 0 || nrect.b > height;
            if (out) continue;
            let collide = false;
            for (let j = 0; j < rects.length; j++) {
              if (j === i) continue;
              if (intersect(nrect, rects[j])) {
                collide = true;
                break;
              }
            }
            if (!collide) {
              placed[i].x = nx;
              placed[i].y = ny;
              rects[i] = nrect;
            }
          }
        }

        svg
          .selectAll('text')
          .data(placed)
          .enter()
          .append('text')
          .attr('x', (d) => d.x)
          .attr('y', (d) => d.y)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-size', (d) => `${d.size}px`)
          .style('font-family', 'Arial, Microsoft JhengHei, sans-serif')
          .style('font-weight', 'bold')
          .style('fill', (d) => d.color)
          .text((d) => d.text);
      };

      var BasicStatsView_onResize = null;
      onMounted(() => {
        const redrawAll = () => {
          drawYearLineChart();
          drawWordCloud({
            containerId: 'field-cloud',
            url: '/yulin-research/data/研究領域.json',
            textKey: '研究領域',
            valueKey: '數量',
          });
          drawWordCloud({
            containerId: 'keyword-cloud',
            url: '/yulin-research/data/中文關鍵詞.json',
            textKey: '中文關鍵詞',
            valueKey: '數量',
          });
        };

        redrawAll();

        let resizeTimer = null;
        const onResize = () => {
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            redrawAll();
          }, 200);
        };
        window.addEventListener('resize', onResize);

        // 保存於閉包，供 onUnmounted 移除
        BasicStatsView_onResize = onResize;
      });

      onUnmounted(() => {
        d3.selectAll('.word-cloud-tooltip').remove();
        if (BasicStatsView_onResize) window.removeEventListener('resize', BasicStatsView_onResize);
      });

      return { exportContainerSvgAsPng };
    },
  };
</script>

<template>
  <div class="basic-stats-container">
    <div class="w-100 px-3">
      <div class="my-bgcolor-white rounded-4 border p-3 mb-4 position-relative">
        <button
          class="btn btn-sm btn-outline-secondary position-absolute"
          style="top: 8px; left: 8px; z-index: 2"
          title="下載 PNG"
          @click="exportContainerSvgAsPng('year-line', '年度趨勢.png')"
        >
          <i class="fa-solid fa-download"></i>
        </button>
        <div class="d-flex justify-content-center my-title-md-black mb-3">
          年度趨勢（委托案件數）
        </div>
        <div id="year-line" style="height: 320px; width: 100%"></div>
        <div id="year-line-legend" class="mt-2"></div>
      </div>

      <div class="row">
        <div class="col-6">
          <div class="my-bgcolor-white rounded-4 border p-3 mb-4 position-relative">
            <button
              class="btn btn-sm btn-outline-secondary position-absolute"
              style="top: 8px; left: 8px; z-index: 2"
              title="下載 PNG"
              @click="exportContainerSvgAsPng('field-cloud', '研究領域_文字雲.png')"
            >
              <i class="fa-solid fa-download"></i>
            </button>
            <div class="d-flex justify-content-center my-title-md-black mb-3">研究領域 文字雲</div>
            <div id="field-cloud" style="height: 360px; width: 100%"></div>
          </div>
        </div>
        <div class="col-6">
          <div class="my-bgcolor-white rounded-4 border p-3 mb-4 position-relative">
            <button
              class="btn btn-sm btn-outline-secondary position-absolute"
              style="top: 8px; left: 8px; z-index: 2"
              title="下載 PNG"
              @click="exportContainerSvgAsPng('keyword-cloud', '中文關鍵詞_文字雲.png')"
            >
              <i class="fa-solid fa-download"></i>
            </button>
            <div class="d-flex justify-content-center my-title-md-black mb-3">
              中文關鍵詞 文字雲
            </div>
            <div id="keyword-cloud" style="height: 360px; width: 100%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .basic-stats-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
