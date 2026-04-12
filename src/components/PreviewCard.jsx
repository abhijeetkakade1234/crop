import { useRef, useEffect } from 'react';
import styles from './PreviewCard.module.css';

const PreviewCard = ({ image, grid, stats }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image.url;

    img.onload = () => {
      canvas.width = stats.outputW;
      canvas.height = stats.outputH;

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw first sprite (0,0) as preview
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
    };
  }, [image, grid, stats]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.indicator} />
        <span>Output Preview (0,0)</span>
      </div>
      <div className={styles.previewContainer}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <div className={styles.footer}>
        <span className={styles.tag}>Live Render</span>
        <span className={styles.tag}>Alpha Active</span>
      </div>
    </div>
  );
};

export default PreviewCard;
