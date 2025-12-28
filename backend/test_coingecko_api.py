"""
Test CoinGecko API Integration
"""
import asyncio
import aiohttp
import os
from dotenv import load_dotenv

load_dotenv()

async def test_coingecko_api():
    """Test CoinGecko API with the provided key"""
    api_key = os.getenv("COINGECKO_API_KEY", "")
    base_url = "https://api.coingecko.com/api/v3"
    
    headers = {}
    if api_key:
        headers["x-cg-demo-api-key"] = api_key
        print(f"✅ Using API key: {api_key[:10]}...")
    else:
        print("⚠️ No API key found")
    
    async with aiohttp.ClientSession() as session:
        # Test 1: Simple price check
        print("\n1. Testing simple price API...")
        try:
            url = f"{base_url}/simple/price"
            params = {
                "vs_currencies": "usd",
                "ids": "bitcoin,ethereum"
            }
            async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Price check successful!")
                    if "bitcoin" in data:
                        print(f"   BTC: ${data['bitcoin']['usd']:,.2f}")
                    if "ethereum" in data:
                        print(f"   ETH: ${data['ethereum']['usd']:,.2f}")
                else:
                    text = await response.text()
                    print(f"❌ Error: {response.status} - {text}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Test 2: Global market data
        print("\n2. Testing global market API...")
        try:
            url = f"{base_url}/global"
            async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                if response.status == 200:
                    data = await response.json()
                    global_data = data.get("data", {})
                    total_market_cap = global_data.get("total_market_cap", {}).get("usd", 0)
                    total_volume = global_data.get("total_volume", {}).get("usd", 0)
                    print(f"✅ Global data successful!")
                    print(f"   Total Market Cap: ${total_market_cap:,.0f}")
                    print(f"   Total Volume 24h: ${total_volume:,.0f}")
                else:
                    text = await response.text()
                    print(f"❌ Error: {response.status} - {text}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Test 3: Top gainers
        print("\n3. Testing top gainers API...")
        try:
            url = f"{base_url}/coins/markets"
            params = {
                "vs_currency": "usd",
                "order": "price_change_percentage_24h_desc",
                "per_page": 5,
                "page": 1
            }
            async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                if response.status == 200:
                    coins = await response.json()
                    print(f"✅ Top gainers successful!")
                    for coin in coins[:3]:
                        print(f"   {coin.get('symbol', '').upper()}: +{coin.get('price_change_percentage_24h', 0):.2f}%")
                else:
                    text = await response.text()
                    print(f"❌ Error: {response.status} - {text}")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🔍 Testing CoinGecko API Integration...\n")
    asyncio.run(test_coingecko_api())
    print("\n✅ Test complete!")

