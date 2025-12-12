# Render Deployment Fix

## Issue
Render was looking for `requirements.txt` in the root directory, but it's in `backend/`.

## Solution
Update your Render service configuration:

### In Render Dashboard:

1. Go to your service: https://dashboard.render.com/
2. Click on your `pamrae-ai-backend` service
3. Go to "Settings"
4. Update these fields:

**Build Command:**
```
cd backend && pip install -r requirements.txt
```

**Start Command:**
```
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Root Directory:**
```
backend
```

5. Click "Save Changes"
6. Render will automatically redeploy

### Alternative: Use render.yaml

The `backend/render.yaml` file has been updated. If Render supports it, you can use that configuration.

---

## Quick Fix Commands

If you prefer to update via Render dashboard:

1. **Build Command**: `cd backend && pip install -r requirements.txt`
2. **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Root Directory**: `backend`

This tells Render to:
- Change to the backend directory
- Install requirements from there
- Run uvicorn from the backend directory

---

## After Fix

Once you update the settings:
1. Render will automatically redeploy
2. Wait 5-10 minutes
3. Check logs to ensure it's running
4. Test: `curl https://your-backend.onrender.com/api/v1/health`

