import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion, useInView, useSpring, useMotionValue,
  useScroll, useTransform,
} from 'framer-motion';
import HeroSequence from './components/HeroSequence';
import ProductShowcase from './components/ProductShowcase';
import TrustSection from './components/TrustSection';
import './components/AboutTags.css';
import './App.css';

/* ─── Emil Kowalski — Precision easing ──────────────────── */
const EASE_OUT_EXPO   = [0.16, 1, 0.3, 1];
const springSnappy    = { type: 'spring', stiffness: 420, damping: 32 };
const springSmooth    = { type: 'spring', stiffness: 90,  damping: 22 };

/* ─── Framer variants ────────────────────────────────────── */
const fadeUp = (delay = 0, distance = 28) => ({
  hidden:  { opacity: 0, y: distance, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay } },
});

const stagger = (s = 0.1, d = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: s, delayChildren: d } },
});

const cardV = {
  hidden:  { opacity: 0, y: 44, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
};

const badgeV = (delay = 0) => ({
  hidden:  { opacity: 0, scale: 0.75, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO, delay } },
});

/* ─── Animated Section wrapper ───────────────────────────── */
function Section({ id, className, children, style, s = 0.12 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-72px 0px' });
  return (
    <motion.section
      id={id} ref={ref} className={className} style={style}
      variants={stagger(s)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.section>
  );
}

/* ─── Floating-label input — Skiper UI ──────────────────── */
function FloatField({ label, type = 'text', as = 'input', rows, required }) {
  const Tag = as;
  return (
    <div className={`field-group${as === 'textarea' ? ' textarea-group' : ''}`}>
      <Tag
        type={type}
        placeholder=" "
        required={required}
        rows={rows}
      />
      <label>{label}</label>
    </div>
  );
}

/* ─── Marquee ticker strip ───────────────────────────────── */
const MARQUEE_ITEMS = [
  'ISO 9001:2015 Certified', 'CE Marked', '60,000 PSI Rated',  'SS316 · Inconel · Duplex',
  'Faridabad & Mathura', 'Precision Machined', 'Zero-Leak Design',
];

function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {doubled.map((text, i) => (
          <span key={i} className="marquee-item">
            <span className="dot" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Animated blueprint visual ─────────────────────────── */
function BlueprintVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [4, -4]), springSmooth);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-4, 4]), springSmooth);

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };
  const onMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={ref}
      className="about-visual"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 800 }}
    >
      <div className="about-visual-grid" />
      <div className="about-visual-scan" />
      {[2,3,4,5,6].map(n => <div key={n} className="about-visual-ring" />)}

      {/* Valve image — scroll-triggered fade+rotate */}
      <motion.img
        src="/valve-blueprint.png"
        alt="Valve Blueprint"
        className="about-visual-img"
        initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
        animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.5 }}
      />

      {/* Glow pulse on top of image */}
      <motion.div
        className="about-visual-glow"
        animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <span className="about-visual-label tl">PRECISION ENGINEERING</span>
      <span className="about-visual-label br">±0.001MM TOLERANCE</span>
    </motion.div>
  );
}

const portfolioTags = [
  'Instrumentation Valves','Valve Manifolds','Tube & Pipe Fittings',
  'High Pressure Fittings','Needle Valves','Ball Valves',
  'Double Block & Bleed','Swivel Adapters','Grease Fittings',
];

const NAV_LINKS = ['HOME','ABOUT','PRODUCTS','OUR TRUST','CONTACT'];

