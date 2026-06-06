# Premium Astrology Backend

Node.js Express backend for the Premium Astrology Web Application, built with TypeScript and MongoDB.

## Prerequisites

- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/premium-astrology-app
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── environment.ts
│   │   └── database.ts
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── utils/            # Utility functions
│   └── index.ts          # Entry point
├── dist/                 # Compiled JavaScript
├── .env                  # Environment variables (local)
├── .env.example          # Environment variables template
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication (Coming Soon)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Birth Data (Coming Soon)
- `POST /api/users/birth-data` - Save birth data
- `GET /api/users/birth-data` - Get user's birth data

### Kundali (Coming Soon)
- `POST /api/kundali/generate` - Generate Kundali
- `GET /api/kundali/get` - Get user's Kundali

### Horoscope (Coming Soon)
- `GET /api/horoscope/daily` - Get daily horoscopes
- `GET /api/horoscope/by-sign` - Get horoscope by zodiac sign

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/premium-astrology-app |
| `JWT_SECRET` | JWT signing secret | your_jwt_secret_key_here_change_in_production |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `CORS_ORIGIN` | CORS allowed origin | http://localhost:3000 |

## Error Handling

The API returns standardized error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

## CORS Configuration

CORS is enabled for the frontend origin specified in `CORS_ORIGIN` environment variable. Allowed methods:
- GET
- POST
- PUT
- DELETE
- OPTIONS

## License

Proprietary - Premium Astrology Web Application
