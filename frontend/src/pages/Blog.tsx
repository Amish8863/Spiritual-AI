import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Your Moon Sign: The Hidden Self',
    excerpt: 'While your sun sign represents your core identity, your moon sign reveals your emotional landscape and innermost needs...',
    category: 'Beginner Astrology',
    date: '2024-01-15',
    image: '🌙',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Mercury Retrograde Survival Guide 2024',
    excerpt: 'Mercury retrograde can disrupt communication and technology, but with the right preparation, you can navigate it smoothly...',
    category: 'Celestial Events',
    date: '2024-01-12',
    image: '☿',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'The 12 Houses: Your Cosmic Map Explained',
    excerpt: 'Each house in your birth chart represents a different area of life. Understanding them unlocks deeper self-knowledge...',
    category: 'Beginner Astrology',
    date: '2024-01-10',
    image: '🏠',
    readTime: '10 min read',
  },
  {
    id: 4,
    title: 'Venus in Capricorn: Love Gets Serious',
    excerpt: 'When Venus transits through Capricorn, relationships take on a more committed and practical tone...',
    category: 'Planetary Transits',
    date: '2024-01-08',
    image: '♀',
    readTime: '4 min read',
  },
  {
    id: 5,
    title: 'Full Moon Rituals for Each Zodiac Sign',
    excerpt: 'Harness the powerful energy of the full moon with rituals tailored to your unique astrological makeup...',
    category: 'Rituals & Practices',
    date: '2024-01-05',
    image: '🌕',
    readTime: '8 min read',
  },
  {
    id: 6,
    title: 'Saturn Return: Your Cosmic Coming of Age',
    excerpt: 'Around ages 28-30, Saturn returns to its natal position, marking a pivotal time of growth and responsibility...',
    category: 'Life Cycles',
    date: '2024-01-02',
    image: '♄',
    readTime: '6 min read',
  },
];

const categories = ['All', 'Beginner Astrology', 'Celestial Events', 'Planetary Transits', 'Rituals & Practices', 'Life Cycles'];

const Blog = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      
      gsap.fromTo('.blog-card', 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.blog-grid',
            start: 'top 85%',
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="page-title font-display text-4xl md:text-5xl lg:text-6xl text-glow text-primary mb-4">
            Celestial Blog
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the wisdom of the stars through our curated articles and guides
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                category === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card hover:border-primary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="blog-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card glass-card-hover rounded-2xl overflow-hidden group">
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-cosmic-purple/50 to-cosmic-blue/50 flex items-center justify-center">
                <span className="text-6xl">{post.image}</span>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                
                <h2 className="font-display text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="text-primary text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
