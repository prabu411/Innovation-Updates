# 🚀 Quick Start Guide - Student Portal

## ⚡ 5-Minute Setup

### Prerequisites Check
```bash
node --version  # Should be v16+
mongod --version  # MongoDB should be installed
```

### Step 1: Start MongoDB
```bash
# Linux/Mac
sudo systemctl start mongod
# OR
mongod

# Verify it's running
mongo --eval "db.version()"
```

### Step 2: Backend Setup
```bash
cd backend

# Install dependencies (first time only)
npm install

# Create uploads directory
mkdir -p uploads/odforms

# Start server
npm run dev

# You should see:
# "Server running on port 5002"
# "MongoDB Connected"
```

### Step 3: Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start React app
npm start

# Browser opens automatically at http://localhost:3000
```

---

## 🎭 Demo Accounts

### 1. Student Login
```
URL: http://localhost:3000/login
Tab: Student (Purple)
Email: ganeshprabu@gmail.com
Password: 12345
Year: II Year
Section: A
```

### 2. Coordinator Login
```
URL: http://localhost:3000/login
Tab: Admin (Cyan)
Email: admin@innovation.com
Password: sece@123
```

### 3. Student Admin Login
```
URL: http://localhost:3000/login
Tab: Admin (Cyan)
Email: studentinnovation@gmail.com
Password: stu1234
```

---

## ✅ Testing Checklist

### Test 1: Student Login with Year/Section
- [ ] Open http://localhost:3000/login
- [ ] Click "Student" tab
- [ ] Enter ganeshprabu@gmail.com / 12345
- [ ] Select Year: II Year, Section: A
- [ ] Click "Access Student Portal"
- [ ] ✓ Should redirect to student dashboard
- [ ] ✓ Profile should show Year: 2, Section: A

### Test 2: View Events
- [ ] Logged in as student
- [ ] Scroll to "Available Innovation Events"
- [ ] ✓ Should see event cards with posters
- [ ] ✓ Each card has Apply button

### Test 3: Apply to Event
- [ ] Click "Apply Now" on any event
- [ ] ✓ Success alert appears
- [ ] ✓ Button changes to "Applied ✓" (disabled)
- [ ] ✓ "My Applications" section appears at top
- [ ] ✓ Status shows "PENDING" (yellow badge)

### Test 4: OD Form Download
- [ ] Login as coordinator (admin@innovation.com)
- [ ] Upload an OD form (if not exists)
- [ ] Logout and login as student
- [ ] ✓ Cyan banner appears with "Download Form" button
- [ ] Click download
- [ ] ✓ File downloads successfully

### Test 5: Student Admin Portal
- [ ] Login with studentinnovation@gmail.com / stu1234
- [ ] ✓ Redirects to /student-admin/dashboard
- [ ] ✓ Student table displays records
- [ ] Click "Export as Excel"
- [ ] ✓ .xlsx file downloads
- [ ] Click "Export as PDF"
- [ ] ✓ .pdf file downloads

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution**:
```bash
# Check if backend is running
curl http://localhost:5002
# Should return: {"message":"Innovation Event Management API"}

# If not, restart backend
cd backend
npm run dev
```

### Issue: "MongoDB connection failed"
**Solution**:
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# OR use MongoDB Compass to verify connection
```

### Issue: "Year/Section not showing in profile"
**Solution**:
- Ensure you selected year/section during login
- Check browser console for errors
- Verify backend authController.js has year/section update logic

### Issue: "OD form not appearing"
**Solution**:
- Login as coordinator first
- Upload an OD form via admin dashboard
- Then login as student to see it

### Issue: "Export buttons not working"
**Solution**:
```bash
cd frontend
npm install jspdf jspdf-autotable xlsx
npm start
```

---

## 📁 Project Structure Quick Reference

```
/backend
  /models
    - User.js              # User schema with year/section
    - Hackathon.js         # Event schema
    - Application.js       # Student applications
    - ODForm.js            # OD form documents
  /controllers
    - authController.js    # Login with year/section
    - odFormController.js  # OD form upload/download
    - studentAdminController.js  # Demo data exports
  /routes
    - authRoutes.js
    - odFormRoutes.js
    - studentAdminRoutes.js
  /uploads
    /odforms              # OD form files stored here
  - server.js             # Main entry point

/frontend
  /src
    /pages
      - Login.js          # Enhanced with year/section
      - StudentDashboard.js  # Main student portal
      - StudentAdminDashboard.js  # Demo export portal
    /context
      - AuthContext.js    # Global auth state
  - App.js               # Routing with 3 roles
```

---

## 🎯 Key Features to Demonstrate

### 1. Separate Student Login Portal
- Show dual-tab system (Student/Admin)
- Highlight year/section dropdowns
- Explain why these fields are required

### 2. Year & Section Storage
- Login as student with specific year/section
- Show profile displaying these values
- Explain database update on login

### 3. OD Form Download
- Show cyan banner with download button
- Explain centralized document management
- Mention automatic updates when admin uploads new form

