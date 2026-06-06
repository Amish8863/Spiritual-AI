import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, Flame, Mountain, Wind, Droplets } from 'lucide-react';
import { zodiacSigns, ZodiacSign } from '@/data/zodiacData';

// Import zodiac line-art images
import ariesImg from '@/assets/zodiac/aries.png';
import taurusImg from '@/assets/zodiac/taurus.png';
import geminiImg from '@/assets/zodiac/gemini.png';
import cancerImg from '@/assets/zodiac/cancer.png';
import leoImg from '@/assets/zodiac/leo.png';
import virgoImg from '@/assets/zodiac/virgo.png';
import libraImg from '@/assets/zodiac/libra.png';
import scorpioImg from '@/assets/zodiac/scorpio.png';
import sagittariusImg from '@/assets/zodiac/sagittarius.png';
import capricornImg from '@/assets/zodiac/capricorn.png';
import aquariusImg from '@/assets/zodiac/aquarius.png';
import piscesImg from '@/assets/zodiac/pisces.png';

// Zodiac images mapping
const zodiacImages: Record<string, string> = {
  Aries: ariesImg,
  Taurus: taurusImg,
  Gemini: geminiImg,
  Cancer: cancerImg,
  Leo: leoImg,
  Virgo: virgoImg,
  Libra: libraImg,
  Scorpio: scorpioImg,
  Sagittarius: sagittariusImg,
  Capricorn: capricornImg,
  Aquarius: aquariusImg,
  Pisces: piscesImg,
};

// Element icons mapping
const elementIcons = {
  Fire: Flame,
  Earth: Mountain,
  Air: Wind,
  Water: Droplets,
};

// Element colors
const elementColors = {
  Fire: 'text-orange-400',
  Earth: 'text-green-400',
  Air: 'text-sky-400',
  Water: 'text-blue-400',
};

const AUTO_CYCLE_INTERVAL = 5000; // 5 seconds between auto-cycles
const INACTIVITY_TIMEOUT = 12000; // 12 seconds before resuming auto mode

