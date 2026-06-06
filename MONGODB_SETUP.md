# MongoDB Setup Guide

## Quick Setup

### Option 1: MongoDB Atlas (Cloud - Recommended for Beginners)

**Step 1: Create Account**
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Create account with email/password

**Step 2: Create Cluster**
1. Click "Create" button
2. Select "Free" tier
3. Choose region closest to you
4. Click "Create Cluster"
5. Wait 2-3 minutes for cluster to be created

**Step 3: Get Connection String**
1. Click "Connect" button
2. Select "Drivers"
3. Choose "Node.js" and version "4.x or later"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `myFirstDatabase` with `astrology`

**Example Connection String:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/astrology?retryWrites=true&w=majority
```

**Step 4: Add to Backend**
1. Create `backend/.env` file
2. Add the connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/astrology?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

**Step 5: Whitelist IP (Important!)**
1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

**Step 6: Start Backend**
```bash
cd backend
npm run dev
```

Done! Your backend is now connected to MongoDB.

---

### Option 2: Local MongoDB

#### macOS (Homebrew)

**Install:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Start MongoDB:**
```bash
brew services start mongodb-community
```

**Connect:**
```bash
mongosh
```

**Add to Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/astrology
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

#### Windows

**Install:**
1. Download from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Install MongoDB as a Service"
4. MongoDB will start automatically

**Connect:**
```bash
mongosh
```

**Add to Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/astrology
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

#### Linux (Ubuntu)

**Install:**
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
```

**Start:**
```bash
sudo systemctl start mongod
```

**Connect:**
```bash
mongosh
```

**Add to Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/astrology
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

---

## Verify Connection

### Test Backend Connection

1. Start backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Check console output:
   ```
   ✓ MongoDB connected
   ✓ Server running on http://localhost:5000
   ```

3. Test API:
   ```bash
   curl http://localhost:5000/api/health
   ```

   Should return:
   ```json
   {
     "success": true,
     "message": "Server is running"
   }
   ```

### Test MongoDB Connection

**Using mongosh:**
```bash
mongosh
```

Then in mongosh:
```javascript
// Show databases
show databases

// Use astrology database
use astrology

// Show collections
show collections

// Insert test data
db.zodiac.insertOne({ name: "Aries", symbol: "♈" })

// Find data
db.zodiac.find()
```

---

## Environment Variables Explained

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/astrology

# Server port
PORT=5000

# Environment (development, production)
NODE_ENV=development

# JWT secret key (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# JWT expiration time
JWT_EXPIRE=7d

# Frontend URL (for CORS)
CORS_ORIGIN=http://localhost:5173
```

### Generate JWT Secret

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -Maximum 1000000000).ToString())) | Select-Object -First 32
```

Or just use any random string like:
```
your_super_secret_jwt_key_12345
```

---

## Troubleshooting

### MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
- Check if MongoDB is running
- For local: `brew services start mongodb-community` (macOS)
- For Atlas: Check internet connection and IP whitelist

### Authentication Failed

**Error:** `MongoAuthenticationError: authentication failed`

**Solution:**
- Check username and password in connection string
- Make sure password doesn't have special characters (or URL encode them)
- For Atlas: Check IP is whitelisted

### Database Not Found

**Error:** `MongoServerError: database not found`

**Solution:**
- MongoDB automatically creates database on first write
- This is normal - just start using it

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

---

## MongoDB Atlas Tips

### Whitelist IP Address

1. Go to MongoDB Atlas dashboard
2. Click "Network Access" in left menu
3. Click "Add IP Address"
4. For development: Click "Allow Access from Anywhere"
5. For production: Add specific IP addresses

### Create Database User

1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Create username and password
4. Click "Add User"
5. Use these credentials in connection string

### View Data

1. Go to "Collections" in cluster view
2. Click on database name
3. Browse collections and documents
4. Can view, edit, delete data directly

---

## Connection String Format

### Local MongoDB
```
mongodb://localhost:27017/astrology
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/astrology?retryWrites=true&w=majority
```

### With Authentication
```
mongodb://username:password@localhost:27017/astrology
```

---

## Next Steps

1. Choose MongoDB option (Atlas or Local)
2. Set up MongoDB
3. Get connection string
4. Create `backend/.env` file
5. Add connection string to `.env`
6. Start backend: `npm run dev`
7. Verify connection works

---

## Support

If you have issues:
1. Check MongoDB is running
2. Verify connection string format
3. Check IP whitelist (for Atlas)
4. Check username/password
5. Check `.env` file exists and has correct variables

