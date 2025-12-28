# How to Get API Keys - Step by Step

## 🔑 Essential APIs (Start Here)

### 1. Etherscan API Key (FREE)
**Why**: Get contract creation date, holder count, transaction data

**Steps**:
1. Visit: https://etherscan.io/register
2. Create account and verify email
3. Go to: https://etherscan.io/myapikey
4. Click **"Add"** button
5. Give it a name (e.g., "Pamrae AI")
6. Copy the API key
7. Add to `.env`: `ETHERSCAN_API_KEY=your_key_here`

**Rate Limits**: 
- Free: 5 calls/second, 100,000 calls/day
- Pro ($50/mo): 10 calls/second, 1,000,000 calls/day

---

### 2. Basescan API Key (FREE)
**Why**: Same as Etherscan but for Base network

**Steps**:
1. Visit: https://basescan.org/register
2. Create account
3. Go to: https://basescan.org/myapikey
4. Create new API key
5. Add to `.env`: `BASESCAN_API_KEY=your_key_here`

---

### 3. Polygonscan API Key (FREE)
**Why**: For Polygon network contracts

**Steps**:
1. Visit: https://polygonscan.com/register
2. Create account  
3. Go to: https://polygonscan.com/myapikey
4. Create new API key
5. Add to `.env`: `POLYGONSCAN_API_KEY=your_key_here`

---

## 💰 Price Data APIs

### CoinGecko API Key (OPTIONAL - Free tier available)
**Why**: Get token prices, market cap, price history

**Steps**:
1. Visit: https://www.coingecko.com/en/api/pricing
2. Choose free tier (or paid for better limits)
3. Sign up and get API key
4. Add to `.env`: `COINGECKO_API_KEY=your_key_here`

**OR**: Leave empty to use free public API (limited to 10-30 calls/minute)

**Rate Limits**:
- Free: 500 calls/month
- Analyst ($129/mo): 10,000 calls/month

---

## 🎨 NFT APIs (Optional)

### OpenSea API Key (FREE tier available)
**Why**: Get NFT floor prices, trading volumes

**Steps**:
1. Visit: https://opensea.io/
2. Create account
3. Go to: https://docs.opensea.io/reference/api-overview
4. Request API access
5. Add to `.env`: `OPENSEA_API_KEY=your_key_here`

---

## ⚡ APIs That Work Without Keys (Use Now!)

These work immediately without any setup:

✅ **DEXScreener** - Liquidity data (no key needed)
✅ **CoinGecko Public API** - Basic price data (no key, but rate limited)
✅ **Public RPC Nodes** - Basic blockchain queries

---

## 📝 Quick Setup

1. **Create `.env` file**:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Add your keys** (open `.env` file):
   ```bash
   ETHERSCAN_API_KEY=ABC123XYZ789
   BASESCAN_API_KEY=DEF456UVW012
   POLYGONSCAN_API_KEY=GHI789RST345
   COINGECKO_API_KEY=optional_key_here
   ```

3. **Restart backend**:
   ```bash
   # Stop current server (Ctrl+C)
   python main.py
   ```

---

## 🎯 Priority Order

**Start with these (5 minutes)**:
1. ✅ Etherscan (most important)
2. ✅ Basescan
3. ✅ Polygonscan

**Then add (if needed)**:
4. CoinGecko (for better price data)
5. OpenSea (for NFT analysis)

**Can wait**:
- Solana RPC (only if supporting Solana)
- Premium API tiers (only if hitting rate limits)

---

## 🔒 Security Reminder

- ⚠️ **Never commit `.env` file to Git**
- ✅ Already added to `.gitignore`
- ✅ Use `.env.example` as template
- ✅ Use different keys for dev/production

---

## 🧪 Test Your Keys

```bash
# Test Etherscan (replace YOUR_KEY and contract address)
curl "https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&apikey=YOUR_KEY"

# Should return JSON with transaction hash if working
```

---

## 💡 Tips

- Start with free tiers - they're usually enough
- Monitor usage in API provider dashboards
- Implement caching to reduce API calls
- Use API keys in production, public APIs for development
- Rotate keys if exposed

