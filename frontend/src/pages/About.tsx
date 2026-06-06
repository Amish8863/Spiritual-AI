import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, Star, Moon, Heart } from 'lucide-react';

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.about-section', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.6, delay: 0.3 });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const values = [
    { icon: Star, title: 'Ancient Wisdom', description: 'We honor the millennia-old traditions of astrology while embracing modern interpretations.' },
    { icon: Moon, title: 'Personal Growth', description: 'Astrology is a tool for self-discovery and understanding, not prediction.' },
    { icon: Heart, title: 'Compassion', description: 'We believe in using cosmic insights to foster empathy and connection.' },
    { icon: Sparkles, title: 'Accessibility', description: 'Making the wisdom of the stars available to everyone, everywhere.' },
  ];

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="page-title font-display text-4xl md:text-5xl lg:text-6xl text-glow text-primary mb-4">
            About Celestial
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your guide to the mysteries of the cosmos
          </p>
        </div>

        {/* Mission */}
        <div className="about-section glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto mb-12 text-center">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            At Celestial, we believe that the stars hold profound wisdom for those who seek to understand. 
            Our mission is to make astrology accessible, meaningful, and practical for modern life. 
            Whether you're a curious beginner or a seasoned star-gazer, we're here to illuminate your cosmic journey.
          </p>
        </div>

        {/* Values */}
        <div className="about-section mb-12">
          <h2 className="font-display text-2xl text-primary text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="glass-card rounded-2xl p-6 text-center">
                <value.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-display text-lg text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story */}
        <div className="about-section glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-primary text-center mb-6">Our Story</h2>
          <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
            <p>
              Celestial was born from a fascination with the night sky and a desire to share its wisdom. 
              What started as a personal exploration of astrology grew into a mission to create the most 
              beautiful and insightful astrology platform on the web.
            </p>
            <p>
              We combine ancient astrological traditions with modern technology to bring you personalized 
              horoscopes, detailed birth charts, and cosmic insights that resonate with your unique journey. 
              Our team of astrologers and developers work together to ensure that every reading, every chart, 
              and every word you find here is crafted with care and expertise.
            </p>
            <p>
              Join us on this celestial journey, and discover what the stars have written for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
