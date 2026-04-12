import { useState, useMemo } from 'react';
import { LayoutGrid, ArrowLeft, RefreshCw } from 'lucide-react';
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
          <button className={styles.backBtn} onClick={onReset}>
            <ArrowLeft size={18} />
          </button>
          <div className={styles.divider} />
          <div>
            <h2 className={styles.filename}>{image.name}</h2>
            <p className={styles.filesize}>
              {image.width} × {image.height} px
            </p>
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.toolbar}>
            <button
              className={`${styles.toolBtn} ${grid.showGrid ? styles.active : ''}`}
              onClick={() =>
                setGrid((prev) => ({ ...prev, showGrid: !prev.showGrid }))
              }
              title="Toggle Grid Lines"
            >
              <LayoutGrid size={18} />
            </button>
            <div className={styles.vDivider} />
            <button
              className={styles.toolBtn}
              onClick={() => setZoom((prev) => Math.max(0.1, prev - 0.1))}
              title="Zoom Out"
            >
              -
            </button>
            <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
            <button
              className={styles.toolBtn}
              onClick={() => setZoom((prev) => Math.min(5, prev + 0.1))}
              title="Zoom In"
            >
              +
            </button>
            <button
              className={styles.toolBtn}
              onClick={() => setZoom(1)}
              title="Reset Zoom"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.badge}>Ready to Harvest</div>
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
