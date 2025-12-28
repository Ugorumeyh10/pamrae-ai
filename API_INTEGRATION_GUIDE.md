# API Integration Guide

This guide explains how to integrate real APIs for blockchain data, prices, and analytics.

## Required API Keys

### 1. Block Explorer APIs (Required for Contract Data)

#### Etherscan (Ethereum)
- **Website**: https://etherscan.io/apis
- **Get API Key**: 
  1. Create account at https://etherscan.io/register
  2. Go to https://etherscan.io/myapikey
  3. Create new API key
  4. Free tier: 5 calls/second, 100,000 calls/day

**Add to `.env`:**
```bash
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

#### Basescan (Base Network)
- **Website**: https://basescan.org/apis
- **Get API Key**: Same process as Etherscan
- **Free tier**: Same rate limits

**Add to `.env`:**
```bash
BASESCAN_API_KEY=your_basescan_api_key_here
```

#### Polygonscan (Polygon Network)
- **Website**: https://polygonscan.com/apis
- **Get API Key**: Same process as Etherscan

**Add to `.env`:**
```bash
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

### 2. Price Data APIs

#### CoinGecko (Recommended - Free Tier Available)
- **Website**: https://www.coingecko.com/en/api
- **Get API Key**: 
  1. Go to https://www.coingecko.com/en/api/pricing
  2. Choose free tier (500 calls/month) or paid plan
  3. Register and get API key
  4. Free tier: 10-50 calls/minute (depends on plan)

**Add to `.env`:**
```bash
COINGECKO_API_KEY=your_coingecko_api_key_here
```

**Alternative - CoinGecko Free (No Key Required)**:
- Can use without API key (strict rate limits)
- 10-30 calls/minute
- Code already supports this - just leave key empty

#### Alternative: CoinMarketCap
- **Website**: https://coinmarketcap.com/api/
- **Free tier**: 333 calls/day
- More limited but good alternative

### 3. DEX/Liquidity Data APIs

#### Uniswap Subgraph (Free - No Key Required)
- **Documentation**: https://thegraph.com/explorer/subgraphs?id=5xMSe3wTNLgFQqsAc5SCVVwT4MiRb5AogJCuTNmVw8aH
- **Endpoint**: https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2
- No API key needed, but rate limited

#### DEXScreener API (Free - No Key Required)
- **Website**: https://docs.dexscreener.com/
- **Endpoint**: https://api.dexscreener.com/latest/dex/tokens/
- Free tier: Good rate limits, no key required

#### Uniswap V3 Subgraph
- **Endpoint**: https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
- For liquidity pool data

### 4. NFT Marketplace APIs

#### OpenSea API
- **Website**: https://docs.opensea.io/reference/api-overview
- **Get API Key**: 
  1. Go to https://opensea.io/
  2. Create account
  3. Apply for API access at https://opensea.io/api
  4. Free tier: 4 requests/second

**Add to `.env`:**
```bash
OPENSEA_API_KEY=your_opensea_api_key_here
```

#### Blur API (Alternative)
- Check their documentation for API access
- Good for Solana NFTs

### 5. Solana RPC (For Solana Support)

#### QuickNode (Recommended)
- **Website**: https://www.quicknode.com/
- **Free tier**: 1,000 requests/day
- **Get API Key**: 
  1. Sign up at https://www.quicknode.com/
  2. Create endpoint
  3. Get RPC URL

**Add to `.env`:**
```bash
SOLANA_RPC_URL=https://your-endpoint.quiknode.pro/your-key/
```

**Free Alternatives**:
- Public RPC: https://api.mainnet-beta.solana.com (unreliable, rate limited)
- Helius: https://www.helius.dev/ (free tier available)

## Environment Setup

### 1. Create `.env` file in backend directory

```bash
cd backend
touch .env
```

### 2. Add all API keys to `.env`:

```bash
# Block Explorer APIs
ETHERSCAN_API_KEY=your_etherscan_key_here
BASESCAN_API_KEY=your_basescan_key_here
POLYGONSCAN_API_KEY=your_polygonscan_key_here

# Price Data
COINGECKO_API_KEY=your_coingecko_key_here
# Or leave empty to use free tier without key

# NFT Marketplaces
OPENSEA_API_KEY=your_opensea_key_here

# Solana
SOLANA_RPC_URL=https://your-solana-rpc-url.com

# Optional: Rate limit settings
API_RATE_LIMIT_ENABLED=true
```

### 3. Update `.gitignore` to exclude `.env`:

```bash
echo ".env" >> .gitignore
```

## Code Updates Required

The services are already structured to use environment variables. You just need to:

1. Load environment variables in each service
2. Replace hardcoded API URLs with env vars
3. Add API keys to requests

## Testing APIs

### Test Etherscan API:
```bash
curl "https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&apikey=YOUR_KEY"
```

### Test CoinGecko API:
```bash
curl "https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&vs_currencies=usd&x_cg_demo_api_key=YOUR_KEY"
```

### Test DEXScreener (No Key):
```bash
curl "https://api.dexscreener.com/latest/dex/tokens/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
```

## Priority Order for Implementation

1. **Start with Free/No-Key APIs**:
   - DEXScreener (liquidity data)
   - CoinGecko free tier (price data)
   - Public RPC nodes (basic blockchain data)

2. **Add Block Explorer APIs** (Essential):
   - Etherscan (contract creation, holder count)
   - Basescan
   - Polygonscan

3. **Add Premium APIs** (For better data):
   - CoinGecko Pro (better rate limits)
   - OpenSea (NFT data)
   - QuickNode (Solana support)

## Rate Limiting Best Practices

1. Cache API responses (use Redis or in-memory cache)
2. Implement exponential backoff for rate limit errors
3. Use connection pooling for HTTP clients
4. Batch requests when possible
5. Monitor API usage to stay within limits

## Cost Estimation

### Free Tier (Getting Started):
- Etherscan: Free (100k calls/day)
- CoinGecko: Free (500 calls/month) or Demo (unlimited with attribution)
- DEXScreener: Free
- Total: **$0/month**

### Production Tier (Recommended):
- Etherscan Pro: ~$50/month (1M calls/day)
- CoinGecko Pro: ~$129/month (10k calls/month)
- OpenSea: Free tier usually sufficient
- QuickNode: $49/month (starter plan)
- Total: **~$228/month**

## Next Steps

1. Sign up for API keys (start with free tiers)
2. Add keys to `.env` file
3. Update service files to load from environment
4. Test each API endpoint
5. Implement caching layer
6. Monitor usage and upgrade plans as needed

