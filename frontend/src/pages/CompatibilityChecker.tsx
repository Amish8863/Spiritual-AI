import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Heart, Zap, AlertCircle, ChevronDown } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiacData';

const compatibilityData: Record<string, Record<string, { score: number; pros: string[]; cons: string[]; funFact: string }>> = {
  aries: {
    leo: { score: 95, pros: ['Passionate connection', 'Mutual admiration', 'Adventure partners'], cons: ['Power struggles', 'Ego clashes'], funFact: 'This fire duo could light up any room!' },
    sagittarius: { score: 90, pros: ['Shared enthusiasm', 'Freedom-loving', 'Intellectual match'], cons: ['Impulsive decisions', 'Commitment issues'], funFact: 'Together, they could conquer the world!' },
    gemini: { score: 85, pros: ['Dynamic energy', 'Fun conversations', 'Never boring'], cons: ['Inconsistency', 'Short attention spans'], funFact: 'Their dates are always unpredictable adventures!' },
    aquarius: { score: 80, pros: ['Innovative ideas', 'Independent natures', 'Mental stimulation'], cons: ['Emotional detachment', 'Stubbornness'], funFact: 'They bond over revolutionizing the world!' },
    cancer: { score: 45, pros: ['Protective instincts', 'Passion'], cons: ['Different emotional needs', 'Sensitivity clashes'], funFact: 'Fire meets water - lots of steam!' },
    capricorn: { score: 50, pros: ['Ambition match', 'Determination'], cons: ['Different approaches', 'Power struggles'], funFact: 'Opposites on the wheel, magnets in life!' },
  },
};

const getCompatibility = (sign1: string, sign2: string) => {
  const s1 = sign1.toLowerCase();
  const s2 = sign2.toLowerCase();
  
  if (compatibilityData[s1]?.[s2]) return compatibilityData[s1][s2];
  if (compatibilityData[s2]?.[s1]) return compatibilityData[s2][s1];
  
  // Generate dynamic compatibility for pairs not in data
  const sign1Data = zodiacSigns.find(s => s.name.toLowerCase() === s1);
  const sign2Data = zodiacSigns.find(s => s.name.toLowerCase() === s2);
  
  if (!sign1Data || !sign2Data) return null;

  const sameElement = sign1Data.element === sign2Data.element;
  const compatibleElements = {
    Fire: ['Air'],
    Earth: ['Water'],
    Air: ['Fire'],
    Water: ['Earth'],
  };
  const elementCompatible = compatibleElements[sign1Data.element]?.includes(sign2Data.element);
  
  let baseScore = 60;
  if (sameElement) baseScore = 85;
  else if (elementCompatible) baseScore = 75;
  else baseScore = Math.floor(Math.random() * 20) + 50;

  return {
    score: baseScore,
    pros: ['Unique dynamic', 'Growth opportunities', 'Different perspectives'],
    cons: ['May need compromise', 'Different communication styles'],
    funFact: `${sign1Data.element} meets ${sign2Data.element} - an interesting cosmic combination!`,
  };
};

