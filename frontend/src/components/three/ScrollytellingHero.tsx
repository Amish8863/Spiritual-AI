import { useState, useEffect, useRef, Suspense, memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import SolarSystem from "./SolarSystem";

// Memoized loader to prevent re-renders
const SceneLoader = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-black">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span className="text-sm text-muted-foreground font-display tracking-wider">Loading cosmos...</span>
    </div>
  </div>
));

SceneLoader.displayName = "SceneLoader";

export const ScrollytellingHero = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop < window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 3D Solar System Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<SceneLoader />}>
          <SolarSystem scrollProgress={0} />
        </Suspense>
      </div>

      {/* Hero content overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6">
              <span className="text-primary text-glow">Journey Through</span>
              <br />
              <span className="text-foreground">The Cosmos</span>
            </h1>

            <p className="font-body text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 tracking-wide">
              From stardust to destiny — discover the ancient wisdom of the zodiac
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/zodiac" className="btn-cosmic btn-pulse px-8 py-4 rounded-lg inline-flex items-center gap-3">
                Explore Your Sign
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/horoscopes" className="btn-outline-cosmic px-8 py-4 rounded-lg">
                Daily Horoscope
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground font-display tracking-widest uppercase">
            Scroll to Explore
          </span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="w-6 h-6 text-primary" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScrollytellingHero;
