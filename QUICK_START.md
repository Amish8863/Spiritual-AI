# Quick Start Guide

## Project Status: ✓ READY

Your frontend and backend are fully set up and ready to connect to MongoDB.

## Current Setup

### Frontend (React + Vite + TypeScript)
- ✓ All 10 pages created
- ✓ API service layer ready
- ✓ React hooks for API calls
- ✓ 40+ UI components available
- ✓ 3D animations optimized (Solar System, Zodiac Formation, etc.)
- ✓ Black background applied
- ✓ ScrollStorytelling removed

### Backend (Express + MongoDB + TypeScript)
- ✓ Server running on port 5000
- ✓ All API endpoints configured
- ✓ Dummy data for testing
- ✓ CORS configured for frontend
- ✓ Error handling middleware
- ✓ Ready for MongoDB connection

## How to Run

### Step 1: Start Backend
```bash
cd backend
npm install  # Only first time
npm run dev
```
Backend will run on: `http://localhost:5000`

### Step 2: Start Frontend
```bash
cd frontend
npm install  # Only first time
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Step 3: Provide MongoDB URL (When Ready)
When you have a MongoDB URL, update `backend/.env`:
```env
MONGODB_URI=your_mongodb_url_here
```

Then restart the backend. That's it!

## Available API Endpoints

All endpoints are ready to use:

### Zodiac
- `GET /api/zodiac/signs` - All zodiac signs
- `GET /api/zodiac/signs/:sign` - Sign details
- `GET /api/zodiac/compatibility?sign1=Aries&sign2=Leo` - Compatibility

### Horoscope
- `GET /api/horoscope/daily/:sign` - Daily horoscope
- `GET /api/horoscope/weekly/:sign` - Weekly horoscope
- `GET /api/horoscope/monthly/:sign` - Monthly horoscope

### Birth Chart
- `POST /api/birth-chart/calculate` - Calculate birth chart
- `GET /api/birth-chart/:id` - Get birth chart

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe

### Contact
- `POST /api/contact/send` - Send message

## Using API in Frontend

### Option 1: Using Hooks (Recommended)
```typescript
import { useZodiacSigns, useDailyHoroscope } from '@/hooks/useApi';

function MyComponent() {
  const { data: signs, loading, error, fetch } = useZodiacSigns();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{signs?.map(s => s.name).join(', ')}</div>;
}
```

### Option 2: Using API Service Directly
```typescript
import { apiService } from '@/lib/api';

const signs = await apiService.getZodiacSigns();
const horoscope = await apiService.getDailyHoroscope('Aries');
```

## File Locations

### Frontend
- API Service: `frontend/src/lib/api.ts`
- Hooks: `frontend/src/hooks/useApi.ts`
- Pages: `frontend/src/pages/`
- Components: `frontend/src/components/`
- Environment: `frontend/.env.local`

### Backend
- Server: `backend/src/index.ts`
- Environment: `backend/.env`
- Controllers: `backend/src/controllers/`
- Models: `backend/src/models/`
- Routes: `backend/src/routes/`

## MongoDB Connection

### Local MongoDB
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connect
mongosh
```

### MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `backend/.env`

## Troubleshooting

### Backend won't start
- Check if port 5000 is in use: `lsof -ti:5000 | xargs kill -9`
- Check MongoDB is running
- Check `.env` file exists

### Frontend can't connect to backend
- Check backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in `frontend/.env.local`
- Check CORS is enabled in backend

### MongoDB connection fails
- Check MongoDB is running
- Check connection string in `backend/.env`
- For Atlas, whitelist your IP

## Next Steps

1. ✓ Frontend structure verified
2. ✓ Backend setup complete
3. ✓ API integration ready
4. → Provide MongoDB URL
5. → Start development!

## Support

- Frontend docs: See `SETUP_GUIDE.md`
- Backend docs: See `SETUP_GUIDE.md`
- Verification: See `FRONTEND_STRUCTURE_VERIFICATION.md`

