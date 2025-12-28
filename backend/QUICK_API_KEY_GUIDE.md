# Quick API Key Guide - Direct Links

## 🔑 Get API Keys in 5 Minutes

### 1. Etherscan API Key (Essential - FREE)
**What it's for**: Contract creation dates, holder counts, transaction data

**Direct Links**:
- 🔗 **Register**: https://etherscan.io/register
- 🔗 **Get API Key**: https://etherscan.io/myapikey
- 🔗 **Documentation**: https://docs.etherscan.io/

**Steps**:
1. Click "Register" link above
2. Fill in email, username, password
3. Verify email
4. Login and go to "Get API Key" link
5. Click "Add" button
6. Give it a name (e.g., "Pamrae AI")
7. Copy the API key
8. Add to `.env`: `ETHERSCAN_API_KEY=your_key_here`

**Rate Limits**: 5 calls/second, 100,000 calls/day (FREE)

---

### 2. Basescan API Key (Essential - FREE)
**What it's for**: Base network contract data

**Direct Links**:
- 🔗 **Register**: https://basescan.org/register
- 🔗 **Get API Key**: https://basescan.org/myapikey

**Steps**: Same as Etherscan (above)

**Rate Limits**: Same as Etherscan (FREE)

---

### 3. Polygonscan API Key (Essential - FREE)
**What it's for**: Polygon network contract data

**Direct Links**:
- 🔗 **Register**: https://polygonscan.com/register
- 🔗 **Get API Key**: https://polygonscan.com/myapikey

**Steps**: Same as Etherscan (above)

**Rate Limits**: Same as Etherscan (FREE)

---

### 4. CoinGecko API Key (Optional - FREE tier available)
**What it's for**: Token prices, market cap, price history

**Direct Links**:
- 🔗 **Get API Key**: https://www.coingecko.com/en/api/pricing
- 🔗 **Documentation**: https://www.coingecko.com/en/api/documentation

**Steps**:
1. Click "Get API Key" link above
2. Choose free tier (or paid for better limits)
3. Sign up
4. Get API key from dashboard
5. Add to `.env`: `COINGECKO_API_KEY=your_key_here`

**OR**: Leave empty to use free public API (rate limited to 10-30 calls/minute)

**Rate Limits**:
- Free: 500 calls/month
- Analyst ($129/mo): 10,000 calls/month

---

## 📝 After Getting Keys

### Option 1: Use Helper Script
```bash
cd backend
python3 get_api_keys_helper.py
```
This will guide you through getting keys and automatically update `.env`

### Option 2: Manual Setup
1. Open `backend/.env` file
2. Replace `your_etherscan_api_key_here` with your actual key
3. Do the same for other keys
4. Save the file
5. Restart backend server

---

## ✅ Already Configured

- ✅ **OpenSea API Key**: Already in `.env` (for NFT analysis)
- ⚠️ **MCP Token**: In `.env` but needs integration

---

## 🧪 Test Your Setup

After adding keys, test them:

```bash
cd backend

# Test OpenSea (already configured)
python3 test_opensea_api.py

# Test Etherscan (once you add key)
curl "https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&apikey=YOUR_KEY"
```

---

## 🚀 Restart Server

After adding keys, restart your backend:

```bash
cd backend
# Stop current server (Ctrl+C if running)
python main.py
```

---

## 💡 Tips

- **Start with Etherscan** - Most important for contract data
- **All keys are FREE** - No credit card required
- **Get keys in parallel** - Open multiple tabs to speed up
- **Keep keys safe** - Never commit `.env` to git (already in .gitignore)
- **Test each key** - Verify they work before moving on

---

## ❓ Need Help?

- Check `API_INTEGRATION_GUIDE.md` for detailed information
- Check `GET_API_KEYS.md` for step-by-step instructions
- Run `python3 get_api_keys_helper.py` for interactive setup

