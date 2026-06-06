import { useState } from 'react';
import { Send, Check } from 'lucide-react';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="input-cosmic flex-1 px-4 py-3 rounded-lg text-foreground placeholder:text-muted-foreground"
        required
      />
      <button
        type="submit"
        disabled={isLoading || isSubmitted}
        className="btn-cosmic px-6 py-3 rounded-lg inline-flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isSubmitted ? (
          <>
            <Check className="w-4 h-4" />
            Subscribed!
          </>
        ) : isLoading ? (
          <span className="animate-spin">✦</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Subscribe
          </>
        )}
      </button>
    </form>
  );
};

export default NewsletterForm;
