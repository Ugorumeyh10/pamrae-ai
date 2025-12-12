#!/usr/bin/env python3
"""
Test OpenAI integration for AI Explainer
"""
import asyncio
import sys
sys.path.insert(0, '.')

from services.ai_explainer import AIExplainer

async def test_openai():
    print("🧪 Testing OpenAI Integration\n")
    print("=" * 50)
    
    explainer = AIExplainer()
    print(f"✅ AI Explainer initialized")
    print(f"   OpenAI Available: {explainer.use_openai}\n")
    
    if not explainer.use_openai:
        print("⚠️  OpenAI not available, will use template fallback")
        return
    
    # Test with sample scan results
    test_results = {
        'safety_score': 65,
        'vulnerabilities': [
            {
                'type': 'Reentrancy',
                'severity': 'high',
                'description': 'Contract may be vulnerable to reentrancy attacks'
            },
            {
                'type': 'Centralized Control',
                'severity': 'medium',
                'description': 'Contract has owner-only functions'
            }
        ],
        'rug_pull_indicators': [
            {
                'type': 'Owner Not Renounced',
                'risk': 'medium',
                'description': 'Contract owner still has control'
            }
        ],
        'gas_optimizations': [
            {
                'type': 'Storage Packing Opportunity',
                'severity': 'low',
                'description': 'Contract has 15 storage variables that could be packed'
            }
        ]
    }
    
    print("📝 Generating AI explanation...")
    try:
        explanation = await explainer.explain_risks(test_results)
        print(f"\n✅ Explanation generated ({len(explanation)} characters)\n")
        print("=" * 50)
        print(explanation)
        print("=" * 50)
        print("\n✅ OpenAI integration working correctly!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("   Falling back to template-based explanations")

if __name__ == "__main__":
    asyncio.run(test_openai())

