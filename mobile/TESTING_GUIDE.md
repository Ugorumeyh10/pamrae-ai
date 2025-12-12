# Mobile App Testing Guide

Complete guide to testing the Contract Scanner mobile app on different platforms.

## 📋 Prerequisites

Before testing, make sure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Backend running** - The FastAPI server must be running on port 8000
3. **Expo CLI** (optional but recommended):
   ```bash
   npm install -g expo-cli
   ```

### Platform-Specific Requirements

**For iOS (Mac only):**
- Xcode (from App Store)
- iOS Simulator (comes with Xcode)
- CocoaPods: `sudo gem install cocoapods`

**For Android:**
- Android Studio
- Android SDK
- Android Emulator (set up in Android Studio)

**For Physical Devices:**
- Expo Go app from App Store (iOS) or Play Store (Android)

## 🚀 Step-by-Step Testing

### Step 1: Start the Backend

**Terminal 1:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

✅ Backend should be running at `http://localhost:8000`

### Step 2: Configure API URL

Edit `mobile/config.js` based on your testing platform:

**For iOS Simulator:**
```javascript
export const API_BASE_URL = 'http://localhost:8000';
```

**For Android Emulator:**
```javascript
export const API_BASE_URL = 'http://10.0.2.2:8000';
```

**For Physical Device:**
1. Find your computer's IP address:
   - Mac/Linux: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Windows: `ipconfig` (look for IPv4 Address)
2. Update config.js:
   ```javascript
   export const API_BASE_URL = 'http://192.168.1.XXX:8000';  // Your IP
   ```
3. Make sure your phone and computer are on the same WiFi network
4. Ensure firewall allows connections on port 8000

### Step 3: Install Mobile App Dependencies

**Terminal 2:**
```bash
cd mobile
npm install
```

### Step 4: Start Expo Development Server

```bash
npm start
```

This will:
- Start the Metro bundler
- Open Expo DevTools in your browser
- Display a QR code for physical devices

### Step 5: Run on Your Platform

#### Option A: iOS Simulator (Mac only)

1. Make sure Xcode is installed
2. In the Expo terminal, press `i`
3. Wait for the simulator to launch and app to load

**Or manually:**
```bash
npm run ios
```

#### Option B: Android Emulator

1. Start Android Emulator from Android Studio
2. In the Expo terminal, press `a`
3. Wait for the app to load

**Or manually:**
```bash
npm run android
```

#### Option C: Physical Device

1. Install **Expo Go** app on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Make sure phone and computer are on the same WiFi

3. Scan the QR code displayed in the terminal or browser

4. The app will load on your device

## 🧪 Testing Scenarios

### Test 1: Scan by Contract Address

1. Open the app
2. Select "Address" mode
3. Choose a blockchain (e.g., Ethereum)
4. Enter a contract address:
   - **USDC on Ethereum**: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
   - **Uniswap Router**: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`
5. Tap "Scan Contract"
6. ✅ Verify: Results screen appears with safety score

### Test 2: Upload Solidity File

1. Select "Upload" mode
2. Tap "Select Solidity File"
3. Choose a `.sol` file from your device
4. Select blockchain network
5. Tap "Scan Contract"
6. ✅ Verify: Results appear with analysis

### Test 3: View Results

1. After scanning, verify:
   - ✅ Safety score is displayed (0-100)
   - ✅ Risk level is shown
   - ✅ Vulnerabilities section is visible
   - ✅ Rug-pull indicators are listed
   - ✅ AI explanation is readable
   - ✅ Recommendations are shown

### Test 4: Download PDF Report

1. On results screen, tap "Download PDF Report"
2. ✅ Verify: PDF generation starts
3. ✅ Verify: Share dialog appears (on mobile)
4. ✅ Verify: PDF can be saved/shared

### Test 5: Multi-Chain Support

Test with different chains:
- Ethereum
- Base
- Polygon
- Solana

✅ Verify: Each chain works correctly

## 🔧 Troubleshooting

### Issue: "Cannot connect to API"

**Solutions:**
1. Verify backend is running: `curl http://localhost:8000/api/v1/health`
2. Check `config.js` has correct URL
3. For physical devices, verify IP address is correct
4. Check firewall settings
5. Ensure phone and computer are on same network

### Issue: "Expo Go can't connect"

**Solutions:**
1. Make sure Expo CLI is installed: `npm install -g expo-cli`
2. Try clearing cache: `expo start -c`
3. Restart Expo: Stop (Ctrl+C) and run `npm start` again
4. Check network connection

### Issue: "Module not found" errors

**Solutions:**
```bash
cd mobile
rm -rf node_modules
npm install
```

### Issue: iOS Simulator won't start

**Solutions:**
1. Open Xcode → Preferences → Locations → Command Line Tools (select version)
2. Run: `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`
3. Try: `npm run ios` again

### Issue: Android Emulator won't start

**Solutions:**
1. Open Android Studio
2. Tools → AVD Manager
3. Start an emulator manually
4. Then run: `npm run android`

### Issue: PDF download not working

**Solutions:**
1. Check backend is running
2. Verify API endpoint: `http://localhost:8000/api/v1/report`
3. Check file permissions on device
4. Try on a different platform

## 📱 Testing Checklist

- [ ] App launches successfully
- [ ] Can switch between Address/Upload modes
- [ ] Can select blockchain network
- [ ] Can enter contract address
- [ ] Can upload Solidity file
- [ ] Scan completes successfully
- [ ] Results screen displays correctly
- [ ] Safety score is shown
- [ ] Vulnerabilities are listed
- [ ] Rug-pull indicators are shown
- [ ] AI explanation is readable
- [ ] Recommendations are displayed
- [ ] PDF download works
- [ ] All chains work (Ethereum, Base, Polygon, Solana)
- [ ] UI is responsive and looks good
- [ ] No crashes or errors

## 🎯 Quick Test Commands

```bash
# Start backend
cd backend && python main.py

# Start mobile app (in new terminal)
cd mobile && npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web (for quick testing)
npm run web
```

## 💡 Pro Tips

1. **Use Web Version First**: Test with `npm run web` to quickly verify functionality
2. **Check Backend Logs**: Watch the backend terminal for API requests
3. **Use React Native Debugger**: Install for better debugging
4. **Test on Multiple Devices**: Different screen sizes and OS versions
5. **Network Testing**: Test on different WiFi networks
6. **Offline Testing**: Test error handling when backend is down

## 🐛 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Network request failed` | Check API_BASE_URL in config.js |
| `Expo Go can't connect` | Ensure same WiFi network |
| `Module not found` | Run `npm install` again |
| `Port already in use` | Kill process: `lsof -ti:8081 | xargs kill` |
| `Metro bundler error` | Clear cache: `expo start -c` |

## ✅ Success Indicators

You'll know everything is working when:
- ✅ App loads without errors
- ✅ Can scan a contract successfully
- ✅ Results display with all sections
- ✅ PDF can be downloaded/shared
- ✅ No console errors
- ✅ Smooth UI interactions

Happy Testing! 🚀

