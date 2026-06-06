import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const FloatingPlanets = () => {
  const planetsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!planetsRef.current) return;

    const planets = planetsRef.current.querySelectorAll('.planet');

    planets.forEach((planet, index) => {
      gsap.to(planet, {
        y: `${20 + index * 5}`,
        x: `${10 + index * 3}`,
        rotation: 360,
        duration: 15 + index * 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, []);

  return (
    <div ref={planetsRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Saturn-like planet */}
      <div 
        className="planet absolute top-[15%] right-[10%] w-32 h-32 opacity-40"
        style={{
          background: 'radial-gradient(circle at 30% 30%, hsl(35, 60%, 50%), hsl(35, 40%, 25%))',
          boxShadow: '0 0 60px hsl(35, 60%, 40%, 0.4), inset -20px -20px 40px hsl(35, 60%, 15%)',
        }}
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-8 rounded-full opacity-60"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, hsl(35, 50%, 60%, 0.5) 20%, hsl(35, 50%, 60%, 0.3) 50%, hsl(35, 50%, 60%, 0.5) 80%, transparent 100%)',
            transform: 'translateX(-50%) translateY(-50%) rotateX(75deg)',
          }}
        />
      </div>

      {/* Purple nebula planet */}
      <div 
        className="planet absolute bottom-[25%] left-[5%] w-24 h-24 opacity-30"
        style={{
          background: 'radial-gradient(circle at 35% 35%, hsl(280, 70%, 60%), hsl(280, 50%, 20%))',
          boxShadow: '0 0 80px hsl(280, 70%, 50%, 0.5), inset -15px -15px 30px hsl(280, 50%, 10%)',
        }}
      />

      {/* Small blue planet */}
      <div 
        className="planet absolute top-[60%] right-[20%] w-16 h-16 opacity-35"
        style={{
          background: 'radial-gradient(circle at 30% 30%, hsl(200, 80%, 60%), hsl(220, 60%, 25%))',
          boxShadow: '0 0 40px hsl(200, 80%, 50%, 0.4), inset -10px -10px 20px hsl(220, 60%, 15%)',
        }}
      />

      {/* Mars-like planet */}
      <div 
        className="planet absolute top-[35%] left-[15%] w-20 h-20 opacity-25"
        style={{
          background: 'radial-gradient(circle at 35% 30%, hsl(15, 70%, 50%), hsl(10, 60%, 25%))',
          boxShadow: '0 0 50px hsl(15, 70%, 40%, 0.4), inset -12px -12px 25px hsl(10, 60%, 15%)',
        }}
      />

      {/* Glowing moon */}
      <div 
        className="planet absolute bottom-[40%] right-[35%] w-12 h-12 opacity-50"
        style={{
          background: 'radial-gradient(circle at 40% 35%, hsl(45, 20%, 90%), hsl(45, 10%, 60%))',
          boxShadow: '0 0 30px hsl(45, 20%, 80%, 0.6)',
        }}
      />
    </div>
  );
};

export default FloatingPlanets;
