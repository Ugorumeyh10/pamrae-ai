#!/usr/bin/env python3
"""
Comprehensive test suite for all Phase 1 and Phase 2 features
"""
import asyncio
import sys
import json
from pathlib import Path

sys.path.insert(0, '.')

from services.scanner import ContractScanner
from services.ai_explainer import AIExplainer
from services.monitor import ContractMonitor
from services.similarity import CodeSimilarityDetector
from services.ml_model import SecurityMLModel
from services.rate_limiter import RateLimiter
from services.webhook import WebhookService
from services.rule_engine import CustomRuleEngine

# Test data
TEST_CONTRACT_CODE = """
pragma solidity ^0.8.0;

contract TestToken {
    mapping(address => uint256) public balances;
    address public owner;
    uint256 public totalSupply;
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
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function transfer(address to, uint256 amount) public {
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
    
    function mint(uint256 amount) public onlyOwner {
        totalSupply += amount;
        balances[owner] += amount;
    }
    
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
"""

async def test_phase1_features():
    print("=" * 60)
    print("🧪 PHASE 1 FEATURES TEST")
    print("=" * 60)
    
    # Test 1: Scanner with Gas Optimizations
    print("\n1️⃣ Testing Scanner with Gas Optimization Detection...")
    try:
        scanner = ContractScanner()
        result = await scanner.scan_solidity_code(TEST_CONTRACT_CODE, "ethereum")
        
        assert 'gas_optimizations' in result, "Gas optimizations missing"
        assert result['safety_score'] >= 0, "Invalid safety score"
        print(f"   ✅ Safety Score: {result['safety_score']}")
        print(f"   ✅ Vulnerabilities: {len(result.get('vulnerabilities', []))}")
        print(f"   ✅ Rug Indicators: {len(result.get('rug_pull_indicators', []))}")
        print(f"   ✅ Gas Optimizations: {len(result.get('gas_optimizations', []))}")
        if result.get('gas_optimizations'):
            print(f"   ✅ First optimization: {result['gas_optimizations'][0]['type']}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 2: AI Explainer
    print("\n2️⃣ Testing AI Explainer...")
    try:
        explainer = AIExplainer()
        print(f"   ✅ OpenAI Available: {explainer.use_openai}")
        
        explanation = await explainer.explain_risks(result)
        assert len(explanation) > 0, "Empty explanation"
        print(f"   ✅ Explanation generated ({len(explanation)} chars)")
        print(f"   Preview: {explanation[:100]}...")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 3: Monitor Service
    print("\n3️⃣ Testing Monitor Service...")
    try:
        monitor = ContractMonitor()
        scan_id = monitor.save_scan("0xTEST123", "ethereum", result)
        print(f"   ✅ Scan saved: {scan_id[:20]}...")
        
        history = monitor.get_contract_history("0xTEST123", "ethereum")
        assert len(history) > 0, "History empty"
        print(f"   ✅ History entries: {len(history)}")
        
        trends = monitor.get_trends("0xTEST123", "ethereum", 30)
        assert 'trends' in trends, "Trends missing"
        print(f"   ✅ Trends calculated")
        print(f"   Safety trend: {trends['trends']['safety_score']['trend']}")
        
        # Test comparison
        scan_id2 = monitor.save_scan("0xTEST123", "ethereum", result)
        comparison = monitor.compare_scans(scan_id, scan_id2)
        assert 'differences' in comparison, "Comparison missing"
        print(f"   ✅ Scan comparison working")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Test 4: Similarity Detector
    print("\n4️⃣ Testing Code Similarity Detection...")
    try:
        similarity = CodeSimilarityDetector()
        
        code1 = "contract A { function test() public {} }"
        code2 = "contract B { function test() public {} }"
        
        sim_score = similarity.calculate_similarity(code1, code2)
        assert 0 <= sim_score <= 1, "Invalid similarity score"
        print(f"   ✅ Similarity: {sim_score:.2%}")
        
        similar_funcs = similarity.find_similar_functions(code1, code2)
        print(f"   ✅ Similar functions: {len(similar_funcs)}")
        
        fingerprint = similarity.generate_code_fingerprint(code1)
        assert len(fingerprint) == 64, "Invalid fingerprint"
        print(f"   ✅ Fingerprint: {fingerprint[:16]}...")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    print("\n✅ Phase 1 Features: ALL TESTS PASSED")
    return True

def test_phase2_features():
    print("\n" + "=" * 60)
    print("🧪 PHASE 2 FEATURES TEST")
    print("=" * 60)
    
    # Test 1: ML Model
    print("\n1️⃣ Testing ML Model...")
    try:
        ml_model = SecurityMLModel()
        
        test_features = {
            'safety_score': 0.65,
            'vulnerability_count': 3,
            'rug_indicator_count': 1,
            'high_severity_count': 1,
            'medium_severity_count': 2,
            'severe_risk_count': 0,
            'high_risk_count': 1,
            'gas_optimization_count': 2,
            'has_reentrancy': True,
            'has_honeypot': False,
            'has_hidden_minting': False,
            'has_owner_control': True
        }
        
        prediction = ml_model.predict_risk(test_features)
        assert 'risk_score' in prediction, "Risk score missing"
        assert 0 <= prediction['risk_score'] <= 1, "Invalid risk score"
        print(f"   ✅ Risk Score: {prediction['risk_score']:.2f}")
        print(f"   ✅ Confidence: {prediction['confidence']:.2f}")
        print(f"   ✅ Predicted Vulns: {len(prediction.get('predicted_vulnerabilities', []))}")
        
        # Train model
        ml_model.train_on_scan(test_features, {'had_vulnerabilities': True})
        print(f"   ✅ Model training successful")
        
        stats = ml_model.get_model_stats()
        print(f"   ✅ Model stats: {stats['patterns_in_database']} patterns")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 2: Rate Limiter
    print("\n2️⃣ Testing Rate Limiter...")
    try:
        rate_limiter = RateLimiter()
        
        # Test free tier
        check = rate_limiter.check_rate_limit(None, 'scan')
        assert check['tier'] == 'free', "Wrong tier"
        assert check['allowed'] == True, "Should be allowed initially"
        print(f"   ✅ Free tier: {check['tier']}")
        print(f"   ✅ Daily limit: {check['remaining_daily']}")
        
        # Record usage
        rate_limiter.record_usage(None, 1)
        print(f"   ✅ Usage recorded")
        
        # Test pro tier
        check_pro = rate_limiter.check_rate_limit('pro_test123', 'scan')
        assert check_pro['tier'] == 'pro', "Wrong tier"
        print(f"   ✅ Pro tier detection: {check_pro['tier']}")
        
        # Get usage stats
        stats = rate_limiter.get_usage_stats(None)
        assert 'tier' in stats, "Stats missing"
        print(f"   ✅ Usage stats: {stats['tier']} tier, {stats['total_scans']} scans")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 3: Webhook Service
    print("\n3️⃣ Testing Webhook Service...")
    try:
        webhook_service = WebhookService()
        
        # Register webhook
        webhook_id = webhook_service.register_webhook(
            'test_api_key',
            'https://example.com/webhook',
            ['scan.complete'],
            'secret123'
        )
        assert len(webhook_id) > 0, "Webhook ID missing"
        print(f"   ✅ Webhook registered: {webhook_id}")
        
        # List webhooks
        webhooks = webhook_service.get_webhooks('test_api_key')
        assert len(webhooks) > 0, "No webhooks found"
        print(f"   ✅ Webhooks found: {len(webhooks)}")
        
        # Delete webhook
        deleted = webhook_service.delete_webhook(webhook_id, 'test_api_key')
        assert deleted == True, "Webhook not deleted"
        print(f"   ✅ Webhook deleted")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 4: Custom Rule Engine
    print("\n4️⃣ Testing Custom Rule Engine...")
    try:
        rule_engine = CustomRuleEngine()
        
        # Create rule
        rule_id = rule_engine.create_rule(
            'test_api_key',
            'No delegatecall',
            'contains_pattern',
            {'pattern': 'delegatecall'},
            'high'
        )
        assert len(rule_id) > 0, "Rule ID missing"
        print(f"   ✅ Rule created: {rule_id}")
        
        # List rules
        rules = rule_engine.get_rules('test_api_key')
        assert len(rules) > 0, "No rules found"
        print(f"   ✅ Rules found: {len(rules)}")
        
        # Evaluate rules
        test_scan = {
            'safety_score': 75,
            'vulnerabilities': [],
            'rug_pull_indicators': []
        }
        violations = rule_engine.evaluate_rules('test_api_key', test_scan, TEST_CONTRACT_CODE)
        print(f"   ✅ Rule evaluation: {len(violations)} violations")
        
        # Delete rule
        deleted = rule_engine.delete_rule(rule_id, 'test_api_key')
        assert deleted == True, "Rule not deleted"
        print(f"   ✅ Rule deleted")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n✅ Phase 2 Features: ALL TESTS PASSED")
    return True

async def main():
    print("\n🚀 COMPREHENSIVE FEATURE TEST SUITE")
    print("=" * 60)
    
    phase1_result = await test_phase1_features()
    phase2_result = test_phase2_features()
    
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    print(f"Phase 1 Features: {'✅ PASSED' if phase1_result else '❌ FAILED'}")
    print(f"Phase 2 Features: {'✅ PASSED' if phase2_result else '❌ FAILED'}")
    
    if phase1_result and phase2_result:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print("\n⚠️  SOME TESTS FAILED")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)


