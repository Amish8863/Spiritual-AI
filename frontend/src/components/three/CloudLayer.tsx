import { motion } from 'framer-motion';

interface CloudLayerProps {
  scrollProgress: number;
}

export const CloudLayer = ({ scrollProgress }: CloudLayerProps) => {
  // Clouds appear between 35% and 75% scroll
  const cloudOpacity = scrollProgress > 0.35 && scrollProgress < 0.75 
    ? Math.sin((scrollProgress - 0.35) / 0.4 * Math.PI) * 1
    : 0;

  const cloudY = (1 - scrollProgress) * 60;

  if (cloudOpacity <= 0) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
      style={{ opacity: cloudOpacity }}
    >
      {/* Cloud layers with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: `${cloudY * 0.5}%` }}
      >
        {/* Large atmospheric wisps */}
        <div 
          className="absolute top-[15%] left-0 w-full h-80"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(180, 190, 210, 0.25) 30%, rgba(180, 190, 210, 0.35) 50%, rgba(180, 190, 210, 0.25) 70%, transparent 100%)',
            filter: 'blur(40px)',
          }}
        />
        <div 
          className="absolute top-[30%] left-[10%] w-[70%] h-64 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(200, 210, 230, 0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        <div 
          className="absolute top-[45%] right-0 w-[80%] h-72"
          style={{
            background: 'linear-gradient(270deg, rgba(160, 175, 200, 0.35) 0%, rgba(160, 175, 200, 0.2) 40%, transparent 100%)',
            filter: 'blur(50px)',
          }}
        />
      </motion.div>
      
      <motion.div 
        className="absolute inset-0"
        style={{ y: `${cloudY * 0.3}%` }}
      >
        <div 
          className="absolute top-[25%] left-[25%] w-[40%] h-52 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(220, 225, 240, 0.25) 0%, transparent 60%)',
            filter: 'blur(25px)',
          }}
        />
        <div 
          className="absolute top-[40%] right-[15%] w-[30%] h-44 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(200, 210, 235, 0.3) 0%, transparent 65%)',
            filter: 'blur(20px)',
          }}
        />
      </motion.div>
      
      {/* Dense fog band */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: `${cloudY * 0.2}%` }}
      >
        <div 
          className="absolute top-[35%] left-0 w-full h-96"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(150, 170, 200, 0.15) 30%, rgba(150, 170, 200, 0.25) 50%, rgba(150, 170, 200, 0.15) 70%, transparent 100%)',
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      {/* Subtle golden tint from atmosphere */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'radial-gradient(ellipse at center 60%, rgba(245, 195, 106, 0.05) 0%, transparent 50%)',
          opacity: cloudOpacity * 0.5,
        }}
      />
    </div>
  );
};

export default CloudLayer;