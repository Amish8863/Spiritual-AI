import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

interface Constellation {
  id: string;
  name: string;
  stars: { x: number; y: number; size: number }[];
  lines: [number, number][];
  triggerProgress: number;
  mythology: {
    origin: string;
    meaning: string;
    keyStars: string[];
  };
}

const constellations: Constellation[] = [
  {
    id: 'orion', name: 'Orion',
    stars: [
      { x: 15, y: 8, size: 3 }, { x: 18, y: 12, size: 2.5 }, { x: 12, y: 14, size: 2 },
      { x: 15, y: 18, size: 4 }, { x: 17, y: 18, size: 3.5 }, { x: 19, y: 18, size: 3 },
      { x: 14, y: 24, size: 2.5 }, { x: 20, y: 25, size: 2.5 },
    ],
    lines: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [1, 4], [3, 6], [5, 7]],
    triggerProgress: 0.05,
    mythology: { origin: 'Greek mythology tells of Orion, a giant huntsman placed among the stars by Zeus.', meaning: 'Represents strength, pursuit, and the eternal hunt.', keyStars: ['Betelgeuse', 'Rigel', 'Bellatrix'] },
  },
  {
    id: 'cassiopeia', name: 'Cassiopeia',
    stars: [
      { x: 75, y: 5, size: 3 }, { x: 78, y: 8, size: 2.5 }, { x: 82, y: 6, size: 3.5 },
      { x: 85, y: 10, size: 2 }, { x: 88, y: 7, size: 3 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
    triggerProgress: 0.1,
    mythology: { origin: 'Named after the vain queen Cassiopeia who boasted of her beauty.', meaning: 'Symbolizes beauty, pride, and the consequences of vanity.', keyStars: ['Schedar', 'Caph', 'Ruchbah'] },
  },
  {
    id: 'leo', name: 'Leo',
    stars: [
      { x: 55, y: 15, size: 4 }, { x: 58, y: 12, size: 2.5 }, { x: 62, y: 10, size: 3 },
      { x: 60, y: 18, size: 2 }, { x: 65, y: 20, size: 3.5 }, { x: 68, y: 22, size: 2.5 },
    ],
    lines: [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5]],
    triggerProgress: 0.12,
    mythology: { origin: 'The Nemean Lion slain by Hercules, immortalized in the stars.', meaning: 'Embodies courage, royalty, and fierce protection.', keyStars: ['Regulus', 'Denebola', 'Algieba'] },
  },
];

interface ShootingStar {
  id: number; startX: number; startY: number; angle: number; speed: number; length: number;
}

const staticStars = Array.from({ length: 150 }, (_, i) => ({
  x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.7 + 0.3,
  twinkleDelay: Math.random() * 5,
}));

const floatingDebris = Array.from({ length: 15 }, (_, i) => ({
  x: Math.random() * 90 + 5, y: Math.random() * 25 + 5,
  size: Math.random() * 8 + 3, rotation: Math.random() * 360,
  duration: Math.random() * 15 + 10, delay: Math.random() * 5,
}));

