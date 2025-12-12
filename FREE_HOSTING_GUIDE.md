# Free Hosting Guide for Pamrae AI

This guide covers free hosting options for all components of the Pamrae AI platform.

## 🎯 Quick Start - Recommended Free Stack

**Best Free Hosting Combination:**
- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel or Netlify (Free tier)
- **Database**: Supabase (Free tier) or keep file-based storage
- **Storage**: GitHub (for code) + Render file system (temporary)

---

## 📦 Backend Hosting (FastAPI)

### Option 1: Render.com (Recommended) ⭐

**Why Render?**
- Free tier with 750 hours/month
- Automatic SSL
- Easy deployment from GitHub
- Supports Python/FastAPI
- Free PostgreSQL (optional)

**Setup Steps:**

1. **Prepare for Deployment:**
```bash
# Create render.yaml in backend/
cd backend
```

Create `render.yaml`:
```yaml
services:
  - type: web
    name: pamrae-ai-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: OPENAI_API_KEY
        sync: false
      - key: PORT
        value: 8000
```

2. **Deploy:**
   - Sign up at [render.com](https://render.com)
   - Connect GitHub repository
   - Select "New Web Service"
   - Choose your repository
   - Set:
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
     - **Environment**: Python 3
   - Add environment variables:
     - `OPENAI_API_KEY`: Your OpenAI key
   - Deploy!

**Free Tier Limits:**
- 750 hours/month (enough for 24/7)
- Spins down after 15 min inactivity (wakes on request)
- 512 MB RAM
- Free SSL

**Note**: Update CORS in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "https://your-frontend.netlify.app",
        "http://localhost:3000"  # For local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Option 2: Railway.app

**Why Railway?**
- $5 free credit monthly
- Easy deployment
- Good for Python apps

**Setup:**
1. Sign up at [railway.app](https://railway.app)
2. Connect GitHub
3. New Project → Deploy from GitHub
4. Add environment variables
5. Deploy!

### Option 3: Fly.io

**Why Fly.io?**
- Free tier with 3 shared VMs
- Global edge network
- Good performance

**Setup:**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Initialize (in backend/)
cd backend
fly launch

# Deploy
fly deploy
```

### Option 4: PythonAnywhere

**Why PythonAnywhere?**
- Free tier available
- Simple setup
- Good for beginners

**Limitations:**
- Free tier: Only accessible from whitelisted IPs
- Limited to 1 web app
- No custom domains on free tier

---

## 🌐 Frontend Hosting (React)

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Best for React/Next.js
- Automatic deployments from GitHub
- Free SSL
- Global CDN
- Excellent performance

**Setup Steps:**

1. **Prepare Build:**
```bash
cd frontend
# Ensure package.json has build script
npm run build  # Test locally first
```

2. **Deploy:**
   - Sign up at [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Set:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add environment variables:
     - `VITE_API_URL`: Your backend URL (e.g., `https://pamrae-ai.onrender.com`)
   - Deploy!

3. **Update API URL:**
Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.onrender.com
```

Update `frontend/src` files to use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

**Free Tier:**
- Unlimited deployments
- 100 GB bandwidth/month
- Free SSL
- Custom domains

### Option 2: Netlify

**Why Netlify?**
- Great for static sites
- Easy deployment
- Free SSL

**Setup:**
1. Sign up at [netlify.com](https://netlify.com)
2. Connect GitHub
3. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add environment variables
5. Deploy!

### Option 3: GitHub Pages

**Why GitHub Pages?**
- Free with GitHub
- Simple setup
- Good for static sites

**Limitations:**
- Only static sites
- No server-side features
- Custom domain requires repo to be public

**Setup:**
```bash
cd frontend
npm run build

# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json:
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# Deploy
npm run deploy
```

---

## 💾 Database/Storage Options

### Option 1: Keep File-Based Storage (Current)

**Pros:**
- No setup needed
- Works with current code
- Free

**Cons:**
- Not scalable
- Data lost on redeploy (unless persistent volumes)

**For Render:**
- Use persistent disk (free tier: 1 GB)
- Mount at `/opt/render/project/src/data`

### Option 2: Supabase (Recommended) ⭐

**Why Supabase?**
- Free PostgreSQL database
- 500 MB database
- Free authentication
- Good free tier

**Setup:**
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string
4. Update backend to use PostgreSQL instead of file storage

**Migration:**
- Install: `pip install psycopg2-binary sqlalchemy`
- Create database models
- Migrate file-based data to database

### Option 3: MongoDB Atlas

**Why MongoDB Atlas?**
- Free 512 MB cluster
- Good for document storage
- Easy to use

**Setup:**
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update backend

### Option 4: PlanetScale (MySQL)

**Why PlanetScale?**
- Free MySQL database
- Serverless
- Good performance

---

## 📱 Mobile App Hosting

### Option 1: Expo (Recommended)

**Why Expo?**
- Free hosting for Expo apps
- OTA updates
- Easy deployment

**Deploy:**
```bash
cd mobile
npx expo publish
```

**Update API URL:**
Update `mobile/config.js`:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000'
  : 'https://your-backend.onrender.com'
```

### Option 2: App Stores (Free)

- **Apple App Store**: $99/year (one-time)
- **Google Play Store**: $25 one-time

For now, use Expo Go app to test without publishing.

---

## 🔧 Complete Deployment Checklist

### Backend Deployment

- [ ] Update CORS to allow frontend domain
- [ ] Set environment variables
- [ ] Test API endpoints
- [ ] Configure persistent storage (if needed)
- [ ] Set up health check endpoint

### Frontend Deployment

- [ ] Update API URL to production backend
- [ ] Test all features
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)
- [ ] Test on mobile devices

### Post-Deployment

- [ ] Test all API endpoints
- [ ] Verify CORS is working
- [ ] Test payment flow (if applicable)
- [ ] Check error handling
- [ ] Monitor logs

---

## 🚀 Step-by-Step: Complete Free Deployment

### Step 1: Deploy Backend (Render)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main

# 2. Go to render.com
# 3. New Web Service
# 4. Connect GitHub repo
# 5. Configure:
#    - Name: pamrae-ai-backend
#    - Environment: Python 3
#    - Build: pip install -r requirements.txt
#    - Start: uvicorn main:app --host 0.0.0.0 --port $PORT
#    - Root Directory: backend
# 6. Add env vars:
#    - OPENAI_API_KEY: your_key
# 7. Deploy!
```

**Backend URL**: `https://pamrae-ai-backend.onrender.com`

### Step 2: Deploy Frontend (Vercel)

```bash
# 1. Update API URL
cd frontend
echo "VITE_API_URL=https://pamrae-ai-backend.onrender.com" > .env.production

# 2. Update axios calls to use env var
# In your components, use:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

# 3. Push to GitHub
git add .
git commit -m "Update API URL for production"
git push

# 4. Go to vercel.com
# 5. Import GitHub repo
# 6. Configure:
#    - Framework: Vite
#    - Root Directory: frontend
#    - Build: npm run build
#    - Output: dist
# 7. Add env var:
#    - VITE_API_URL: https://pamrae-ai-backend.onrender.com
# 8. Deploy!
```

**Frontend URL**: `https://pamrae-ai.vercel.app`

### Step 3: Update Backend CORS

```python
# In backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pamrae-ai.vercel.app",
        "https://pamrae-ai.netlify.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Test Everything

```bash
# Test backend
curl https://pamrae-ai-backend.onrender.com/api/v1/health

# Test frontend
# Visit https://pamrae-ai.vercel.app
```

---

## 💡 Tips for Free Hosting

### 1. Optimize for Free Tiers

**Backend:**
- Use efficient algorithms
- Cache results when possible
- Minimize dependencies
- Use async operations

**Frontend:**
- Optimize bundle size
- Use code splitting
- Compress images
- Minimize API calls

### 2. Handle Cold Starts

**Render/Railway:**
- Add health check endpoint
- Use keep-alive pings (free service)
- Consider paid tier for production

### 3. Monitor Usage

- Track API calls
- Monitor bandwidth
- Watch database size
- Set up alerts

### 4. Backup Strategy

- Use GitHub for code
- Export data regularly
- Keep local backups
- Document deployment process

---

## 🔒 Security Considerations

### 1. Environment Variables

- Never commit secrets
- Use platform env vars
- Rotate keys regularly
- Use different keys for dev/prod

### 2. CORS Configuration

- Only allow trusted domains
- Don't use `allow_origins=["*"]` in production
- Validate all inputs
- Use HTTPS everywhere

### 3. Rate Limiting

- Implement rate limits
- Use API keys
- Monitor abuse
- Block suspicious IPs

---

## 📊 Free Tier Comparison

| Service | Free Tier | Best For | Limitations |
|---------|-----------|----------|-------------|
| **Render** | 750 hrs/month | Backend | Spins down after inactivity |
| **Vercel** | Unlimited | Frontend | 100 GB bandwidth |
| **Netlify** | 100 GB bandwidth | Frontend | Build time limits |
| **Railway** | $5 credit/month | Backend | Credit-based |
| **Fly.io** | 3 shared VMs | Backend | Limited resources |
| **Supabase** | 500 MB DB | Database | Limited storage |
| **MongoDB Atlas** | 512 MB | Database | Shared cluster |

---

## 🎯 Recommended Free Stack

**For Production-Ready Free Hosting:**

```
Backend:  Render.com
Frontend: Vercel
Database: Supabase (if migrating from files)
Storage:  Render persistent disk (1 GB free)
Mobile:   Expo (free hosting)
```

**Total Cost: $0/month**

---

## 🚨 Important Notes

1. **Cold Starts**: Free tiers may have cold starts (15-30 seconds)
2. **Data Persistence**: File-based storage may reset on redeploy
3. **Rate Limits**: Free tiers have usage limits
4. **Custom Domains**: Some services require paid tier
5. **SSL**: All recommended services provide free SSL

---

## 📝 Quick Reference Commands

### Render Deployment
```bash
# Update and deploy
git add .
git commit -m "Update"
git push
# Render auto-deploys
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### Check Deployments
```bash
# Backend health
curl https://your-backend.onrender.com/api/v1/health

# Frontend
# Visit your Vercel URL
```

---

## 🆘 Troubleshooting

### Backend Not Starting
- Check logs in Render dashboard
- Verify environment variables
- Test locally first
- Check Python version

### Frontend Can't Connect to Backend
- Verify CORS settings
- Check API URL in env vars
- Test backend directly
- Check browser console for errors

### Database Issues
- Verify connection string
- Check database is running
- Verify credentials
- Check network access

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Documentation](https://docs.expo.dev)

---

**Last Updated**: January 2025  
**Recommended Stack**: Render + Vercel + Supabase  
**Total Monthly Cost**: $0

