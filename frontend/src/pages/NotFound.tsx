import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Home, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.not-found-symbol', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)' });
      gsap.fromTo('.not-found-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.6, delay: 0.5 });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="not-found-symbol text-8xl md:text-9xl mb-6 text-glow">
          <Sparkles className="w-24 h-24 md:w-32 md:h-32 text-primary mx-auto" />
        </div>
        <h1 className="not-found-text font-display text-5xl md:text-7xl text-foreground mb-4">404</h1>
        <p className="not-found-text text-xl md:text-2xl text-muted-foreground mb-2">
          Lost in the Cosmos
        </p>
        <p className="not-found-text text-muted-foreground mb-8 max-w-md mx-auto">
          The stars have aligned, but this page has drifted beyond our celestial reach.
        </p>
        <Link to="/" className="not-found-text btn-cosmic px-8 py-4 rounded-lg inline-flex items-center gap-2">
          <Home className="w-4 h-4" />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
