# 🚀 Quick Test Guide

## Fastest Test (Copy & Paste)

### 1. Test Safe Token (USDC)
**Address:** `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
**Chain:** Ethereum
**Expected:** High safety score (70+), minimal vulnerabilities

### 2. Test NFT (Bored Ape)
**Address:** `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`
**Chain:** Ethereum
**Expected:** NFT analysis, collection info

### 3. Test Market Insights
- Go to Home page → See Trade Insights section
- Or click "Insights" in navigation
- Should show real-time data (BTC price, market cap, etc.)

## Copy These Addresses:

**USDC (Stablecoin):**
```
0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
```

**WETH (Wrapped ETH):**
```
0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
```

**BAYC NFT:**
```
0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D
```

**USDT:**
```
0xdAC17F958D2ee523a2206206994597C13D831ec7
```

## Test API Directly:

```bash
# Market insights (real-time)
curl http://localhost:8000/api/v1/market-insights

# Scan USDC
curl -X POST http://localhost:8000/api/v1/scan \
  -H "Content-Type: application/json" \
  -d '{"contract_address":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","chain":"ethereum","contract_type":"token"}'
```
