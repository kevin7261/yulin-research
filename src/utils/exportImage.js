// Export an SVG inside a container as PNG
export async function exportContainerSvgAsPng(containerId, filename = 'chart.png') {
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
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;

  // White background to match site background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  URL.revokeObjectURL(url);

  const a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
