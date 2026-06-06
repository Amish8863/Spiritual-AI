import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Heart, Briefcase, User, Sparkles, Star } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiacData';

// Import all zodiac images
import ariesImg from '@/assets/zodiac/aries.png';
import taurusImg from '@/assets/zodiac/taurus.png';
import geminiImg from '@/assets/zodiac/gemini.png';
import cancerImg from '@/assets/zodiac/cancer.png';
import leoImg from '@/assets/zodiac/leo.png';
import virgoImg from '@/assets/zodiac/virgo.png';
import libraImg from '@/assets/zodiac/libra.png';
import scorpioImg from '@/assets/zodiac/scorpio.png';
import sagittariusImg from '@/assets/zodiac/sagittarius.png';
import capricornImg from '@/assets/zodiac/capricorn.png';
import aquariusImg from '@/assets/zodiac/aquarius.png';
import piscesImg from '@/assets/zodiac/pisces.png';

gsap.registerPlugin(ScrollTrigger);

const zodiacImages: Record<string, string> = {
  Aries: ariesImg,
  Taurus: taurusImg,
  Gemini: geminiImg,
  Cancer: cancerImg,
  Leo: leoImg,
  Virgo: virgoImg,
  Libra: libraImg,
  Scorpio: scorpioImg,
  Sagittarius: sagittariusImg,
  Capricorn: capricornImg,
  Aquarius: aquariusImg,
  Pisces: piscesImg,
};