/* ─── Main App ───────────────────────────────────────────── */
const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  /* Cursor glow */
  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);

  const onMouseMove = useCallback((e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseMove]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 900 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* Scroll progress */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      {/* Cursor glow — nextlevelbuilder/Aceternity */}
      <motion.div
        className="cursor-glow"
        style={{ left: cursorX, top: cursorY }}
      />

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: EASE_OUT_EXPO, delay: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
          background: isScrolled ? 'rgba(3,7,18,0.8)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(28px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(28px) saturate(180%)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background 0.5s ease, border-color 0.5s ease',
        }}
      >
        <div className="nav-inner">
          <motion.a
            href="#"
            className="brand-logo-link"
            whileHover={{ scale: 1.03 }}
            transition={springSnappy}
          >
            <img src="/logo.jpg" alt="Krishna International" className="brand-logo" />
            <div className="brand-name">
              <span className="brand-name-primary">KRISHNA</span>
              <span className="brand-name-secondary">INTERNATIONAL</span>
            </div>
          </motion.a>

          {/* Emil Kowalski — staggered nav entrance */}
          <button
            className={`nav-toggle${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          <motion.div
            className={`nav-links${menuOpen ? ' open' : ''}`}
            variants={stagger(0.07, 0.4)}
            initial="hidden"
            animate="visible"
          >
            {NAV_LINKS.map((label) => {
              const href = label === 'HOME' ? '#'
                : label === 'OUR TRUST' ? '#certifications'
                : `#${label.toLowerCase().replace(' ', '')}`;
              return (
                <motion.a
                  key={label}
                  href={href}
                  className="nav-link"
                  variants={fadeUp(0, 12)}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ scale: 0.93, transition: { duration: 0.08 } }}
                  onClick={closeMenu}
                >
                  {label}
                </motion.a>
              );
            })}
          </motion.div>
          <div className={`mobile-nav-backdrop${menuOpen ? ' open' : ''}`} onClick={closeMenu} />
        </div>
      </motion.nav>

      <main>
        <div className="global-volumetric-light" />
        <HeroSequence />

        <MarqueeStrip />

        {/* ── About ── */}
        <Section id="about" s={0.1}>
          <div className="about-split">
            <div className="about-content">
              <motion.p variants={fadeUp(0)} className="eyebrow-label">PRECISION MANUFACTURING</motion.p>
              <motion.h2 variants={fadeUp(0.05)} className="about-heading">
                Designed for<br />Critical<br />Applications.
              </motion.h2>

              {/* Animated stat pills — replaces long paragraphs */}
              <motion.div variants={stagger(0.07, 0.1)} className="about-pills">
                {[
                  { value: '60,000', unit: ' PSI', label: 'Max Working Pressure' },
                  { value: '1/8"–2"', unit: '', label: 'Full Size Range' },
                  { value: '7+', unit: '', label: 'Alloy Grades' },
                  { value: '50+', unit: '', label: 'Countries Served' },
                ].map(({ value, unit, label }) => (
                  <motion.div key={label} variants={fadeUp(0)} className="about-pill glass">
                    <span className="pill-value">{value}<span className="pill-unit">{unit}</span></span>
                    <span className="pill-label">{label}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Short feature list */}
              <motion.div variants={stagger(0.06, 0.05)} className="about-features">
                {[
                  { icon: '✦', text: 'Instrumentation valves, manifolds, tube & pipe fittings' },
                  { icon: '✦', text: 'SS316 · A105 · Monel · Inconel · Duplex · C276 · Hastelloy' },
                  { icon: '✦', text: 'Needle, ball, double block & bleed, monoflange, swivel adapters' },
                  { icon: '✦', text: 'Faridabad (HR) & Mathura (UP) — ISO 9001:2015 · CE Marked' },
                ].map(({ icon, text }) => (
                  <motion.p key={text} variants={fadeUp(0)} className="about-feature-item">
                    <span className="feature-icon">{icon}</span>{text}
                  </motion.p>
                ))}
              </motion.div>

              <motion.div variants={stagger(0.045, 0.1)} className="portfolio-tags">
                {portfolioTags.map((tag, i) => (
                  <motion.span key={tag} variants={badgeV(i * 0.03)} className="portfolio-tag">{tag}</motion.span>
                ))}
              </motion.div>
            </div>

            {/* Animated blueprint visual */}
            <motion.div variants={fadeUp(0.18)}>
              <BlueprintVisual />
            </motion.div>
          </div>
        </Section>

        <div className="section-divider" />

        {/* ── Products ── */}
        <div id="products">
          <Section s={0.09} style={{ paddingBottom: 0 }}>
            <motion.div variants={fadeUp(0)} style={{ textAlign: 'center' }}>
              <p className="eyebrow-label centered">WHAT WE MAKE</p>
              <h2 className="section-title">PRECISION <span>PRODUCTS</span></h2>
            </motion.div>
          </Section>
          <ProductShowcase />
        </div>

        <div className="section-divider" />

        {/* ── Trust ── */}
        <TrustSection />

        {/* ── Contact ── */}
        <Section id="contact" s={0.1}>
          <motion.div variants={fadeUp(0)} style={{ textAlign: 'center' }}>
            <p className="eyebrow-label centered">REACH OUT</p>
            <h2 className="section-title">GET IN <span>TOUCH</span></h2>
          </motion.div>
          <motion.div variants={fadeUp(0.1)} className="contact-grid glass" style={{ padding: 'clamp(2rem,4vw,3.5rem)' }}>
              <div className="contact-card">
              <div className="contact-info">
                <h3>Head Quarter</h3>
                {[
                  { icon: '📍', text: 'Plot No. 36, Mujeri Industrial Area, Gali No. 4, Sector-70, Ballabgarh, Faridabad (HR) - 121004' },
                  { icon: '📧', text: 'krishnainternational2006@gmail.com' },
                  { icon: '📞', text: '+91 82878 86319 / +91 98216 16398' },
                ].map(({ icon, text }) => (
                  <div key={text} className="info-item">
                    <div className="info-icon">{icon}</div>
                    <p style={{ color: 'var(--text-secondary)' }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced contact CTA */}
            <div className="contact-card">
              <div className="contact-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem' }}>
                {/* Decorative line */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: '60px', opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                  style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', margin: '0 auto' }}
                />

                {/* Heading */}
                <motion.div
                  variants={fadeUp(0)}
                  style={{ textAlign: 'center', maxWidth: '400px' }}
                >
                  <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                    Ready to discuss your project?
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Connect with our team via WhatsApp for instant response and quick solutions.
                  </p>
                </motion.div>

                {/* WhatsApp Button with Icon */}
                <motion.a
                  href="https://wa.me/+919643145910"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-submit"
                  style={{ textDecoration: 'none', display: 'inline-flex', gap: '0.75rem' }}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
                >
                  <span style={{ fontSize: '1.2rem' }}>💬</span>
                  <span>SEND INQUIRY</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={springSnappy}
                  >→</motion.span>
                </motion.a>

                {/* Optional response time badge */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}
                >
                  ⚡ Typically responds within 2 hours
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Section>
      </main>

      {/* ── Footer ── */}
      <footer>
        <div className="footer-content">
          <a href="#" className="brand-logo-link">
            <img src="/logo.jpg" alt="Krishna International" className="brand-logo" />
            <div className="brand-name">
              <span className="brand-name-primary">KRISHNA</span>
              <span className="brand-name-secondary">INTERNATIONAL</span>
            </div>
          </a>
          <div className="footer-links">
            {['About','Products','Our Trust','Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ','')}`}>{l}</a>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
            &copy; {new Date().getFullYear()} Krishna International. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default App;
