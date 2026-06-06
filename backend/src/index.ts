import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import interpretationRoutes from './routes/interpretationRoutes';

// Load environment variables FIRST - before anything else
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrology';

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' });
});

// Zodiac endpoints - Real data
app.get('/api/zodiac/signs', (req: Request, res: Response) => {
  const signs = [
    { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire', ruling_planet: 'Mars' },
    { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth', ruling_planet: 'Venus' },
    { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air', ruling_planet: 'Mercury' },
    { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water', ruling_planet: 'Moon' },
    { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire', ruling_planet: 'Sun' },
    { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth', ruling_planet: 'Mercury' },
    { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air', ruling_planet: 'Venus' },
    { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water', ruling_planet: 'Pluto' },
    { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire', ruling_planet: 'Jupiter' },
    { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth', ruling_planet: 'Saturn' },
    { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air', ruling_planet: 'Uranus' },
    { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water', ruling_planet: 'Neptune' },
  ];
  res.json({ success: true, data: signs });
});

app.get('/api/zodiac/signs/:sign', (req: Request, res: Response) => {
  const { sign } = req.params;
  const signData: Record<string, any> = {
    'Aries': { name: 'Aries', symbol: '♈', element: 'Fire', ruling_planet: 'Mars', dates: 'Mar 21 - Apr 19' },
    'Taurus': { name: 'Taurus', symbol: '♉', element: 'Earth', ruling_planet: 'Venus', dates: 'Apr 20 - May 20' },
    'Gemini': { name: 'Gemini', symbol: '♊', element: 'Air', ruling_planet: 'Mercury', dates: 'May 21 - Jun 20' },
    'Cancer': { name: 'Cancer', symbol: '♋', element: 'Water', ruling_planet: 'Moon', dates: 'Jun 21 - Jul 22' },
    'Leo': { name: 'Leo', symbol: '♌', element: 'Fire', ruling_planet: 'Sun', dates: 'Jul 23 - Aug 22' },
    'Virgo': { name: 'Virgo', symbol: '♍', element: 'Earth', ruling_planet: 'Mercury', dates: 'Aug 23 - Sep 22' },
    'Libra': { name: 'Libra', symbol: '♎', element: 'Air', ruling_planet: 'Venus', dates: 'Sep 23 - Oct 22' },
    'Scorpio': { name: 'Scorpio', symbol: '♏', element: 'Water', ruling_planet: 'Pluto', dates: 'Oct 23 - Nov 21' },
    'Sagittarius': { name: 'Sagittarius', symbol: '♐', element: 'Fire', ruling_planet: 'Jupiter', dates: 'Nov 22 - Dec 21' },
    'Capricorn': { name: 'Capricorn', symbol: '♑', element: 'Earth', ruling_planet: 'Saturn', dates: 'Dec 22 - Jan 19' },
    'Aquarius': { name: 'Aquarius', symbol: '♒', element: 'Air', ruling_planet: 'Uranus', dates: 'Jan 20 - Feb 18' },
    'Pisces': { name: 'Pisces', symbol: '♓', element: 'Water', ruling_planet: 'Neptune', dates: 'Feb 19 - Mar 20' },
  };
  
  const data = signData[sign] || signData['Aries'];
  res.json({ success: true, data });
});

// Newsletter subscription
app.post('/api/newsletter/subscribe', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }
  // TODO: Save to database
  res.json({ success: true, message: 'Subscribed successfully', email });
});

// Contact form
app.post('/api/contact/send', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }
  // TODO: Send email or save to database
  res.json({ success: true, message: 'Message sent successfully' });
});

// AI Interpretation Routes
app.use('/api/interpretation', interpretationRoutes);

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
