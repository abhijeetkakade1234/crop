import { useRef, useEffect } from 'react';
import styles from './PreviewCard.module.css';
import { applyChromaKey, applySmartRemoval } from '../utils/transparency';

const PreviewCard = ({ image, grid, stats }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!image || !canvasRef.current || !stats.outputW || !stats.outputH)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image.url;

    img.onload = () => {
      canvas.width = stats.outputW;
      canvas.height = stats.outputH;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        img,
        grid.padding,
        grid.padding,
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
          applyChromaKey(ctx, grid.chromaKey.color, grid.chromaKey.tolerance);
        }
      }
    };
  }, [image, grid, stats]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.indicator} />
        <span>One small part</span>
      </div>
      <div className={styles.previewContainer}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <div className={styles.footer}>
        <span className={styles.tag}>Real-time</span>
        <span className={styles.tag}>Transparent</span>
      </div>
    </div>
  );
};

export default PreviewCard;
