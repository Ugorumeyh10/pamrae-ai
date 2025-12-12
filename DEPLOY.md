# Deployment Instructions

## Prerequisites

1. GitHub account with your code pushed
2. Render.com account (free)
3. Vercel account (free)
4. OpenAI API key

## Step 1: Push Code to GitHub

```bash
# If not already done
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your repository
5. Configure:
   - **Name**: `pamrae-ai-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`
6. Add Environment Variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PORT`: `8000` (auto-set by Render)
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Copy your backend URL (e.g., `https://pamrae-ai-backend.onrender.com`)

## Step 3: Update Backend CORS

Update `backend/main.py` CORS settings:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pamrae-ai.vercel.app",  # Will update after frontend deploy
        "http://localhost:3000",
        "http://localhost:5173"  # Vite default port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push:
```bash
git add backend/main.py
git commit -m "Update CORS for production"
git push
```

## Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up/login
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (from Step 2)
6. Click "Deploy"
7. Wait for deployment (2-5 minutes)
8. Copy your frontend URL (e.g., `https://pamrae-ai.vercel.app`)

## Step 5: Update CORS with Frontend URL

1. Go back to Render dashboard
2. Update backend environment variable or update code:
   - Add your Vercel URL to CORS origins
3. Redeploy backend

## Step 6: Test Deployment

1. Visit your Vercel frontend URL
2. Test all features:
   - Sign up/Login
   - Contract scanning
   - Payment flow
   - All pages

## Troubleshooting

- **Backend not starting**: Check Render logs
- **Frontend can't connect**: Verify CORS and API URL
- **Environment variables**: Make sure they're set correctly
- **Build errors**: Check logs in deployment dashboard

