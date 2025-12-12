from typing import Dict, List
import os
from openai import OpenAI

class AIExplainer:
    """
    AI-powered explanation generator for security risks
    Converts technical findings into human-readable explanations using OpenAI
    """
    
    def __init__(self):
        # Get API key from environment variable
        api_key = os.getenv('OPENAI_API_KEY')
        
        if api_key:
            try:
                self.client = OpenAI(api_key=api_key)
                self.use_openai = True
            except Exception as e:
                print(f"Warning: Could not initialize OpenAI client: {e}")
                self.use_openai = False
        else:
            self.use_openai = False
        
        # Fallback templates
        self.explanation_templates = {
            "reentrancy": "The contract may be vulnerable to reentrancy attacks. This means an attacker could repeatedly call a function before the previous call completes, potentially draining funds or manipulating state.",
            "centralized_control": "The contract has functions that only the owner can call. While this provides flexibility, it also means the owner has significant control and could potentially make changes that affect all users.",
            "upgradeable": "This contract can be upgraded, which means the owner can change its code. While useful for fixing bugs, this also means the owner could potentially introduce malicious code in the future.",
            "hidden_minting": "The contract allows the owner to create new tokens at any time without limits. This could lead to inflation and devalue your tokens if the owner decides to mint large amounts.",
            "backdoor_withdrawals": "The contract may have hidden functions that allow the owner to withdraw funds. This is a major red flag for potential rug pulls.",
            "anti_sell": "The contract may prevent users from selling their tokens. This is a common rug-pull pattern where developers trap investors' funds.",
            "honeypot": "This contract appears to be a honeypot - it may look legitimate but is designed to prevent you from withdrawing your funds. DO NOT interact with this contract.",
            "owner_not_renounced": "The contract owner still has administrative privileges. While not necessarily malicious, this means they could potentially make changes that affect the contract's behavior.",
            "unbounded_loops": "The contract contains loops that could potentially run indefinitely or consume excessive gas, which could make transactions fail or become very expensive.",
            "external_calls": "The contract makes calls to other contracts. If those external contracts fail or are malicious, it could affect this contract's functionality."
        }
    
    async def explain_risks(self, scan_results: Dict) -> str:
        """
        Generate human-readable explanation of risks using OpenAI
        """
        # If OpenAI is available, use it for better explanations
        if self.use_openai:
            try:
                return await self._generate_ai_explanation(scan_results)
            except Exception as e:
                print(f"OpenAI API error, falling back to template: {e}")
                # Fall through to template-based explanation
        
        # Fallback to template-based explanation
        return self._generate_template_explanation(scan_results)
    
    async def _generate_ai_explanation(self, scan_results: Dict) -> str:
        """
        Generate explanation using OpenAI API
        """
        safety_score = scan_results.get('safety_score', 0)
        vulnerabilities = scan_results.get('vulnerabilities', [])
        rug_indicators = scan_results.get('rug_pull_indicators', [])
        gas_optimizations = scan_results.get('gas_optimizations', [])
        
        # Build context for AI
        context = f"""
        Smart Contract Security Analysis Results:
        
        Safety Score: {safety_score}/100
        Risk Level: {"Low" if safety_score >= 80 else "Moderate" if safety_score >= 50 else "Severe"}
        
        Vulnerabilities Found: {len(vulnerabilities)}
        """
        
        if vulnerabilities:
            context += "\n\nVulnerabilities:\n"
            for vuln in vulnerabilities[:5]:
                context += f"- {vuln.get('type')} ({vuln.get('severity')}): {vuln.get('description')}\n"
        
        if rug_indicators:
            context += f"\n\nRug-Pull Indicators: {len(rug_indicators)}\n"
            for indicator in rug_indicators[:5]:
                context += f"- {indicator.get('type')} ({indicator.get('risk')} risk): {indicator.get('description')}\n"
        
        if gas_optimizations:
            context += f"\n\nGas Optimization Opportunities: {len(gas_optimizations)}\n"
            for opt in gas_optimizations[:3]:
                context += f"- {opt.get('type')}: {opt.get('description')}\n"
        
        prompt = f"""You are a smart contract security expert. Analyze the following security scan results and provide a clear, concise explanation in plain English that a non-technical user can understand.

{context}

Provide:
1. An overall assessment of the contract's security (2-3 sentences)
2. Explanation of the most critical issues found (if any)
3. What these issues mean for users/investors
4. Key recommendations

Keep it under 300 words and use simple language. Format with emojis for readability."""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful smart contract security expert who explains technical concepts in simple, clear language."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI API call failed: {e}")
            raise
    
    def _generate_template_explanation(self, scan_results: Dict) -> str:
        """
        Fallback template-based explanation
        """
        explanations = []
        safety_score = scan_results.get('safety_score', 0)
        
        # Start with overall assessment
        if safety_score >= 80:
            explanations.append("✅ This contract appears relatively safe with a good security score.")
        elif safety_score >= 50:
            explanations.append("⚠️ This contract has some security concerns that should be reviewed carefully.")
        else:
            explanations.append("🚨 This contract has significant security risks. Exercise extreme caution.")
        
        # Explain vulnerabilities
        vulnerabilities = scan_results.get('vulnerabilities', [])
        if vulnerabilities:
            explanations.append("\n🔍 Security Vulnerabilities Found:")
            for vuln in vulnerabilities[:5]:  # Limit to top 5
                vuln_type = vuln.get('type', '').lower().replace(' ', '_')
                template = self.explanation_templates.get(vuln_type, vuln.get('description', ''))
                explanations.append(f"\n• {vuln.get('type', 'Unknown')}: {template}")
        
        # Explain rug-pull indicators
        rug_indicators = scan_results.get('rug_pull_indicators', [])
        if rug_indicators:
            explanations.append("\n🚩 Rug-Pull Warning Signs:")
            for indicator in rug_indicators[:5]:  # Limit to top 5
                indicator_type = indicator.get('type', '').lower().replace(' ', '_')
                template = self.explanation_templates.get(indicator_type, indicator.get('description', ''))
                risk_emoji = "🔴" if indicator.get('risk') == 'severe' else "🟡" if indicator.get('risk') == 'high' else "🟠"
                explanations.append(f"\n{risk_emoji} {indicator.get('type', 'Unknown')}: {template}")
        
        # Add recommendations
        if not vulnerabilities and not rug_indicators:
            explanations.append("\n✅ No critical issues detected. However, always do your own research (DYOR) before investing.")
        else:
            explanations.append("\n💡 Recommendations:")
            explanations.append("• Review all findings carefully before interacting with this contract")
            explanations.append("• Check the contract owner's reputation and history")
            explanations.append("• Consider waiting for a professional audit if investing significant funds")
            explanations.append("• Monitor contract activity on blockchain explorers")
        
        return "\n".join(explanations)
    
    def explain_vulnerability(self, vulnerability: Dict) -> str:
        """
        Explain a single vulnerability in simple terms
        """
        vuln_type = vulnerability.get('type', '').lower().replace(' ', '_')
        template = self.explanation_templates.get(vuln_type, vulnerability.get('description', ''))
        
        severity = vulnerability.get('severity', 'unknown')
        severity_text = {
            'high': 'high risk',
            'medium': 'moderate risk',
            'low': 'low risk'
        }.get(severity, 'unknown risk')
        
        return f"This is a {severity_text} issue. {template}"
