#!/bin/bash

echo "🧪 Testing All Contracts - Pamrae AI"
echo "====================================="
echo ""

BASE_URL="http://localhost:8000"

# Test 1: Market Insights
echo "1️⃣  Testing Market Insights API..."
RESULT=$(curl -s "${BASE_URL}/api/v1/market-insights")
if echo "$RESULT" | grep -q "overview"; then
    echo "   ✅ Market Insights: Working"
    echo "$RESULT" | python3 -c "import sys, json; d=json.load(sys.stdin); print(f'   📊 Total Volume: \${d[\"overview\"][\"total_volume_24h\"]:,.0f}')" 2>/dev/null || echo "   📊 Data received"
else
    echo "   ❌ Market Insights: Failed"
fi
echo ""

# Test 2: USDC Token
echo "2️⃣  Testing USDC Contract Scan..."
USDC_RESULT=$(curl -s -X POST "${BASE_URL}/api/v1/scan" \
  -H "Content-Type: application/json" \
  -d '{"contract_address":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","chain":"ethereum","contract_type":"token"}')

if echo "$USDC_RESULT" | grep -q "safety_score"; then
    SCORE=$(echo "$USDC_RESULT" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('safety_score', 'N/A'))" 2>/dev/null)
    echo "   ✅ USDC Scan: Success (Safety Score: $SCORE)"
else
    echo "   ❌ USDC Scan: Failed"
    echo "   Response: ${USDC_RESULT:0:200}"
fi
echo ""

# Test 3: WETH Token
echo "3️⃣  Testing WETH Contract Scan..."
WETH_RESULT=$(curl -s -X POST "${BASE_URL}/api/v1/scan" \
  -H "Content-Type: application/json" \
  -d '{"contract_address":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","chain":"ethereum","contract_type":"token"}')

if echo "$WETH_RESULT" | grep -q "safety_score"; then
    SCORE=$(echo "$WETH_RESULT" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('safety_score', 'N/A'))" 2>/dev/null)
    echo "   ✅ WETH Scan: Success (Safety Score: $SCORE)"
else
    echo "   ❌ WETH Scan: Failed"
fi
echo ""

# Test 4: BAYC NFT
echo "4️⃣  Testing BAYC NFT Contract Scan..."
BAYC_RESULT=$(curl -s -X POST "${BASE_URL}/api/v1/scan" \
  -H "Content-Type: application/json" \
  -d '{"contract_address":"0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D","chain":"ethereum","contract_type":"nft"}')

if echo "$BAYC_RESULT" | grep -q "safety_score"; then
    SCORE=$(echo "$BAYC_RESULT" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('safety_score', 'N/A'))" 2>/dev/null)
    echo "   ✅ BAYC NFT Scan: Success (Safety Score: $SCORE)"
else
    echo "   ❌ BAYC NFT Scan: Failed"
fi
echo ""

# Test 5: Top Gainers
echo "5️⃣  Testing Top Gainers API..."
GAINERS=$(curl -s "${BASE_URL}/api/v1/market-insights/top-gainers?limit=5")
if echo "$GAINERS" | grep -q "top_gainers"; then
    echo "   ✅ Top Gainers: Working"
    echo "$GAINERS" | python3 -c "import sys, json; d=json.load(sys.stdin); gains=d.get('top_gainers',[]); print(f'   📈 Found {len(gains)} gainers')" 2>/dev/null || echo "   📈 Data received"
else
    echo "   ❌ Top Gainers: Failed"
fi
echo ""

# Test 6: Top Losers
echo "6️⃣  Testing Top Losers API..."
LOSERS=$(curl -s "${BASE_URL}/api/v1/market-insights/top-losers?limit=5")
if echo "$LOSERS" | grep -q "top_losers"; then
    echo "   ✅ Top Losers: Working"
    echo "$LOSERS" | python3 -c "import sys, json; d=json.load(sys.stdin); loss=d.get('top_losers',[]); print(f'   📉 Found {len(loss)} losers')" 2>/dev/null || echo "   📉 Data received"
else
    echo "   ❌ Top Losers: Failed"
fi
echo ""

echo "====================================="
echo "✅ Testing Complete!"
echo ""
echo "💡 Frontend URL: http://localhost:3000"
echo "💡 Backend URL: http://localhost:8000"

