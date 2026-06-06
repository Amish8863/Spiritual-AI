import { Request, Response } from 'express';
import {
  generateHumanReadableInterpretation,
  generateDailyHoroscope,
  generateCompatibilityAnalysis
} from '../services/chatgptService';

// Generate human-readable birth chart interpretation
export const interpretBirthChart = async (req: Request, res: Response) => {
  try {
    const { birthData } = req.body;

    if (!birthData) {
      return res.status(400).json({
        success: false,
        error: 'Birth data is required'
      });
    }

    const interpretation = await generateHumanReadableInterpretation(birthData);

    res.json({
      success: true,
      data: interpretation
    });
  } catch (error: any) {
    console.error('Interpretation Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate interpretation'
    });
  }
};

// Generate AI-powered daily horoscope
export const generateAIDailyHoroscope = async (req: Request, res: Response) => {
  try {
    const { sign } = req.params;

    if (!sign) {
      return res.status(400).json({
        success: false,
        error: 'Zodiac sign is required'
      });
    }

    const horoscope = await generateDailyHoroscope(sign);

    res.json({
      success: true,
      data: {
        sign,
        horoscope,
        date: new Date().toISOString().split('T')[0]
      }
    });
  } catch (error: any) {
    console.error('Horoscope Generation Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate horoscope'
    });
  }
};

// Generate AI-powered compatibility analysis
export const generateAICompatibility = async (req: Request, res: Response) => {
  try {
    const { sign1, sign2 } = req.query;

    if (!sign1 || !sign2) {
      return res.status(400).json({
        success: false,
        error: 'Both zodiac signs are required'
      });
    }

    const analysis = await generateCompatibilityAnalysis(
      sign1 as string,
      sign2 as string
    );

    res.json({
      success: true,
      data: {
        sign1,
        sign2,
        analysis
      }
    });
  } catch (error: any) {
    console.error('Compatibility Analysis Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate compatibility analysis'
    });
  }
};
