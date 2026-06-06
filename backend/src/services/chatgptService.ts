import axios from 'axios';

interface BirthChartData {
  sign?: string;
  moon?: string;
  rising?: string;
  planets?: Record<string, string>;
  houses?: Record<string, string>;
  aspects?: string[];
  [key: string]: any;
}

interface HumanReadableInterpretation {
  summary: string;
  personality: string;
  strengths: string[];
  challenges: string[];
  compatibility: string;
  careerGuidance: string;
  lifeAdvice: string;
}

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export const generateHumanReadableInterpretation = async (
  birthData: BirthChartData
): Promise<HumanReadableInterpretation> => {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables');
    }

    const prompt = `You are an expert astrologer. Based on the following birth chart data, provide a detailed but easy-to-understand interpretation in simple Hindi-English mix (Hinglish). Make it relatable and practical.

Birth Chart Data:
${JSON.stringify(birthData, null, 2)}

Please provide the response in this exact JSON format:
{
  "summary": "A 2-3 sentence overview of the person's astrological profile",
  "personality": "A paragraph describing their personality traits in simple language",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "challenges": ["challenge 1", "challenge 2", "challenge 3"],
  "compatibility": "A paragraph about their romantic and relationship compatibility",
  "careerGuidance": "A paragraph about suitable career paths and professional strengths",
  "lifeAdvice": "A paragraph with practical life advice based on their chart"
}

Use simple, conversational language. Avoid complex astrological jargon. Make it feel personal and helpful.`;

    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: 'openai/gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a friendly astrologer who explains birth charts in simple, easy-to-understand language. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:8081',
          'X-Title': 'Astrology App'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from ChatGPT response');
    }

    const interpretation: HumanReadableInterpretation = JSON.parse(jsonMatch[0]);
    return interpretation;
  } catch (error: any) {
    console.error('OpenRouter Service Error:', error.response?.status, error.response?.data?.error?.message || error.message);
    
    // Fallback: Return mock data for testing UI
    if (error.response?.status === 402) {
      console.warn('OpenRouter API: Payment required. Using mock data for testing.');
      return {
        summary: `Your ${birthData.sign} sun sign combined with ${birthData.moon} moon and ${birthData.rising} rising creates a unique personality blend. You are naturally curious, adaptable, and intellectually driven.`,
        personality: `As a ${birthData.sign}, you are known for your versatility and communication skills. Your ${birthData.moon} moon sign adds emotional depth and intuitive understanding. People see you as a ${birthData.rising} rising, which gives you a composed and responsible demeanor. Together, these placements make you a thoughtful communicator who values both logic and emotion.`,
        strengths: [
          'Excellent communication and adaptability',
          'Quick thinking and problem-solving abilities',
          'Intellectual curiosity and love of learning',
          'Ability to see multiple perspectives'
        ],
        challenges: [
          'Tendency to overthink situations',
          'Difficulty making long-term commitments',
          'Can be emotionally detached at times',
          'May struggle with consistency'
        ],
        compatibility: `Your ${birthData.sign} nature seeks partners who can keep up with your intellectual pace. You are most compatible with air signs and fire signs who share your enthusiasm. Your ${birthData.moon} sign suggests you need emotional security and understanding in relationships.`,
        careerGuidance: `Your ${birthData.sign} sun and ${birthData.moon} moon make you excellent in careers involving communication, teaching, writing, or technology. You thrive in dynamic environments where you can use your analytical skills and adaptability.`,
        lifeAdvice: `Embrace your natural curiosity but try to follow through on your commitments. Your ${birthData.rising} sign suggests you have the discipline to achieve your goals. Balance your intellectual pursuits with emotional connections to create a fulfilling life.`
      };
    }
    
    throw new Error(`Failed to generate interpretation: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const generateDailyHoroscope = async (sign: string): Promise<string> => {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables');
    }

    const prompt = `Generate a personalized daily horoscope for ${sign} in simple, encouraging language. Include:
1. Overall energy for the day
2. Love/Relationships
3. Career/Finance
4. Health/Wellness
5. Lucky tip

Keep it positive, practical, and easy to understand. Use Hinglish (Hindi-English mix) for better relatability.`;

    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: 'openai/gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a friendly astrologer providing daily horoscopes in simple, encouraging language.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:8081',
          'X-Title': 'Astrology App'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenRouter Horoscope Error:', error.response?.status, error.response?.data || error.message);
    throw new Error(`Failed to generate horoscope: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const generateCompatibilityAnalysis = async (
  sign1: string,
  sign2: string
): Promise<string> => {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables');
    }

    const prompt = `Analyze the romantic and relationship compatibility between ${sign1} and ${sign2}. 

Provide:
1. Overall compatibility percentage and rating
2. What makes them work together
3. Potential challenges
4. Tips for a successful relationship
5. Best areas of connection

Use simple, encouraging language. Make it practical and relatable. Use Hinglish for better understanding.`;

    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: 'openai/gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert relationship astrologer providing compatibility analysis in simple, helpful language.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:8081',
          'X-Title': 'Astrology App'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenRouter Compatibility Error:', error.response?.status, error.response?.data || error.message);
    throw new Error(`Failed to generate compatibility analysis: ${error.response?.data?.error?.message || error.message}`);
  }
};
