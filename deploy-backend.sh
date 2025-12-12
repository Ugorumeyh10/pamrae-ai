#!/bin/bash

# Backend Deployment Helper Script
# This script helps prepare and deploy the backend to Render

echo "🚀 Pamrae AI - Backend Deployment Helper"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "backend/main.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Check if requirements.txt exists
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Error: backend/requirements.txt not found"
    exit 1
fi

echo "📋 Pre-deployment Checklist:"
echo "  [ ] Code pushed to GitHub"
echo "  [ ] Render.com account created"
echo "  [ ] OpenAI API key ready"
echo ""

read -p "Have you pushed your code to GitHub? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⚠️  Please push your code to GitHub first:"
    echo "   git add ."
    echo "   git commit -m 'Ready for deployment'"
    echo "   git push origin main"
    exit 1
fi

echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Go to https://render.com"
echo "2. Sign up or log in"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your GitHub account"
echo "5. Select your repository"
echo "6. Configure:"
echo "   - Name: pamrae-ai-backend"
echo "   - Environment: Python 3"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo "   - Root Directory: backend"
echo "7. Add Environment Variables:"
echo "   - OPENAI_API_KEY: (your key)"
echo "8. Click 'Create Web Service'"
echo ""
echo "⏳ Deployment will take 5-10 minutes"
echo ""
echo "📋 After deployment, copy your backend URL and use it in frontend deployment"
echo ""

