// API Configuration and Service Layer
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ApiError {
  message: string;
  status: number;
  data?: any;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP ${response.status}`,
          status: response.status,
          data: errorData,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  // Zodiac endpoints
  async getZodiacSigns() {
    return this.request<any[]>('/zodiac/signs');
  }

  async getZodiacDetail(sign: string) {
    return this.request<any>(`/zodiac/signs/${sign}`);
  }

  async getCompatibility(sign1: string, sign2: string) {
    return this.request<any>(`/zodiac/compatibility?sign1=${sign1}&sign2=${sign2}`);
  }

  // Horoscope endpoints
  async getDailyHoroscope(sign: string) {
    return this.request<any>(`/horoscope/daily/${sign}`);
  }

  async getWeeklyHoroscope(sign: string) {
    return this.request<any>(`/horoscope/weekly/${sign}`);
  }

  async getMonthlyHoroscope(sign: string) {
    return this.request<any>(`/horoscope/monthly/${sign}`);
  }

  // Birth chart endpoints
  async calculateBirthChart(data: {
    birthDate: string;
    birthTime: string;
    birthLocation: string;
  }) {
    return this.request<any>('/birth-chart/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBirthChart(id: string) {
    return this.request<any>(`/birth-chart/${id}`);
  }

  // User endpoints
  async registerUser(data: {
    email: string;
    password: string;
    name: string;
    zodiacSign?: string;
  }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async loginUser(data: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserProfile() {
    return this.request<any>('/user/profile');
  }

  async updateUserProfile(data: any) {
    return this.request<any>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Newsletter endpoints
  async subscribeNewsletter(email: string) {
    return this.request<any>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Contact endpoints
  async sendContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return this.request<any>('/contact/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export type { ApiResponse, ApiError };
