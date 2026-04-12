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
      <header id="hero" className={styles.hero}>
        <div className={styles.heroBg}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFdW_7CBIgDNUjIuTrKMtBQvyuXX3fMNeUn_iJNps6Y9TrMjeZ67vVfOGCKm_46WPrfumHfR6hvPOVhcZrHgcH-jkcBZrK_MkJaOL-B7gDmEV8FwIjO-f7lrBdyb4pkvqu2i4bjFMe0X5DPxINgvzDid-7EwV5UantcFPnZiXBVJlPgfBPNmPhVb3oMz4-p8roFWHqmLpm2f6vtwWjYPiwvPjQdC9HUsemA5D1FYJ9D-UpxDFr_dVS14itwwQqrRTE3thf93puandL"
            alt="Heritage landscape"
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <Sparkles size={14} />
            sprite sheet slicer
          </span>
          <h1 className={styles.headline}>Crop</h1>
          <p className={styles.subtitle}>
            Upload a sprite sheet. Set your grid. <br /> Download clean
            individual assets.
          </p>

          <div {...getRootProps()} className={styles.uploadTrigger}>
            <input {...getInputProps()} />
            <button className={styles.heroBtn} onClick={open}>
              {isDragActive ? 'Drop to Harvest' : 'Start Cropping'}
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
              Crop bridges the gap between generative imagery and game
              development. We take that sprawling grid of character animations
              and precisely slice them into clean, transparent PNGs ready for
              Unity, Unreal, or Godot.
            </p>
            <div className={styles.featureRow}>
              <div className={styles.featureItem}>
                <PackageCheck size={18} /> Auto-detection
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
              <h3 className={styles.stepName}>Ingest</h3>
              <p className={styles.stepText}>
                Drop your AI-generated sprite sheets or legacy atlas files into
                the canvas.
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>02</span>
              <Grid3X3 className={styles.stepIcon} size={40} />
              <h3 className={styles.stepName}>Define</h3>
              <p className={styles.stepText}>
                Set your grid dimensions or let our vision model auto-detect
                frame boundaries.
              </p>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNumber}>03</span>
              <PackageCheck className={styles.stepIcon} size={40} />
              <h3 className={styles.stepName}>Harvest</h3>
              <p className={styles.stepText}>
                Export a zip of individual PNGs with optimized padding and
                transparency.
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
                Watch your sprites dance as you adjust the grid in real-time. No
                more guessing pixel offsets.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.carrotBorder}`}>
              <h4 className={styles.featureLabel}>Alpha Handling</h4>
              <p className={styles.featureDesc}>
                Smart background removal for sheets that didn&apos;t come with a
                transparent layer.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.kiwiBorder}`}>
              <h4 className={styles.featureLabel}>Naming Schemes</h4>
              <p className={styles.featureDesc}>
                Custom regex naming. {'{sheet_name}'}_{'{row}'}_{'{col}'}.png
                ready for your pipeline.
              </p>
            </div>
            <div className={`${styles.featureCard} ${styles.tomatoBorder}`}>
              <h4 className={styles.featureLabel}>Cloud Storage</h4>
              <p className={styles.featureDesc}>
                Save your slicing templates and access them from any device.
                Secure and encrypted.
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
                Copy this prompt into Midjourney or DALL-E to generate perfectly
                structured agrarian sprite sheets.
              </p>
            </div>
            <div className={styles.codeBlock}>
              <code id="sprite-prompt">
                A full character sprite sheet of a 2D fantasy adventurer, 8
                directions of movement, walking animation, side view, front
                view, back view, pixel art style, high fidelity, 32-bit, soft
                agrarian lighting, forest green and cream palette, organized in
                a clean 4x4 grid, white background --v 6.0
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
              Refining the digital harvest since 2024. Built for the next
              generation of asset pipelines.
            </p>
          </div>
          <div className={styles.footerNav}>
            {/* Nav columns removed as per request */}
          </div>
        </div>
        <div className={styles.copyrightBar}>
          <p>
            © {new Date().getFullYear()} Crop Digital Heirloom. All rights
            reserved.
          </p>
          <a href="#">Built by Abhijeet</a>
        </div>
      </footer>
    </div>
  );
};

export default UploadBox;
