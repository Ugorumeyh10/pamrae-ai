# Contract Scanner Mobile App

React Native mobile application for the AI Smart Contract Threat Scanner.

## 🚀 Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API configuration:
Edit `config.js` and set `API_BASE_URL` to your backend server URL:
- For iOS Simulator: `http://localhost:8000`
- For Android Emulator: `http://10.0.2.2:8000`
- For physical devices: `http://YOUR_COMPUTER_IP:8000`

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## 📱 Features

- Scan contracts by address
- Upload Solidity source code
- View detailed security analysis
- Download PDF reports
- Multi-chain support (Ethereum, Base, Polygon, Solana)
- Beautiful, native mobile UI

## 🔧 Configuration

Make sure your backend API is running and accessible from your mobile device/emulator. Update the `API_BASE_URL` in `config.js` accordingly.

## 📦 Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

Or use EAS Build:
```bash
eas build --platform ios
eas build --platform android
```

