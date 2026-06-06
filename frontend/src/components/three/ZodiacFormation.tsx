import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const zodiacSymbols = [
  { name: 'Aries', symbol: '♈' },
  { name: 'Taurus', symbol: '♉' },
  { name: 'Gemini', symbol: '♊' },
  { name: 'Cancer', symbol: '♋' },
  { name: 'Leo', symbol: '♌' },
  { name: 'Virgo', symbol: '♍' },
  { name: 'Libra', symbol: '♎' },
  { name: 'Scorpio', symbol: '♏' },
  { name: 'Sagittarius', symbol: '♐' },
  { name: 'Capricorn', symbol: '♑' },
  { name: 'Aquarius', symbol: '♒' },
  { name: 'Pisces', symbol: '♓' },
];

interface ZodiacFormationProps {
  isVisible: boolean;
  hasAssembled: boolean;
}

export const ZodiacFormation = ({ isVisible, hasAssembled }: ZodiacFormationProps) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (hasAssembled) {
      // Start continuous rotation once assembled
      controls.start({
        rotate: 360,
        transition: {
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        },
      });
    }
  }, [hasAssembled, controls]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      
      {/* Zodiac wheel container */}
      <motion.div
        ref={wheelRef}
        animate={controls}
        className="relative w-[500px] h-[500px] md:w-[600px] md:h-[600px]"
      >
        {/* Decorative rings */}
        <div className="absolute inset-0 rounded-full border border-primary/20" />
        <div className="absolute inset-6 rounded-full border border-primary/15" />
        <div className="absolute inset-12 rounded-full border border-primary/10" />
        <div className="absolute inset-[45%] rounded-full border border-primary/30" />
        
        {/* Cross lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        
        {/* Zodiac symbols */}
        {zodiacSymbols.map((zodiac, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const radius = 42;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          
          const dropDelay = index * 0.1;
          const assembleDelay = 1.5 + index * 0.08;
          
          return (
            <motion.div
              key={zodiac.name}
              initial={{ 
                y: -200 - Math.random() * 300,
                x: (Math.random() - 0.5) * 400,
                opacity: 0,
                scale: 0.5,
              }}
              animate={hasAssembled ? {
                y: 0,
                x: 0,
                opacity: 1,
                scale: 1,
                left: `${x}%`,
                top: `${y}%`,
              } : {
                y: [
                  -200 - Math.random() * 300,
                  50 + Math.sin(Date.now() * 0.001 + index) * 20,
                ],
                opacity: 1,
                scale: 1,
              }}
              transition={{
                y: hasAssembled 
                  ? { delay: assembleDelay, duration: 0.8, type: 'spring', stiffness: 100 }
                  : { delay: dropDelay, duration: 2, ease: 'easeOut' },
                x: hasAssembled
                  ? { delay: assembleDelay, duration: 0.8, type: 'spring', stiffness: 100 }
                  : { delay: dropDelay, duration: 2, ease: 'easeOut' },
                opacity: { delay: dropDelay, duration: 0.5 },
                scale: { delay: dropDelay, duration: 0.5 },
              }}
              className="absolute w-12 h-12 md:w-14 md:h-14 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={hasAssembled ? {
                left: `${x}%`,
                top: `${y}%`,
              } : {}}
            >
              {/* Glow background */}
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-md" />
              
              {/* Symbol container */}
              <div className="relative w-full h-full rounded-full border border-primary/40 bg-card/80 backdrop-blur-sm flex items-center justify-center group">
                <span className="text-2xl md:text-3xl text-primary font-display">
                  {zodiac.symbol}
                </span>
              </div>
              
              {/* Label (counter-rotate to keep upright) */}
              <motion.span 
                animate={hasAssembled ? { rotate: -360 } : {}}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-6 text-xs text-muted-foreground font-display tracking-wider whitespace-nowrap"
              >
                {zodiac.name}
              </motion.span>
            </motion.div>
          );
        })}
        
        {/* Center compass/astrolabe decoration */}
        <div className="absolute inset-[40%] flex items-center justify-center">
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full"
          >
            {/* Compass needles */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-1/2 bg-gradient-to-t from-primary/50 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-1/2 bg-gradient-to-b from-primary/50 to-transparent" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-1/2 bg-gradient-to-l from-primary/50 to-transparent" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-1/2 bg-gradient-to-r from-primary/50 to-transparent" />
          </motion.div>
          <div className="absolute w-4 h-4 rounded-full bg-primary/50 animate-pulse" />
        </div>
      </motion.div>
      
      {/* Bottom decorative element - Mountains silhouette hint */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
};

export default ZodiacFormation;
