# Quick API Setup Guide

## Step 1: Get Free API Keys (5 minutes)

### Etherscan (Essential - Free)
1. Go to https://etherscan.io/register
2. Verify email
3. Go to https://etherscan.io/myapikey
4. Click "Add" to create new API key
5. Copy the key

### Basescan (Essential - Free)
1. Same process at https://basescan.org/
2. Register and create API key at https://basescan.org/myapikey

### Polygonscan (Essential - Free)
1. Same process at https://polygonscan.com/
2. Register and create API key at https://polygonscan.com/myapikey

### CoinGecko (Recommended - Free Tier)
1. Go to https://www.coingecko.com/en/api/pricing
2. Sign up for free account
3. Get API key from dashboard
4. OR leave empty to use free public tier (rate limited)

## Step 2: Create .env File

```bash
cd backend
cp .env.example .env
```

Then edit `.env` and add your keys:

```bash
ETHERSCAN_API_KEY=ABC123XYZ789...
BASESCAN_API_KEY=DEF456UVW012...
POLYGONSCAN_API_KEY=GHI789RST345...
COINGECKO_API_KEY=your_key_here_or_leave_empty
```

## Step 3: Install python-dotenv (if not already installed)

```bash
cd backend
source venv/bin/activate  # or your venv activation
pip install python-dotenv
```

## Step 4: Test Your Setup

```bash
# Test Etherscan (replace with your key and a contract address)
curl "https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&apikey=YOUR_KEY"

# Test CoinGecko (works without key too)
curl "https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&vs_currencies=usd"

# Test DEXScreener (no key needed)
curl "https://api.dexscreener.com/latest/dex/tokens/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
```

## Step 5: Restart Backend

```bash
# Stop current backend (Ctrl+C)
# Then restart
cd backend
source venv/bin/activate
python main.py
```

## What Works Without API Keys?

- ✅ DEXScreener API (liquidity data) - No key needed
- ✅ CoinGecko free tier (limited) - Can work without key
- ✅ Basic blockchain queries - Works with public RPC nodes

## What Requires API Keys?

- ❌ Contract creation block - Needs Etherscan/Basescan/Polygonscan
- ❌ Holder count - Needs block explorer APIs  
- ❌ Better rate limits - All APIs work better with keys

## Troubleshooting

### "Rate limit exceeded"
- Add API keys to increase limits
- Implement caching (see API_INTEGRATION_GUIDE.md)

### "API key invalid"
- Double-check key in .env file
- Make sure there are no extra spaces
- Verify key is active in API provider dashboard

### ".env file not found"
- Make sure .env is in the `backend/` directory
- Copy from .env.example if needed
- Don't commit .env to git!

