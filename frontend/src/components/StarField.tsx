import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

interface ConstellationLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const constellationLinesRef = useRef<ConstellationLine[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initConstellations();
    };

    const initStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 8000);
      starsRef.current = [];
      
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    const initConstellations = () => {
      constellationLinesRef.current = [];
      const lineCount = Math.floor((canvas.width * canvas.height) / 100000);
      
      for (let i = 0; i < lineCount; i++) {
        const x1 = Math.random() * canvas.width;
        const y1 = Math.random() * canvas.height;
        const angle = Math.random() * Math.PI * 2;
        const length = Math.random() * 100 + 50;
        
        constellationLinesRef.current.push({
          x1,
          y1,
          x2: x1 + Math.cos(angle) * length,
          y2: y1 + Math.sin(angle) * length,
          opacity: Math.random() * 0.15 + 0.05,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw constellation lines
      constellationLinesRef.current.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(245, 195, 106, ${line.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 8]);
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
        ctx.setLineDash([]);
      });
      
      // Draw stars with twinkling
      const time = Date.now() * 0.001;
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 10) * 0.3 + 0.7;
        const opacity = star.opacity * twinkle;
        
        // Parallax effect based on mouse position
        const parallaxX = (mouseRef.current.x - canvas.width / 2) * 0.01 * star.size;
        const parallaxY = (mouseRef.current.y - canvas.height / 2) * 0.01 * star.size;
        
        ctx.beginPath();
        ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2);
        
        // Create glow effect for larger stars
        if (star.size > 1) {
          const gradient = ctx.createRadialGradient(
            star.x + parallaxX, star.y + parallaxY, 0,
            star.x + parallaxX, star.y + parallaxY, star.size * 3
          );
          gradient.addColorStop(0, `rgba(245, 195, 106, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(245, 195, 106, ${opacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(245, 195, 106, 0)');
          ctx.fillStyle = gradient;
          ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size * 3, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = `rgba(250, 245, 235, ${opacity})`;
        }
        
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resizeCanvas();
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.8 }}
        aria-hidden="true"
      />
      {/* Grain overlay */}
      <div className="grain-overlay" />
    </>
  );
};

export default StarField;
