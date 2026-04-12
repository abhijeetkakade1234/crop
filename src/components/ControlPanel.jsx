import {
  Settings2,
  Eye,
  Download,
  Image as ImageIcon,
  Box,
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import PreviewCard from './PreviewCard';
import styles from './ControlPanel.module.css';

const ControlPanel = ({
  grid,
  setGrid,
  stats,
  image,
  isExporting,
  setIsExporting,
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGrid((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value) || 0,
    }));
  };

  const exportZip = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const zip = new JSZip();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image.url;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      canvas.width = stats.outputW;
      canvas.height = stats.outputH;

      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // sx, sy, sw, sh, dx, dy, dw, dh
          ctx.drawImage(
            img,
            c * stats.cellW + grid.padding,
            r * stats.cellH + grid.padding,
            stats.outputW,
            stats.outputH,
            0,
            0,
            stats.outputW,
            stats.outputH
          );

          const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, 'image/png')
          );
          zip.file(`${image.name}_${r}_${c}.png`, blob);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${image.name}_sprites.zip`);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const exportSheet = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image.url;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      canvas.width = stats.outputW * grid.cols;
      canvas.height = stats.outputH * grid.rows;

      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          ctx.drawImage(
            img,
            c * stats.cellW + grid.padding,
            r * stats.cellH + grid.padding,
            stats.outputW,
            stats.outputH,
            c * stats.outputW,
            r * stats.outputH,
            stats.outputW,
            stats.outputH
          );
        }
      }

      canvas.toBlob((blob) => {
        saveAs(blob, `${image.name}_repacked.png`);
      });
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Settings2 size={16} />
          <span>Grid Settings</span>
        </div>

        <div className={styles.gridInputs}>
          <div className={styles.inputGroup}>
            <label>Rows</label>
            <input
              type="number"
              name="rows"
              value={grid.rows}
              onChange={handleInputChange}
              min="1"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Columns</label>
            <input
              type="number"
              name="cols"
              value={grid.cols}
              onChange={handleInputChange}
              min="1"
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Padding (px per side)</label>
          <input
            type="range"
            name="padding"
            value={grid.padding}
            onChange={handleInputChange}
            min="0"
            max={Math.floor(Math.min(stats.cellW, stats.cellH) / 2) - 1}
          />
          <div className={styles.rangeValue}>{grid.padding}px</div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Cell Size</span>
            <span className={styles.statValue}>
              {stats.cellW}x{stats.cellH}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Output Size</span>
            <span className={styles.statValue}>
              {stats.outputW}x{stats.outputH}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Sprites</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Eye size={16} />
          <span>Preview</span>
        </div>
        <PreviewCard image={image} grid={grid} stats={stats} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Box size={16} />
          <span>Options</span>
        </div>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="transparentBg"
            checked={grid.transparentBg}
            onChange={handleInputChange}
          />
          <span>Handle Transparency</span>
        </label>
      </section>

      <div className={styles.actions}>
        <button
          className={styles.exportBtn}
          onClick={exportZip}
          disabled={isExporting}
        >
          {isExporting ? (
            <RefreshCw className={styles.spin} size={18} />
          ) : (
            <Download size={18} />
          )}
          <span>Download ZIP</span>
        </button>
        <button
          className={styles.secondaryBtn}
          onClick={exportSheet}
          disabled={isExporting}
        >
          <ImageIcon size={18} />
          <span>Export Sprite Sheet</span>
        </button>
      </div>
    </div>
  );
};

// Simple spinner animation for exporting
const RefreshCw = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ animation: 'spin 1s linear infinite' }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    <path d="M21 3v9h-9" />
  </svg>
);

export default ControlPanel;
