# 🔧 Fix Login Issue - Quick Guide

## Problem
Login is failing because:
1. MongoDB is not running
2. Demo users don't exist in database
3. Backend server needs to be restarted

## Solution (3 Steps)

### Step 1: Start MongoDB

**Option A - Using systemctl (Ubuntu/Debian):**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

**Option B - Direct start:**
```bash
mongod --dbpath ~/data/db
```

**Option C - If MongoDB not installed:**
```bash
# Install MongoDB first
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### Step 2: Create Demo Users

```bash
cd backend
node seedDemo.js
```

**Expected Output:**
```
MongoDB Connected
✓ Demo student created
✓ Demo coordinator created
✓ Sample hackathon created

✅ Demo data setup complete!

Login credentials:
Student: ganeshprabu@gmail.com / 12345
Admin: studentinnovation@gmail.com / stu1234
```

### Step 3: Restart Backend Server

```bash
# Kill existing server
pkill -f "node server.js"

# Start fresh
npm run dev
# OR
node server.js
```

**Expected Output:**
```
Server running on port 5003
MongoDB Connected
```

### Step 4: Test Login

1. Open http://localhost:3000/login
2. Click "Student" tab
3. Enter:
   - Email: ganeshprabu@gmail.com
   - Password: 12345
   - Year: II Year
   - Section: A
4. Click "Access Student Portal"

## Quick Verification

**Check MongoDB is running:**
```bash
mongosh --eval "db.version()"
```

**Check backend is running:**
```bash
curl http://localhost:5003/api/auth/me
# Should return: {"message":"Unauthorized"} (this is correct)
```

**Check if users exist:**
```bash
mongosh innovation_updates --eval "db.users.find({}, {email:1, role:1}).pretty()"
```

## Alternative: Manual User Creation

If seedDemo.js doesn't work, create user manually:

```bash
mongosh innovation_updates
```

```javascript
// In MongoDB shell
db.users.insertOne({
  name: "Ganesh Prabu",
  email: "ganeshprabu@gmail.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  role: "student",
  rollNumber: "21CS001",
  department: "Computer Science and Engineering",
  year: 2,
  section: "A",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Still Not Working?

**Check backend logs:**
```bash
cd backend
tail -f server.log
```

**Check frontend console:**
- Open browser DevTools (F12)
- Go to Console tab
- Look for error messages

**Common Issues:**

1. **Port already in use:**
   ```bash
   lsof -ti:5003 | xargs kill -9
   ```

2. **MongoDB connection string wrong:**
   - Check `backend/.env`
   - Should be: `MONGO_URI=mongodb://127.0.0.1:27017/innovation_updates`

3. **CORS error:**
   - Backend should have `app.use(cors())`
   - Check `backend/server.js`

## Contact Points

If issue persists:
1. Share backend logs (`backend/server.log`)
2. Share browser console errors
3. Verify MongoDB is running: `sudo systemctl status mongod`
