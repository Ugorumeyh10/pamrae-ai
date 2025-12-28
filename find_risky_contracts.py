#!/usr/bin/env python3
"""
Helper script to find contracts with known security issues for testing
Note: This is for testing scanner detection capabilities only
"""

import requests
import json

def get_etherscan_risky_tokens():
    """
    Search for tokens with known issues on Etherscan
    Note: This would require Etherscan API key for production use
    """
    print("🔍 Finding risky contracts for testing...")
    print("")
    print("⚠️  Note: These addresses are for testing scanner detection only")
    print("⚠️  DO NOT interact with these contracts or send funds")
    print("")
    
    # These are examples - in production, you'd query Etherscan API
    # or use a curated list of known problematic contracts
    
    risky_contracts = {
        "known_honeypot_patterns": [
            {
                "address": "0x0000000000000000000000000000000000000000",
                "type": "zero_address",
                "description": "Zero address - tests error handling",
                "expected_score": "Should return error"
            }
        ],
        "contracts_with_centralization": [
            {
                "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                "type": "token",
                "description": "DAI token - has owner controls (for testing)",
                "expected_issues": ["Centralized Control"]
            }
        ],
        "proxy_patterns": [
            {
                "address": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
                "type": "defi",
                "description": "Uniswap Router V2 - uses proxy pattern",
                "expected_issues": ["Upgradeable Contract Risk"]
            }
        ]
    }
    
    return risky_contracts

def print_test_addresses():
    """Print test addresses for risky contracts"""
    contracts = get_etherscan_risky_tokens()
    
    print("=" * 60)
    print("TEST CONTRACTS FOR SECURITY SCANNER")
    print("=" * 60)
    print("")
    
    for category, items in contracts.items():
        print(f"📋 {category.replace('_', ' ').title()}:")
        print("")
        for contract in items:
            print(f"  Address: {contract['address']}")
            print(f"  Type: {contract['type']}")
            print(f"  Description: {contract['description']}")
            if 'expected_issues' in contract:
                print(f"  Expected Issues: {', '.join(contract['expected_issues'])}")
            if 'expected_score' in contract:
                print(f"  Expected: {contract['expected_score']}")
            print("")
    
    print("=" * 60)
    print("⚠️  WARNING: These are for testing scanner detection only")
    print("⚠️  Do NOT send funds or interact with these contracts")
    print("=" * 60)

if __name__ == "__main__":
    print_test_addresses()

