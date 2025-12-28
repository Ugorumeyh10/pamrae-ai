# Test Data for Pamrae AI Platform

## 🪙 Ethereum Contract Addresses (Real Contracts)

### Popular Tokens to Test

1. **USDC (USD Coin) - Stablecoin**
   - Address: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
   - Chain: `ethereum`
   - Type: `token`
   - ✅ Safe token with high liquidity

2. **WETH (Wrapped Ethereum)**
   - Address: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
   - Chain: `ethereum`
   - Type: `token`
   - ✅ Well-known, secure contract

3. **Uniswap V3 Router**
   - Address: `0xE592427A0AEce92De3Edee1F18E0157C05861564`
   - Chain: `ethereum`
   - Type: `defi`
   - ✅ Popular DEX router

4. **USDT (Tether)**
   - Address: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
   - Chain: `ethereum`
   - Type: `token`
   - ✅ Stablecoin

### NFT Contracts

5. **Bored Ape Yacht Club (BAYC)**
   - Address: `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`
   - Chain: `ethereum`
   - Type: `nft`
   - ✅ Popular NFT collection

6. **CryptoPunks**
   - Address: `0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB`
   - Chain: `ethereum`
   - Type: `nft`
   - ✅ Classic NFT collection

---

## 🔗 Base Chain Contracts

7. **USDC on Base**
   - Address: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
   - Chain: `base`
   - Type: `token`

8. **WETH on Base**
   - Address: `0x4200000000000000000000000000000000000006`
   - Chain: `base`
   - Type: `token`

---

## 📊 API Test Commands

### Test Market Insights (Real-time Data)
```bash
# Get market overview
curl http://localhost:8000/api/v1/market-insights

# Get top gainers
curl http://localhost:8000/api/v1/market-insights/top-gainers?limit=10

# Get top losers
curl http://localhost:8000/api/v1/market-insights/top-losers?limit=10
```

### Test Contract Scanning
```bash
# Scan USDC token
curl -X POST http://localhost:8000/api/v1/scan \
  -H "Content-Type: application/json" \
  -d '{
    "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "chain": "ethereum",
    "contract_type": "token"
  }'

# Scan NFT contract (BAYC)
curl -X POST http://localhost:8000/api/v1/scan \
  -H "Content-Type: application/json" \
  -d '{
    "contract_address": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    "chain": "ethereum",
    "contract_type": "nft"
  }'
```

### Test with API Key (if logged in)
```bash
# Replace YOUR_API_KEY with your actual API key
curl -X POST http://localhost:8000/api/v1/scan \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "chain": "ethereum",
    "contract_type": "token"
  }'
```

---

## 🧪 Frontend Test Scenarios

### 1. Basic Token Scan
1. Go to Home page
2. Select "Single Scan" mode
3. Select chain: **Ethereum**
4. Enter address: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
5. Click "Scan Contract"
6. Review results (should show safety score, vulnerabilities, token metrics)

### 2. NFT Scan
1. Select "Single Scan" mode
2. Select chain: **Ethereum**
3. Enter address: `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`
4. Select contract type: **NFT** (if available)
5. Click "Scan Contract"
6. Review NFT-specific analysis

### 3. Batch Scan
1. Select "Batch Scan" mode
2. Add multiple contracts:
   - `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` (USDC)
   - `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` (WETH)
   - `0xdAC17F958D2ee523a2206206994597C13D831ec7` (USDT)
3. Click "Scan All"

### 4. View Market Insights
1. Go to Home page - Trade Insights section should be visible
2. Or click "Insights" in navigation
3. Review:
   - Market overview stats
   - Top gainers
   - Top losers
   - Risk analysis

### 5. Download PDF Report
1. After scanning a contract
2. Click "Download PDF Report" button
3. PDF should download with full analysis

---

## 📝 Expected Test Results

### Safe Contracts (Should show High Safety Score)
- USDC: Expected safety score > 70
- WETH: Expected safety score > 70
- USDT: Expected safety score > 70

### Features to Verify
- ✅ Safety score calculation
- ✅ Vulnerability detection
- ✅ Rug-pull indicators
- ✅ Token metrics (if token contract)
- ✅ NFT analysis (if NFT contract)
- ✅ PDF report generation
- ✅ Real-time market data in Insights

---

## 🚨 Invalid Addresses for Error Testing

Use these to test error handling:

1. **Invalid address format**: `0x123`
   - Should show: "Invalid address format"

2. **Non-existent contract**: `0x0000000000000000000000000000000000000001`
   - Should show: "Contract not found"

3. **Wrong chain**: Use Ethereum address on Base chain
   - Should show: "Contract not found on this chain"

---

## 🔑 Authentication Test

### Create Account
1. Click "Sign Up"
2. Enter email: `test@example.com`
3. Enter password: `Test123456!`
4. Click "Create Account"
5. Save your API key when shown

### Login
1. Click "Sign In"
2. Enter credentials
3. Should see user menu in header

### Test Authenticated Features
- API Dashboard
- Personal scan history
- Enhanced insights (if logged in)

---

## 📈 Market Insights Expected Data

After restarting backend with CoinGecko API key, you should see:

- **Total Volume 24h**: Real number (e.g., $50B+)
- **Top Gainers**: Actual tokens with real price changes
- **Top Losers**: Actual tokens with real price changes
- **Market Cap**: Real-time global market cap

---

## 🎯 Quick Test Checklist

- [ ] Scan USDC contract (should work quickly)
- [ ] Scan BAYC NFT contract
- [ ] View Trade Insights (real-time data)
- [ ] Download PDF report
- [ ] Test batch scan
- [ ] Create account and login
- [ ] Test API Dashboard (if logged in)
- [ ] Test error handling with invalid addresses

---

## 💡 Tips

1. **Start with USDC** - It's a well-known, safe contract that should scan quickly
2. **Check console** - Open browser DevTools to see any errors
3. **Check backend logs** - Watch terminal where backend is running
4. **Test both modes** - Try address input and file upload (if you have Solidity code)

---

*Last updated: Test data for Pamrae AI platform*

