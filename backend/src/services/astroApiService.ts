import axios, { AxiosInstance } from 'axios';

interface BirthData {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone: number;
}

interface VedicChartResponse {
  ascendant: string;
  moonSign: string;
  sunSign: string;
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
    house: number;
  }>;
  houses: Array<{
    number: number;
    sign: string;
    degree: number;
  }>;
  yogas: string[];
}

interface HoroscopeResponse {
  sign: string;
  date: string;
  horoscope: string;
}

class AstroApiService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.ASTRO_API_BASE_URL || 'https://astro-api-1qnc.onrender.com';
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  /**
   * Generate Vedic Birth Chart (Kundali) from birth data
   * Endpoint: POST /api/v1/vedic/chart
   */
  async generateVedicChart(birthData: BirthData): Promise<VedicChartResponse> {
    try {
      const response = await this.client.post('/api/v1/vedic/chart', {
        day: birthData.day,
        month: birthData.month,
        year: birthData.year,
        hour: birthData.hour,
        minute: birthData.minute,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone,
      });

      return response.data;
    } catch (error) {
      console.error('Error generating Vedic Chart:', error);
      throw new Error('Failed to generate Vedic Chart from AstroAPI');
    }
  }

  /**
   * Get Yogas (astrological combinations) from birth chart
   * Endpoint: GET /api/v1/vedic/yogas
   */
  async getYogas(birthData: BirthData): Promise<string[]> {
    try {
      const response = await this.client.get('/api/v1/vedic/yogas', {
        params: {
          day: birthData.day,
          month: birthData.month,
          year: birthData.year,
          hour: birthData.hour,
          minute: birthData.minute,
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          timezone: birthData.timezone,
        },
      });

      return response.data.yogas || [];
    } catch (error) {
      console.error('Error fetching Yogas:', error);
      throw new Error('Failed to fetch Yogas from AstroAPI');
    }
  }

  /**
   * Get daily horoscope for a zodiac sign
   * Endpoint: GET /api/v1/horoscope/daily/{sign}
   */
  async getDailyHoroscope(sign: string): Promise<HoroscopeResponse> {
    try {
      const response = await this.client.get(`/api/v1/horoscope/daily/${sign.toLowerCase()}`);

      return response.data;
    } catch (error) {
      console.error(`Error fetching horoscope for ${sign}:`, error);
      throw new Error(`Failed to fetch horoscope for ${sign}`);
    }
  }

  /**
   * Get weekly horoscope for a zodiac sign
   * Endpoint: GET /api/v1/horoscope/weekly/{sign}
   */
  async getWeeklyHoroscope(sign: string): Promise<HoroscopeResponse> {
    try {
      const response = await this.client.get(`/api/v1/horoscope/weekly/${sign.toLowerCase()}`);

      return response.data;
    } catch (error) {
      console.error(`Error fetching weekly horoscope for ${sign}:`, error);
      throw new Error(`Failed to fetch weekly horoscope for ${sign}`);
    }
  }

  /**
   * Get monthly horoscope for a zodiac sign
   * Endpoint: GET /api/v1/horoscope/monthly/{sign}
   */
  async getMonthlyHoroscope(sign: string): Promise<HoroscopeResponse> {
    try {
      const response = await this.client.get(`/api/v1/horoscope/monthly/${sign.toLowerCase()}`);

      return response.data;
    } catch (error) {
      console.error(`Error fetching monthly horoscope for ${sign}:`, error);
      throw new Error(`Failed to fetch monthly horoscope for ${sign}`);
    }
  }

  /**
   * Get all horoscopes for all zodiac signs
   */
  async getAllDailyHoroscopes(): Promise<HoroscopeResponse[]> {
    try {
      const zodiacSigns = [
        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
        'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
      ];

      const horoscopes = await Promise.all(
        zodiacSigns.map(sign => this.getDailyHoroscope(sign))
      );

      return horoscopes;
    } catch (error) {
      console.error('Error fetching all horoscopes:', error);
      throw new Error('Failed to fetch all horoscopes');
    }
  }

  /**
   * Get zodiac sign from birth date
   */
  getZodiacSignFromDate(month: number, day: number): string {
    const zodiacSigns = [
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

    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;

      if (startMonth === endMonth) {
        if (month === startMonth && day >= startDay && day <= endDay) {
          return sign.name;
        }
      } else {
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
          return sign.name;
        }
      }
    }

    return 'Unknown';
  }
}

export default new AstroApiService();
