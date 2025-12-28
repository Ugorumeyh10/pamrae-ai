# Quick Start Guide

Get your AI Smart Contract Threat Scanner up and running in minutes!

## 🚀 Quick Setup

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

Backend will be running at `http://localhost:8000`

### 2. Frontend Setup (3 minutes)

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be running at `http://localhost:3000`

### 3. Test It Out!

1. Open `http://localhost:3000` in your browser
2. Enter a contract address (e.g., `0x...`) or upload a Solidity file
3. Select the blockchain network
4. Click "Scan Contract"
5. View results and download PDF report!

## 📱 Mobile App Setup (Optional)

```bash
# Navigate to mobile
cd mobile

# Install dependencies
npm install

# Update API URL in config.js
# For iOS Simulator: http://localhost:8000
# For Android Emulator: http://10.0.2.2:8000
# For physical device: http://YOUR_COMPUTER_IP:8000

# Start Expo
npm start
```

## 🧪 Example Contract Addresses to Test

**Ethereum:**
- USDC: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- Uniswap V2 Router: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`

**Base:**
- USDC on Base: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## 🔧 Troubleshooting

### Backend Issues
- **Port 8000 already in use**: Change port in `main.py` (uvicorn.run port parameter)
- **Module not found**: Make sure virtual environment is activated and dependencies are installed
- **Web3 connection error**: Check your internet connection and RPC endpoints

### Frontend Issues
- **Port 3000 already in use**: Vite will automatically use the next available port
- **API connection error**: Make sure backend is running on port 8000
- **CORS errors**: Backend CORS is configured for localhost:3000 and localhost:5173

### Mobile Issues
- **Cannot connect to API**: Update `API_BASE_URL` in `mobile/config.js`
- **Expo errors**: Make sure you have Expo CLI installed globally: `npm install -g expo-cli`

## 📚 Next Steps

1. **Add OpenAI API Key** (optional): For enhanced AI explanations, add your key to `backend/.env`
2. **Customize RPC Endpoints**: Update RPC URLs in `backend/services/scanner.py` for better performance
3. **Deploy Backend**: Deploy to Heroku, Railway, or AWS
4. **Deploy Frontend**: Deploy to Vercel, Netlify, or your preferred hosting
5. **Build Mobile App**: Use EAS Build or build natively

## 🎯 Production Checklist

- [ ] Set up environment variables
- [ ] Configure production RPC endpoints
- [ ] Set up database for scan history
- [ ] Implement rate limiting
- [ ] Add authentication (if needed)
- [ ] Set up monitoring/logging
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates
- [ ] Test all features end-to-end

## 💡 Tips

- Start with the web app first, then test mobile
- Use testnet contracts for initial testing
- Check browser console and terminal for error messages
- The scanner works best with verified contracts on Etherscan

Happy scanning! 🛡️


