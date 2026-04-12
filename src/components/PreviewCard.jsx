import { useRef, useEffect } from 'react';
import styles from './PreviewCard.module.css';

const PreviewCard = ({ image, grid, stats }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    canvas.width = stats.outputW;
    canvas.height = stats.outputH;

    const img = new Image();
    img.src = image.url;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the first cell as preview
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
  }, [image, grid.padding, stats.outputW, stats.outputH]);

  return (
    <div className={styles.card}>
      <div className={styles.previewBox}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <div className={styles.info}>
        <span className={styles.label}>Single Sprite Preview</span>
        <span className={styles.size}>
          {stats.outputW} × {stats.outputH} px
        </span>
      </div>
    </div>
  );
};

export default PreviewCard;
