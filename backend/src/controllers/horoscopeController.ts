import { Request, Response } from 'express';
import astroApiService from '../services/astroApiService';

/**
 * Get daily horoscope for a zodiac sign
 * GET /api/horoscope/daily/:sign
 */
export const getDailyHoroscope = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sign } = req.params;

    if (!sign) {
      res.status(400).json({ error: 'Zodiac sign is required' });
      return;
    }

    const horoscope = await astroApiService.getDailyHoroscope(sign);

    res.status(200).json({
      success: true,
      data: horoscope,
    });
  } catch (error: any) {
    console.error('Error fetching daily horoscope:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch horoscope',
    });
  }
};

/**
 * Get weekly horoscope for a zodiac sign
 * GET /api/horoscope/weekly/:sign
 */
export const getWeeklyHoroscope = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sign } = req.params;

    if (!sign) {
      res.status(400).json({ error: 'Zodiac sign is required' });
      return;
    }

    const horoscope = await astroApiService.getWeeklyHoroscope(sign);

    res.status(200).json({
      success: true,
      data: horoscope,
    });
  } catch (error: any) {
    console.error('Error fetching weekly horoscope:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch horoscope',
    });
  }
};

/**
 * Get monthly horoscope for a zodiac sign
 * GET /api/horoscope/monthly/:sign
 */
export const getMonthlyHoroscope = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sign } = req.params;

    if (!sign) {
      res.status(400).json({ error: 'Zodiac sign is required' });
      return;
    }

    const horoscope = await astroApiService.getMonthlyHoroscope(sign);

    res.status(200).json({
      success: true,
      data: horoscope,
    });
  } catch (error: any) {
    console.error('Error fetching monthly horoscope:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch horoscope',
    });
  }
};

/**
 * Get all daily horoscopes for all zodiac signs
 * GET /api/horoscope/all
 */
export const getAllDailyHoroscopes = async (req: Request, res: Response): Promise<void> => {
  try {
    const horoscopes = await astroApiService.getAllDailyHoroscopes();

    res.status(200).json({
      success: true,
      data: horoscopes,
    });
  } catch (error: any) {
    console.error('Error fetching all horoscopes:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch horoscopes',
    });
  }
};
