# Hackathon & Innovation Event Management System

A full-stack MERN application replacing WhatsApp-based updates with a centralized web platform for managing hackathons and innovation events.

## 🏗️ Architecture

### MERN Stack
- **MongoDB**: NoSQL database for storing users, hackathons, and applications
- **Express.js**: Backend REST API server
- **React.js**: Frontend UI with role-based dashboards
- **Node.js**: JavaScript runtime environment

### Authentication Flow
- JWT (JSON Web Tokens) for stateless authentication
- bcrypt for secure password hashing
- Role-based middleware for access control
- Persistent sessions via localStorage

## 📁 Project Structure

```
/backend
  /config
    - db.js                    # MongoDB connection
  /models
    - User.js                  # User schema with roles
    - Hackathon.js             # Hackathon event schema
    - Application.js           # Student applications
  /controllers
    - authController.js        # Auth logic (signup/login)
    - hackathonController.js   # CRUD operations
    - applicationController.js # Application management
  /middleware
    - auth.js                  # JWT verification & role checks
  /routes
    - authRoutes.js
    - hackathonRoutes.js
    - applicationRoutes.js
  /uploads                     # File storage for posters
  - server.js                  # Express server entry point
  - .env                       # Environment variables

/frontend
  /src
    /components               # Reusable UI components
    /pages
      - Login.js
      - Signup.js
      - CoordinatorDashboard.js
      - StudentDashboard.js
    /services
      - api.js                # Axios API calls
    /context
      - AuthContext.js        # Global auth state
    /utils
      - exportUtils.js        # PDF/Excel generation
    - App.js                  # Main routing
    - index.js                # React entry point
  /public
    - index.html
```

## 🔐 MongoDB Schema Design

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['student', 'coordinator'],
  rollNumber: String (required for students),
  department: String,
  year: Number (required for students),
  timestamps: true
}
```

### Hackathon Schema
```javascript
{
  name: String,
  poster: String (file path),
  organizer: String,
  dates: [Date],
  mode: Enum ['online', 'offline', 'hybrid'],
  description: String,
  location: String,
  prizePool: String,
  themes: [String],
  registrationLink: String,
  collegeDBLink: String,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

### Application Schema
```javascript
{
  hackathon: ObjectId (ref: Hackathon),
  student: ObjectId (ref: User),
  status: Enum ['pending', 'approved', 'rejected'],
  timestamps: true
}
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Hackathons (Coordinator Only)
- `POST /api/hackathons` - Create hackathon
- `GET /api/hackathons` - Get all hackathons
- `GET /api/hackathons/:id` - Get single hackathon
- `PUT /api/hackathons/:id` - Update hackathon
- `DELETE /api/hackathons/:id` - Delete hackathon
- `GET /api/hackathons/participated-students` - Get students with filters

### Applications (Student Only)
- `POST /api/applications` - Apply to hackathon
- `GET /api/applications/my-applications` - Get user's applications

## 📦 Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `multer` - File upload handling
- `express-validator` - Input validation

### Frontend
- `react` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `jspdf` - PDF generation
- `jspdf-autotable` - PDF tables
- `xlsx` - Excel export
- `lucide-react` - Icon library
- `tailwindcss` - Utility-first CSS

## 🎨 UI Framework

**Tailwind CSS** - Chosen for:
- Utility-first approach for rapid development
- Minimal custom CSS needed
- Responsive design out of the box
- Modern gradient and shadow utilities
- Easy customization

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or Atlas)

### Backend Setup
```bash
cd backend
npm install
# Ensure MongoDB is running
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/innovation_updates
JWT_SECRET=your_super_secret_jwt_key_change_this
```

Optional: Frontend environment (create `frontend/.env`):
```
# API origin used by the frontend for file downloads
REACT_APP_API_ORIGIN=http://localhost:5003
```

## 👥 User Roles & Features

### Innovation Coordinator (Admin)
✅ Create, update, delete hackathons
✅ Upload event posters
✅ View all participated students
✅ Filter students by:
  - Hackathon event
  - Date range
  - Mode (online/offline/hybrid)
✅ Export options:
  - Excel spreadsheet
  - PDF student list (names + roll numbers)
  - Official OD Letter to HOD (auto-generated)

### Student
✅ View all available hackathons
✅ Apply to hackathons
✅ View application status
✅ Track applied events
✅ Browse by themes and modes

## 📄 OD Letter Auto-Generation

The system automatically generates official On-Duty letters with:
- Proper formatting as per college standards
- Auto-filled event dates from database
- Student names and roll numbers
- Professional letter structure
- Ready for HOD approval

## 🔒 Security Best Practices

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 30-day expiration
- Protected routes with middleware
- Role-based access control
- Input validation on all endpoints
- CORS enabled for frontend communication
- No sensitive data in client-side code

## 🎯 Key Features

1. **Single Authentication System** - One signup/login for both roles
2. **Role-Based Dashboards** - Automatic routing based on user role
3. **File Upload Support** - Poster images with multer
4. **Advanced Filtering** - Multi-criteria student search
5. **Export Functionality** - Excel and PDF generation
6. **Responsive Design** - Works on all devices
7. **Modern UI** - Gradient backgrounds, smooth transitions
8. **Real-time Updates** - Instant data refresh after operations

## 🚦 Running the Application

1. Start MongoDB service
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm start`
4. Access at `http://localhost:3000`
5. Create coordinator account to manage events
6. Create student accounts to apply for hackathons

## 📝 Code Style

- Human-written, readable code
- Minimal comments (self-documenting)
- Consistent naming conventions
- Modular architecture
- Separation of concerns
- DRY principles followed

## 🔄 Future Enhancements

- Email notifications
- Real-time chat support
- Analytics dashboard
- Certificate generation
- Team formation features
- Payment integration for paid events
