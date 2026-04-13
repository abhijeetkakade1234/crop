export const analyzeImageTransparency = (img) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let hasTransparency = false;
  // Scan alpha channel
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 250) {
      // Slight buffer for near-opaque pixels
      hasTransparency = true;
      break;
    }
  }

  const rgbToHex = (r, g, b) =>
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');

  // Sample corner to find potential background color
  // We sample (0,0) as the primary candidate
  const suggestedBgColor = rgbToHex(data[0], data[1], data[2]);

  return {
    hasTransparency,
    suggestedBgColor,
    isFullyOpaque: !hasTransparency,
  };
};

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const applyChromaKey = (ctx, targetColor, tolerance) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const target = hexToRgb(targetColor);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt(
      Math.pow(r - target.r, 2) +
        Math.pow(g - target.g, 2) +
        Math.pow(b - target.b, 2)
    );

    if (dist <= tolerance) {
      data[i + 3] = 0; // Set Alpha to 0 (Transparent)
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Advanced Edge-Seeded Flood Fill
 * Starts from all perimeter pixels and floods inward, removing pixels
 * that are similar to the edge colors. This preserves internal whites
 * and handles "fake" transparency patterns.
 */
export const applySmartRemoval = (ctx, tolerance) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const visited = new Uint8Array(width * height);
  const toRemove = new Uint8Array(width * height);
  const stack = [];

  const getRGB = (x, y) => {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };

  // Build a palette of colors found on the edges to use as seeds
  const edgeColors = [];
  const sampleStep = 10;
  for (let x = 0; x < width; x += sampleStep) {
    edgeColors.push(getRGB(x, 0));
    edgeColors.push(getRGB(x, height - 1));
  }
  for (let y = 0; y < height; y += sampleStep) {
    edgeColors.push(getRGB(0, y));
    edgeColors.push(getRGB(width - 1, y));
  }

  // Helper to check if a color is "background-like"
  const isBackground = (color) => {
    return edgeColors.some((bc) => {
      const dist = Math.sqrt(
        Math.pow(color[0] - bc[0], 2) +
          Math.pow(color[1] - bc[1], 2) +
          Math.pow(color[2] - bc[2], 2)
      );
      return dist <= tolerance;
    });
  };

  // Seed the stack with all perimeter pixels that look like background
  for (let x = 0; x < width; x++) {
    if (isBackground(getRGB(x, 0))) stack.push([x, 0]);
    if (isBackground(getRGB(x, height - 1))) stack.push([x, height - 1]);
  }
  for (let y = 1; y < height - 1; y++) {
    if (isBackground(getRGB(0, y))) stack.push([0, y]);
    if (isBackground(getRGB(width - 1, y))) stack.push([width - 1, y]);
  }

  while (stack.length > 0) {
    const [x, y] = stack.pop();
    const idx = y * width + x;

    if (visited[idx]) continue;
    visited[idx] = 1;

    const color = getRGB(x, y);
    if (isBackground(color)) {
      toRemove[idx] = 1;

      // Check neighbors
      if (x > 0) stack.push([x - 1, y]);
      if (x < width - 1) stack.push([x + 1, y]);
      if (y > 0) stack.push([x, y - 1]);
      if (y < height - 1) stack.push([x, y + 1]);
    }
  }

  // Apply the mask
  for (let i = 0; i < toRemove.length; i++) {
    if (toRemove[i]) {
      data[i * 4 + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};
