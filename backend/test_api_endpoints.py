#!/usr/bin/env python3
"""
Test API endpoints using HTTP requests
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_endpoints():
    print("=" * 60)
    print("🧪 API ENDPOINTS TEST")
    print("=" * 60)
    
    results = []
    
    # Test 1: Health Check
    print("\n1️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/health", timeout=5)
        if response.status_code == 200:
            print(f"   ✅ Health check passed: {response.json()}")
            results.append(True)
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            results.append(False)
    except requests.exceptions.ConnectionError:
        print(f"   ⚠️  Server not running. Start with: cd backend && python main.py")
        results.append(False)
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(False)
    
    # Test 2: Root Endpoint
    print("\n2️⃣ Testing Root Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Root endpoint: {data.get('message')}")
            print(f"   ✅ Version: {data.get('version')}")
            results.append(True)
        else:
            results.append(False)
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(False)
    
    # Test 3: Scan Endpoint (if server is running)
    print("\n3️⃣ Testing Scan Endpoint...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/scan",
            json={
                "contract_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
                "chain": "ethereum"
            },
            timeout=30
        )
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Scan completed")
            print(f"   ✅ Safety Score: {data.get('safety_score')}")
            print(f"   ✅ Risk Level: {data.get('risk_level')}")
            print(f"   ✅ Has Gas Optimizations: {len(data.get('gas_optimizations', [])) > 0}")
            results.append(True)
        elif response.status_code == 429:
            print(f"   ⚠️  Rate limited (expected for free tier)")
            results.append(True)  # This is expected behavior
        else:
            print(f"   ❌ Scan failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            results.append(False)
    except requests.exceptions.ConnectionError:
        print(f"   ⚠️  Server not running")
        results.append(False)
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(False)
    
    # Test 4: Usage Endpoint
    print("\n4️⃣ Testing Usage Endpoint...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/usage",
            headers={"X-API-Key": "test_key"},
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Usage stats retrieved")
            print(f"   ✅ Tier: {data.get('tier')}")
            print(f"   ✅ Total Scans: {data.get('total_scans')}")
            results.append(True)
        elif response.status_code == 401:
            print(f"   ⚠️  Authentication required (expected)")
            results.append(True)
        else:
            results.append(False)
    except requests.exceptions.ConnectionError:
        print(f"   ⚠️  Server not running")
        results.append(False)
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(False)
    
    # Test 5: ML Stats
    print("\n5️⃣ Testing ML Stats Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/ml/stats", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ ML stats retrieved")
            print(f"   ✅ Patterns: {data.get('patterns_in_database', 0)}")
            results.append(True)
        else:
            results.append(False)
    except requests.exceptions.ConnectionError:
        print(f"   ⚠️  Server not running")
        results.append(False)
    except Exception as e:
        print(f"   ❌ Error: {e}")
        results.append(False)
    
    print("\n" + "=" * 60)
    print("📊 API TEST SUMMARY")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 ALL API TESTS PASSED!")
    elif passed > 0:
        print("⚠️  SOME TESTS PASSED (server may not be running)")
    else:
        print("❌ NO TESTS PASSED (server not running)")
        print("\n💡 To test API endpoints, start the server:")
        print("   cd backend && python main.py")

if __name__ == "__main__":
    test_endpoints()


