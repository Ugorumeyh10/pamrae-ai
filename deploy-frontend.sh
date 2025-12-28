#!/bin/bash

# Frontend Deployment Helper Script
# This script helps prepare and deploy the frontend to Vercel

echo "🚀 Pamrae AI - Frontend Deployment Helper"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Check if backend URL is provided
read -p "Enter your Render backend URL (e.g., https://pamrae-ai-backend.onrender.com): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Error: Backend URL is required"
    exit 1
fi

echo ""
echo "📝 Creating production environment file..."

# Create .env.production
cat > frontend/.env.production << EOF
VITE_API_URL=$BACKEND_URL
EOF

echo "✅ Created frontend/.env.production"
echo ""

# Test build locally
echo "🧪 Testing build locally..."
cd frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying"
    exit 1
fi

echo "✅ Build successful!"
echo ""

cd ..

echo "📋 Next Steps:"
echo ""
echo "1. Go to https://vercel.com"
echo "2. Sign up or log in"
echo "3. Click 'Add New...' → 'Project'"
echo "4. Import your GitHub repository"
echo "5. Configure:"
echo "   - Framework Preset: Vite"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo "6. Add Environment Variable:"
echo "   - VITE_API_URL: $BACKEND_URL"
echo "7. Click 'Deploy'"
echo ""
echo "⏳ Deployment will take 2-5 minutes"
echo ""
echo "📋 After deployment, update backend CORS with your Vercel URL"
echo ""


