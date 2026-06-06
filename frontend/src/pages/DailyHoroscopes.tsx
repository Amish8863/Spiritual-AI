import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Heart, Briefcase, Activity, Sparkles, Loader } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiacData';
import { useAIDailyHoroscope } from '@/hooks/useInterpretation';

gsap.registerPlugin(ScrollTrigger);

const DailyHoroscopes = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  
  const { data: horoscopeData, loading, fetch } = useAIDailyHoroscope(selectedSign || '');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.zodiac-selector',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (selectedSign && readingRef.current) {
      gsap.fromTo(
        readingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [selectedSign]);

  useEffect(() => {
    if (selectedSign) {
      fetch();
    }
  }, [selectedSign, fetch]);

  const selectedZodiac = zodiacSigns.find(s => s.name.toLowerCase() === selectedSign);

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="page-title font-display text-4xl md:text-5xl lg:text-6xl text-glow text-primary mb-4">
            Daily Horoscopes
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your zodiac sign to receive your personalized celestial guidance for today
          </p>
        </div>

        {/* Zodiac Selector */}
        <div className="zodiac-selector max-w-md mx-auto mb-12">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full glass-card p-4 rounded-xl flex items-center justify-between text-left"
            >
              {selectedZodiac ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl" style={{ textShadow: `0 0 20px ${selectedZodiac.color}` }}>
                    {selectedZodiac.symbol}
                  </span>
                  <div>
                    <div className="font-display text-foreground">{selectedZodiac.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedZodiac.dates}</div>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">Choose your zodiac sign...</span>
              )}
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-20 max-h-80 overflow-y-auto">
                {zodiacSigns.map((sign) => (
                  <button
                    key={sign.name}
                    onClick={() => {
                      setSelectedSign(sign.name.toLowerCase());
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full p-3 flex items-center gap-3 hover:bg-primary/10 transition-colors ${
                      selectedSign === sign.name.toLowerCase() ? 'bg-primary/10' : ''
                    }`}
                  >
                    <span className="text-2xl">{sign.symbol}</span>
                    <div className="text-left">
                      <div className="font-display text-sm text-foreground">{sign.name}</div>
                      <div className="text-xs text-muted-foreground">{sign.dates}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Horoscope Reading */}
        {selectedSign && selectedZodiac && (
          <div ref={readingRef} className="max-w-4xl mx-auto">
            {/* Sign Header */}
            <div className="text-center mb-10">
              <div 
                className="text-7xl mb-4"
                style={{ textShadow: `0 0 40px ${selectedZodiac.color}` }}
              >
                {selectedZodiac.symbol}
              </div>
              <h2 className="font-display text-3xl text-foreground mb-2">{selectedZodiac.name}</h2>
              <p className="text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Generating your personalized horoscope from the cosmos...</p>
              </div>
            )}

            {/* Real ChatGPT Horoscope */}
            {!loading && horoscopeData && (
              <div className="glass-card rounded-2xl p-8">
                <div className="prose prose-invert max-w-none">
                  <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {horoscopeData.horoscope}
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loading && !horoscopeData && (
              <div className="text-center py-12">
                <p className="text-red-400">Failed to generate horoscope. Please try again.</p>
              </div>
            )}
          </div>
        )}

        {/* Prompt to select */}
        {!selectedSign && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-30">✨</div>
            <p className="text-muted-foreground">Select your zodiac sign above to reveal today's cosmic guidance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyHoroscopes;
