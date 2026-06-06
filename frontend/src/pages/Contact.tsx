import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Send, Mail, MapPin, Phone, Check } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.contact-form', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.3 });
      gsap.fromTo('.contact-info', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.3 });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@celestial.com' },
    { icon: MapPin, label: 'Location', value: 'Written in the Stars' },
    { icon: Phone, label: 'Phone', value: '+1 (555) STARS' },
  ];

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="page-title font-display text-4xl md:text-5xl lg:text-6xl text-glow text-primary mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about the cosmos? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <div className="contact-form glass-card rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-xl text-foreground mb-6">Send a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">We'll get back to you as soon as the stars align.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full input-cosmic px-4 py-3 rounded-lg text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full input-cosmic px-4 py-3 rounded-lg text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full input-cosmic px-4 py-3 rounded-lg text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full input-cosmic px-4 py-3 rounded-lg text-foreground resize-none"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-cosmic py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="animate-spin">✦</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="contact-info space-y-6">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="font-display text-xl text-foreground mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-display text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-lg text-foreground mb-4">Office Hours</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <p>Monday - Friday: 9am - 6pm PST</p>
                <p>Saturday: 10am - 4pm PST</p>
                <p>Sunday: Closed (Communing with the cosmos)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