const ScrollStorytelling = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [hoveredConstellation, setHoveredConstellation] = useState<Constellation | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const shootingStarIdRef = useRef(0);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Parallax transforms
  const planetY = useTransform(smoothProgress, [0, 0.3], [0, -120]);
  const asteroidsY = useTransform(smoothProgress, [0, 0.4], [0, -200]);
  const cloudsY1 = useTransform(smoothProgress, [0.2, 0.6], [100, -80]);
  const cloudsY2 = useTransform(smoothProgress, [0.2, 0.6], [120, -50]);
  const birdsY = useTransform(smoothProgress, [0.25, 0.55], [60, -100]);
  const mountainsBackY = useTransform(smoothProgress, [0.4, 0.8], [80, -30]);
  const mountainsMidY = useTransform(smoothProgress, [0.4, 0.8], [100, -15]);
  const waterfallY = useTransform(smoothProgress, [0.45, 0.8], [90, -20]);
  const treesY = useTransform(smoothProgress, [0.45, 0.85], [110, -10]);
  const villageY = useTransform(smoothProgress, [0.6, 1], [80, 0]);
  const groundY = useTransform(smoothProgress, [0.65, 1], [60, 0]);

  // Phase opacities with overlap
  const cosmosOpacity = useTransform(smoothProgress, [0, 0.2, 0.35], [1, 1, 0.3]);
  const atmosphereOpacity = useTransform(smoothProgress, [0.15, 0.25, 0.5, 0.6], [0, 1, 1, 0.4]);
  const landscapeOpacity = useTransform(smoothProgress, [0.4, 0.5, 0.75, 0.85], [0, 1, 1, 0.8]);
  const civilizationOpacity = useTransform(smoothProgress, [0.65, 0.75, 1], [0, 1, 1]);

  // Background gradient shift
  const bgLighten = useTransform(smoothProgress, [0, 0.3, 0.5, 1], [0, 0, 0.08, 0.12]);

  useEffect(() => {
    const spawnShootingStar = () => {
      const newStar: ShootingStar = {
        id: shootingStarIdRef.current++,
        startX: Math.random() * 80 + 10, startY: Math.random() * 20,
        angle: Math.random() * 30 + 30, speed: Math.random() * 2 + 1,
        length: Math.random() * 80 + 40,
      };
      setShootingStars(prev => [...prev.slice(-3), newStar]);
    };
    const interval = setInterval(spawnShootingStar, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleConstellationHover = (constellation: Constellation | null, event?: React.MouseEvent) => {
    setHoveredConstellation(constellation);
    if (event && constellation) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltipPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        zIndex: -1,
        background: 'linear-gradient(to bottom, #1E1B4B 0%, #1a1845 15%, #151340 30%, #111035 50%, #0d0c2d 70%, #0F172A 100%)',
      }}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Atmosphere lightening overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(49, 46, 129, 0.15) 40%, rgba(99, 102, 241, 0.06) 60%, rgba(15, 23, 42, 0.3) 100%)',
          opacity: bgLighten,
        }}
      />

      {/* ============================================= */}
      {/* SCENE 1: THE COSMOS (0% - 25%) */}
      {/* ============================================= */}
      <motion.div className="absolute inset-0" style={{ opacity: cosmosOpacity }}>

        {/* Star field */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="starSoftGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="starBrightGlow">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {staticStars.map((star, i) => {
            const isBright = star.size > 1.8;
            const color = i % 3 === 0 ? '#C7D2FE' : i % 3 === 1 ? '#A5B4FC' : '#E0E7FF';
            return (
              <g key={`star-${i}`}>
                {/* Outer glow halo */}
                {isBright && (
                  <circle
                    cx={`${star.x}%`} cy={`${star.y}%`} r={star.size * 4}
                    fill={color} opacity={star.opacity * 0.08}
                    filter="url(#starBrightGlow)"
                  />
                )}
                {/* Core star */}
                <circle
                  cx={`${star.x}%`} cy={`${star.y}%`} r={star.size}
                  fill={color} opacity={star.opacity}
                  filter={isBright ? 'url(#starBrightGlow)' : 'url(#starSoftGlow)'}
                >
                  <animate
                    attributeName="opacity"
                    values={`${star.opacity};${star.opacity * 0.3};${star.opacity}`}
                    dur={`${3 + star.twinkleDelay}s`}
                    repeatCount="indefinite"
                    begin={`${star.twinkleDelay}s`}
                  />
                </circle>
                {/* Bright center dot */}
                {isBright && (
                  <circle
                    cx={`${star.x}%`} cy={`${star.y}%`} r={star.size * 0.4}
                    fill="#FFFFFF" opacity={star.opacity * 0.9}
                  >
                    <animate
                      attributeName="opacity"
                      values={`${star.opacity * 0.9};${star.opacity * 0.4};${star.opacity * 0.9}`}
                      dur={`${3 + star.twinkleDelay}s`}
                      repeatCount="indefinite"
                      begin={`${star.twinkleDelay}s`}
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Giant Planet */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ left: '5%', top: '12%', width: '42vw', height: '42vw', maxWidth: '600px', maxHeight: '600px', y: planetY }}
        >
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              <radialGradient id="planetBody" cx="35%" cy="30%" r="55%">
                <stop offset="0%" stopColor="#5B52E5" />
                <stop offset="25%" stopColor="#4338CA" />
                <stop offset="50%" stopColor="#3730A3" />
                <stop offset="75%" stopColor="#252362" />
                <stop offset="100%" stopColor="#131136" />
              </radialGradient>
              {/* Bright highlight — top-left (moonlight source) */}
              <radialGradient id="planetHighlight" cx="25%" cy="20%" r="35%">
                <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.6" />
                <stop offset="40%" stopColor="#818CF8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              {/* Deep shadow — bottom-right (away from light) */}
              <radialGradient id="planetShadow" cx="75%" cy="70%" r="50%">
                <stop offset="0%" stopColor="transparent" stopOpacity="0" />
                <stop offset="40%" stopColor="#0a0e14" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#0a0e14" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#050810" stopOpacity="0.95" />
              </radialGradient>
              {/* Atmospheric glow around planet */}
              <radialGradient id="planetGlow" cx="50%" cy="50%" r="55%">
                <stop offset="78%" stopColor="transparent" stopOpacity="0" />
                <stop offset="88%" stopColor="#6366F1" stopOpacity="0.15" />
                <stop offset="94%" stopColor="#818CF8" stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              {/* Rim light — left edge (bright crescent) */}
              <radialGradient id="planetRimLight" cx="10%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#C7D2FE" stopOpacity="0.35" />
                <stop offset="15%" stopColor="#A5B4FC" stopOpacity="0.15" />
                <stop offset="30%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              {/* Crater shadow */}
              <radialGradient id="craterShadow" cx="60%" cy="60%" r="50%">
                <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#252362" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              <clipPath id="planetClip"><circle cx="250" cy="250" r="180" /></clipPath>
              <filter id="planetAtmoGlow">
                <feGaussianBlur stdDeviation="8" result="glow" />
                <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Outer atmospheric glow */}
            <circle cx="250" cy="250" r="220" fill="url(#planetGlow)" filter="url(#planetAtmoGlow)" />
            {/* Planet body */}
            <circle cx="250" cy="250" r="180" fill="url(#planetBody)" />
            {/* Surface detail */}
            <g clipPath="url(#planetClip)">
              {/* Atmospheric bands */}
              <ellipse cx="250" cy="190" rx="180" ry="12" fill="#4F46E5" opacity="0.25" />
              <ellipse cx="250" cy="215" rx="180" ry="6" fill="#6366F1" opacity="0.15" />
              <ellipse cx="250" cy="255" rx="180" ry="18" fill="#3730A3" opacity="0.2" />
              <ellipse cx="250" cy="300" rx="180" ry="10" fill="#4338CA" opacity="0.15" />
              {/* Craters with depth */}
              <circle cx="195" cy="205" r="28" fill="#1E1B4B" opacity="0.35" />
              <circle cx="195" cy="205" r="24" fill="url(#craterShadow)" />
              <ellipse cx="188" cy="200" rx="8" ry="6" fill="#312E81" opacity="0.3" /> {/* crater rim highlight */}
              <circle cx="315" cy="275" r="20" fill="#1E1B4B" opacity="0.3" />
              <circle cx="315" cy="275" r="16" fill="url(#craterShadow)" />
              <circle cx="225" cy="310" r="14" fill="#1E1B4B" opacity="0.25" />
              <circle cx="285" cy="185" r="10" fill="#1E1B4B" opacity="0.2" />
            </g>
            {/* Lighting layers */}
            <circle cx="250" cy="250" r="180" fill="url(#planetHighlight)" />
            <circle cx="250" cy="250" r="180" fill="url(#planetRimLight)" />
            <circle cx="250" cy="250" r="180" fill="url(#planetShadow)" />
            {/* Rim light edge — thin bright arc on left side */}
            <path d="M 105 150 A 180 180 0 0 0 105 350" fill="none" stroke="#A5B4FC" strokeWidth="1.5" opacity="0.4" filter="url(#planetAtmoGlow)" />
            {/* Rings with depth */}
            <ellipse cx="250" cy="260" rx="265" ry="42" fill="none" stroke="#818CF8" strokeWidth="2.5" opacity="0.3" strokeDasharray="8 4">
              <animate attributeName="stroke-dashoffset" values="0;-24" dur="15s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="250" cy="260" rx="245" ry="37" fill="none" stroke="#6366F1" strokeWidth="1.5" opacity="0.2" />
            <ellipse cx="250" cy="260" rx="280" ry="46" fill="none" stroke="#4338CA" strokeWidth="1" opacity="0.15" />
          </svg>
        </motion.div>

        {/* Floating debris */}
        {floatingDebris.map((rock, i) => (
          <motion.div
            key={`debris-${i}`}
            className="absolute pointer-events-none"
            style={{ left: `${rock.x}%`, top: `${rock.y}%` }}
            animate={{ y: [0, -15, 0, 10, 0], x: [0, 5, -3, 8, 0], rotate: [rock.rotation, rock.rotation + 20, rock.rotation - 10, rock.rotation + 15, rock.rotation] }}
            transition={{ duration: rock.duration, repeat: Infinity, ease: 'easeInOut', delay: rock.delay }}
          >
            <svg width={rock.size * 2} height={rock.size * 2} viewBox="0 0 20 20">
              <polygon points="10,2 16,7 14,16 6,14 4,8" fill="#312E81" stroke="#6366F1" strokeWidth="0.5" opacity="0.5" />
            </svg>
          </motion.div>
        ))}

        {/* Asteroids transitioning downward */}
        <motion.div className="absolute pointer-events-none" style={{ y: asteroidsY }}>
          <svg className="absolute w-full h-full" viewBox="0 0 100 100">
            {/* Larger asteroids at bottom of cosmos zone */}
            <ellipse cx="25" cy="75" rx="3" ry="2.2" fill="#312E81" stroke="#6366F1" strokeWidth="0.3" opacity="0.6" transform="rotate(-15 25 75)" />
            <ellipse cx="70" cy="80" rx="2" ry="1.5" fill="#252362" stroke="#818CF8" strokeWidth="0.2" opacity="0.5" transform="rotate(20 70 80)" />
            <ellipse cx="50" cy="85" rx="4" ry="2.8" fill="#1E1B4B" stroke="#6366F1" strokeWidth="0.4" opacity="0.7" transform="rotate(-30 50 85)">
              <animateTransform attributeName="transform" type="rotate" values="-30 50 85;-25 50 85;-30 50 85" dur="8s" repeatCount="indefinite" />
            </ellipse>
            <circle cx="82" cy="70" r="1.2" fill="#312E81" stroke="#A5B4FC" strokeWidth="0.2" opacity="0.4" />
            <ellipse cx="15" cy="88" rx="1.8" ry="1.2" fill="#252362" opacity="0.5" />
          </svg>
        </motion.div>

        {/* Nebula wisps */}
        <svg className="absolute" style={{ left: '-10%', top: '-5%', width: '70vw', height: '45vh' }} viewBox="0 0 700 400">
          <defs>
            <radialGradient id="neb1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4338CA" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#3730A3" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="neb1b" cx="60%" cy="40%" r="40%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="350" cy="200" rx="330" ry="180" fill="url(#neb1)" />
          <ellipse cx="400" cy="170" rx="220" ry="130" fill="url(#neb1b)" />
        </svg>
        <svg className="absolute" style={{ right: '-5%', top: '5%', width: '40vw', height: '35vh' }} viewBox="0 0 400 300">
          <defs>
            <radialGradient id="neb2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="150" rx="190" ry="130" fill="url(#neb2)" />
        </svg>

        {/* Constellations */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
          <defs>
            <filter id="starGlow"><feGaussianBlur stdDeviation="1.5" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="starGlowHover"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.7" /><stop offset="100%" stopColor="#818CF8" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="lineGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C7D2FE" stopOpacity="1" /><stop offset="100%" stopColor="#A5B4FC" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {constellations.map((c) => (
            <ConstellationGroup key={c.id} constellation={c} scrollProgress={smoothProgress} isHovered={hoveredConstellation?.id === c.id} onHover={handleConstellationHover} />
          ))}
        </svg>

        {/* Shooting stars */}
        {shootingStars.map((star) => <ShootingStarElement key={star.id} star={star} />)}
      </motion.div>

      {/* ============================================= */}
      {/* SCENE 2: THE ATMOSPHERE (25% - 50%) */}
      {/* ============================================= */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: atmosphereOpacity }}>

        {/* Gradient sky shift — lighter moonlight blue */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(49, 46, 129, 0.15) 20%, rgba(79, 70, 229, 0.08) 50%, rgba(30, 27, 75, 0.2) 100%)',
        }} />

        {/* Cloud layer 1 — back */}
        <motion.svg
          className="absolute w-full pointer-events-none"
          style={{ top: '15%', height: '50%', y: cloudsY1 }}
          viewBox="0 0 1440 500" preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cloud1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312E81" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="cloud2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#252362" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1a1845" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          {/* Stylized flat vector cloud shapes */}
          <path d="M-50,200 Q50,150 200,180 Q350,120 500,170 Q650,100 800,160 Q950,110 1100,150 Q1250,100 1490,140 L1490,280 Q1300,250 1100,270 Q900,230 700,260 Q500,220 300,250 Q100,230 -50,260 Z" fill="url(#cloud1)" />
          <path d="M-50,280 Q100,230 250,260 Q400,200 600,250 Q750,190 950,240 Q1100,200 1300,230 Q1400,210 1490,220 L1490,360 Q1200,320 1000,350 Q800,310 600,340 Q400,300 200,330 Q50,320 -50,350 Z" fill="url(#cloud2)" />
        </motion.svg>

        {/* Cloud layer 2 — front */}
        <motion.svg
          className="absolute w-full pointer-events-none"
          style={{ top: '25%', height: '45%', y: cloudsY2 }}
          viewBox="0 0 1440 400" preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cloud3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#312E81" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <path d="M-50,150 Q100,100 300,140 Q500,80 700,130 Q900,70 1100,120 Q1300,90 1490,110 L1490,250 Q1300,220 1100,240 Q900,200 700,230 Q500,190 300,220 Q100,200 -50,230 Z" fill="url(#cloud3)" />
          {/* Wispy thin clouds */}
          <path d="M100,200 Q300,175 500,195 Q700,170 900,190 Q1100,165 1300,185" fill="none" stroke="#312E81" strokeWidth="2" opacity="0.3" />
          <path d="M200,260 Q400,240 600,255 Q800,235 1000,250 Q1200,230 1400,245" fill="none" stroke="#252362" strokeWidth="1.5" opacity="0.25" />
        </motion.svg>

        {/* Birds silhouettes */}
        <motion.svg
          className="absolute w-full pointer-events-none"
          style={{ top: '20%', height: '30%', y: birdsY }}
          viewBox="0 0 1000 300"
        >
          {/* Bird flock — simple V-shapes */}
          <g opacity="0.4" fill="none" stroke="#4338CA" strokeWidth="1.5" strokeLinecap="round">
            {/* Flock 1 — distant */}
            <path d="M200,100 L208,94 L216,100" />
            <path d="M220,105 L226,100 L232,105" />
            <path d="M210,112 L217,106 L224,112" />
            <path d="M235,98 L240,94 L245,98" />
            <path d="M195,108 L201,103 L207,108" />
            {/* Flock 2 — mid */}
            <g opacity="0.6" strokeWidth="2">
              <path d="M650,140 L662,130 L674,140" />
              <path d="M680,148 L690,140 L700,148" />
              <path d="M660,155 L670,147 L680,155" />
              <path d="M640,152 L648,146 L656,152" />
            </g>
            {/* Flock 3 — closer, larger */}
            <g opacity="0.5" strokeWidth="2.5" stroke="#312E81">
              <path d="M400,200 L415,186 L430,200" />
              <path d="M445,195 L456,184 L467,195" />
              <path d="M420,210 L433,198 L446,210" />
            </g>
          </g>
        </motion.svg>
      </motion.div>

      {/* ============================================= */}
      {/* SCENE 3: THE LANDSCAPE (50% - 75%) */}
      {/* ============================================= */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: landscapeOpacity }}>

        {/* Atmospheric haze — horizon layer where sky meets mountains */}
        <motion.div
          className="absolute w-full pointer-events-none"
          style={{ bottom: '35%', height: '25%', y: mountainsBackY }}
        >
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(67, 56, 202, 0.06) 30%, rgba(99, 102, 241, 0.1) 50%, rgba(49, 46, 129, 0.08) 70%, transparent 100%)',
            filter: 'blur(20px)',
          }} />
        </motion.div>

        {/* Back mountain range */}
        <motion.svg
          className="absolute bottom-0 w-full pointer-events-none"
          style={{ height: '65%', y: mountainsBackY }}
          viewBox="0 0 1440 500" preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mtBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4338CA" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#312E81" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#1E1B4B" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#131136" stopOpacity="0.8" />
            </linearGradient>
            <filter id="mtHaze">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <path d="M0,350 L60,280 L140,320 L260,200 L380,280 L500,220 L620,300 L760,160 L880,250 L1000,200 L1120,270 L1260,210 L1380,270 L1440,240 L1440,500 L0,500 Z" fill="url(#mtBack)" />
          {/* Atmospheric haze where mountains meet sky */}
          <rect x="0" y="140" width="1440" height="80" fill="url(#mtBack)" opacity="0.15" filter="url(#mtHaze)" />
          {/* Moonlight-catching peaks */}
          <path d="M260,200 L275,212 L245,212 Z" fill="#6366F1" opacity="0.5" />
          <path d="M258,200 L262,200 L260,192 Z" fill="#818CF8" opacity="0.35" /> {/* tip highlight */}
          <path d="M760,160 L778,175 L742,175 Z" fill="#6366F1" opacity="0.55" />
          <path d="M758,160 L762,160 L760,150 Z" fill="#A5B4FC" opacity="0.3" /> {/* tip highlight */}
          <path d="M1000,200 L1015,212 L985,212 Z" fill="#6366F1" opacity="0.4" />
          {/* Ridge edge highlights (moonlight) */}
          <path d="M260,200 L380,280 L500,220 L620,300 L760,160 L880,250 L1000,200" fill="none" stroke="#818CF8" strokeWidth="1.5" opacity="0.15" />
        </motion.svg>

        {/* Mid mountain range with pine trees */}
        <motion.svg
          className="absolute bottom-0 w-full pointer-events-none"
          style={{ height: '55%', y: mountainsMidY }}
          viewBox="0 0 1440 450" preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mtMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3730A3" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#312E81" />
              <stop offset="60%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#131136" />
            </linearGradient>
            <linearGradient id="mtMidHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,300 L80,250 L180,280 L280,180 L360,240 L480,200 L600,260 L720,150 L840,220 L960,180 L1100,240 L1220,200 L1340,250 L1440,220 L1440,450 L0,450 Z" fill="url(#mtMid)" />
          {/* Moonlit face of mountains — left-facing slopes catch light */}
          <path d="M280,180 L360,240 L280,240 Z" fill="url(#mtMidHighlight)" />
          <path d="M720,150 L840,220 L720,220 Z" fill="url(#mtMidHighlight)" />
          <path d="M960,180 L1100,240 L960,240 Z" fill="url(#mtMidHighlight)" />

          {/* Pine tree silhouettes on ridges */}
          <g fill="#1a1845" opacity="0.9">
            {/* Trees near peak at 720 */}
            <polygon points="690,155 695,140 700,155" />
            <polygon points="700,158 706,138 712,158" />
            <polygon points="715,160 720,142 725,160" />
            <polygon points="730,157 735,140 740,157" />
            {/* Trees near peak at 280 */}
            <polygon points="255,185 260,168 265,185" />
            <polygon points="268,188 274,170 280,188" />
            <polygon points="285,185 290,168 295,185" />
            {/* Trees near 960 */}
            <polygon points="940,185 946,165 952,185" />
            <polygon points="955,183 960,167 965,183" />
            <polygon points="968,186 974,168 980,186" />
            {/* Scattered trees along ridgeline */}
            <polygon points="400,210 405,192 410,210" />
            <polygon points="500,205 506,188 512,205" />
            <polygon points="1150,245 1156,228 1162,245" />
            <polygon points="1170,242 1175,226 1180,242" />
          </g>

          {/* Edge highlight */}
          <path d="M280,180 L360,240 L480,200 L600,260 L720,150 L840,220 L960,180" fill="none" stroke="#6366F1" strokeWidth="1" opacity="0.25" />
        </motion.svg>

        {/* Waterfall & River */}
        <motion.svg
          className="absolute bottom-0 w-full pointer-events-none"
          style={{ height: '50%', y: waterfallY }}
          viewBox="0 0 1440 400" preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waterfallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C7D2FE" stopOpacity="0.7" />
              <stop offset="20%" stopColor="#A5B4FC" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#818CF8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.05" />
              <stop offset="20%" stopColor="#818CF8" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#A5B4FC" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#818CF8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="riverReflection" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C7D2FE" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#E0E7FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
            <filter id="waterGlow">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feMerge><feMergeNode in="glow" /><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="mistGlow">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          {/* Waterfall stream — multi-layer for depth */}
          <path d="M720,50 Q722,100 718,150 Q715,200 720,250 Q725,280 730,310" fill="none" stroke="url(#waterfallGrad)" strokeWidth="8" filter="url(#waterGlow)" />
          {/* Bright center stream */}
          <path d="M720,55 Q721,105 719,155 Q717,205 720,255 Q724,285 728,310" fill="none" stroke="#E0E7FF" strokeWidth="1.5" opacity="0.5" />
          {/* Spray/mist at waterfall base */}
          <ellipse cx="725" cy="308" rx="45" ry="18" fill="#818CF8" opacity="0.12" filter="url(#mistGlow)" />
          <ellipse cx="725" cy="310" rx="25" ry="8" fill="#A5B4FC" opacity="0.08" filter="url(#mistGlow)" />

          {/* River with reflection highlights */}
          <path d="M730,310 Q780,320 850,315 Q950,310 1050,320 Q1150,325 1250,318 Q1350,312 1440,320" fill="none" stroke="url(#riverGrad)" strokeWidth="10" opacity="0.6" />
          {/* White/cyan reflection highlights on water surface */}
          <path d="M750,312 Q820,316 870,313" fill="none" stroke="#E0E7FF" strokeWidth="1" opacity="0.35" />
          <path d="M950,311 Q1020,318 1080,315" fill="none" stroke="#C7D2FE" strokeWidth="0.8" opacity="0.3" />
          <path d="M1180,320 Q1230,317 1280,319" fill="none" stroke="#E0E7FF" strokeWidth="0.8" opacity="0.25" />
          {/* Soft glow on river */}
          <path d="M730,310 Q780,320 850,315 Q950,310 1050,320 Q1150,325 1250,318 Q1350,312 1440,320" fill="none" stroke="#A5B4FC" strokeWidth="2" opacity="0.2" filter="url(#waterGlow)" />

          {/* Left branch */}
          <path d="M730,310 Q680,325 600,330 Q500,340 400,335 Q300,330 200,338 Q100,342 0,340" fill="none" stroke="url(#riverGrad)" strokeWidth="8" opacity="0.5" />
          {/* Left branch reflections */}
          <path d="M680,322 Q620,328 560,330" fill="none" stroke="#E0E7FF" strokeWidth="0.8" opacity="0.25" />
          <path d="M420,336 Q360,332 310,334" fill="none" stroke="#C7D2FE" strokeWidth="0.8" opacity="0.2" />
        </motion.svg>

        {/* Extra foreground trees */}
        <motion.svg
          className="absolute bottom-0 w-full pointer-events-none"
          style={{ height: '40%', y: treesY }}
          viewBox="0 0 1440 350" preserveAspectRatio="none"
        >
          <g fill="#131136" opacity="0.85">
            {/* Larger foreground pines — left side */}
            <polygon points="100,250 115,190 130,250" />
            <polygon points="108,220 115,195 122,220" />
            <polygon points="140,255 152,200 164,255" />
            <polygon points="146,230 152,208 158,230" />
            {/* Right side */}
            <polygon points="1250,245 1265,185 1280,245" />
            <polygon points="1258,215 1265,192 1272,215" />
            <polygon points="1300,255 1312,205 1324,255" />
            {/* Mid scattered */}
            <polygon points="550,260 560,215 570,260" />
            <polygon points="890,250 900,200 910,250" />
            <polygon points="898,225 900,208 902,225" />
          </g>
        </motion.svg>
      </motion.div>

      {/* ============================================= */}
      {/* SCENE 4: THE ARRIVAL / CIVILIZATION (75%-100%) */}
      {/* ============================================= */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: civilizationOpacity }}>

        {/* Dark ground gradient */}
        <div className="absolute bottom-0 w-full" style={{ height: '40%', background: 'linear-gradient(to top, #0a0e14 0%, #0F172A 50%, transparent 100%)' }} />

        {/* Village & Architecture */}
        <motion.svg
          className="absolute bottom-0 w-full pointer-events-none"
          style={{ height: '35%', y: villageY }}
          viewBox="0 0 1440 300" preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="villageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#131136" />
              <stop offset="100%" stopColor="#0a0e14" />
            </linearGradient>
            <filter id="windowGlow">
              <feGaussianBlur stdDeviation="2" result="glow" />
              <feMerge><feMergeNode in="glow" /><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Temple complex — left bank */}
          <g fill="url(#villageGrad)">
            {/* Main temple with dome */}
            <rect x="180" y="140" width="60" height="80" />
            <path d="M175,140 L210,100 L245,140 Z" />
            {/* Spire */}
            <rect x="206" y="75" width="8" height="25" />
            <circle cx="210" cy="72" r="6" fill="#131136" />
            {/* Side building */}
            <rect x="250" y="165" width="40" height="55" />
            <path d="M248,165 L270,145 L292,165 Z" />
            {/* Small shrine */}
            <rect x="130" y="175" width="30" height="45" />
            <path d="M127,175 L145,155 L163,175 Z" />
          </g>

          {/* Temple complex — right bank */}
          <g fill="url(#villageGrad)">
            {/* Pagoda-style temple */}
            <rect x="1050" y="150" width="50" height="70" />
            <path d="M1040,150 L1075,120 L1110,150 Z" />
            <path d="M1050,130 L1075,105 L1100,130 Z" />
            <rect x="1071" y="80" width="8" height="25" />
            {/* Houses */}
            <rect x="1120" y="175" width="35" height="45" />
            <path d="M1116,175 L1137,158 L1158,175 Z" />
            <rect x="1000" y="180" width="30" height="40" />
            <path d="M997,180 L1015,162 L1033,180 Z" />
            {/* Small dome */}
            <rect x="1170" y="185" width="25" height="35" />
            <ellipse cx="1182" cy="185" rx="16" ry="10" />
          </g>

          {/* Central structures along riverbank */}
          <g fill="url(#villageGrad)">
            <rect x="620" y="170" width="30" height="50" />
            <path d="M617,170 L635,150 L653,170 Z" />
            <rect x="670" y="178" width="25" height="42" />
            <path d="M667,178 L682,162 L697,178 Z" />
            {/* Arch/bridge over river */}
            <path d="M700,210 Q730,190 760,210" fill="none" stroke="#131136" strokeWidth="4" />
          </g>

          {/* Window lights — WARM GOLD/AMBER for life contrast */}
          <g filter="url(#windowGlow)">
            {/* Left temple complex */}
            <rect x="195" y="158" width="4" height="5" fill="#FBBF24" opacity="0.7" rx="0.5" />
            <rect x="195" y="158" width="4" height="5" fill="#FDE68A" opacity="0.3" rx="0.5" /> {/* warm overlay */}
            <rect x="215" y="158" width="4" height="5" fill="#F59E0B" opacity="0.6" rx="0.5" />
            <rect x="200" y="173" width="3" height="4" fill="#FBBF24" opacity="0.5" rx="0.5" />
            <rect x="220" y="173" width="3" height="4" fill="#F59E0B" opacity="0.45" rx="0.5" />
            <rect x="262" y="178" width="4" height="5" fill="#FBBF24" opacity="0.6" rx="0.5" />
            <rect x="275" y="178" width="3" height="4" fill="#F59E0B" opacity="0.5" rx="0.5" />
            <rect x="140" y="188" width="3" height="4" fill="#FBBF24" opacity="0.5" rx="0.5" />
            <rect x="148" y="192" width="2" height="3" fill="#F59E0B" opacity="0.4" rx="0.5" />
            {/* Right temple complex */}
            <rect x="1063" y="163" width="4" height="5" fill="#FBBF24" opacity="0.6" rx="0.5" />
            <rect x="1080" y="163" width="4" height="5" fill="#F59E0B" opacity="0.55" rx="0.5" />
            <rect x="1068" y="178" width="3" height="4" fill="#FBBF24" opacity="0.45" rx="0.5" />
            <rect x="1130" y="188" width="4" height="5" fill="#FBBF24" opacity="0.6" rx="0.5" />
            <rect x="1145" y="188" width="3" height="4" fill="#F59E0B" opacity="0.5" rx="0.5" />
            <rect x="1010" y="193" width="3" height="4" fill="#FBBF24" opacity="0.5" rx="0.5" />
            <rect x="1178" y="198" width="3" height="4" fill="#F59E0B" opacity="0.45" rx="0.5" />
            {/* Central structures */}
            <rect x="630" y="183" width="3" height="4" fill="#FBBF24" opacity="0.5" rx="0.5" />
            <rect x="638" y="188" width="2" height="3" fill="#F59E0B" opacity="0.4" rx="0.5" />
            <rect x="678" y="190" width="3" height="4" fill="#FBBF24" opacity="0.5" rx="0.5" />
          </g>

          {/* Window light spillage — warm glow halos around windows */}
          <g opacity="0.15" filter="url(#windowGlow)">
            <circle cx="197" cy="161" r="8" fill="#FBBF24" />
            <circle cx="264" cy="181" r="7" fill="#F59E0B" />
            <circle cx="1065" cy="166" r="8" fill="#FBBF24" />
            <circle cx="1132" cy="191" r="7" fill="#F59E0B" />
            <circle cx="632" cy="186" r="6" fill="#FBBF24" />
          </g>

          {/* Spire tip glows — warm gold beacons */}
          <g filter="url(#windowGlow)">
            <circle cx="210" cy="70" r="3.5" fill="#FBBF24" opacity="0.9" />
            <circle cx="210" cy="70" r="8" fill="#F59E0B" opacity="0.15" /> {/* halo */}
            <circle cx="1075" cy="78" r="3.5" fill="#FBBF24" opacity="0.85" />
            <circle cx="1075" cy="78" r="8" fill="#F59E0B" opacity="0.12" />
            <circle cx="145" cy="153" r="2.5" fill="#F59E0B" opacity="0.7" />
          </g>
        </motion.svg>

        {/* Foreground ground silhouette */}
        <motion.svg
          className="absolute bottom-0 w-full pointer-events-none"
          style={{ height: '18%', y: groundY }}
          viewBox="0 0 1440 150" preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d0c2d" />
              <stop offset="100%" stopColor="#0a0e14" />
            </linearGradient>
          </defs>
          <path d="M0,150 L0,80 L40,75 L100,82 L180,70 L260,78 L340,68 L420,76 L500,72 L580,78 L660,65 L740,74 L820,70 L900,78 L980,66 L1060,74 L1140,70 L1220,76 L1300,68 L1380,74 L1440,72 L1440,150 Z" fill="url(#groundGrad)" />

          {/* People silhouettes */}
          <g fill="#0d0c2d" opacity="0.9">
            {/* Seated monk — left riverbank */}
            <ellipse cx="300" cy="72" rx="4" ry="3" /> {/* body */}
            <circle cx="300" cy="67" r="2.5" /> {/* head */}
            
            {/* Standing figure gazing up — right */}
            <rect x="1098" y="58" width="4" height="14" rx="1" /> {/* body */}
            <circle cx="1100" cy="55" r="2.5" /> {/* head */}

            {/* Walking pair — center */}
            <rect x="698" y="60" width="3.5" height="12" rx="1" />
            <circle cx="700" cy="56" r="2" />
            <rect x="708" y="62" width="3.5" height="10" rx="1" />
            <circle cx="710" cy="58.5" r="2" />
          </g>
        </motion.svg>
      </motion.div>

      {/* Unifying gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(30, 27, 75, 0.05) 0%, rgba(15, 23, 42, 0.05) 40%, rgba(15, 23, 42, 0.1) 70%, rgba(10, 14, 20, 0.15) 100%)' }}
      />

      {/* Constellation tooltip */}
      <AnimatePresence>
        {hoveredConstellation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 pointer-events-none max-w-xs"
            style={{ left: Math.min(tooltipPosition.x + 20, window.innerWidth - 320), top: Math.min(tooltipPosition.y - 20, window.innerHeight - 250) }}
          >
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)', border: '1px solid rgba(99, 102, 241, 0.4)', boxShadow: '0 0 30px rgba(99, 102, 241, 0.15), 0 20px 60px rgba(0, 0, 0, 0.8)' }}>
              <h3 className="font-display text-lg tracking-wider mb-2" style={{ color: '#A5B4FC', textShadow: '0 0 10px rgba(165, 180, 252, 0.5)' }}>{hoveredConstellation.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{hoveredConstellation.mythology.origin}</p>
              <div className="text-xs mb-3 p-2 rounded-lg" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <span style={{ color: '#818CF8' }} className="font-display tracking-wider">MEANING: </span>
                <span className="text-foreground/80">{hoveredConstellation.mythology.meaning}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hoveredConstellation.mythology.keyStars.map((star) => (
                  <span key={star} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#C7D2FE', border: '1px solid rgba(99, 102, 241, 0.3)' }}>★ {star}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journey milestones */}
      <JourneyMilestones scrollProgress={smoothProgress} />
    </div>
  );
};

// Constellation group
const ConstellationGroup = ({ constellation, scrollProgress, isHovered, onHover }: {
  constellation: Constellation; scrollProgress: ReturnType<typeof useSpring>; isHovered: boolean;
  onHover: (c: Constellation | null, e?: React.MouseEvent) => void;
}) => {
  const visibility = useTransform(scrollProgress, [constellation.triggerProgress - 0.02, constellation.triggerProgress, constellation.triggerProgress + 0.08], [0, 0.7, 1]);
  const lineProgress = useTransform(scrollProgress, [constellation.triggerProgress, constellation.triggerProgress + 0.1], [0, 1]);
  const minX = Math.min(...constellation.stars.map(s => s.x)) - 3;
  const maxX = Math.max(...constellation.stars.map(s => s.x)) + 3;
  const minY = Math.min(...constellation.stars.map(s => s.y)) - 3;
  const maxY = Math.max(...constellation.stars.map(s => s.y)) + 3;

  return (
    <motion.g style={{ opacity: visibility }}>
      <rect x={`${minX}%`} y={`${minY}%`} width={`${maxX - minX}%`} height={`${maxY - minY}%`} fill="transparent" className="cursor-pointer" style={{ pointerEvents: 'all' }}
        onMouseEnter={(e) => onHover(constellation, e)} onMouseMove={(e) => isHovered && onHover(constellation, e)} onMouseLeave={() => onHover(null)} />
      {constellation.lines.map(([s, e], i) => {
        const start = constellation.stars[s], end = constellation.stars[e];
        return (
          <motion.line key={`l-${i}`} x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${end.y}%`}
            stroke={isHovered ? "url(#lineGradientHover)" : "url(#lineGradient)"} strokeWidth={isHovered ? 2 : 1} strokeDasharray={isHovered ? "0" : "4 4"}
            style={{ pathLength: lineProgress, opacity: useTransform(lineProgress, [0, 0.5], [0, isHovered ? 1 : 0.6]), transition: 'stroke-width 0.3s, stroke-dasharray 0.3s' }}
          />
        );
      })}
      {constellation.stars.map((star, idx) => (
        <motion.circle key={`s-${idx}`} cx={`${star.x}%`} cy={`${star.y}%`} r={isHovered ? star.size * 1.5 : star.size}
          fill={isHovered ? "#C7D2FE" : "#A5B4FC"} filter={isHovered ? "url(#starGlowHover)" : "url(#starGlow)"}
          style={{ scale: useTransform(visibility, [0, 1], [0, 1]), transition: 'r 0.3s, fill 0.3s' }}
        />
      ))}
      <motion.text x={`${constellation.stars[0].x + 3}%`} y={`${constellation.stars[0].y - 2}%`} fill={isHovered ? "#C7D2FE" : "#A5B4FC"} fontSize={isHovered ? "12" : "10"} fontFamily="Iceland, sans-serif" letterSpacing="0.2em"
        style={{ opacity: useTransform(visibility, [0.5, 1], [0, isHovered ? 1 : 0.7]), transition: 'font-size 0.3s, fill 0.3s' }}
      >{constellation.name.toUpperCase()}</motion.text>
    </motion.g>
  );
};

const ShootingStarElement = ({ star }: { star: ShootingStar }) => (
  <motion.div className="absolute"
    initial={{ left: `${star.startX}%`, top: `${star.startY}%`, opacity: 1 }}
    animate={{ left: `${star.startX + star.length * Math.cos(star.angle * Math.PI / 180)}%`, top: `${star.startY + star.length * Math.sin(star.angle * Math.PI / 180)}%`, opacity: 0 }}
    transition={{ duration: star.speed, ease: 'easeOut' }}
  >
    <div className="w-1 h-1 rounded-full" style={{
      background: '#A5B4FC',
      boxShadow: `-${star.length / 4}px 0 ${star.length / 8}px rgba(165, 180, 252, 0.8), -${star.length / 2}px 0 ${star.length / 4}px rgba(99, 102, 241, 0.4)`,
      transform: `rotate(${star.angle}deg)`,
    }} />
  </motion.div>
);

const MilestoneItem = ({ scrollProgress, progress, text, topPercent }: { scrollProgress: ReturnType<typeof useSpring>; progress: number; text: string; topPercent: number }) => {
  const opacity = useTransform(scrollProgress, [progress - 0.05, progress, progress + 0.08, progress + 0.15], [0, 0.8, 0.8, 0]);
  return (
    <motion.div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ top: `${topPercent}%`, opacity }}>
      <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#A5B4FC', textShadow: '0 0 20px rgba(165, 180, 252, 0.5)' }}>{text}</span>
    </motion.div>
  );
};

const JourneyMilestones = ({ scrollProgress }: { scrollProgress: ReturnType<typeof useSpring> }) => (
  <>
    <MilestoneItem scrollProgress={scrollProgress} progress={0.1} text="Traversing the cosmos..." topPercent={15} />
    <MilestoneItem scrollProgress={scrollProgress} progress={0.3} text="Entering the atmosphere..." topPercent={35} />
    <MilestoneItem scrollProgress={scrollProgress} progress={0.55} text="Descending through the landscape..." topPercent={60} />
    <MilestoneItem scrollProgress={scrollProgress} progress={0.8} text="Arriving at the ancient village..." topPercent={85} />
  </>
);

export default ScrollStorytelling;