### 4. Application Tracking
- Apply to multiple events
- Show "My Applications" section
- Point out status badges (Pending/Approved/Rejected)

### 5. Export Features
- Login to student-admin portal
- Export as Excel (show file)
- Export as PDF (show file)
- Explain institutional reporting use case

---

## 🎓 Presentation Tips

### Opening Statement
"Our Innovation Management System replaces WhatsApp-based updates with a centralized web platform. Students can login with their current year and section, browse events, apply directly to the college, download OD forms, and track their application status."

### Demo Flow
1. **Start with Problem**: Show WhatsApp chaos (if possible)
2. **Show Student Login**: Emphasize year/section selection
3. **Browse Events**: Show clean UI with event cards
4. **Apply to Event**: Demonstrate application process
5. **Download OD Form**: Show centralized document access
6. **Track Applications**: Show status tracking
7. **Admin View**: Switch to coordinator dashboard
8. **Export Data**: Show student-admin portal exports

### Key Talking Points
- "Year and section are captured on login for academic compliance"
- "OD forms are centrally managed - no outdated versions"
- "Application tracking prevents duplicates using database indexes"
- "Export features support institutional reporting"
- "Demo accounts allow testing without affecting production data"

### Technical Highlights
- "Built with MERN stack for full JavaScript development"
- "JWT authentication for stateless sessions"
- "bcrypt password hashing for security"
- "Role-based access control with three user types"
- "MongoDB compound indexes prevent duplicate applications"

---

## 📊 Database Seeding (Optional)

If you want sample data for demo:

```bash
cd backend
node
```

```javascript
// In Node REPL
const mongoose = require('mongoose');
const User = require('./models/User');
const Hackathon = require('./models/Hackathon');

mongoose.connect('mongodb://127.0.0.1:27017/innovation_updates');

// Create sample students
User.create([
  { name: 'Ganesh Prabu', email: 'ganeshprabu@gmail.com', password: '12345', role: 'student', rollNumber: '21CS001', year: 2, section: 'A' },
  { name: 'Priya Kumar', email: 'priya@gmail.com', password: '12345', role: 'student', rollNumber: '21CS002', year: 2, section: 'A' },
  { name: 'Raj Sharma', email: 'raj@gmail.com', password: '12345', role: 'student', rollNumber: '21CS003', year: 3, section: 'B' }
]);

// Create sample hackathon
Hackathon.create({
  name: 'Smart India Hackathon 2024',
  organizer: 'Government of India',
  dates: [new Date('2024-03-15')],
  mode: 'hybrid',
  description: 'National level hackathon for innovative solutions',
  location: 'Multiple Cities',
  prizePool: '₹1 Crore',
  themes: ['Healthcare', 'Education', 'Agriculture'],
  registrationLink: 'https://sih.gov.in',
  createdBy: 'COORDINATOR_ID_HERE'
});
```

---

## 🔄 Git Workflow (If Using Version Control)

```bash
# Initial commit
git init
git add .
git commit -m "Initial commit: Student portal with year/section login"

# Feature branches
git checkout -b feature/od-form-download
git checkout -b feature/student-admin-portal

# After testing
git checkout main
git merge feature/od-form-download
```

---

## 📞 Support & Resources

### Documentation Files
- `STUDENT_PORTAL_DOCUMENTATION.md` - Complete technical documentation
- `THEORY_EXPLANATION.md` - Conceptual explanations for viva
- `README.md` - Project overview

### Useful Commands
```bash
# Check running processes
lsof -i :5002  # Backend port
lsof -i :3000  # Frontend port

# Kill process if port is busy
kill -9 <PID>

# View backend logs
cd backend
tail -f server.log

# Clear npm cache (if issues)
npm cache clean --force
```

### Common MongoDB Commands
```bash
# Connect to MongoDB shell
mongo

# Use database
use innovation_updates

# View collections
show collections

# View users
db.users.find().pretty()

# View applications
db.applications.find().pretty()

# Clear applications (for testing)
db.applications.deleteMany({})
```

---

## ✨ Final Checklist Before Demo

- [ ] MongoDB is running
- [ ] Backend server is running (port 5002)
- [ ] Frontend app is running (port 3000)
- [ ] All demo accounts work
- [ ] At least one hackathon exists in database
- [ ] OD form is uploaded (for download demo)
- [ ] Browser console has no errors
- [ ] Network tab shows successful API calls
- [ ] Documentation files are ready for reference

---

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Student can login with year/section
- ✅ Profile shows correct year/section
- ✅ Events display with posters
- ✅ Apply button works and shows "Applied ✓"
- ✅ OD form downloads successfully
- ✅ Student-admin can export Excel/PDF
- ✅ No console errors in browser
- ✅ All three demo accounts work

---

**Ready to impress! 🚀**

For detailed explanations, refer to:
- Technical details → `STUDENT_PORTAL_DOCUMENTATION.md`
- Theory concepts → `THEORY_EXPLANATION.md`
- Project overview → `README.md`
