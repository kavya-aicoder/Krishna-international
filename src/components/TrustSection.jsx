import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence, animate } from 'framer-motion';
import './TrustSection.css';

const EASE_EXPO = [0.16, 1, 0.3, 1];
const springSnappy = { type: 'spring', stiffness: 300, damping: 28 };

/* ── Certs data ──────────────────────────────────────────── */
const CERTS = [
  {
    id: 1,
    code: 'ISO 9001:2015',
    title: 'Quality Management System',
    desc: 'Certified to the highest international standard for quality management, ensuring consistent product excellence and customer satisfaction.',
    image: '/cert-iso-9001.png',
    color: 'rgba(37,99,235,0.35)',
  },
  {
    id: 2,
    code: 'ISO 14001:2015',
    title: 'Environmental Management System',
    desc: 'Committed to environmental responsibility through certified systems that minimize impact and promote sustainable manufacturing practices.',
    image: '/cert-iso-14001.png',
    color: 'rgba(16,185,129,0.3)',
  },
  {
    id: 3,
    code: 'ISO 45001:2018',
    title: 'Occupational Health & Safety',
    desc: 'Certified occupational health and safety management ensuring the highest standards of workplace safety across all operations.',
    image: '/cert-iso-45001.png',
    color: 'rgba(245,158,11,0.28)',
  },
];

/* ── Stats ───────────────────────────────────────────────── */
const STATS = [
  { value: '60,000', suffix: ' PSI+', label: 'Maximum Pressure Capability' },
  { value: 'ISO',    suffix: '',      label: 'Certified · International Standards' },
  { value: 'SS316',  suffix: '',      label: 'Premium Materials' },
  { value: '100%',   suffix: '',      label: 'Leak Tight Engineering' },
];

/* ── Count-up ────────────────────────────────────────────── */
function CountUp({ value, suffix, duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px 0px' });
  const isNumeric = /^\d+/.test(value);

  useEffect(() => {
    if (!inView || !isNumeric) return;
    const num = parseInt(value.replace(/\D/g, ''));
    const ctrl = animate(0, num, {
      duration,
      ease: EASE_EXPO,
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
      },
    });
    return () => ctrl.stop();
  }, [inView, isNumeric, value, suffix, duration]);

  return (
    <span ref={ref} className="trust-stat-val">
      {isNumeric ? `0${suffix}` : value + suffix}
    </span>
  );
}

/* ── Particles ───────────────────────────────────────────── */
const DOTS = Array.from({ length: 18 }, (_, i) => ({
  id: i, x: (i * 23) % 96, y: (i * 31) % 93,
  s: (i % 3) + 0.8, d: (i % 5) * 0.8, t: 5 + (i % 4),
}));

/* ── Modal ───────────────────────────────────────────────── */
function CertModal({ cert, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="cert-modal-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="cert-modal-card glass"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE_EXPO } }}
          exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.3 } }}
          onClick={(e) => e.stopPropagation()}
          style={{ '--cert-color': cert.color }}
        >
          <button className="cert-modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="cert-modal-img-wrap">
            {cert.image
              ? <img src={cert.image} alt={cert.code} className="cert-modal-img" />
              : <div className="cert-modal-placeholder">
                  <span className="cert-placeholder-icon">🏆</span>
                  <span className="cert-placeholder-code">{cert.code}</span>
                </div>
            }
            <div className="cert-modal-glow" />
          </div>

          <div className="cert-modal-info">
            <span className="cert-modal-code">{cert.code}</span>
            <h3 className="cert-modal-title">{cert.title}</h3>
            <p className="cert-modal-desc">{cert.desc}</p>
            <div className="cert-modal-footer">
              <span className="cert-modal-badge">✓ Internationally Certified</span>
              <span className="cert-modal-badge">✓ Krishna International</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Cert Card ───────────────────────────────────────────── */
function CertCard({ cert, index, onClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });

  return (
    <motion.div
      ref={ref}
      className="cert-card glass"
      style={{ '--cert-color': cert.color }}
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: EASE_EXPO, delay: index * 0.15 }}
      whileHover={{ y: -10, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(cert)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(cert)}
      aria-label={`View ${cert.code} certificate`}
    >
      <div className="cert-card-glow" />
      <div className="cert-card-top-bar" />

      <div className="cert-card-img-area">
        {cert.image
          ? <img src={cert.image} alt={cert.code} className="cert-card-img" />
          : <div className="cert-card-placeholder">
              <span className="cert-placeholder-icon">🏆</span>
            </div>
        }
        <div className="cert-card-img-glow" />
      </div>

      <div className="cert-card-body">
        <span className="cert-card-code">{cert.code}</span>
        <h4 className="cert-card-title">{cert.title}</h4>
        <span className="cert-card-cta">View Certificate →</span>
      </div>
    </motion.div>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export default function TrustSection() {
  const [activeCert, setActiveCert] = useState(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px 0px' });

  const closeModal = useCallback(() => setActiveCert(null), []);

  return (
    <>
      <section ref={sectionRef} id="certifications" className="trust-section">
        {/* BG */}
        <div className="trust-bg-grid" aria-hidden="true" />
        <div className="trust-bg-glow" aria-hidden="true" />
        <div className="trust-scan-line" aria-hidden="true" />

        {/* Particles */}
        <div className="trust-particles" aria-hidden="true">
          {DOTS.map(({ id, x, y, s, d, t }) => (
            <motion.span key={id} className="trust-particle"
              style={{ left: `${x}%`, top: `${y}%`, width: s, height: s }}
              animate={{ opacity: [0.07, 0.35, 0.07], y: [0, -12, 0] }}
              transition={{ duration: t, delay: d, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Blueprint rings */}
        <div className="trust-rings" aria-hidden="true">
          {[320, 220, 130].map((sz, i) => (
            <motion.div key={sz} className="trust-ring"
              style={{ width: sz, height: sz }}
              animate={{ opacity: [0.05, 0.14, 0.05], scale: [1, 1.04, 1] }}
              transition={{ duration: 5 + i * 1.5, delay: i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="trust-inner">

          {/* ── LEFT ── */}
          <div className="trust-left">
            <motion.p
              className="trust-eyebrow"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
            >
              VERIFIED EXCELLENCE
            </motion.p>

            <motion.h2
              className="trust-headline"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.08 }}
            >
              Certified Engineering<br />
              <span className="trust-headline-accent">Excellence.</span>
            </motion.h2>

            <motion.p
              className="trust-desc"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.15 }}
            >
              Krishna International operates under internationally recognized management systems to ensure consistent quality, environmental responsibility and workplace safety across every stage of manufacturing.
            </motion.p>

            {/* Divider */}
            <motion.div
              className="trust-divider"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.2 }}
              style={{ originX: 0 }}
            />

            {/* Stats grid */}
            <motion.div
              className="trust-stats"
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            >
              {STATS.map(({ value, suffix, label }) => (
                <motion.div
                  key={label}
                  className="trust-stat glass"
                  variants={{ hidden: { opacity: 0, y: 20, scale: 0.92 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE_EXPO } } }}
                  whileHover={{ scale: 1.04, borderColor: 'rgba(37,99,235,0.4)' }}
                  transition={springSnappy}
                >
                  <CountUp value={value} suffix={suffix} />
                  <span className="trust-stat-label">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <div className="trust-right">
            {CERTS.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} onClick={setActiveCert} />
            ))}
          </div>

        </div>
      </section>

      {/* Modal */}
      {activeCert && <CertModal cert={activeCert} onClose={closeModal} />}
    </>
  );
}