export const ZodiacWheelSection = () => {
  const navigate = useNavigate();
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>(zodiacSigns[0]);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const wheelRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<gsap.core.Tween | null>(null);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Initialize continuous wheel rotation
  useEffect(() => {
    if (wheelRef.current) {
      rotationRef.current = gsap.to(wheelRef.current, {
        rotation: 360,
        duration: 90,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      });
    }

    return () => {
      rotationRef.current?.kill();
    };
  }, []);

  // Get random zodiac (different from current)
  const getRandomSign = useCallback(() => {
    let newSign: ZodiacSign;
    do {
      const randomIndex = Math.floor(Math.random() * zodiacSigns.length);
      newSign = zodiacSigns[randomIndex];
    } while (newSign.name === selectedSign.name);
    return newSign;
  }, [selectedSign]);

  // Auto-cycling logic
  useEffect(() => {
    if (isAutoMode) {
      autoIntervalRef.current = setInterval(() => {
        if (!isAnimating) {
          setIsAnimating(true);
          const newSign = getRandomSign();
          setTimeout(() => {
            setSelectedSign(newSign);
            setIsAnimating(false);
          }, 150);
        }
      }, AUTO_CYCLE_INTERVAL);
    }

    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, [isAutoMode, getRandomSign, isAnimating]);

  // Reset inactivity timeout
  const resetInactivityTimeout = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      setIsAutoMode(true);
    }, INACTIVITY_TIMEOUT);
  }, []);

  // Handle sign click
  const handleSignClick = useCallback((sign: ZodiacSign) => {
    setIsAutoMode(false);
    setIsAnimating(true);
    
    setTimeout(() => {
      setSelectedSign(sign);
      setIsAnimating(false);
    }, 100);
    
    resetInactivityTimeout();
  }, [resetInactivityTimeout]);

  // Navigate to detail page with transition
  const handleReadMore = useCallback(() => {
    navigate(`/zodiac/${selectedSign.name.toLowerCase()}`);
  }, [navigate, selectedSign]);

  const ElementIcon = elementIcons[selectedSign.element];

  return (
    <section ref={sectionRef} className="relative z-10 py-16 bg-transparent overflow-hidden">
      {/* Background cosmic effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wider text-glow text-primary mb-4">
            The Twelve Zodiac Signs
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto tracking-wide">
            Explore the cosmic wisdom of each celestial sign
          </p>
        </div>

        {/* Main content - Left info + Right wheel */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[550px]">
          {/* Left: Info Panel */}
          <div className="order-2 lg:order-1">
            <div className="rounded-3xl p-8 md:p-10 min-h-[420px] flex flex-col justify-center relative overflow-hidden bg-transparent border border-white/15" style={{ textShadow: '0 1px 8px hsla(0, 0%, 0%, 0.9)' }}>
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-primary/40" />
              <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-primary/40" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-primary/40" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-primary/40" />

              {/* Auto mode indicator */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className={`flex items-center gap-2 text-xs uppercase tracking-widest transition-opacity duration-300 ${isAutoMode ? 'opacity-60' : 'opacity-0'}`}>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-muted-foreground">Auto-exploring</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSign.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="flex flex-col"
                >
                  {/* Element badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <ElementIcon className={`w-5 h-5 ${elementColors[selectedSign.element]}`} />
                    <span className={`text-base uppercase tracking-[0.2em] ${elementColors[selectedSign.element]}`}>
                      {selectedSign.element} Element
                    </span>
                  </div>

                  {/* Zodiac image + name */}
                  <div className="flex items-center gap-5 mb-4">
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <img 
                        src={zodiacImages[selectedSign.name]} 
                        alt={selectedSign.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(245,195,106,0.4)]"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl tracking-wider text-foreground">
                        {selectedSign.name}
                      </h3>
                      <p className="text-muted-foreground text-lg tracking-wide">
                        {selectedSign.dates}
                      </p>
                    </div>
                  </div>

                  {/* Ruling planet */}
                  <div className="text-base text-muted-foreground mb-4">
                    Ruled by <span className="text-primary">{selectedSign.ruling}</span>
                  </div>

                  {/* Description */}
                  <p className="text-foreground/90 text-base md:text-lg leading-relaxed mb-6">
                    {selectedSign.description}
                  </p>

                  {/* Traits preview */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedSign.traits.slice(0, 4).map((trait, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm rounded-full border border-primary/30 text-primary/80 bg-primary/5"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Read more button */}
                  <motion.button
                    onClick={handleReadMore}
                    className="btn-outline-cosmic btn-pulse px-6 py-3 rounded-lg inline-flex items-center gap-2 w-fit group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Read Full Profile</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Zodiac Wheel */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-[520px] aspect-square">
              {/* Outer static decorative ring */}
              <div className="absolute inset-0 rounded-full border border-primary/10" />
              <div className="absolute inset-[5%] rounded-full border border-primary/15" />
              
              {/* Rotating wheel container */}
              <div 
                ref={wheelRef}
                className="absolute inset-[10%] rounded-full"
              >
                {/* Inner circles */}
                <div className="absolute inset-0 rounded-full border border-primary/20" />
                <div className="absolute inset-[15%] rounded-full border border-primary/15 border-dashed" />
                <div className="absolute inset-[35%] rounded-full border border-primary/10" />
                
                {/* Division lines */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={`line-${i}`}
                    className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/15 to-primary/5 origin-left"
                    style={{ transform: `rotate(${i * 30}deg)` }}
                  />
                ))}

                {/* Center glow */}
                <div className="absolute inset-[40%] rounded-full bg-gradient-radial from-primary/10 to-transparent" />
                
                {/* Zodiac icons positioned in a proper circle */}
                {zodiacSigns.map((sign, index) => {
                  const angle = (index * 30 - 90) * (Math.PI / 180);
                  const radius = 42; // percentage from center
                  const x = 50 + Math.cos(angle) * radius;
                  const y = 50 + Math.sin(angle) * radius;
                  const isSelected = selectedSign.name === sign.name;
                  
                  return (
                    <button
                      key={sign.name}
                      onClick={() => handleSignClick(sign)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 focus:outline-none group"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                      }}
                    >
                      {/* Just the icon with glow - no card */}
                      <img 
                        src={zodiacImages[sign.name]}
                        alt={sign.name}
                        className={`
                          w-10 h-10 md:w-12 md:h-12 object-contain
                          transition-all duration-300
                          ${isSelected 
                            ? 'scale-125 filter brightness-125' 
                            : 'scale-100 filter brightness-90 group-hover:brightness-110 group-hover:scale-110'
                          }
                        `}
                        style={{
                          filter: isSelected 
                            ? 'drop-shadow(0 0 15px rgba(245, 195, 106, 0.7)) drop-shadow(0 0 30px rgba(245, 195, 106, 0.4))' 
                            : 'drop-shadow(0 0 6px rgba(245, 195, 106, 0.3))'
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Center sun icon (static) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-radial from-primary/20 to-transparent flex items-center justify-center">
                <span className="text-3xl text-primary drop-shadow-[0_0_10px_rgba(245,195,106,0.5)]">☉</span>
              </div>

              {/* Outer zodiac name labels (static) */}
              <div className="absolute inset-0 pointer-events-none">
                {zodiacSigns.map((sign, index) => {
                  const angle = index * 30 - 90;
                  const radius = 49;
                  const x = 50 + Math.cos(angle * Math.PI / 180) * radius;
                  const y = 50 + Math.sin(angle * Math.PI / 180) * radius;
                  const isSelected = selectedSign.name === sign.name;
                  
                  return (
                    <span
                      key={`label-${sign.name}`}
                      className={`
                        absolute font-display text-[10px] uppercase tracking-[0.1em]
                        transition-all duration-300
                        ${isSelected ? 'text-primary' : 'text-primary/40'}
                      `}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {sign.name}
                    </span>
                  );
                })}
              </div>

              {/* Decorative corner stars */}
              {[
                { top: '5%', left: '10%' },
                { top: '8%', right: '15%' },
                { bottom: '10%', left: '8%' },
                { bottom: '15%', right: '12%' },
              ].map((pos, i) => (
                <div 
                  key={`star-${i}`}
                  className="absolute w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse"
                  style={{ ...pos, animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZodiacWheelSection;