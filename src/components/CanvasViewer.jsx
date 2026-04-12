import { useRef, useEffect, useState } from 'react';
import styles from './CanvasViewer.module.css';

const CanvasViewer = ({ image, grid, zoom, setZoom, stats }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initial Auto-fit
  useEffect(() => {
    if (!image || !containerRef.current || hasInitialized) return;

    const container = containerRef.current;
    const padding = 80;
    const availableW = container.clientWidth - padding;
    const availableH = container.clientHeight - padding;

    const fitZoom = Math.min(
      availableW / image.width,
      availableH / image.height,
      1.0 // Don't upscale beyond 100% by default
    );

    setZoom(Number(fitZoom.toFixed(2)));

    // Center it
    setOffset({
      x: (container.clientWidth - image.width * fitZoom) / 2,
      y: (container.clientHeight - image.height * fitZoom) / 2,
    });

    setHasInitialized(true);
  }, [image, hasInitialized, setZoom]);

  // Canvas Drawing
  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image.url;

    img.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (grid.showGrid) {
        ctx.strokeStyle = '#18542a';
        ctx.lineWidth = 1 / zoom;
        ctx.setLineDash([5 / zoom, 5 / zoom]);

        for (let i = 0; i <= grid.cols; i++) {
          const x = i * stats.cellW;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i <= grid.rows; i++) {
          const y = i * stats.cellH;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255, 201, 38, 0.2)';
        ctx.setLineDash([]);
        for (let r = 0; r < grid.rows; r++) {
          for (let c = 0; c < grid.cols; c++) {
            const x = c * stats.cellW + grid.padding;
            const y = r * stats.cellH + grid.padding;
            ctx.strokeRect(x, y, stats.outputW, stats.outputH);
            ctx.fillRect(x, y, stats.outputW, stats.outputH);
          }
        }
      }
    };
  }, [image, grid, stats, zoom]);

  // Non-passive wheel listener for zoom to prevent whole-page zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.min(10, Math.max(0.1, zoom + delta));

        // Zoom towards mouse coordinate math
        const rect = container.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const ix = (mx - offset.x) / zoom;
        const iy = (my - offset.y) / zoom;

        const nx = mx - ix * newZoom;
        const ny = my - iy * newZoom;

        setZoom(newZoom);
        setOffset({ x: nx, y: ny });
      }
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelEvent);
  }, [zoom, offset, setZoom]);

  // Pan logic
  const onMouseDown = (e) => {
    if (e.button === 0) {
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const onMouseMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const onMouseUp = () => setIsPanning(false);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div
        className={styles.canvasWrapper}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <div className={styles.coordinateInfo}>
        PAN: {Math.round(offset.x)}, {Math.round(offset.y)} | HOLD CTRL + SCROLL
        TO ZOOM
      </div>
    </div>
  );
};

export default CanvasViewer;
