import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import styles from './UploadBox.module.css';

const UploadBox = ({ onUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    multiple: false,
  });

  return (
    <div className={styles.container}>
      {/* Basic Hero/Landing Theme */}
      <div className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={14} className={styles.sparkle} />
          <span>Professional Sprite Tools</span>
        </div>
        <h1 className={styles.title}>
          Slice your <span className={styles.highlight}>Sprite Sheets</span>{' '}
          instantly.
        </h1>
        <p className={styles.subtitle}>
          The fastest, browser-based grid cropping tool for game developers. No
          installation, no backend, pure performance.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
      >
        <input {...getInputProps()} />
        <div className={styles.iconWrapper}>
          <Upload size={32} className={styles.icon} />
        </div>
        <h3>{isDragActive ? 'Drop it here!' : 'Click or Drag Sprite Sheet'}</h3>
        <p>Supports PNG (Transparency preserved)</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.feature}>
          <ImageIcon size={18} />
          <span>Grid-based Slicing</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.feature}>
          <Sparkles size={18} />
          <span>Instant ZIP Export</span>
        </div>
      </div>
    </div>
  );
};

export default UploadBox;
