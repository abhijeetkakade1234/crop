import {
  Settings2,
  Eye,
  Download,
  Image as ImageIcon,
  Box,
  RefreshCw,
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import PreviewCard from './PreviewCard';
import styles from './ControlPanel.module.css';
import { applyChromaKey, applySmartRemoval } from '../utils/transparency';

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

    if (name.startsWith('chromaKey.')) {
      const key = name.split('.')[1];
      setGrid((prev) => ({
        ...prev,
        chromaKey: {
          ...prev.chromaKey,
          [key]:
            type === 'checkbox'
              ? checked
              : type === 'number' || type === 'range'
                ? parseInt(value)
                : value,
        },
      }));
      return;
    }

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

          if (grid.chromaKey.enabled) {
            if (grid.chromaKey.smartMode) {
              applySmartRemoval(ctx, grid.chromaKey.tolerance);
            } else {
              applyChromaKey(
                ctx,
                grid.chromaKey.color,
                grid.chromaKey.tolerance
              );
            }
          }

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

      if (grid.chromaKey.enabled) {
        if (grid.chromaKey.smartMode) {
          applySmartRemoval(ctx, grid.chromaKey.tolerance);
        } else {
          applyChromaKey(ctx, grid.chromaKey.color, grid.chromaKey.tolerance);
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
          <span>Layout Settings</span>
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
          <label>Gap between parts (px)</label>
          <div className={styles.rangeRow}>
            <input
              type="range"
              name="padding"
              value={grid.padding}
              onChange={handleInputChange}
              min="0"
              max={Math.floor(Math.min(stats.cellW, stats.cellH) / 2) - 1}
            />
            <span className={styles.rangeValue}>{grid.padding}px</span>
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statLine}>
            <span>Original Box</span>
            <span className={styles.mono}>
              {stats.cellW}x{stats.cellH}
            </span>
          </div>
          <div className={styles.statLine}>
            <span>Final Image Size</span>
            <span className={styles.mono + ' ' + styles.accent}>
              {stats.outputW}x{stats.outputH}
            </span>
          </div>
          <div className={styles.harvestGradient}></div>
          <div className={styles.statLine}>
            <span>Total Images</span>
            <span className={styles.mono}>{stats.total} found</span>
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
          <span>Download Settings</span>
        </div>
        <label className={styles.modernCheckbox}>
          <input
            type="checkbox"
            name="transparentBg"
            checked={grid.transparentBg}
            onChange={handleInputChange}
          />
          <span className={styles.checkmark}></span>
          <span className={styles.checkboxLabel}>Keep transparency</span>
        </label>

        <div className={styles.chromaSection}>
          <label className={styles.modernCheckbox}>
            <input
              type="checkbox"
              name="chromaKey.enabled"
              checked={grid.chromaKey.enabled}
              onChange={handleInputChange}
            />
            <span className={styles.checkmark}></span>
            <span className={styles.checkboxLabel}>
              Remove solid background
            </span>
          </label>

          {grid.chromaKey.enabled && (
            <div className={styles.chromaControls}>
              <label className={styles.modernCheckbox}>
                <input
                  type="checkbox"
                  name="chromaKey.smartMode"
                  checked={grid.chromaKey.smartMode}
                  onChange={handleInputChange}
                />
                <span className={styles.checkmark}></span>
                <span className={styles.checkboxLabel}>Smart Cleanup</span>
                <span className={styles.betaBadge}>AI Fix</span>
              </label>

              {!grid.chromaKey.smartMode && (
                <div className={styles.inputGroup}>
                  <div className={styles.labelRow}>
                    <label>Background color</label>
                    {image.isFullyOpaque &&
                      grid.chromaKey.color === image.suggestedBgColor && (
                        <span className={styles.autoBadge}>Auto-detected</span>
                      )}
                  </div>
                  <div className={styles.colorRow}>
                    <input
                      type="color"
                      name="chromaKey.color"
                      value={grid.chromaKey.color}
                      onChange={handleInputChange}
                    />
                    <span className={styles.mono}>{grid.chromaKey.color}</span>
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label>
                  {grid.chromaKey.smartMode
                    ? 'Cleanup Edge Strength'
                    : 'Color Sensitivity'}
                </label>
                <div className={styles.rangeRow}>
                  <input
                    type="range"
                    name="chromaKey.tolerance"
                    value={grid.chromaKey.tolerance}
                    onChange={handleInputChange}
                    min="1"
                    max={grid.chromaKey.smartMode ? '100' : '200'}
                  />
                  <span className={styles.rangeValue}>
                    {grid.chromaKey.tolerance}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className={styles.actions}>
        <button
          className={styles.carrotBtn}
          onClick={exportZip}
          disabled={isExporting}
        >
          {isExporting ? (
            <RefreshCw className={styles.spacer} size={18} />
          ) : (
            <Download size={18} />
          )}
          <span>Download all as ZIP</span>
        </button>
        <button
          className={styles.sunshineBtn}
          onClick={exportSheet}
          disabled={isExporting}
        >
          <ImageIcon size={18} />
          <span>Save as one clean sheet</span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
