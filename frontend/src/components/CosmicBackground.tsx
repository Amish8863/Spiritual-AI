import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  hue: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  hue: number;
  opacity: number;
}

const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      // Only render viewport-sized canvas, not full scroll height
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initNebulae();
    };

    const initStars = () => {
      const starCount = Math.min(800, Math.floor((canvas.width * canvas.height) / 6000));
      starsRef.current = [];
      
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          hue: Math.random() > 0.7 ? 40 : (Math.random() > 0.5 ? 200 : 0), // Gold, blue, or white
        });
      }
    };

    const initNebulae = () => {
      nebulaeRef.current = [];
      const nebulaCount = 8;
      
      for (let i = 0; i < nebulaCount; i++) {
        nebulaeRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 400 + 200,
          hue: Math.random() > 0.5 ? 40 : 280, // Gold or subtle purple
          opacity: Math.random() * 0.04 + 0.02,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Deep cosmic gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#050810');
      gradient.addColorStop(0.3, '#0a0d14');
      gradient.addColorStop(0.6, '#080c12');
      gradient.addColorStop(1, '#040608');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw nebulae (subtle cosmic clouds)
      nebulaeRef.current.forEach((nebula) => {
        const parallaxY = scrollRef.current * 0.1;
        const nebulaGradient = ctx.createRadialGradient(
          nebula.x, nebula.y - parallaxY, 0,
          nebula.x, nebula.y - parallaxY, nebula.radius
        );
        
        if (nebula.hue === 40) {
          // Golden nebula
          nebulaGradient.addColorStop(0, `hsla(40, 70%, 50%, ${nebula.opacity})`);
          nebulaGradient.addColorStop(0.5, `hsla(35, 60%, 40%, ${nebula.opacity * 0.5})`);
          nebulaGradient.addColorStop(1, 'transparent');
        } else {
          // Subtle blue/purple nebula
          nebulaGradient.addColorStop(0, `hsla(220, 50%, 30%, ${nebula.opacity})`);
          nebulaGradient.addColorStop(0.5, `hsla(240, 40%, 20%, ${nebula.opacity * 0.3})`);
          nebulaGradient.addColorStop(1, 'transparent');
        }
        
        ctx.fillStyle = nebulaGradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y - parallaxY, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw twinkling stars
      const time = Date.now() * 0.001;
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 10 + star.x) * 0.4 + 0.6;
        const opacity = star.opacity * twinkle;
        
        // Parallax effect
        const parallaxX = (mouseRef.current.x - canvas.width / 2) * 0.02 * star.size;
        const parallaxY = (mouseRef.current.y - canvas.height / 2) * 0.02 * star.size;
        const scrollParallax = scrollRef.current * (star.size * 0.05);
        
        const x = star.x + parallaxX;
        const y = star.y + parallaxY - scrollParallax;
        
        // Create glow for larger stars
        if (star.size > 1.2) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, star.size * 4);
          const hueStr = star.hue === 0 ? '0, 0%' : `${star.hue}, 70%`;
          glow.addColorStop(0, `hsla(${hueStr}, 90%, ${opacity})`);
          glow.addColorStop(0.3, `hsla(${hueStr}, 70%, ${opacity * 0.4})`);
          glow.addColorStop(1, 'transparent');
          
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Star core
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        const coreHue = star.hue === 0 ? '40, 20%' : `${star.hue}, 60%`;
        ctx.fillStyle = `hsla(${coreHue}, 95%, ${opacity})`;
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    const handleResize = () => {
      resizeCanvas();
    };

    resizeCanvas();
    animate();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
};

export default CosmicBackground;
