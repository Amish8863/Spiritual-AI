# Astrology App - Frontend & Backend Setup Guide

## Project Structure

```
.
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   ├── .env.local     # Frontend environment variables
│   └── package.json
├── backend/           # Express + MongoDB + TypeScript
│   ├── src/
│   ├── .env           # Backend environment variables
│   └── package.json
└── SETUP_GUIDE.md
```

## Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (local or MongoDB Atlas)
- Git

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local` file (or copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create `.env` file (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/astrology
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### 3. MongoDB Setup

#### Option A: Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS (with Homebrew):
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB:
brew services start mongodb-community

# Verify connection:
mongosh
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/astrology
```

### 4. Run Development Server

```bash
npm run dev
```

Backend will be available at `http://localhost:5000`

### 5. Build for Production

```bash
npm run build
npm start
```

## API Integration

### Frontend API Service

The frontend has a built-in API service layer in `src/lib/api.ts`:

```typescript
import { apiService } from '@/lib/api';

// Get zodiac signs
const signs = await apiService.getZodiacSigns();

// Get daily horoscope
const horoscope = await apiService.getDailyHoroscope('Aries');

// Subscribe to newsletter
await apiService.subscribeNewsletter('user@example.com');
```

### Using API Hooks

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

## Available API Endpoints

### Zodiac
- `GET /api/zodiac/signs` - Get all zodiac signs
- `GET /api/zodiac/signs/:sign` - Get specific sign details
- `GET /api/zodiac/compatibility?sign1=Aries&sign2=Leo` - Get compatibility

### Horoscope
- `GET /api/horoscope/daily/:sign` - Get daily horoscope
- `GET /api/horoscope/weekly/:sign` - Get weekly horoscope
- `GET /api/horoscope/monthly/:sign` - Get monthly horoscope

### Birth Chart
- `POST /api/birth-chart/calculate` - Calculate birth chart
- `GET /api/birth-chart/:id` - Get birth chart

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### Contact
- `POST /api/contact/send` - Send contact message

## Connecting MongoDB

When you provide your MongoDB URL, the backend will:

1. Connect to your database
2. Create collections automatically (with Mongoose schemas)
3. Store all data persistently

### Example MongoDB Connection String

**Local:**
```
mongodb://localhost:27017/astrology
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/astrology?retryWrites=true&w=majority
```

## Development Workflow

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3: MongoDB (if local)
```bash
mongosh
```

## Troubleshooting

### Frontend can't connect to backend
- Check if backend is running on `http://localhost:5000`
- Verify `VITE_API_URL` in `.env.local`
- Check CORS settings in backend

### MongoDB connection fails
- Verify MongoDB is running
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### Port already in use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

## Production Deployment

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables
4. Deploy

### Backend (Heroku/Railway/Render)
1. Push to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

## Next Steps

1. **Implement Database Models** - Create Mongoose schemas for zodiac data, horoscopes, users, etc.
2. **Add Authentication** - Implement JWT-based auth with bcrypt password hashing
3. **Create Admin Panel** - Build admin interface for managing content
4. **Add Email Service** - Integrate email for newsletters and contact forms
5. **Implement Caching** - Add Redis for performance optimization
6. **Add Testing** - Write unit and integration tests
7. **Setup CI/CD** - Automate testing and deployment

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check console logs for errors
4. Verify environment variables are set correctly
