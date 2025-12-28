#!/bin/bash

# Mobile App Test Setup Script
# This script helps you set up and test the mobile app

echo "🚀 Contract Scanner Mobile App - Test Setup"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:8000/api/v1/health > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:8000"
else
    echo "⚠️  Backend is not running!"
    echo "   Please start the backend first:"
    echo "   cd backend && python main.py"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Detect platform
echo "🔍 Detecting platform..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "✅ macOS detected"
    PLATFORM="ios"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "✅ Linux detected"
    PLATFORM="android"
else
    echo "⚠️  Unknown platform, defaulting to web"
    PLATFORM="web"
fi

echo ""
echo "📱 Configuration:"
echo "   Platform: $PLATFORM"
echo "   Backend URL: Check mobile/config.js"
echo ""

# Get local IP for physical device testing
if [[ "$OSTYPE" == "darwin"* ]]; then
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    LOCAL_IP=$(hostname -I | awk '{print $1}')
fi

if [ ! -z "$LOCAL_IP" ]; then
    echo "💡 For physical device testing, update mobile/config.js:"
    echo "   export const API_BASE_URL = 'http://$LOCAL_IP:8000';"
    echo ""
fi

echo "🚀 Starting Expo development server..."
echo "   Press 'i' for iOS simulator"
echo "   Press 'a' for Android emulator"
echo "   Scan QR code with Expo Go for physical device"
echo ""

npm start


