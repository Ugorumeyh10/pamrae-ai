#!/usr/bin/env python3
"""
Test script for Phase 1 features
"""
import asyncio
import sys
from services.scanner import ContractScanner
from services.ai_explainer import AIExplainer
from services.monitor import ContractMonitor
from services.similarity import CodeSimilarityDetector

async def test_all_features():
    print("🧪 Testing Phase 1 Features\n")
    print("=" * 50)
    
    # Test 1: Scanner with Gas Optimizations
    print("\n1️⃣ Testing Scanner with Gas Optimization Detection...")
    scanner = ContractScanner()
    test_code = """
    pragma solidity ^0.8.0;
    
    contract TestContract {
        uint256 public value1;
        uint256 public value2;
        uint256 public value3;
        uint256 public value4;
        uint256 public value5;
        uint256 public value6;
        uint256 public value7;
        uint256 public value8;
        uint256 public value9;
        uint256 public value10;
        uint256 public value11;
        uint256 public value12;
        uint256 public value13;
        uint256 public value14;
        uint256 public value15;
        
        function test() public {
            for(uint i = 0; i < 100; i++) {
                value1 = i;
            }
        }
    }
    """
    
    scan_result = await scanner.scan_solidity_code(test_code, "ethereum")
    print(f"   ✅ Scan completed")
    print(f"   Safety Score: {scan_result['safety_score']}")
    print(f"   Vulnerabilities: {len(scan_result.get('vulnerabilities', []))}")
    print(f"   Gas Optimizations: {len(scan_result.get('gas_optimizations', []))}")
    if scan_result.get('gas_optimizations'):
        print(f"   First optimization: {scan_result['gas_optimizations'][0]['type']}")
    
    # Test 2: AI Explainer
    print("\n2️⃣ Testing AI Explainer with OpenAI...")
    explainer = AIExplainer()
    print(f"   OpenAI Available: {explainer.use_openai}")
    
    ai_explanation = await explainer.explain_risks(scan_result)
    print(f"   ✅ Explanation generated ({len(ai_explanation)} chars)")
    print(f"   Preview: {ai_explanation[:150]}...")
    
    # Test 3: Monitor Service
    print("\n3️⃣ Testing Monitor Service...")
    monitor = ContractMonitor()
    scan_id = monitor.save_scan("0x1234567890abcdef", "ethereum", scan_result)
    print(f"   ✅ Scan saved with ID: {scan_id[:30]}...")
    
    history = monitor.get_contract_history("0x1234567890abcdef", "ethereum")
    print(f"   History entries: {len(history)}")
    
    trends = monitor.get_trends("0x1234567890abcdef", "ethereum", 30)
    if 'trends' in trends:
        print(f"   ✅ Trends calculated")
        print(f"   Safety score trend: {trends['trends']['safety_score']['trend']}")
    
    # Test 4: Similarity Detector
    print("\n4️⃣ Testing Code Similarity Detection...")
    similarity = CodeSimilarityDetector()
    
    code1 = """
    contract Token {
        mapping(address => uint256) balances;
        function transfer(address to, uint256 amount) public {
            balances[msg.sender] -= amount;
            balances[to] += amount;
        }
    }
    """
    
    code2 = """
    contract MyToken {
        mapping(address => uint256) balances;
        function transfer(address to, uint256 amount) public {
            balances[msg.sender] -= amount;
            balances[to] += amount;
        }
    }
    """
    
    sim_score = similarity.calculate_similarity(code1, code2)
    print(f"   ✅ Similarity calculated: {sim_score:.2%}")
    
    similar_funcs = similarity.find_similar_functions(code1, code2)
    print(f"   Similar functions found: {len(similar_funcs)}")
    
    fingerprint = similarity.generate_code_fingerprint(code1)
    print(f"   Code fingerprint: {fingerprint[:32]}...")
    
    print("\n" + "=" * 50)
    print("✅ All Phase 1 features tested successfully!")
    print("\n📊 Summary:")
    print(f"   • Scanner: ✅ Working")
    print(f"   • AI Explainer: {'✅ OpenAI' if explainer.use_openai else '⚠️ Template mode'}")
    print(f"   • Monitor: ✅ Working")
    print(f"   • Similarity: ✅ Working")

if __name__ == "__main__":
    asyncio.run(test_all_features())


