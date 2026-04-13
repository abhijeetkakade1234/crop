import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  ArrowRight,
  Grid3X3,
  PackageCheck,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';
import styles from './UploadBox.module.css';

const UploadBox = ({ onUpload }) => {
  const [copied, setCopied] = useState(false);
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    multiple: false,
    noClick: true, // Prevent the wrapper from clicking so we can control buttons manually
    noKeyboard: true,
  });

  return (
    <div className={styles.landingRoot}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <a className={styles.logo} href="#">
            Crop
          </a>
          <div className={styles.navLinks}>
            {/* Nav links removed as per request */}
          </div>
          <button className={styles.navBtn} onClick={open}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        id="hero"
        {...getRootProps()}
        className={`${styles.hero} ${isDragActive ? styles.dragActive : ''}`}
      >
        <div className={styles.heroBg}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFdW_7CBIgDNUjIuTrKMtBQvyuXX3fMNeUn_iJNps6Y9TrMjeZ67vVfOGCKm_46WPrfumHfR6hvPOVhcZrHgcH-jkcBZrK_MkJaOL-B7gDmEV8FwIjO-f7lrBdyb4pkvqu2i4bjFMe0X5DPxINgvzDid-7EwV5UantcFPnZiXBVJlPgfBPNmPhVb3oMz4-p8roFWHqmLpm2f6vtwWjYPiwvPjQdC9HUsemA5D1FYJ9D-UpxDFr_dVS14itwwQqrRTE3thf93puandL"
            alt="Heritage landscape"
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          {isDragActive && (
            <div className={styles.dragOverlay}>
              <div className={styles.dragContent}>
                <Upload size={64} className={styles.dragIcon} />
                <p>Drop your image here to start</p>
              </div>
            </div>
          )}
          <span className={styles.badge}>
            <Sparkles size={14} />
            split big images into parts
          </span>
          <h1 className={styles.headline}>Crop</h1>
          <p className={styles.subtitle}>
            Upload an image. Set your grid. <br /> Download clean individual
            parts.
          </p>

          <div className={styles.uploadTrigger}>
            <input {...getInputProps()} />
            <button className={styles.heroBtn} onClick={open}>
              {isDragActive ? 'Drop to Start' : 'Start Splitting'}
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div className={styles.harvestDivider}></div>

      {/* Section 2: What is Crop */}
      <section className={styles.infoSection}>
        <div className={styles.dotPattern}></div>
        <div className={styles.sectionGrid}>
          <div className={styles.textContent}>
            <h2 className={styles.sectionTitle}>
              AI gives you sheets.{' '}
              <span className={styles.goldText}>Not assets.</span>
            </h2>
            <p className={styles.sectionDesc}>
              Crop helps you turn one big image into many smaller ones. We take
              your grid of drawings and precisely cut them into clean,
              transparent images ready for any project.
            </p>
            <div className={styles.featureRow}>
              <div className={styles.featureItem}>
                <PackageCheck size={18} /> Automatic Settings
              </div>
              <div className={styles.featureItem}>
                <PackageCheck size={18} /> Batch export
              </div>
            </div>
          </div>
          <div className={styles.previewFrame}>
            <div className={styles.videoPlaceholder}>
              <img src="/hero_spritesheet.png" alt="Tech Preview" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How it Works */}
      <section className={styles.stepsSection}>
        <div className={styles.container}>
          <h2 className={styles.stepsTitle}>
            Three <span className={styles.carrotText}>steps.</span>
          </h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>01</span>
              <Upload className={styles.stepIcon} size={40} />
              <h3 className={styles.stepName}>Upload</h3>
              <p className={styles.stepText}>
                Drop your big images or character sheets into the area.
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>02</span>
              <Grid3X3 className={styles.stepIcon} size={40} />
              <h3 className={styles.stepName}>Adjust</h3>
              <p className={styles.stepText}>
                Choose how many parts you want or let us automatically find the
                borders.
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>03</span>
              <PackageCheck className={styles.stepIcon} size={40} />
              <h3 className={styles.stepName}>Save</h3>
              <p className={styles.stepText}>
                Download a folder of all your small images with transparent
                backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Features */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.featuresTitle}>
            Built for <span className={styles.kiwiText}>speed.</span>
          </h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${styles.sunshineBorder}`}>
              <h4 className={styles.featureLabel}>Live Preview</h4>
              <p className={styles.featureDesc}>
                Watch your images update as you change the grid. No more
                guessing pixel sizes.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.carrotBorder}`}>
              <h4 className={styles.featureLabel}>Make Transparent</h4>
              <p className={styles.featureDesc}>
                Easily remove solid backgrounds to get clean, transparent images
                for your project.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.kiwiBorder}`}>
              <h4 className={styles.featureLabel}>Naming Schemes</h4>
              <p className={styles.featureDesc}>
                Automatically name your files. Name_Row_Column.png ready for
                your folders.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.tomatoBorder}`}>
              <h4 className={styles.featureLabel}>Privacy First</h4>
              <p className={styles.featureDesc}>
                Everything happens on your computer. Your images are never
                uploaded to a server. Safe and private.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Section 5: The Prompt */}
      <section className={styles.promptSection}>
        <div className={styles.container}>
          <div className={styles.promptCard}>
            <div className={styles.promptHeader}>
              <h2 className={styles.promptTitle}>
                The Seed <span className={styles.kiwiText}>Prompt.</span>
              </h2>
              <p className={styles.promptSubtitle}>
                Copy this professional prompt into Midjourney or DALL-E to get
                perfectly aligned images that are easy to split.
              </p>
            </div>
            <div className={styles.codeBlock}>
              <code id="sprite-prompt">
                Create a pixel art image sheet for a main player character in a
                top-down 2D RPG game (Pokémon GBA style). <br />
                <br />
                Character: Young village boy, adventurer outfit, messy brown
                hair. <br />
                Style: 16-bit pixel art, sharp edges, soft colors. <br />
                Perspective: Top-down RPG view. <br />
                Layout: 4 rows × 3 columns grid (Down, Left, Right, Up). <br />
                Requirement: One PNG with a plain white or transparent
                background.
              </code>
              <button
                className={styles.copyBtn}
                onClick={() => {
                  navigator.clipboard.writeText(
                    document.getElementById('sprite-prompt').innerText
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <a className={styles.footerLogo} href="#">
              Crop
            </a>
            <p className={styles.footerTagline}>
              The easy way to split and save your images. Built for everyone.
              <br />
              Found a bug? Mail me at:{' '}
              <a href="mailto:abhijeetskakade04@gmail.com">
                abhijeetskakade04@gmail.com
              </a>
            </p>
          </div>
          <div className={styles.footerNav}>
            {/* Nav columns removed as per request */}
          </div>
        </div>
        <div className={styles.copyrightBar}>
          <p>
            © {new Date().getFullYear()} Crop Sprite Slicer. All rights
            reserved.
          </p>
          <a href="https://experimentwith.abhijeetkakade.in">
            Built by Abhijeet
          </a>
        </div>
      </footer>
    </div>
  );
};

export default UploadBox;
