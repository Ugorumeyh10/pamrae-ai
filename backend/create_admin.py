#!/usr/bin/env python3
"""
Script to create an admin account for testing
"""
import requests
import sys

def create_admin(email, password, name):
    """Create an admin account"""
    url = "http://localhost:8000/api/v1/admin/create"
    headers = {
        "X-Admin-Secret": "pamrae_admin_2025"
    }
    params = {
        "email": email,
        "password": password,
        "name": name
    }
    
    try:
        response = requests.post(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            print("✅ Admin account created successfully!")
            print(f"\n📧 Email: {data['email']}")
            print(f"🆔 User ID: {data['user_id']}")
            print(f"🔑 API Key: {data['api_key']}")
            print(f"\n💡 Use this API key to authenticate requests")
            return data
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Error creating admin: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python create_admin.py <email> <password> <name>")
        print("\nExample:")
        print("  python create_admin.py admin@pamrae.ai admin123 Admin User")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    name = sys.argv[3]
    
    create_admin(email, password, name)

