import { Link } from 'react-router-dom';
import { ZodiacSign } from '@/data/zodiacData';

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

interface ZodiacCardProps {
  sign: ZodiacSign;
  index: number;
  compact?: boolean;
}

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

const ZodiacCard = ({ sign, index, compact = false }: ZodiacCardProps) => {
  const zodiacImage = zodiacImages[sign.name];

  if (compact) {
    return (
      <Link 
        to={`/zodiac/${sign.name.toLowerCase()}`}
        className="glass-card-hover rounded-2xl p-4 text-center block group"
      >
        <div className="w-16 h-16 mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(245,195,106,0.5)]">
          <img 
            src={zodiacImage} 
            alt={sign.name}
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="font-display text-lg tracking-wider text-foreground mb-1 group-hover:text-primary transition-colors">
          {sign.name}
        </h3>
        <p className="text-xs text-muted-foreground">{sign.dates}</p>
      </Link>
    );
  }

  return (
    <Link 
      to={`/zodiac/${sign.name.toLowerCase()}`}
      className="group block relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Card container */}
      <div className="relative rounded-2xl bg-card border border-border overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(245,195,106,0.15)]">
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(245,195,106,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,195,106,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Zodiac image */}
        <div className="relative h-48 md:h-56 flex items-center justify-center p-6">
          <div className="w-32 h-32 md:w-40 md:h-40 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(245,195,106,0.6)]">
            <img 
              src={zodiacImage} 
              alt={sign.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Content section */}
        <div className="relative px-6 pb-6 pt-2">
          {/* Element badge */}
          <div className="absolute -top-3 right-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80 px-3 py-1 rounded-full border border-primary/30 bg-card">
              {sign.element}
            </span>
          </div>

          <h3 className="font-display text-2xl tracking-wider text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
            {sign.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{sign.dates}</p>
          
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
            {sign.description}
          </p>

          {/* Traits */}
          <div className="flex flex-wrap gap-2">
            {sign.traits.slice(0, 3).map((trait) => (
              <span 
                key={trait}
                className="text-xs px-3 py-1 rounded-full border border-primary/20 text-primary/80 bg-primary/5"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ZodiacCard;
