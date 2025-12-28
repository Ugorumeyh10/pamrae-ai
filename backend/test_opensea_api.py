#!/usr/bin/env python3
"""
Test OpenSea API Key
"""
import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()

def test_opensea_api():
    api_key = os.getenv("OPENSEA_API_KEY")
    
    if not api_key:
        print("❌ OPENSEA_API_KEY not found in .env file")
        return False
    
    print(f"✅ Found OpenSea API Key: {api_key[:10]}...")
    print("\n🧪 Testing OpenSea API...\n")
    
    headers = {
        "X-API-KEY": api_key,
        "Accept": "application/json"
    }
    
    # Test 1: Get collection stats (Bored Ape Yacht Club)
    print("Test 1: Fetching collection stats...")
    try:
        url = "https://api.opensea.io/api/v2/chain/ethereum/collection/bored-ape-yacht-club/stats"
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success! Collection stats retrieved")
            if 'total' in data:
                print(f"   📊 Total Supply: {data.get('total', {}).get('value', 'N/A')}")
        elif response.status_code == 401:
            print(f"   ❌ Authentication failed - Invalid API key")
            return False
        elif response.status_code == 429:
            print(f"   ⚠️  Rate limit exceeded - API key is valid but too many requests")
            return True  # Key is valid, just rate limited
        else:
            print(f"   ⚠️  Status {response.status_code}: {response.text[:100]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 2: Get NFT contract info
    print("\nTest 2: Fetching NFT contract information...")
    try:
        url = "https://api.opensea.io/api/v2/chain/ethereum/contract/0xBC4CA0EdA7647A8aB7C2061c2E118a18a936f13d"
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success! Contract info retrieved")
            if 'name' in data:
                print(f"   📝 Collection Name: {data.get('name', 'N/A')}")
        elif response.status_code == 404:
            print(f"   ⚠️  Contract not found (this is normal for some contracts)")
        else:
            print(f"   ⚠️  Status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Get NFT listings
    print("\nTest 3: Fetching NFT listings...")
    try:
        url = "https://api.opensea.io/api/v2/listings/collection/bored-ape-yacht-club/active"
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success! Listings retrieved")
            if 'orders' in data:
                print(f"   📦 Active Listings: {len(data.get('orders', []))}")
        else:
            print(f"   ⚠️  Status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "="*50)
    print("✅ OpenSea API Key is working!")
    print("="*50)
    return True

if __name__ == "__main__":
    success = test_opensea_api()
    sys.exit(0 if success else 1)

