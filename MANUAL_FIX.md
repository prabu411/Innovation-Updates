# 🔧 Manual Fix for Login Issue

## The Problem
Your login is failing because MongoDB is not running and demo users don't exist.

## Quick Fix (Copy-Paste Commands)

### Terminal 1 - Start MongoDB
```bash
# Try this first
sudo systemctl start mongod

# If that doesn't work, try:
mkdir -p ~/data/db
mongod --dbpath ~/data/db
```
**Keep this terminal open!**

---

### Terminal 2 - Setup Backend
```bash
cd "Innovation Updates/backend"

# Create demo users
node seedDemo.js

# Start backend
node server.js
```
**Keep this terminal open!**

You should see:
```
Server running on port 5003
MongoDB Connected
```

---

### Terminal 3 - Start Frontend
```bash
cd "Innovation Updates/frontend"

npm start
```
**Browser will open automatically**

---

## Now Test Login

1. Browser opens at http://localhost:3000/login
2. Click **"Student"** tab (purple)
3. Enter:
   - **Email:** ganeshprabu@gmail.com
   - **Password:** 12345
   - **Year:** II Year
   - **Section:** A
4. Click **"Access Student Portal"**

✅ **You should now be logged in!**

---

## If Still Not Working

### Check 1: Is MongoDB Running?
```bash
mongosh --eval "db.version()"
```
Should show MongoDB version. If error, MongoDB is not running.

### Check 2: Do Users Exist?
```bash
mongosh innovation_updates --eval "db.users.find({email: 'ganeshprabu@gmail.com'})"
```
Should show the user. If empty, run `node seedDemo.js` again.

### Check 3: Is Backend Running?
```bash
curl http://localhost:5003
```
Should return: `{"message":"Innovation Event Management API"}`

### Check 4: Check Backend Logs
```bash
cd backend
cat server.log
```
Look for errors.

---

## Alternative: Use Automated Script

```bash
cd "Innovation Updates"
./START_PROJECT.sh
```

This will start everything automatically.

---

## Demo Accounts Reference

| Role | Email | Password | Year | Section |
|------|-------|----------|------|---------|
| Student | ganeshprabu@gmail.com | 12345 | II Year | A |
| Coordinator | studentinnovation@gmail.com | stu1234 | - | - |

---

## Stop Everything

When done testing:
```bash
# Stop MongoDB
sudo systemctl stop mongod

# Stop backend
pkill -f "node server.js"

# Stop frontend
pkill -f "react-scripts"
```
