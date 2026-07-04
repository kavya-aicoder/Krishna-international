import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroSequence.css';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const getFrame = (i) => `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;

/* Emil Kowalski — staggered spring entrance */
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.35 } },
};

const heroChild = {
  hidden:  { opacity: 0, y: 36, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 65, damping: 18 } },
};

const HeroSequence = () => {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const textRef      = useRef(null);
  const scrollRef    = useRef(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const ctx     = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const images = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = getFrame(i);
      return img;
    });

    const airpods = { frame: 0 };

    const render = () => {
      const img = images[airpods.frame];
      if (!img?.complete || !img.naturalWidth) return;
      const ir = img.width / img.height;
      const cr = canvas.width / canvas.height;
      let dw, dh;
      if (cr > ir) { dw = canvas.width;         dh = canvas.width / ir; }
      else          { dw = canvas.height * ir;   dh = canvas.height; }
      const dx = (canvas.width  - dw) / 2;
      const dy = (canvas.height - dh) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    images[0].onload = render;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        scrub: 0.6,
        pin: true,
      },
    });

    tl.to(airpods, {
      frame: FRAME_COUNT - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: render,
    });

    tl.to(textRef.current, { opacity: 0, y: -56, duration: 0.18 }, 0);
    tl.to(scrollRef.current, { opacity: 0, y: 24, duration: 0.07 }, 0);

    const onResize = () => { resize(); render(); };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-sequence-container">
      <div className="hero-ambient-light" />

      <div className="hero-canvas-wrapper">
        <canvas ref={canvasRef} className="hero-canvas" />
      </div>

      <div className="hero-floor" />
      <div className="hero-floor-reflection" />
      <div className="hero-overlay" />

      {/* Particle dots layer */}
      <HeroParticles />

      <div className="hero-content" ref={textRef}>
        <motion.div
          className="hero-text-wrapper"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={heroChild} className="subtitle">
            PRECISION. RELIABILITY. PERFORMANCE.
          </motion.p>
          <motion.h1 variants={heroChild} className="title">
            PRECISION HYDRAULICS<br />WITHOUT<br />COMPROMISE.
          </motion.h1>
          <motion.p variants={heroChild} className="description">
            Premium Instrumentation Valves &amp; Tube Fittings<br />
            Manufacturing Excellence in Faridabad, Ballabgarh
          </motion.p>

          {/* Micro-interaction badges — Animista */}
          <motion.div variants={heroChild} className="hero-badges">
            {['ISO 9001:2015', 'CE Marked', '60K PSI'].map((b) => (
              <motion.span
                key={b}
                className="hero-badge"
                whileHover={{ scale: 1.07, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
              >
                {b}
              </motion.span>
            ))}
          </motion.div>

          <motion.div variants={heroChild} className="cta-group">
            <motion.a
              href="#products"
              className="btn-primary"
              whileHover={{ y: -5, boxShadow: '0 20px 50px rgba(37,99,235,0.8)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              EXPLORE PRODUCTS{' '}
              <motion.span whileHover={{ x: 6 }} transition={{ type: 'spring', stiffness: 400 }}>→</motion.span>
            </motion.a>
            <motion.button
              className="btn-secondary"
              whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.5)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              DOWNLOAD CATALOGUE{' '}
              <motion.span whileHover={{ y: 3 }} transition={{ type: 'spring', stiffness: 400 }}>↓</motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <div className="scroll-indicator" ref={scrollRef}>
        <span className="scroll-text">SCROLL TO EXPLORE</span>
        <div className="mouse"><div className="wheel" /></div>
      </div>
    </div>
  );
};

/* Subtle static particle dots — nextlevelbuilder style */
function HeroParticles() {
  const dots = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
    dur: Math.random() * 3 + 3,
  }));

  return (
    <div className="hero-particles" aria-hidden="true">
      {dots.map(({ id, x, y, size, delay, dur }) => (
        <motion.span
          key={id}
          className="hero-particle"
          style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
          animate={{ opacity: [0.15, 0.6, 0.15], scale: [1, 1.4, 1] }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default HeroSequence;
