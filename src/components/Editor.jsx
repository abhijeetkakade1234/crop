import { useState, useMemo } from 'react';
import { LayoutGrid, ArrowLeft, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import CanvasViewer from './CanvasViewer';
import ControlPanel from './ControlPanel';
import styles from './Editor.module.css';

const Editor = ({ image, onReset }) => {
  const [grid, setGrid] = useState({
    rows: 4,
    cols: 4,
    padding: 0,
    showGrid: true,
    transparentBg: true,
    chromaKey: {
      enabled: image.isFullyOpaque, // Auto-enable if the image has no transparency
      smartMode: false,
      color: image.suggestedBgColor || '#ffffff',
      tolerance: 15,
    },
  });

  const [zoom, setZoom] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const stats = useMemo(() => {
    const cellW = Math.floor(image.width / grid.cols);
    const cellH = Math.floor(image.height / grid.rows);
    const outputW = cellW - grid.padding * 2;
    const outputH = cellH - grid.padding * 2;
    return { cellW, cellH, outputW, outputH, total: grid.rows * grid.cols };
  }, [image, grid.rows, grid.cols, grid.padding]);

  return (
    <div className={styles.editorRoot}>
      <header className={styles.header}>
        <div className={styles.left}>
          <button className={styles.backBtn} onClick={onReset} title="Go Back">
            <ArrowLeft size={20} />
          </button>
          <div className={styles.divider} />
          <div className={styles.fileInfo}>
            <h2 className={styles.filename}>{image.name}</h2>
            <span className={styles.filesize}>
              {image.width} × {image.height} pixels
            </span>
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.toolbar}>
            <button
              className={`${styles.toolBtn} ${grid.showGrid ? styles.active : ''}`}
              onClick={() =>
                setGrid((prev) => ({ ...prev, showGrid: !prev.showGrid }))
              }
              title="Show/Hide Grid"
            >
              <LayoutGrid size={18} />
            </button>
            <div className={styles.vDivider} />
            <div className={styles.zoomControls}>
              <button
                className={styles.toolBtn}
                onClick={() => setZoom((prev) => Math.max(0.1, prev - 0.1))}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className={styles.zoomLabel}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                className={styles.toolBtn}
                onClick={() => setZoom((prev) => Math.min(5, prev + 0.1))}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                className={styles.toolBtn}
                onClick={() => setZoom(1)}
                title="Reset Zoom"
              >
                <Maximize size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.pulseBadge}>
            <div className={styles.pulseDot}></div>
            Ready to save
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.canvasArea}>
          <CanvasViewer
            image={image}
            grid={grid}
            zoom={zoom}
            setZoom={setZoom}
            stats={stats}
          />
        </div>

        <aside className={styles.sidebar}>
          <ControlPanel
            grid={grid}
            setGrid={setGrid}
            stats={stats}
            image={image}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
          />
        </aside>
      </main>
    </div>
  );
};

export default Editor;
