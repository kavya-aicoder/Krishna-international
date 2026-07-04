import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProductShowcase.css';

gsap.registerPlugin(ScrollTrigger);

const EASE_EXPO = [0.16, 1, 0.3, 1];
const spring    = { type: 'spring', stiffness: 55,  damping: 18 };
const springFast= { type: 'spring', stiffness: 300, damping: 30 };

/* ── Products ────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    image: '/fitting-01.png',
    tag: 'PRODUCT 01',
    name: 'Instrumentation Tube & Pipe Fittings',
    desc: 'Precision-engineered compression fittings for leak-tight connections in critical industrial applications.',
    pills: [
      { label: 'Material',  value: 'SS316 · Monel · Inconel · Duplex' },
      { label: 'Pressure',  value: 'Up to 15,000 PSI' },
      { label: 'Size',      value: '1/8" OD – 2"' },
      { label: 'Use',       value: 'Oil & Gas · Chemical · Power' },
    ],
    chips: ['Leak Tight', 'Corrosion Resistant', 'Precision Machined', 'SS316'],
  },
  {
    id: 2,
    image: '/lubrication-fittings.png',
    tag: 'PRODUCT 02',
    name: 'Grease / Lubrication Fittings',
    desc: 'Precision lubrication fittings engineered for reliable sealing and pressure retention in demanding environments.',
    pills: [
      { label: 'Material',  value: 'A105 · SS316 · SS316L · 17-4PH' },
      { label: 'Pressure',  value: '10,000 – 20,000 PSI' },
      { label: 'Size',      value: '1/4" NPT – 1" NPT' },
      { label: 'Compliance', value: 'NACE MR0175' },
    ],
    chips: ['Positive Flow', 'NACE MR0175', 'High Pressure', 'Vent Cap'],
  },
  {
    id: 3,
    image: '/high-pressure-fittings.png',
    tag: 'PRODUCT 03',
    name: 'High Pressure Fittings',
    desc: 'Engineered for demanding industrial environments requiring leak-tight sealing, extreme pressure resistance, and precision-machined stainless steel construction.',
    pills: [
      { label: 'Construction',     value: 'SS316 Stainless Steel' },
      { label: 'Medium Pressure',  value: '1/4" – 1"' },
      { label: 'High Pressure',    value: '1/4" – 9/16"' },
      { label: 'Maximum Pressure', value: '60,000 PSI' },
      { label: 'Applications',     value: 'Oil & Gas · Hydraulics · Chemical · Instrumentation · Power Plants' },
    ],
    chips: ['High Pressure', '60,000 PSI', 'Leak Tight', 'SS316', 'Industrial Grade', 'Precision Machined'],
  },
  {
    id: 4,
    image: '/valve-manifolds.png',
    tag: 'PRODUCT 04',
    name: 'Instrument Valve Manifolds',
    desc: 'Provide precise isolation, equalization, and venting for pressure instrumentation systems. Engineered from premium SS316 and exotic alloys for reliable sealing in critical applications.',
    pills: [
      { label: 'Construction',     value: '2-Way · 3-Way · 5-Way' },
      { label: 'Mounting',         value: 'Remote · Direct · Coplanar' },
      { label: 'Materials',        value: 'SS316 · A105 · Monel · Inconel · Duplex · C276' },
      { label: 'Maximum Pressure', value: 'Up to 10,000 PSI' },
      { label: 'Applications',     value: 'Pressure Transmitters · Oil & Gas · Chemical · Power · Process · Hydraulic' },
    ],
    chips: ['2 / 3 / 5 Way', 'Remote Mount', 'Direct Mount', 'Coplanar', 'Leak Tight', 'SS316', 'Precision Machined', 'Industrial Grade'],
  },
  {
    id: 5,
    image: '/needle-valve.png',
    tag: 'PRODUCT 05',
    name: 'Needle Valves',
    desc: 'Fine-threaded needle valves engineered for precise flow control in critical instrumentation and process lines.',
    pills: [
      { label: 'Material',        value: 'SS316 · A105 · Monel · Inconel' },
      { label: 'Pressure Rating', value: 'Up to 60,000 PSI' },
      { label: 'Size Range',      value: '1/4" to 2"' },
      { label: 'End Connection',  value: 'NPT · SW · BW · Compression' },
      { label: 'Applications',    value: 'Oil & Gas · Chemical · Power · Instrumentation' },
    ],
    chips: ['Precision Flow', 'High Pressure', 'Leak Tight', 'SS316', 'Fine Thread', 'Industrial Grade'],
  },
  {
    id: 6,
    image: '/ball-valve.png',
    tag: 'PRODUCT 06',
    name: 'Instrumentation Ball Valves',
    desc: 'Engineered for fast shut-off, smooth operation, and leak-tight isolation. Precision-machined SS construction ensures reliable performance under high-pressure conditions.',
    pills: [
      { label: 'Construction',      value: '2 PC · 3 PC' },
      { label: 'Flow Pattern',      value: '2 Way · 3 Way · 4 Way' },
      { label: 'Materials',         value: 'SS316 · A105 · Monel · Inconel · Duplex · C276 · Hastelloy' },
      { label: 'Maximum Pressure',  value: 'Up to 10,000 PSI' },
      { label: 'Valve Operation',   value: 'Quarter Turn · Low Torque · Bubble Tight Shut-Off' },
      { label: 'Applications',      value: 'Oil & Gas · Instrumentation · Chemical · Hydraulic · Power · Process' },
    ],
    chips: ['2 / 3 / 4 Way', 'Quick Shut-Off', 'Quarter Turn', 'Leak Tight', 'SS316', 'Up to 10,000 PSI', 'Corrosion Resistant', 'Industrial Grade'],
  },
  {
    id: 7,
    image: '/double-block-bleed.png',
    tag: 'PRODUCT 07',
    name: 'Double Block & Bleed Valves',
    desc: 'Provide safe isolation and controlled venting in critical process systems. Compact monoflange design minimizes leak points with reliable sealing and high-performance operation.',
    pills: [
      { label: 'Design',              value: 'Compact Monoflange · Fire Safe' },
      { label: 'Construction',        value: '1 PC · 3 PC · Needle / Ball Assembly' },
      { label: 'Materials',           value: 'SS316 · A105 · Monel · Inconel · Duplex · C276 · Hastelloy' },
      { label: 'Connection Standard', value: 'ASME B16.34 · 150# – 2500#' },
      { label: 'Safety Features',     value: 'Anti Blow-Out Stem · Non-Rotating Tip · Leak Tight Isolation' },
      { label: 'Applications',        value: 'Oil & Gas · Refineries · Chemical · Instrumentation · Power · Process' },
    ],
    chips: ['Double Isolation', 'Integrated Bleed', 'Fire Safe', 'Monoflange', 'SS316', 'Up to 10,000 PSI', 'Compact Design', 'Leak Tight'],
  },
  {
    id: 8,
    image: '/swivel-adapters.png',
    tag: 'PRODUCT 08',
    name: 'Swivel Adapters',
    desc: 'Precision-engineered connectors designed to eliminate torsional stress while ensuring secure, leak-tight connections in high-pressure fluid systems.',
    pills: [
      { label: 'Working Pressure',  value: 'Up to 20,000 PSI' },
      { label: 'Connection Size',   value: '1/4" · 1/2" · NPT · BSP' },
      { label: 'Materials',         value: 'SS316 · A105 · Monel · Inconel · Duplex · C276 · Hastelloy' },
      { label: 'Features',          value: '360° Swivel · Precision Threads · Compact Body · Leak Tight' },
      { label: 'Applications',      value: 'Instrumentation · Hydraulic · Oil & Gas · Chemical · Power · Automation' },
    ],
    chips: ['360° Rotation', 'Leak Tight', 'High Pressure', 'SS316', 'NPT & BSP', 'Up to 20,000 PSI', 'Precision Machined', 'Industrial Grade'],
  },
];

/* ── Particles ───────────────────────────────────────────── */
const DOTS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: ((i * 19) % 97),
  y: ((i * 27) % 94),
  s: (i % 3) * 0.8 + 0.8,
  d: (i % 5) * 0.7,
  t: 5 + (i % 4),
}));

