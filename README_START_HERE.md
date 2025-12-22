# 🚀 START HERE - Innovation Management System

## ⚡ Quick Start (3 Commands)

Open **3 separate terminals** and run:

### Terminal 1: MongoDB
```bash
sudo systemctl start mongod
# OR if that fails:
mongod --dbpath ~/data/db
```

### Terminal 2: Backend
```bash
cd "Innovation Updates/backend"
node seedDemo.js  # Creates demo users
node server.js    # Starts backend
```

### Terminal 3: Frontend
```bash
cd "Innovation Updates/frontend"
npm start  # Opens browser automatically
```

---

## 🎭 Login Credentials

### Student Login
- **URL:** http://localhost:3000/login
- **Tab:** Student (Purple)
- **Email:** ganeshprabu@gmail.com
- **Password:** 12345
- **Year:** II Year
- **Section:** A

### Admin Login
- **URL:** http://localhost:3000/login
- **Tab:** Admin (Cyan)
- **Email:** studentinnovation@gmail.com
- **Password:** stu1234

---

## ✅ Verify Everything Works

After starting all services:

**1. Check MongoDB:**
```bash
mongosh --eval "db.version()"
```
✓ Should show version number

**2. Check Backend:**
```bash
curl http://localhost:5003
```
✓ Should return: `{"message":"Innovation Event Management API"}`

**3. Check Frontend:**
- Browser should open at http://localhost:3000
- You should see the login page

**4. Test Login:**
- Use student credentials above
- Should redirect to student dashboard

---

## 📁 Project Structure

```
Innovation Updates/
├── backend/
│   ├── models/          # Database schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── uploads/         # File storage
│   ├── seedDemo.js      # Creates demo users
│   └── server.js        # Main entry point
│
├── frontend/
│   ├── src/
│   │   ├── pages/       # Dashboard components
│   │   ├── context/     # Global state
│   │   └── services/    # API calls
│   └── public/
│
├── START_PROJECT.sh     # Automated startup
├── MANUAL_FIX.md        # Troubleshooting guide
└── README_START_HERE.md # This file
```

---

## 🐛 Troubleshooting

### Issue: "Login failed"
**Cause:** MongoDB not running or users don't exist

**Fix:**
```bash
# Start MongoDB
sudo systemctl start mongod

# Create users
cd backend
node seedDemo.js
```

### Issue: "Cannot connect to server"
**Cause:** Backend not running

**Fix:**
```bash
cd backend
node server.js
```

### Issue: "Port already in use"
**Fix:**
```bash
# Kill existing processes
pkill -f "node server.js"
pkill -f "react-scripts"

# Restart
node server.js  # in backend/
npm start       # in frontend/
```

---

## 📚 Documentation Files

- **MANUAL_FIX.md** - Step-by-step troubleshooting
- **STUDENT_PORTAL_DOCUMENTATION.md** - Complete technical docs
- **THEORY_EXPLANATION.md** - Concepts for viva/presentation
- **QUICK_START_GUIDE.md** - Detailed setup guide
- **IMPLEMENTATION_SUMMARY.md** - What's been implemented

---

## 🎯 Features Implemented

### Student Portal
✅ Login with year/section selection
✅ View available hackathons
✅ Apply to events
✅ Download OD forms
✅ Track application status
✅ Profile with academic details

### Coordinator Portal
✅ Create/edit/delete hackathons
✅ Upload event posters
✅ Upload OD forms
✅ View student applications
✅ Export student data (Excel/PDF)
✅ Generate OD letters

### Student Admin Portal (Demo)
✅ View all student records
✅ Export as Excel
✅ Export as PDF
✅ Demo data management

---

## 🔄 Stop All Services

```bash
sudo systemctl stop mongod
pkill -f "node server.js"
pkill -f "react-scripts"
```

---

## 📞 Need Help?

1. Check **MANUAL_FIX.md** for common issues
2. Review backend logs: `cat backend/server.log`
3. Check browser console (F12) for frontend errors
4. Verify MongoDB is running: `sudo systemctl status mongod`

---

## 🎉 Success Checklist

- [ ] MongoDB is running
- [ ] Backend shows "Server running on port 5003"
- [ ] Frontend opens in browser
- [ ] Can login as student
- [ ] Can see student dashboard
- [ ] Can view hackathons
- [ ] Can apply to events

**All checked? You're ready to go! 🚀**