const CompatibilityChecker = () => {
  const [sign1, setSign1] = useState<string | null>(null);
  const [sign2, setSign2] = useState<string | null>(null);
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof getCompatibility>>(null);
  const [showResult, setShowResult] = useState(false);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo('.page-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo('.form-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 });
  }, []);

  useEffect(() => {
    if (showResult && resultRef.current) {
      gsap.fromTo(resultRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.3)' });
      gsap.fromTo('.progress-bar-fill', { width: '0%' }, { width: `${result?.score || 0}%`, duration: 1.5, ease: 'power3.out', delay: 0.3 });
    }
  }, [showResult, result?.score]);

  const handleCheck = () => {
    if (sign1 && sign2) {
      const compatibility = getCompatibility(sign1, sign2);
      setResult(compatibility);
      setShowResult(true);
    }
  };

  const selectedSign1 = zodiacSigns.find(s => s.name.toLowerCase() === sign1);
  const selectedSign2 = zodiacSigns.find(s => s.name.toLowerCase() === sign2);

  const SignDropdown = ({ 
    value, 
    onChange, 
    isOpen, 
    setIsOpen, 
    label 
  }: { 
    value: string | null; 
    onChange: (v: string) => void; 
    isOpen: boolean; 
    setIsOpen: (v: boolean) => void;
    label: string;
  }) => {
    const selected = zodiacSigns.find(s => s.name.toLowerCase() === value);
    
    return (
      <div className="relative flex-1">
        <label className="text-sm text-muted-foreground mb-2 block">{label}</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full glass-card p-4 rounded-xl flex items-center justify-between text-left"
        >
          {selected ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selected.symbol}</span>
              <span className="font-display text-foreground">{selected.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select sign...</span>
          )}
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-20 max-h-60 overflow-y-auto">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.name}
                onClick={() => {
                  onChange(sign.name.toLowerCase());
                  setIsOpen(false);
                }}
                className="w-full p-3 flex items-center gap-3 hover:bg-primary/10 transition-colors"
              >
                <span className="text-xl">{sign.symbol}</span>
                <span className="font-display text-sm text-foreground">{sign.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="page-title font-display text-4xl md:text-5xl lg:text-6xl text-glow text-primary mb-4">
            Compatibility Checker
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the cosmic chemistry between two zodiac signs
          </p>
        </div>

        {/* Form */}
        <div className="form-container max-w-2xl mx-auto mb-12">
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <SignDropdown 
                value={sign1} 
                onChange={setSign1} 
                isOpen={dropdown1Open} 
                setIsOpen={(v) => { setDropdown1Open(v); setDropdown2Open(false); }}
                label="First Sign"
              />
              
              <div className="flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary animate-pulse" />
              </div>
              
              <SignDropdown 
                value={sign2} 
                onChange={setSign2} 
                isOpen={dropdown2Open} 
                setIsOpen={(v) => { setDropdown2Open(v); setDropdown1Open(false); }}
                label="Second Sign"
              />
            </div>
            
            <button
              onClick={handleCheck}
              disabled={!sign1 || !sign2}
              className="w-full btn-cosmic py-4 rounded-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Compatibility
            </button>
          </div>
        </div>

        {/* Results */}
        {showResult && result && selectedSign1 && selectedSign2 && (
          <div ref={resultRef} className="max-w-3xl mx-auto">
            <div className="glass-card rounded-3xl p-8 md:p-10">
              {/* Signs Header */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-5xl mb-2" style={{ textShadow: `0 0 30px ${selectedSign1.color}` }}>
                    {selectedSign1.symbol}
                  </div>
                  <span className="font-display text-foreground">{selectedSign1.name}</span>
                </div>
                <Heart className="w-10 h-10 text-primary" />
                <div className="text-center">
                  <div className="text-5xl mb-2" style={{ textShadow: `0 0 30px ${selectedSign2.color}` }}>
                    {selectedSign2.symbol}
                  </div>
                  <span className="font-display text-foreground">{selectedSign2.name}</span>
                </div>
              </div>

              {/* Score */}
              <div className="text-center mb-8">
                <div className="font-display text-6xl text-primary text-glow mb-2">{result.score}%</div>
                <p className="text-muted-foreground">Compatibility Score</p>
              </div>

              {/* Progress Bar */}
              <div className="h-4 bg-muted rounded-full overflow-hidden mb-8">
                <div 
                  className="progress-bar-fill h-full progress-cosmic rounded-full"
                  style={{ width: '0%' }}
                />
              </div>

              {/* Pros & Cons */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="glass-card rounded-xl p-5">
                  <h3 className="font-display text-lg text-emerald-400 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    What Works
                  </h3>
                  <ul className="space-y-2">
                    {result.pros.map((pro, i) => (
                      <li key={i} className="text-muted-foreground text-sm flex items-center gap-2">
                        <span className="text-emerald-400">✓</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="glass-card rounded-xl p-5">
                  <h3 className="font-display text-lg text-amber-400 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Challenges
                  </h3>
                  <ul className="space-y-2">
                    {result.cons.map((con, i) => (
                      <li key={i} className="text-muted-foreground text-sm flex items-center gap-2">
                        <span className="text-amber-400">!</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="text-center p-4 bg-primary/10 rounded-xl">
                <p className="text-primary italic">✨ {result.funFact}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompatibilityChecker;
