import { motion } from 'framer-motion';

interface MountainSilhouetteProps {
  scrollProgress: number;
}

export const MountainSilhouette = ({ scrollProgress }: MountainSilhouetteProps) => {
  // Mountains appear after 60% scroll
  const mountainOpacity = scrollProgress > 0.6 ? Math.min((scrollProgress - 0.6) / 0.25, 1) : 0;
  const mountainY = (1 - mountainOpacity) * 20;

  if (mountainOpacity <= 0) return null;

  return (
    <motion.div 
      className="absolute bottom-0 left-0 right-0 pointer-events-none z-20"
      style={{ 
        opacity: mountainOpacity,
        y: `${mountainY}%`,
      }}
    >
      {/* Atmospheric glow behind mountains */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[50vh]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(17, 26, 36, 0.5) 40%, rgba(13, 17, 23, 0.9) 100%)',
        }}
      />

      {/* Mountain SVG silhouette */}
      <svg
        viewBox="0 0 1440 400"
        className="w-full h-auto relative"
        preserveAspectRatio="xMidYMax slice"
        style={{ minHeight: '250px' }}
      >
        <defs>
          {/* Mountain gradient - deep to deeper */}
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a2433" />
            <stop offset="60%" stopColor="#0f161f" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          
          <linearGradient id="mountainMidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#151c28" />
            <stop offset="100%" stopColor="#0d1219" />
          </linearGradient>
          
          <linearGradient id="mountainBackGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          
          {/* Glow effect for golden edges */}
          <filter id="mountainGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="peakGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background mountains (furthest, lighter) */}
        <path
          d="M0,300 L80,250 L180,280 L300,200 L420,260 L540,220 L660,270 L780,180 L900,240 L1020,200 L1140,260 L1260,220 L1380,270 L1440,240 L1440,400 L0,400 Z"
          fill="url(#mountainBackGradient)"
          opacity="0.6"
        />
        
        {/* Middle mountains */}
        <path
          d="M0,340 L100,290 L200,320 L340,240 L480,300 L600,260 L720,310 L840,210 L960,280 L1100,240 L1220,290 L1340,255 L1440,300 L1440,400 L0,400 Z"
          fill="url(#mountainMidGradient)"
          opacity="0.85"
        />
        
        {/* Foreground mountains (closest, darkest) */}
        <path
          d="M0,400 L60,350 L140,370 L260,290 L380,340 L480,310 L600,355 L720,270 L840,330 L960,295 L1080,345 L1180,310 L1300,350 L1380,320 L1440,360 L1440,400 L0,400 Z"
          fill="url(#mountainGradient)"
        />
        
        {/* Golden edge highlight on foreground peaks */}
        <path
          d="M0,400 L60,350 L140,370 L260,290 L380,340 L480,310 L600,355 L720,270 L840,330 L960,295 L1080,345 L1180,310 L1300,350 L1380,320 L1440,360"
          fill="none"
          stroke="#f5c36a"
          strokeWidth="1.5"
          opacity="0.5"
          filter="url(#mountainGlow)"
        />

        {/* Secondary edge highlight */}
        <path
          d="M0,340 L100,290 L200,320 L340,240 L480,300 L600,260 L720,310 L840,210 L960,280 L1100,240 L1220,290 L1340,255 L1440,300"
          fill="none"
          stroke="#f5c36a"
          strokeWidth="1"
          opacity="0.2"
        />
        
        {/* Glowing stars/lights on peaks */}
        <g filter="url(#peakGlow)">
          <circle cx="260" cy="288" r="3" fill="#f5c36a" opacity="0.9" />
          <circle cx="720" cy="268" r="4" fill="#f5c36a" opacity="1" />
          <circle cx="840" cy="208" r="3" fill="#f5c36a" opacity="0.85" />
          <circle cx="340" cy="238" r="2" fill="#f5c36a" opacity="0.7" />
          <circle cx="1100" cy="238" r="2.5" fill="#f5c36a" opacity="0.75" />
        </g>
      </svg>
      
      {/* Ground gradient overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, #0a0e14 100%)',
        }}
      />
    </motion.div>
  );
};

export default MountainSilhouette;