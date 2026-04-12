import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UploadBox from './components/UploadBox';
import Editor from './components/Editor';

function App() {
  const [image, setImage] = useState(null); // { url, width, height, name }

  const handleUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage({
          url: e.target.result,
          width: img.width,
          height: img.height,
          name: file.name.replace(/\.[^/.]+$/, ''),
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleReset = () => setImage(null);

  return (
    <div
      className="app-container"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UploadBox onUpload={handleUpload} />
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ display: 'flex', flex: 1 }}
          >
            <Editor image={image} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
