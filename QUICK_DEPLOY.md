# Quick Deployment Guide

## 🚀 Automated Deployment Steps

### Prerequisites
- GitHub account
- Render.com account (free)
- Vercel account (free)
- OpenAI API key

---

## Step 1: Prepare and Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"
git branch -M main

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/pamrae-ai.git
git push -u origin main
```

---

## Step 2: Deploy Backend (Render)

### Option A: Use Render Dashboard (Recommended)

1. **Go to Render**: https://render.com
2. **Sign up/Login** (use GitHub for easy connection)
3. **New Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub account
   - Select your repository
4. **Configure Service**:
   ```
   Name: pamrae-ai-backend
   Environment: Python 3
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. **Environment Variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key
6. **Create Service**
7. **Wait for deployment** (5-10 minutes)
8. **Copy your backend URL**: `https://pamrae-ai-backend.onrender.com`

### Option B: Use Helper Script

```bash
./deploy-backend.sh
```

---

## Step 3: Deploy Frontend (Vercel)

### Option A: Use Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** (use GitHub for easy connection)
3. **New Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
4. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
5. **Environment Variables**:
   - `VITE_API_URL`: Your Render backend URL (from Step 2)
6. **Deploy**
7. **Wait for deployment** (2-5 minutes)
8. **Copy your frontend URL**: `https://pamrae-ai.vercel.app`

### Option B: Use Helper Script

```bash
./deploy-frontend.sh
# Enter your Render backend URL when prompted
```

---

## Step 4: Update CORS

After frontend is deployed, update backend CORS:

### Option A: Manual Update

1. Edit `backend/main.py`
2. Add your Vercel URL to `allow_origins`:
   ```python
   allow_origins=[
       "https://your-app.vercel.app",  # Your Vercel URL
       "http://localhost:3000",
       "http://localhost:5173",
   ],
   ```
3. Commit and push:
   ```bash
   git add backend/main.py
   git commit -m "Update CORS for production"
   git push
   ```
4. Render will auto-redeploy

### Option B: Use Helper Script

```bash
./update-cors.sh
# Enter your Vercel URL when prompted
# Then commit and push the changes
```

---

## Step 5: Test Everything

1. Visit your Vercel frontend URL
2. Test features:
   - ✅ Sign up / Login
   - ✅ Contract scanning
   - ✅ Payment flow
   - ✅ All pages load correctly
   - ✅ API calls work

---

## 🎯 Quick Reference

### Your URLs (after deployment):
- **Backend**: `https://pamrae-ai-backend.onrender.com`
- **Frontend**: `https://pamrae-ai.vercel.app`
- **API Docs**: `https://pamrae-ai-backend.onrender.com/docs`

### Environment Variables Needed:

**Backend (Render):**
- `OPENAI_API_KEY`

**Frontend (Vercel):**
- `VITE_API_URL` (your Render backend URL)

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- Check Render logs
- Verify `requirements.txt` is correct
- Check Python version (should be 3.13+)

**Problem**: Environment variables not working
- Make sure they're set in Render dashboard
- Redeploy after adding variables

### Frontend Issues

**Problem**: Can't connect to backend
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Test backend URL directly: `curl https://your-backend.onrender.com/api/v1/health`

**Problem**: Build fails
- Check Vercel build logs
- Test build locally: `cd frontend && npm run build`
- Verify all dependencies in `package.json`

### CORS Issues

**Problem**: CORS errors in browser
- Make sure frontend URL is in backend CORS `allow_origins`
- Check that backend is redeployed after CORS update
- Verify URLs match exactly (including https://)

---

## 📊 Deployment Status Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL copied
- [ ] CORS updated in backend
- [ ] Backend redeployed with new CORS
- [ ] All features tested
- [ ] Environment variables set correctly

---

## 💡 Pro Tips

1. **Use GitHub for deployment**: Both Render and Vercel auto-deploy on push
2. **Test locally first**: Make sure everything works before deploying
3. **Monitor logs**: Check deployment logs for errors
4. **Keep secrets safe**: Never commit API keys to GitHub
5. **Use environment variables**: All sensitive data should be in env vars

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Check logs**: Both platforms have detailed logs in dashboard
- **Test endpoints**: Use `curl` or Postman to test API

---

**Total Deployment Time**: ~15-20 minutes  
**Cost**: $0/month (free tiers)

