#!/bin/bash

# Automated Deployment Script for Pamrae AI
# This script automates as much as possible

set -e  # Exit on error

echo "🚀 Pamrae AI - Automated Deployment"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git not initialized. Initializing...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
    echo -e "${GREEN}✅ Git initialized${NC}"
fi

# Check if code is committed
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes found. Committing...${NC}"
    git add .
    git commit -m "Update: $(date +%Y-%m-%d)"
    echo -e "${GREEN}✅ Changes committed${NC}"
fi

echo ""
echo "✅ Prerequisites check complete"
echo ""

# Check if GitHub remote exists
if git remote get-url origin >/dev/null 2>&1; then
    GITHUB_REPO=$(git remote get-url origin)
    echo -e "${GREEN}✅ GitHub remote found: $GITHUB_REPO${NC}"
else
    echo -e "${YELLOW}⚠️  No GitHub remote found${NC}"
    echo ""
    read -p "Enter your GitHub repository URL (or press Enter to skip): " GITHUB_REPO
    if [ -n "$GITHUB_REPO" ]; then
        git remote add origin "$GITHUB_REPO"
        echo -e "${GREEN}✅ GitHub remote added${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipping GitHub remote setup${NC}"
    fi
fi

echo ""
echo "📦 Deployment Preparation Complete!"
echo ""
echo "📋 Next Steps (Manual - Require Authentication):"
echo ""
echo "1️⃣  BACKEND DEPLOYMENT (Render.com):"
echo "   • Go to: https://render.com"
echo "   • Sign up/Login (free)"
echo "   • Click 'New +' → 'Web Service'"
echo "   • Connect GitHub → Select this repo"
echo "   • Configure:"
echo "     - Name: pamrae-ai-backend"
echo "     - Root Directory: backend"
echo "     - Build: pip install -r requirements.txt"
echo "     - Start: uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo "   • Add Env Var: OPENAI_API_KEY"
echo "   • Deploy → Copy backend URL"
echo ""
echo "2️⃣  FRONTEND DEPLOYMENT (Vercel.com):"
echo "   • Go to: https://vercel.com"
echo "   • Sign up/Login (free)"
echo "   • Click 'Add New...' → 'Project'"
echo "   • Import GitHub repo"
echo "   • Configure:"
echo "     - Root Directory: frontend"
echo "     - Framework: Vite"
echo "   • Add Env Var: VITE_API_URL = (your Render backend URL)"
echo "   • Deploy → Copy frontend URL"
echo ""
echo "3️⃣  UPDATE CORS:"
echo "   • Edit backend/main.py"
echo "   • Add frontend URL to allow_origins"
echo "   • Commit & push (Render auto-redeploys)"
echo ""
echo "📖 For detailed instructions, see: QUICK_DEPLOY.md"
echo ""

# Try to push to GitHub if remote exists
if git remote get-url origin >/dev/null 2>&1; then
    echo -e "${YELLOW}Attempting to push to GitHub...${NC}"
    if git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null; then
        echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not push to GitHub (may need authentication)${NC}"
        echo "   You can push manually: git push -u origin main"
    fi
fi

echo ""
echo "✅ Deployment preparation complete!"
echo ""

