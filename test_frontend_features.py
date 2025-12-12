#!/usr/bin/env python3
"""
Test script for frontend features
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🏥 Testing Health Endpoint...")
    response = requests.get(f"{BASE_URL}/api/v1/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
    return response.status_code == 200

def test_register():
    """Test user registration"""
    print("\n📝 Testing User Registration...")
    data = {
        "email": "test@example.com",
        "password": "test123456",
        "name": "Test User"
    }
    response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=data)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   User ID: {result.get('user_id')}")
        print(f"   API Key: {result.get('api_key')[:20]}...")
        return result.get('api_key')
    else:
        print(f"   Error: {response.text}")
        return None

def test_login():
    """Test user login"""
    print("\n🔐 Testing User Login...")
    data = {
        "email": "test@example.com",
        "password": "test123456"
    }
    response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=data)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   Session Token: {result.get('session_token')[:20]}...")
        return result.get('api_key')
    else:
        print(f"   Error: {response.text}")
        return None

def test_scan(api_key):
    """Test contract scanning"""
    print("\n🔍 Testing Contract Scan...")
    headers = {"X-API-Key": api_key} if api_key else {}
    data = {
        "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",  # USDC
        "chain": "ethereum"
    }
    response = requests.post(f"{BASE_URL}/api/v1/scan", json=data, headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   Safety Score: {result.get('safety_score')}")
        print(f"   Risk Level: {result.get('risk_level')}")
        return True
    else:
        print(f"   Error: {response.text}")
        return False

def test_payment(api_key):
    """Test payment creation"""
    print("\n💳 Testing Payment Creation...")
    headers = {"X-API-Key": api_key} if api_key else {}
    data = {
        "plan": "basic",
        "currency": "USD"
    }
    response = requests.post(f"{BASE_URL}/api/v1/payments/create", json=data, headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   Payment ID: {result.get('payment_id')}")
        print(f"   Amount: {result.get('amount')} {result.get('currency')}")
        return True
    else:
        print(f"   Error: {response.text}")
        return False

def test_free_payment(api_key):
    """Test free plan activation"""
    print("\n🆓 Testing Free Plan...")
    headers = {"X-API-Key": api_key} if api_key else {}
    data = {
        "plan": "free",
        "currency": "USD"
    }
    response = requests.post(f"{BASE_URL}/api/v1/payments/create", json=data, headers=headers)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"   Status: {result.get('status')}")
        return result.get('status') == 'completed'
    else:
        print(f"   Error: {response.text}")
        return False

def main():
    print("🧪 Testing Frontend Features\n")
    print("=" * 50)
    
    # Test health
    if not test_health():
        print("\n❌ Backend is not running. Please start it first.")
        return
    
    # Test registration
    api_key = test_register()
    
    # Test login
    if api_key:
        api_key = test_login()
    
    # Test scan
    if api_key:
        test_scan(api_key)
    
    # Test payments
    if api_key:
        test_free_payment(api_key)
        test_payment(api_key)
    
    print("\n" + "=" * 50)
    print("✅ Testing Complete!")

if __name__ == "__main__":
    main()

