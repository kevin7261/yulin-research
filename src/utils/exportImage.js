// Export an SVG inside a container as PNG, with optional high-resolution scaling
// optionsOrScale: number | { scale?: number; background?: string }
// - scale: rasterization scale factor (default 2)
// - background: canvas background color (default '#ffffff')
export async function exportContainerSvgAsPng(containerId, filename = 'chart.png', optionsOrScale = undefined) {
  // Normalize options
  const defaultScale = 2; // Increase resolution by default without changing call sites
  const defaultBackground = '#ffffff';
  const isNumber = typeof optionsOrScale === 'number';
  const opts = isNumber
    ? { scale: optionsOrScale, background: defaultBackground }
    : { scale: (optionsOrScale && optionsOrScale.scale) || defaultScale, background: (optionsOrScale && optionsOrScale.background) || defaultBackground };

  const container = document.getElementById(containerId);
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  // Clone first
  const clonedSvg = svg.cloneNode(true);

  // Copy computed styles from the original (attached) SVG to the clone.
  // This ensures CSS variables and external styles are fully resolved to absolute values.
  const styleProps = [
    'fill',
    'stroke',
    'stroke-width',
    'stroke-dasharray',
    'stroke-linecap',
    'stroke-linejoin',
    'opacity',
    'fill-opacity',
    'stroke-opacity',
    'font-family',
    'font-size',
    'font-weight',
    'text-anchor',
    'dominant-baseline',
    'shape-rendering',
    'letter-spacing',
  ];

  const originalNodes = [svg, ...svg.querySelectorAll('*')];
  const cloneNodes = [clonedSvg, ...clonedSvg.querySelectorAll('*')];
  const count = Math.min(originalNodes.length, cloneNodes.length);

  for (let i = 0; i < count; i++) {
    const src = originalNodes[i];
    const dst = cloneNodes[i];
    const computed = window.getComputedStyle(src);
    styleProps.forEach((prop) => {
      const val = computed.getPropertyValue(prop);
      if (val && val !== 'initial') dst.setAttribute(prop, val);
    });
  }

  // Ensure proper namespaces
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  // Ensure width/height attributes are absolute numbers
  const rect = svg.getBoundingClientRect();
  const width = Math.ceil(rect.width || parseFloat(svg.getAttribute('width')) || 800);
  const height = Math.ceil(rect.height || parseFloat(svg.getAttribute('height')) || 600);
  clonedSvg.setAttribute('width', String(width));
  clonedSvg.setAttribute('height', String(height));

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  const scale = Math.max(1, Number.isFinite(opts.scale) ? Number(opts.scale) : defaultScale);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = 'high';

  // Apply scale and paint background
  ctx.scale(scale, scale);
  ctx.fillStyle = opts.background || defaultBackground;
  ctx.fillRect(0, 0, width, height);

  // Draw the rasterized SVG
  ctx.drawImage(img, 0, 0, width, height);

  URL.revokeObjectURL(url);

  const a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
