import { Request, Response } from 'express';
import { Kundali } from '../models/Kundali';
import { User } from '../models/User';
import astroApiService from '../services/astroApiService';

/**
 * Generate Kundali for authenticated user using AstroAPI
 * POST /api/kundali/generate
 */
export const generateKundali = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { dateOfBirth, timeOfBirth, placeOfBirth, latitude, longitude, timezone } = req.body;

    // Validate input
    if (!dateOfBirth || !timeOfBirth || !placeOfBirth || latitude === undefined || longitude === undefined) {
      res.status(400).json({
        error: 'Date of birth, time of birth, place of birth, latitude, and longitude are required',
      });
      return;
    }

    // Parse date and time
    const [year, month, day] = dateOfBirth.split('-').map(Number);
    const [hour, minute] = timeOfBirth.split(':').map(Number);

    // Call AstroAPI to generate Vedic Chart
    const vedicChart = await astroApiService.generateVedicChart({
      day,
      month,
      year,
      hour,
      minute,
      latitude,
      longitude,
      timezone: timezone || 5.5, // Default to IST
    });

    // Get Yogas
    const yogas = await astroApiService.getYogas({
      day,
      month,
      year,
      hour,
      minute,
      latitude,
      longitude,
      timezone: timezone || 5.5,
    });

    // Get zodiac sign
    const zodiacSign = astroApiService.getZodiacSignFromDate(month, day);

    // Update user with birth data
    const user = await User.findById(userId);
    if (user) {
      user.dateOfBirth = dateOfBirth;
      user.timeOfBirth = timeOfBirth;
      user.placeOfBirth = placeOfBirth;
      user.zodiacSign = zodiacSign;
      await user.save();
    }

    // Check if Kundali already exists
    let kundali = await Kundali.findOne({ userId });

    const birthChartData = {
      ...vedicChart,
      yogas,
      zodiacSign,
      placeOfBirth,
      latitude,
      longitude,
      timezone: timezone || 5.5,
    };

    if (kundali) {
      // Update existing Kundali
      kundali.birthChart = birthChartData;
      await kundali.save();
    } else {
      // Create new Kundali
      kundali = new Kundali({
        userId,
        birthChart: birthChartData,
      });
      await kundali.save();
    }

    res.status(200).json({
      success: true,
      message: 'Kundali generated successfully',
      data: kundali,
    });
  } catch (error: any) {
    console.error('Error generating Kundali:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate Kundali',
    });
  }
};

/**
 * Get user's Kundali
 * GET /api/kundali/get
 */
export const getKundali = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const kundali = await Kundali.findOne({ userId });

    if (!kundali) {
      res.status(404).json({ error: 'Kundali not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: kundali,
    });
  } catch (error) {
    console.error('Error fetching Kundali:', error);
    res.status(500).json({ error: 'Failed to fetch Kundali' });
  }
};

/**
 * Delete user's Kundali
 * DELETE /api/kundali/delete
 */
export const deleteKundali = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await Kundali.deleteOne({ userId });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Kundali not found' });
      return;
    }

    res.status(200).json({ message: 'Kundali deleted successfully' });
  } catch (error) {
    console.error('Error deleting Kundali:', error);
    res.status(500).json({ error: 'Failed to delete Kundali' });
  }
};
