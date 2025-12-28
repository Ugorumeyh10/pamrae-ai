# Your Deployment Instructions

## ✅ Code Pushed to GitHub

Your code is now at: **https://github.com/Ugorumeyh10/pamrae-ai.git**

---

## 🚀 Step 1: Deploy Backend to Render

### Go to: https://dashboard.render.com/

1. **Click**: "New +" → "Web Service"

2. **Connect Repository**:
   - If not connected, click "Connect account" and authorize GitHub
   - Select repository: `Ugorumeyh10/pamrae-ai`

3. **Configure Service**:
   ```
   Name: pamrae-ai-backend
   Environment: Python 3
   Region: Choose closest (Oregon, Frankfurt, Singapore)
   Branch: main
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Environment Variables**:
   Click "Add Environment Variable":
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (get from OpenAI dashboard)

5. **Click**: "Create Web Service"

6. **Wait**: 5-10 minutes for deployment

7. **Copy Backend URL**: 
   - Will be: `https://pamrae-ai-backend.onrender.com` (or similar)
   - Copy this URL - you'll need it for frontend!

---

## 🌐 Step 2: Deploy Frontend to Vercel

### Go to: https://vercel.com/henry-ugorumes-projects

1. **Click**: "Add New..." → "Project"

2. **Import Repository**:
   - If not connected, connect GitHub account
   - Select: `Ugorumeyh10/pamrae-ai`

3. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables**:
   Click "Add" to add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL (from Step 1)
     Example: `https://pamrae-ai-backend.onrender.com`

5. **Click**: "Deploy"

6. **Wait**: 2-5 minutes for deployment

7. **Copy Frontend URL**: 
   - Will be: `https://pamrae-ai.vercel.app` (or similar)
   - Copy this URL - you'll need it for CORS!

---

## 🔧 Step 3: Update CORS

After frontend is deployed, update backend CORS:

1. **Edit** `backend/main.py`

2. **Find** the CORS section (around line 26-32)

3. **Update** to include your Vercel URL:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://pamrae-ai.vercel.app",  # Your Vercel URL (update this!)
           "http://localhost:3000",
           "http://localhost:5173",
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

4. **Commit and Push**:
   ```bash
   git add backend/main.py
   git commit -m "Update CORS for production"
   git push
   ```

5. **Render will auto-redeploy** (or manually redeploy in Render dashboard)

---

## ✅ Step 4: Test Everything

1. Visit your Vercel frontend URL
2. Test features:
   - ✅ Sign up / Login
   - ✅ Contract scanning
   - ✅ Payment flow
   - ✅ All pages

---

## 📋 Quick Reference

**Your URLs:**
- **GitHub**: https://github.com/Ugorumeyh10/pamrae-ai.git
- **Render Dashboard**: https://dashboard.render.com/
- **Vercel Dashboard**: https://vercel.com/henry-ugorumes-projects
- **Backend**: `https://pamrae-ai-backend.onrender.com` (after deployment)
- **Frontend**: `https://pamrae-ai.vercel.app` (after deployment)

**Environment Variables Needed:**

**Render (Backend):**
- `OPENAI_API_KEY`: (Your OpenAI API key - get from OpenAI dashboard)

**Vercel (Frontend):**
- `VITE_API_URL`: (Your Render backend URL)

---

## 🆘 Troubleshooting

**Backend not starting?**
- Check Render logs: https://dashboard.render.com/
- Verify `OPENAI_API_KEY` is set
- Check build logs for errors

**Frontend can't connect?**
- Verify `VITE_API_URL` is set to your Render backend URL
- Check CORS settings in backend
- Test backend: `curl https://your-backend.onrender.com/api/v1/health`

**CORS errors?**
- Make sure Vercel URL is in backend CORS
- Verify backend is redeployed after CORS update
- Check URLs match exactly (including https://)

---

**Status**: Code pushed ✅  
**Next**: Deploy to Render and Vercel (follow steps above)

