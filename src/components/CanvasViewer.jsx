import { useRef, useEffect, useState } from 'react';
import styles from './CanvasViewer.module.css';

const CanvasViewer = ({ image, grid, zoom, setZoom, stats }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoverCell, setHoverCell] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    const img = new Image();
    img.src = image.url;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      // Draw Grid
      if (grid.showGrid) {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();

        // Vertical lines
        for (let i = 0; i <= grid.cols; i++) {
          const x = i * stats.cellW;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, image.height);
        }

        // Horizontal lines
        for (let i = 0; i <= grid.rows; i++) {
          const y = i * stats.cellH;
          ctx.moveTo(0, y);
          ctx.lineTo(image.width, y);
        }
        ctx.stroke();

        // Draw padding indicators if padding > 0
        if (grid.padding > 0) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          for (let r = 0; r < grid.rows; r++) {
            for (let c = 0; c < grid.cols; c++) {
              ctx.strokeRect(
                c * stats.cellW + grid.padding,
                r * stats.cellH + grid.padding,
                stats.outputW,
                stats.outputH
              );
            }
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Highlight Hover Cell
        if (hoverCell) {
          ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
          ctx.fillRect(
            hoverCell.c * stats.cellW,
            hoverCell.r * stats.cellH,
            stats.cellW,
            stats.cellH
          );
        }
      }
    };
  }, [image, grid, stats, hoverCell]);

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      // Left click for pan
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    // Hover detection for grid highlighting
    if (grid.showGrid) {
      const rect = canvasRef.current.getBoundingClientRect();
      const xInCanvas = (e.clientX - rect.left) / zoom;
      const yInCanvas = (e.clientY - rect.top) / zoom;

      const col = Math.floor(xInCanvas / stats.cellW);
      const row = Math.floor(yInCanvas / stats.cellH);

      if (col >= 0 && col < grid.cols && row >= 0 && row < grid.rows) {
        setHoverCell({ r: row, c: col });
      } else {
        setHoverCell(null);
      }
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.min(5, Math.max(0.1, prev + delta)));
    }
  };

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <div
        className={styles.transformWrapper}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <div className={styles.controls}>
        <span>Drag to pan · Ctrl + Wheel to zoom</span>
      </div>
    </div>
  );
};

export default CanvasViewer;
