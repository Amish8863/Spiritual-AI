import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MapPin, Clock, Calendar, Loader, Send, X } from 'lucide-react';
import { useInterpretBirthChart } from '@/hooks/useInterpretation';
import { useChartChat } from '@/hooks/useChartChat';

const BirthChart = () => {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chartGenerated, setChartGenerated] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  const { data: interpretation, loading: interpretLoading, interpret } = useInterpretBirthChart();
  const { messages, loading: chatLoading, sendMessage, clearChat } = useChartChat();
  const pageRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo('.page-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo('.form-section', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 });
  }, []);

  useEffect(() => {
    if (chartGenerated && chartRef.current) {
      gsap.fromTo(chartRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    }
  }, [chartGenerated]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch location suggestions from OpenStreetMap Nominatim API
  const handleLocationChange = async (value: string) => {
    setFormData({ ...formData, birthPlace: value });
    
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&addressdetails=1`
        );
        const data = await response.json();
        const suggestions = data.map((item: any) => {
          const address = item.address;
          // Get city/town, state/province, and country
          const city = address.city || address.town || address.village || address.county || '';
          const state = address.state || '';
          const country = address.country || '';
          
          const parts = [];
          if (city) parts.push(city);
          if (state) parts.push(state);
          if (country) parts.push(country);
          
          return parts.filter(p => p).join(', ');
        }).filter(s => s); // Remove empty suggestions
        
        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Convert 24-hour time to 12-hour format
  const formatTime12Hour = (time24: string): string => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Calculate sun sign from birth date
  const calculateSunSign = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const signs = [
      { name: 'Capricorn', start: [12, 22], end: [1, 19] },
      { name: 'Aquarius', start: [1, 20], end: [2, 18] },
      { name: 'Pisces', start: [2, 19], end: [3, 20] },
      { name: 'Aries', start: [3, 21], end: [4, 19] },
      { name: 'Taurus', start: [4, 20], end: [5, 20] },
      { name: 'Gemini', start: [5, 21], end: [6, 20] },
      { name: 'Cancer', start: [6, 21], end: [7, 22] },
      { name: 'Leo', start: [7, 23], end: [8, 22] },
      { name: 'Virgo', start: [8, 23], end: [9, 22] },
      { name: 'Libra', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
    ];

    for (const sign of signs) {
      if (
        (month === sign.start[0] && day >= sign.start[1]) ||
        (month === sign.end[0] && day <= sign.end[1])
      ) {
        return sign.name;
      }
    }
    return 'Capricorn';
  };

  const generateChart = async () => {
    if (!formData.birthDate) return;

    const sunSign = calculateSunSign(formData.birthDate);
    const date = new Date(formData.birthDate);
    const moonIndex = (date.getMonth() + date.getDate()) % 12;
    const risingIndex = formData.birthTime 
      ? (parseInt(formData.birthTime.split(':')[0]) + date.getDate()) % 12 
      : (date.getDate() + 3) % 12;

    const zodiacNames = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    const birthData = {
      sign: sunSign,
      moon: zodiacNames[moonIndex],
      rising: zodiacNames[risingIndex],
      birthDate: formData.birthDate,
      birthTime: formData.birthTime ? formatTime12Hour(formData.birthTime) : 'Not provided',
      birthPlace: formData.birthPlace || 'Not provided',
    };

    setChartData(birthData);
    setChartGenerated(true);

    // Get ChatGPT interpretation
    await interpret(birthData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateChart();
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chartData) return;

    const message = chatInput;
    setChatInput('');
    
    try {
      await sendMessage(message, chartData);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="page-title font-display text-4xl md:text-5xl lg:text-6xl text-glow text-primary mb-4">
            Birth Chart
          </h1>
          <p className="text-muted-foreground">
            Enter your birth details to get your personalized astrological interpretation
          </p>
        </div>

        {/* Form */}
        {!chartGenerated && (
          <div className="form-section glass-card rounded-2xl p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Birth Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  Birth Date
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-primary/20 text-foreground focus:outline-none focus:border-primary/50 transition"
                  required
                />
              </div>

              {/* Birth Time */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <Clock className="w-4 h-4 text-primary" />
                  Birth Time (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-lg bg-muted/50 border border-primary/20 text-foreground focus:outline-none focus:border-primary/50 transition"
                  />
                  {formData.birthTime && (
                    <div className="px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 text-foreground font-medium flex items-center">
                      {formatTime12Hour(formData.birthTime)}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.birthTime ? `Selected: ${formatTime12Hour(formData.birthTime)}` : 'Leave blank if unknown'}
                </p>
              </div>

              {/* Birth Place */}
              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  Birth Place (Optional)
                </label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() => formData.birthPlace && setShowSuggestions(true)}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition"
                />
                
                {/* Location Suggestions */}
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-muted/90 border border-primary/20 rounded-lg overflow-hidden z-10">
                    {locationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, birthPlace: suggestion });
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-primary/10 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-cosmic py-3 rounded-lg font-medium transition hover:shadow-lg"
              >
                Generate Chart
              </button>
            </form>
          </div>
        )}

        {/* Results */}
        {chartGenerated && chartData && (
          <div ref={chartRef} className="space-y-8">
            {/* Birth Details Summary */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="font-display text-2xl text-primary mb-6">Your Birth Details</h2>
              <div className="space-y-4 text-foreground">
                <div className="flex justify-between items-center pb-3 border-b border-primary/10">
                  <span className="text-muted-foreground">Birth Date:</span>
                  <span className="font-medium">{new Date(chartData.birthDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-primary/10">
                  <span className="text-muted-foreground">Birth Time:</span>
                  <span className="font-medium">{chartData.birthTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Birth Place:</span>
                  <span className="font-medium">{chartData.birthPlace}</span>
                </div>
              </div>
            </div>

            {/* Big Three */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="font-display text-2xl text-primary mb-6">Your Big Three</h2>
              <div className="space-y-4">
                <div className="pb-4 border-b border-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Sun Sign (Your Core Identity)</p>
                  <p className="text-xl font-medium text-foreground">{chartData.sign}</p>
                </div>
                <div className="pb-4 border-b border-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Moon Sign (Your Emotions)</p>
                  <p className="text-xl font-medium text-foreground">{chartData.moon}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rising Sign (How Others See You)</p>
                  <p className="text-xl font-medium text-foreground">{chartData.rising}</p>
                </div>
              </div>
            </div>

            {/* ChatGPT Interpretation */}
            {interpretLoading && (
              <div className="glass-card rounded-2xl p-8 text-center">
                <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Generating your personalized interpretation...</p>
              </div>
            )}

            {!interpretLoading && interpretation && (
              <div className="glass-card rounded-2xl p-8">
                <h2 className="font-display text-2xl text-primary mb-6">Your Interpretation</h2>
                <div className="space-y-6 text-foreground leading-relaxed">
                  <div>
                    <h3 className="font-medium text-primary mb-2">Summary</h3>
                    <p className="text-muted-foreground">{interpretation.summary}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-2">Personality</h3>
                    <p className="text-muted-foreground">{interpretation.personality}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-2">Strengths</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {interpretation.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-2">Challenges</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {interpretation.challenges.map((challenge: string, index: number) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-2">Compatibility</h3>
                    <p className="text-muted-foreground">{interpretation.compatibility}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-2">Career Guidance</h3>
                    <p className="text-muted-foreground">{interpretation.careerGuidance}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary mb-2">Life Advice</h3>
                    <p className="text-muted-foreground">{interpretation.lifeAdvice}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Section */}
            {!interpretLoading && interpretation && (
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-primary">Ask About Your Chart</h2>
                  {messages.length > 0 && (
                    <button
                      onClick={() => clearChat()}
                      className="text-xs text-muted-foreground hover:text-primary transition"
                    >
                      Clear Chat
                    </button>
                  )}
                </div>

                {/* Messages Container */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {messages.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Ask any questions about your birth chart and get personalized answers from ChatGPT
                    </p>
                  )}
                  
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted text-foreground rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your chart..."
                    disabled={chatLoading}
                    className="flex-1 px-4 py-3 rounded-lg bg-muted/50 border border-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={() => {
                setChartGenerated(false);
                setFormData({ birthDate: '', birthTime: '', birthPlace: '' });
              }}
              className="w-full btn-outline-cosmic py-3 rounded-lg font-medium transition"
            >
              Generate Another Chart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthChart;