/* ── Transition config ───────────────────────────────────── */
const getVariants = (dir) => ({
  enter: {
    x: dir > 0 ? '30%' : '-30%',
    opacity: 0,
    scale: 0.75,
    rotateY: dir > 0 ? 25 : -25,
    filter: 'blur(12px)',
  },
  center: {
    x: 0, opacity: 1, scale: 1, rotateY: 0, filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASE_EXPO },
  },
  exit: (d) => ({
    x: d > 0 ? '-30%' : '30%',
    opacity: 0,
    scale: 0.75,
    rotateY: d > 0 ? -25 : 25,
    filter: 'blur(12px)',
    transition: { duration: 0.55, ease: EASE_EXPO },
  }),
});

/* ── Main ────────────────────────────────────────────────── */
export default function ProductShowcase() {
  const [[idx, dir], setPage] = useState([0, 0]);
  const product = PRODUCTS[idx];
  const total   = PRODUCTS.length;

  const sectionRef = useRef(null);
  const imgRef     = useRef(null);

  /* Mouse tilt */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-1, 1], [-8, 8]), spring);
  const rotX = useSpring(useTransform(my, [-1, 1], [5, -5]), spring);

  const onMouseMove = useCallback((e) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width  - 0.5) * 2);
    my.set(((e.clientY - r.top)  / r.height - 0.5) * 2);
  }, [mx, my]);

  const onMouseLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  /* Navigate */
  const go = useCallback((d) => {
    setPage(([p]) => [(p + d + total) % total, d]);
  }, [total]);

  /* Keyboard */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft')  go(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go]);

  /* Swipe */
  const touchStart = useRef(0);
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
  };

  /* GSAP scroll parallax on section enter */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.ps-bg-glow', { scale: 0.8, opacity: 0.4 }, {
        scale: 1.1, opacity: 0.9, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'center center', scrub: 2 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const variants = getVariants(dir);

  return (
    <>
      <section
        ref={sectionRef}
        className="ps-section desktop-only"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
      {/* ── Background ── */}
      <div className="ps-bg-grid" aria-hidden="true" />
      <div className="ps-bg-glow" aria-hidden="true" />

      {/* Particles */}
      <div className="ps-particles" aria-hidden="true">
        {DOTS.map(({ id, x, y, s, d, t }) => (
          <motion.span key={id} className="ps-particle"
            style={{ left: `${x}%`, top: `${y}%`, width: s, height: s }}
            animate={{ opacity: [0.08, 0.4, 0.08], y: [0, -14, 0] }}
            transition={{ duration: t, delay: d, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Blueprint rings behind image ── */}
      <div className="ps-rings-center" aria-hidden="true">
        {[420, 300, 200, 120].map((sz, i) => (
          <motion.div key={sz} className="ps-ring"
            style={{ width: sz, height: sz }}
            animate={{ opacity: [0.06, 0.18, 0.06], scale: [1, 1.03, 1] }}
            transition={{ duration: 4 + i, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <motion.div className="ps-ring dashed" style={{ width: 520, height: 520 }}
          animate={{ rotate: 360, opacity: 0.06 }}
          transition={{ rotate: { duration: 100, repeat: Infinity, ease: 'linear' }, opacity: { duration: 2 } }}
        />
      </div>

      {/* ── Left Arrow ── */}
      <motion.button className="ps-nav ps-nav-left" onClick={() => go(-1)}
        whileHover={{ scale: 1.12, x: -4 }} whileTap={{ scale: 0.9 }}
        transition={springFast} aria-label="Previous"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M14 5L8 11L14 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      {/* ── Right Arrow ── */}
      <motion.button className="ps-nav ps-nav-right" onClick={() => go(1)}
        whileHover={{ scale: 1.12, x: 4 }} whileTap={{ scale: 0.9 }}
        transition={springFast} aria-label="Next"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M8 5L14 11L8 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      {/* ── HERO IMAGE (full center) ── */}
      <div className="ps-image-zone">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={`img-${idx}`}
            className="ps-img-wrap"
            custom={dir}
            variants={variants}
            initial="enter" animate="center" exit="exit"
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', transformPerspective: 1200 }}
          >
            <motion.img
              ref={imgRef}
              src={product.image}
              alt={product.name}
              className="ps-img"
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Halo */}
            <motion.div className="ps-halo"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Platform shadow */}
            <div className="ps-shadow" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── TEXT ZONE (bottom) ── */}
      <div className="ps-text-zone">
        <AnimatePresence mode="wait">
          <motion.div key={`text-${idx}`} className="ps-text-inner"
            initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
            animate={{ opacity: 1,  y: 0,  filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE_EXPO, delay: 0.2 } }}
            exit={{   opacity: 0,  y: -20, filter: 'blur(4px)', transition: { duration: 0.35, ease: EASE_EXPO } }}
          >
            {/* Tag + counter */}
            <div className="ps-text-meta">
              <span className="ps-tag">{product.tag}</span>
              <span className="ps-counter">{idx + 1} / {total}</span>
            </div>

            {/* Name */}
            <h2 className="ps-name">{product.name}</h2>

            {/* Desc */}
            <p className="ps-desc">{product.desc}</p>

            {/* Spec pills */}
            <motion.div className="ps-pills"
              initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
            >
              {product.pills.map(({ label, value }) => (
                <motion.div key={label} className="ps-pill glass"
                  variants={{ hidden: { opacity: 0, y: 14, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_EXPO } } }}
                  whileHover={{ scale: 1.04, borderColor: 'rgba(37,99,235,0.5)' }}
                  transition={springFast}
                >
                  <span className="ps-pill-label">{label}</span>
                  <span className="ps-pill-value">{value}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Feature chips */}
            <motion.div className="ps-chips"
              initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } } }}
            >
              {product.chips.map((chip) => (
                <motion.span key={chip} className="ps-chip"
                  variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_EXPO } } }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={springFast}
                >
                  {chip}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Dot nav */}
        <div className="ps-dots">
          {PRODUCTS.map((_, i) => (
            <motion.button key={i}
              className={`ps-dot${i === idx ? ' active' : ''}`}
              onClick={() => setPage([i, i > idx ? 1 : -1])}
              whileHover={{ scale: 1.5 }} transition={springFast}
              aria-label={`Product ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>

    <section className="ps-mobile-list mobile-only">
      <div className="mobile-products">
        {PRODUCTS.map((product) => (
          <article key={product.id} className="mobile-product-card glass">
            <div className="mobile-product-img-wrap">
              <img src={product.image} alt={product.name} className="mobile-product-img" />
            </div>
            <div className="mobile-product-body">
              <div className="ps-text-meta">
                <span className="ps-tag">{product.tag}</span>
                <span className="ps-counter">{product.id} / {PRODUCTS.length}</span>
              </div>
              <h3 className="mobile-product-name">{product.name}</h3>
              <p className="mobile-product-desc">{product.desc}</p>
              <div className="ps-pills mobile-pills">
                {product.pills.map(({ label, value }) => (
                  <div key={label} className="ps-pill glass">
                    <span className="ps-pill-label">{label}</span>
                    <span className="ps-pill-value">{value}</span>
                  </div>
                ))}
              </div>
              <div className="ps-chips mobile-chips">
                {product.chips.map((chip) => (
                  <span key={chip} className="ps-chip">{chip}</span>
                ))}
              </div>
              <a href="#contact" className="btn-full">ENQUIRE NOW</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  </>
);
}
