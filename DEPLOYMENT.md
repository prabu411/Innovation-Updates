# Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Render account (sign up at render.com)
- MongoDB Atlas cluster (already configured)

---

## Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub
```bash
cd "Innovation Updates"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: innovation-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables on Render
Go to Environment tab and add:
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://ganeshprabubo2024cse_db_user:prabu2006@innovation-cluster.rapl0zf.mongodb.net/innovation_updates?retryWrites=true&w=majority
JWT_SECRET=mySuperSecretKey123
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Copy your backend URL: `https://innovation-backend-xxxx.onrender.com`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update API URL
1. Open `frontend/.env.production`
2. Replace with your Render backend URL:
```
REACT_APP_API_ORIGIN=https://innovation-backend-xxxx.onrender.com
```

### Step 2: Update API Configuration
Open `frontend/src/services/api.js` and ensure it uses:
```javascript
const API_URL = process.env.REACT_APP_API_ORIGIN || 'http://localhost:5003';
```

### Step 3: Deploy on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build

### Step 4: Add Environment Variable
In Vercel project settings → Environment Variables:
```
REACT_APP_API_ORIGIN=https://innovation-backend-xxxx.onrender.com
```

### Step 5: Deploy
- Click "Deploy"
- Wait for build (2-5 minutes)
- Your app will be live at: `https://your-app.vercel.app`

---

## Part 3: Update Backend CORS

After getting your Vercel URL, update backend CORS:

1. Open `backend/server.js`
2. Update CORS configuration:
```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

3. Commit and push changes
4. Render will auto-deploy

---

## Testing Deployment

1. Visit your Vercel URL
2. Try signing up/logging in
3. Test coordinator and student features
4. Verify file uploads work
5. Check MongoDB Atlas for data

---

## Troubleshooting

### Backend Issues
- Check Render logs: Dashboard → Logs
- Verify environment variables are set
- Ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Frontend Issues
- Check browser console for errors
- Verify REACT_APP_API_ORIGIN is correct
- Ensure backend CORS allows your Vercel domain

### Database Issues
- Check MongoDB Atlas → Network Access
- Verify connection string in Render env vars
- Check Atlas → Database Access for user permissions

---

## Free Tier Limitations

### Render Free Tier
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

### Vercel Free Tier
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

### MongoDB Atlas Free Tier
- 512 MB storage
- Shared cluster
- No backups

---

## Post-Deployment

1. Test all features thoroughly
2. Share your live URL
3. Monitor usage in dashboards
4. Set up custom domain (optional)

Your app is now live! 🚀