const ZodiacDetail = () => {
  const { sign: signParam } = useParams<{ sign: string }>();
  const pageRef = useRef<HTMLDivElement>(null);

  const sign = zodiacSigns.find(s => s.name.toLowerCase() === signParam?.toLowerCase());
  const zodiacImage = sign ? zodiacImages[sign.name] : '';

  useEffect(() => {
    if (!sign) return;

    const ctx = gsap.context(() => {
      // Hero image animation
      gsap.fromTo('.hero-image', 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.2)' }
      );
      
      // Title animation
      gsap.fromTo('.hero-title', 
        { opacity: 0, x: 30 }, 
        { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
      );

      // Content sections with scroll trigger
      gsap.fromTo('.content-section',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.content-wrapper',
            start: 'top 70%',
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [sign]);

  if (!sign) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4 font-display tracking-wider">Zodiac sign not found</p>
          <Link to="/zodiac" className="btn-outline-cosmic px-6 py-3 rounded-lg">
            Back to Zodiac Signs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen relative z-10">
      {/* Full-screen Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
        {/* Background glow effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 50%, rgba(245, 195, 106, 0.15) 0%, transparent 50%)`
          }}
        />

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Large Zodiac Image */}
            <div className="hero-image relative flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                {/* Glow rings */}
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-glow" />
                <div className="absolute inset-4 rounded-full border border-primary/10" />
                
                <img 
                  src={zodiacImage} 
                  alt={sign.name}
                  className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(245,195,106,0.4)]"
                />
              </div>
            </div>

            {/* Right: Sign Info */}
            <div className="hero-title text-center lg:text-left">
              {/* Back link */}
              <Link 
                to="/zodiac" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm uppercase tracking-[0.2em]">All Signs</span>
              </Link>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-wider text-foreground mb-4">
                {sign.name}
              </h1>
              <p className="text-xl text-primary font-display tracking-wider mb-6">{sign.dates}</p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <span className="px-5 py-2 glass-card rounded-full text-sm font-display tracking-wider">
                  Element: <span className="text-primary">{sign.element}</span>
                </span>
                <span className="px-5 py-2 glass-card rounded-full text-sm font-display tracking-wider">
                  Ruler: <span className="text-primary">{sign.ruling}</span>
                </span>
              </div>

              <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                {sign.description}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="content-wrapper container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Personality Overview */}
          <div className="content-section glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg border border-primary/30 flex items-center justify-center bg-primary/5">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display text-2xl tracking-wider text-foreground">Personality</h2>
            </div>

            <div className="space-y-6">
              {/* Core Traits */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-primary mb-3">Core Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {sign.traits.map((trait) => (
                    <span key={trait} className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-display tracking-wider">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-primary mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {sign.strengths.map((strength) => (
                    <li key={strength} className="flex items-center gap-3 text-muted-foreground">
                      <Star className="w-4 h-4 text-primary flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">Challenges</h3>
                <ul className="space-y-2">
                  {sign.weaknesses.map((weakness) => (
                    <li key={weakness} className="flex items-center gap-3 text-muted-foreground">
                      <span className="w-4 h-4 flex items-center justify-center text-muted-foreground flex-shrink-0">•</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Love & Relationships */}
          <div className="content-section glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg border border-primary/30 flex items-center justify-center bg-primary/5">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display text-2xl tracking-wider text-foreground">Love & Relationships</h2>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              In relationships, {sign.name} brings {sign.traits[0].toLowerCase()} energy and 
              seeks partners who appreciate their {sign.traits[1].toLowerCase()} nature. 
              They thrive with signs that complement their {sign.element} element.
            </p>

            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Best Matches</h3>
              <div className="flex flex-wrap gap-3">
                {sign.compatibility.map((match) => {
                  const matchSign = zodiacSigns.find(s => s.name === match);
                  const matchImage = matchSign ? zodiacImages[matchSign.name] : '';
                  return (
                    <Link 
                      key={match}
                      to={`/zodiac/${match.toLowerCase()}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <img 
                        src={matchImage} 
                        alt={match}
                        className="w-6 h-6 object-contain group-hover:scale-110 transition-transform"
                      />
                      <span className="text-sm font-display tracking-wider text-foreground group-hover:text-primary transition-colors">
                        {match}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Career & Life Path */}
        <div className="content-section glass-card rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg border border-primary/30 flex items-center justify-center bg-primary/5">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl tracking-wider text-foreground">Career & Life Path</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-primary mb-3">Work Strengths</h3>
              <p className="text-muted-foreground leading-relaxed">
                {sign.name}'s natural {sign.traits[0].toLowerCase()} and {sign.traits[1].toLowerCase()} 
                qualities make them excellent in roles requiring {sign.element === 'Fire' ? 'leadership and initiative' : 
                sign.element === 'Earth' ? 'patience and practicality' : 
                sign.element === 'Air' ? 'communication and creativity' : 
                'intuition and emotional intelligence'}.
              </p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-primary mb-3">Growth Areas</h3>
              <p className="text-muted-foreground leading-relaxed">
                To reach their full potential, {sign.name} can focus on developing 
                {sign.weaknesses[0] && ` balance around their tendency toward ${sign.weaknesses[0].toLowerCase()}`},
                transforming challenges into opportunities for growth.
              </p>
            </div>
          </div>
        </div>

        {/* Compatibility Meter */}
        <div className="content-section glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg border border-primary/30 flex items-center justify-center bg-primary/5">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl tracking-wider text-foreground">Element Compatibility</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Fire', 'Earth', 'Air', 'Water'].map((element) => {
              const isMatch = 
                (sign.element === element) ||
                (sign.element === 'Fire' && element === 'Air') ||
                (sign.element === 'Air' && element === 'Fire') ||
                (sign.element === 'Earth' && element === 'Water') ||
                (sign.element === 'Water' && element === 'Earth');
              
              const compatibility = 
                sign.element === element ? 85 :
                isMatch ? 75 :
                45;

              return (
                <div key={element} className="p-4 rounded-xl bg-card/50 border border-border">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-display tracking-wider text-foreground">{element}</span>
                    <span className="text-sm text-primary">{compatibility}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${compatibility}%`,
                        background: `linear-gradient(90deg, hsl(var(--gold)) 0%, hsl(var(--gold-dim)) 100%)`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link 
            to="/compatibility" 
            className="btn-cosmic btn-pulse px-8 py-4 rounded-lg inline-flex items-center gap-3"
          >
            Check Full Compatibility
            <Heart className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ZodiacDetail;
