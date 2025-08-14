// Export an SVG inside a container as PNG
export async function exportContainerSvgAsPng(containerId, filename = 'chart.png') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  // Clone and inline computed styles to avoid CSS var issues
  const clonedSvg = svg.cloneNode(true);

  const inlineStyles = (node) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, null, false);
    const elements = [node];
    while (walker.nextNode()) elements.push(walker.currentNode);

    elements.forEach((el) => {
      const computed = window.getComputedStyle(el);
      const styleProps = ['fill', 'stroke', 'font-family', 'font-size', 'font-weight', 'opacity'];
      styleProps.forEach((prop) => {
        const val = computed.getPropertyValue(prop);
        if (val) el.setAttribute(prop, val);
      });
    });
  };

  inlineStyles(clonedSvg);

  // Ensure proper namespaces
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  const rect = svg.getBoundingClientRect();
  const width = Math.ceil(rect.width || parseFloat(svg.getAttribute('width')) || 800);
  const height = Math.ceil(rect.height || parseFloat(svg.getAttribute('height')) || 600);

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  // White background
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
