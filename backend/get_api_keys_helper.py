#!/usr/bin/env python3
"""
Helper script to guide users through getting API keys
"""
import webbrowser
import sys
import os

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def open_url(url, description):
    print(f"📌 {description}")
    print(f"   URL: {url}")
    response = input("   Open in browser? (y/n): ").strip().lower()
    if response == 'y':
        webbrowser.open(url)
        print("   ✅ Opened in browser\n")
    else:
        print("   ⏭️  Skipped\n")

def get_etherscan_key():
    print_header("1. Get Etherscan API Key")
    print("Steps:")
    print("   1. Register at Etherscan (free)")
    print("   2. Verify your email")
    print("   3. Go to API Keys section")
    print("   4. Create new API key")
    print("   5. Copy the key")
    print("\nRate Limits: 5 calls/second, 100,000 calls/day (FREE)")
    print("\n")
    
    open_url("https://etherscan.io/register", "Etherscan Registration")
    open_url("https://etherscan.io/myapikey", "Etherscan API Keys Page")
    
    key = input("📝 Paste your Etherscan API key here (or press Enter to skip): ").strip()
    return key

def get_basescan_key():
    print_header("2. Get Basescan API Key")
    print("Steps:")
    print("   1. Register at Basescan (free)")
    print("   2. Verify your email")
    print("   3. Go to API Keys section")
    print("   4. Create new API key")
    print("   5. Copy the key")
    print("\nRate Limits: Same as Etherscan (FREE)")
    print("\n")
    
    open_url("https://basescan.org/register", "Basescan Registration")
    open_url("https://basescan.org/myapikey", "Basescan API Keys Page")
    
    key = input("📝 Paste your Basescan API key here (or press Enter to skip): ").strip()
    return key

def get_polygonscan_key():
    print_header("3. Get Polygonscan API Key")
    print("Steps:")
    print("   1. Register at Polygonscan (free)")
    print("   2. Verify your email")
    print("   3. Go to API Keys section")
    print("   4. Create new API key")
    print("   5. Copy the key")
    print("\nRate Limits: Same as Etherscan (FREE)")
    print("\n")
    
    open_url("https://polygonscan.com/register", "Polygonscan Registration")
    open_url("https://polygonscan.com/myapikey", "Polygonscan API Keys Page")
    
    key = input("📝 Paste your Polygonscan API key here (or press Enter to skip): ").strip()
    return key

def get_coingecko_key():
    print_header("4. Get CoinGecko API Key (Optional)")
    print("Steps:")
    print("   1. Visit CoinGecko API pricing page")
    print("   2. Choose free tier (or paid for better limits)")
    print("   3. Sign up and get API key")
    print("\nRate Limits:")
    print("   - Free: 500 calls/month")
    print("   - Paid: 10,000+ calls/month")
    print("\nNote: You can use CoinGecko without a key, but it's rate limited")
    print("\n")
    
    open_url("https://www.coingecko.com/en/api/pricing", "CoinGecko API Pricing")
    
    key = input("📝 Paste your CoinGecko API key here (or press Enter to skip): ").strip()
    return key

def update_env_file(keys):
    env_path = ".env"
    
    # Read existing .env if it exists
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key] = value
    
    # Update with new keys
    if keys.get('etherscan'):
        env_vars['ETHERSCAN_API_KEY'] = keys['etherscan']
    if keys.get('basescan'):
        env_vars['BASESCAN_API_KEY'] = keys['basescan']
    if keys.get('polygonscan'):
        env_vars['POLYGONSCAN_API_KEY'] = keys['polygonscan']
    if keys.get('coingecko'):
        env_vars['COINGECKO_API_KEY'] = keys['coingecko']
    
    # Write back to .env
    with open(env_path, 'w') as f:
        f.write("# Block Explorer API Keys\n")
        f.write("# Get free keys from:\n")
        f.write("# - Etherscan: https://etherscan.io/myapikey\n")
        f.write("# - Basescan: https://basescan.org/myapikey\n")
        f.write("# - Polygonscan: https://polygonscan.com/myapikey\n\n")
        
        f.write(f"ETHERSCAN_API_KEY={env_vars.get('ETHERSCAN_API_KEY', 'your_etherscan_api_key_here')}\n")
        f.write(f"BASESCAN_API_KEY={env_vars.get('BASESCAN_API_KEY', 'your_basescan_api_key_here')}\n")
        f.write(f"POLYGONSCAN_API_KEY={env_vars.get('POLYGONSCAN_API_KEY', 'your_polygonscan_api_key_here')}\n\n")
        
        f.write("# Price Data API Keys\n")
        f.write("# CoinGecko: https://www.coingecko.com/en/api/pricing\n")
        f.write("# Free tier available, can leave empty for basic usage\n")
        f.write(f"COINGECKO_API_KEY={env_vars.get('COINGECKO_API_KEY', 'your_coingecko_api_key_here')}\n\n")
        
        f.write("# NFT Marketplace API Keys\n")
        f.write("# OpenSea: https://docs.opensea.io/reference/api-overview\n")
        f.write(f"OPENSEA_API_KEY={env_vars.get('OPENSEA_API_KEY', 'your_opensea_api_key_here')}\n\n")
        
        f.write("# Solana RPC (Optional)\n")
        f.write("# QuickNode: https://www.quicknode.com/ (recommended)\n")
        f.write("# Or use public: https://api.mainnet-beta.solana.com\n")
        f.write(f"SOLANA_RPC_URL={env_vars.get('SOLANA_RPC_URL', 'https://api.mainnet-beta.solana.com')}\n\n")
        
        if 'MCP_TOKEN' in env_vars:
            f.write("# MCP Token\n")
            f.write(f"MCP_TOKEN={env_vars['MCP_TOKEN']}\n\n")
    
    print(f"\n✅ Updated {env_path} with your API keys!")

def main():
    print_header("API Key Setup Helper")
    print("This script will help you get API keys for blockchain data services.")
    print("All the APIs we'll set up have FREE tiers available.\n")
    
    response = input("Ready to start? (y/n): ").strip().lower()
    if response != 'y':
        print("Cancelled.")
        return
    
    keys = {}
    
    # Get Etherscan key
    etherscan = get_etherscan_key()
    if etherscan:
        keys['etherscan'] = etherscan
        print("✅ Etherscan key saved!\n")
    
    # Get Basescan key
    basescan = get_basescan_key()
    if basescan:
        keys['basescan'] = basescan
        print("✅ Basescan key saved!\n")
    
    # Get Polygonscan key
    polygonscan = get_polygonscan_key()
    if polygonscan:
        keys['polygonscan'] = polygonscan
        print("✅ Polygonscan key saved!\n")
    
    # Get CoinGecko key (optional)
    coingecko = get_coingecko_key()
    if coingecko:
        keys['coingecko'] = coingecko
        print("✅ CoinGecko key saved!\n")
    
    # Update .env file
    if keys:
        update_env_file(keys)
        print_header("Setup Complete!")
        print("✅ Your API keys have been saved to .env file")
        print("\nNext steps:")
        print("1. Restart your backend server to load the new keys")
        print("2. Test your setup with: python3 test_opensea_api.py")
    else:
        print("\n⚠️  No keys were added. You can run this script again later.")
    
    print("\n💡 Tip: You can also manually edit the .env file to add keys later.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup cancelled by user.")
        sys.exit(0)

