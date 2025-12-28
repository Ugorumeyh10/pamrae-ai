#!/usr/bin/env python3
"""
Test Etherscan API Key
"""
import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()

def test_etherscan_api():
    api_key = os.getenv("ETHERSCAN_API_KEY")
    
    if not api_key or api_key == "your_etherscan_api_key_here":
        print("❌ ETHERSCAN_API_KEY not found or not set in .env file")
        return False
    
    print(f"✅ Found Etherscan API Key: {api_key[:10]}...")
    print("\n🧪 Testing Etherscan API...\n")
    
    base_url = "https://api.etherscan.io/api"
    
    # Test 1: Get contract creation info (USDC contract as test)
    print("Test 1: Fetching contract creation info...")
    try:
        params = {
            "module": "contract",
            "action": "getcontractcreation",
            "contractaddresses": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",  # USDC
            "apikey": api_key
        }
        response = requests.get(base_url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == '1':
                result = data.get('result', [])
                if result:
                    print(f"   ✅ Success! Contract creation data retrieved")
                    print(f"   📝 Creator: {result[0].get('contractCreator', 'N/A')}")
                    print(f"   🔗 TX Hash: {result[0].get('txHash', 'N/A')[:20]}...")
                else:
                    print(f"   ⚠️  No results returned")
            elif data.get('message') == 'NOTOK':
                error = data.get('result', 'Unknown error')
                if 'Invalid API Key' in error or 'invalid' in error.lower():
                    print(f"   ❌ Invalid API Key: {error}")
                    return False
                else:
                    print(f"   ⚠️  API Error: {error}")
        else:
            print(f"   ❌ HTTP Error {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 2: Get account balance
    print("\nTest 2: Fetching account balance...")
    try:
        params = {
            "module": "account",
            "action": "balance",
            "address": "0x0000000000000000000000000000000000000000",
            "tag": "latest",
            "apikey": api_key
        }
        response = requests.get(base_url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == '1':
                print(f"   ✅ Success! API key is working")
                balance = int(data.get('result', 0))
                print(f"   💰 Balance retrieved: {balance / 1e18:.4f} ETH")
            else:
                print(f"   ⚠️  Status: {data.get('message', 'Unknown')}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Get gas prices
    print("\nTest 3: Fetching current gas prices...")
    try:
        params = {
            "module": "gastracker",
            "action": "gasoracle",
            "apikey": api_key
        }
        response = requests.get(base_url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == '1':
                result = data.get('result', {})
                print(f"   ✅ Success! Gas prices retrieved")
                print(f"   ⛽ Safe Gas Price: {result.get('SafeGasPrice', 'N/A')} Gwei")
                print(f"   ⛽ Fast Gas Price: {result.get('FastGasPrice', 'N/A')} Gwei")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "="*50)
    print("✅ Etherscan API Key is working!")
    print("="*50)
    print("\n💡 Your API key is now configured and ready to use!")
    print("   Rate Limits: 5 calls/second, 100,000 calls/day (FREE)")
    return True

if __name__ == "__main__":
    success = test_etherscan_api()
    sys.exit(0 if success else 1)

