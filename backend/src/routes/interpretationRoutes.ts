import { Router } from 'express';
import {
  interpretBirthChart,
  generateAIDailyHoroscope,
  generateAICompatibility
} from '../controllers/interpretationController';
import { chartChat } from '../controllers/chartChatController';

const router = Router();

// POST /api/interpretation/birth-chart - Generate human-readable birth chart interpretation
router.post('/birth-chart', interpretBirthChart);

// GET /api/interpretation/horoscope/:sign - Generate AI-powered daily horoscope
router.get('/horoscope/:sign', generateAIDailyHoroscope);

// GET /api/interpretation/compatibility - Generate AI-powered compatibility analysis
router.get('/compatibility', generateAICompatibility);

// POST /api/interpretation/chart-chat - Chat about birth chart
router.post('/chart-chat', chartChat);

export default router;
