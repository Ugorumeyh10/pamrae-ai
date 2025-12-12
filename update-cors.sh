#!/bin/bash

# CORS Update Helper Script
# Updates backend CORS to include frontend URL

echo "🔧 Pamrae AI - CORS Update Helper"
echo "=================================="
echo ""

read -p "Enter your Vercel frontend URL (e.g., https://pamrae-ai.vercel.app): " FRONTEND_URL

if [ -z "$FRONTEND_URL" ]; then
    echo "❌ Error: Frontend URL is required"
    exit 1
fi

echo ""
echo "📝 Updating backend/main.py CORS settings..."

# Read current main.py
CORS_SECTION=$(grep -A 10 "CORSMiddleware" backend/main.py | head -11)

# Check if URL already exists
if grep -q "$FRONTEND_URL" backend/main.py; then
    echo "✅ Frontend URL already in CORS settings"
else
    # Add frontend URL to CORS
    sed -i.bak "s|allow_origins=\[\"\\*\"\]|allow_origins=[\"$FRONTEND_URL\", \"http://localhost:3000\", \"http://localhost:5173\"]|g" backend/main.py
    
    echo "✅ Updated CORS in backend/main.py"
    echo ""
    echo "📋 Next steps:"
    echo "1. Commit the changes:"
    echo "   git add backend/main.py"
    echo "   git commit -m 'Update CORS for production'"
    echo "   git push"
    echo ""
    echo "2. Render will auto-redeploy, or manually redeploy in Render dashboard"
    echo ""
fi

