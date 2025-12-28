"""
Custom Rule Engine
Allows users to define custom security checks
"""
import re
import json
from typing import Dict, List, Optional, Callable
from pathlib import Path

class CustomRuleEngine:
    """
    Engine for executing custom security rules
    """
    
    def __init__(self, storage_path: str = "data/rules"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        
        # Built-in rule functions
        self.rule_functions = {
            'contains_pattern': self._rule_contains_pattern,
            'function_count': self._rule_function_count,
            'has_modifier': self._rule_has_modifier,
            'storage_count': self._rule_storage_count,
            'external_call_count': self._rule_external_call_count,
            'score_threshold': self._rule_score_threshold,
            'vulnerability_type': self._rule_vulnerability_type,
            'rug_indicator_type': self._rule_rug_indicator_type
        }
    
    def create_rule(
        self,
        api_key: str,
        rule_name: str,
        rule_type: str,
        rule_config: Dict,
        severity: str = 'medium'
    ) -> str:
        """
        Create a custom rule
        Returns rule_id
        """
        import hashlib
        import time
        
        rule_id = hashlib.md5(
            f"{api_key}{rule_name}{time.time()}".encode()
        ).hexdigest()[:16]
        
        rule = {
            'id': rule_id,
            'api_key': api_key,
            'name': rule_name,
            'type': rule_type,
            'config': rule_config,
            'severity': severity,
            'active': True,
            'created_at': time.time()
        }
        
        rule_file = self.storage_path / f"rule_{rule_id}.json"
        with open(rule_file, 'w') as f:
            json.dump(rule, f, indent=2)
        
        return rule_id
    
    def evaluate_rules(
        self,
        api_key: str,
        scan_result: Dict,
        source_code: Optional[str] = None
    ) -> List[Dict]:
        """
        Evaluate all custom rules for a user
        Returns list of rule violations
        """
        rules = self.get_rules(api_key)
        violations = []
        
        for rule in rules:
            if not rule.get('active', True):
                continue
            
            try:
                result = self._evaluate_rule(rule, scan_result, source_code)
                if result['violated']:
                    violations.append({
                        'rule_id': rule['id'],
                        'rule_name': rule['name'],
                        'severity': rule.get('severity', 'medium'),
                        'message': result.get('message', 'Rule violated'),
                        'details': result.get('details', {})
                    })
            except Exception as e:
                # Log error but continue
                print(f"Error evaluating rule {rule['id']}: {e}")
        
        return violations
    
    def _evaluate_rule(
        self,
        rule: Dict,
        scan_result: Dict,
        source_code: Optional[str]
    ) -> Dict:
        """
        Evaluate a single rule
        """
        rule_type = rule['type']
        config = rule['config']
        
        if rule_type in self.rule_functions:
            return self.rule_functions[rule_type](config, scan_result, source_code)
        else:
            return {'violated': False, 'message': 'Unknown rule type'}
    
    def get_rules(self, api_key: str) -> List[Dict]:
        """
        Get all rules for an API key
        """
        rules = []
        for rule_file in self.storage_path.glob("rule_*.json"):
            try:
                with open(rule_file, 'r') as f:
                    rule = json.load(f)
                    if rule.get('api_key') == api_key:
                        rules.append(rule)
            except:
                continue
        
        return rules
    
    def delete_rule(self, rule_id: str, api_key: str) -> bool:
        """
        Delete a rule
        """
        rule_file = self.storage_path / f"rule_{rule_id}.json"
        if rule_file.exists():
            try:
                with open(rule_file, 'r') as f:
                    rule = json.load(f)
                    if rule.get('api_key') == api_key:
                        rule_file.unlink()
                        return True
            except:
                pass
        
        return False
    
    # Rule functions
    
    def _rule_contains_pattern(
        self,
        config: Dict,
        scan_result: Dict,
        source_code: Optional[str]
    ) -> Dict:
        """
        Check if code contains a pattern
        """
        pattern = config.get('pattern', '')
        if not source_code:
            return {'violated': False, 'message': 'Source code required'}
        
        matches = re.findall(pattern, source_code, re.IGNORECASE)
        
        if matches:
            return {
                'violated': True,
                'message': f"Pattern '{pattern}' found in code",
                'details': {'matches': len(matches), 'pattern': pattern}
            }
        
        return {'violated': False}
    
    def _rule_function_count(
        self,
        config: Dict,
        scan_result: Dict,
        source_code: Optional[str]
    ) -> Dict:
        """
        Check function count
        """
        if not source_code:
            return {'violated': False, 'message': 'Source code required'}
        
        max_count = config.get('max_count', 50)
        functions = re.findall(r'function\s+\w+', source_code)
        count = len(functions)
        
        if count > max_count:
            return {
                'violated': True,
                'message': f"Function count ({count}) exceeds limit ({max_count})",
                'details': {'count': count, 'limit': max_count}
            }
        
        return {'violated': False}
    
    def _rule_has_modifier(
        self,
        config: Dict,
        scan_result: Dict,
        source_code: Optional[str]
    ) -> Dict:
        """
        Check if code has specific modifier
        """
        modifier = config.get('modifier', '')
        if not source_code:
            return {'violated': False, 'message': 'Source code required'}
        
        if modifier in source_code:
            return {
                'violated': True,
                'message': f"Modifier '{modifier}' found in code",
                'details': {'modifier': modifier}
            }
        
        return {'violated': False}
    
    def _rule_storage_count(
        self,
        config: Dict,
        scan_result: Dict,
        source_code: Optional[str]
    ) -> Dict:
        """
        Check storage variable count
        """
        if not source_code:
            return {'violated': False, 'message': 'Source code required'}
        
        max_count = config.get('max_count', 20)
        storage_vars = re.findall(r'\w+\s+(public|private|internal)?\s+\w+;', source_code)
        count = len(storage_vars)
        
        if count > max_count:
            return {
                'violated': True,
                'message': f"Storage variable count ({count}) exceeds limit ({max_count})",
                'details': {'count': count, 'limit': max_count}
            }
        
        return {'violated': False}
    
    def _rule_external_call_count(
        self,
        config: Dict,
        scan_result: Dict,
        source_code: Optional[str]
    ) -> Dict:
        """
        Check external call count
        """
        if not source_code:
            return {'violated': False, 'message': 'Source code required'}
        
        max_count = config.get('max_count', 10)
        external_calls = re.findall(r'\.(call|delegatecall|staticcall)\(', source_code)
        count = len(external_calls)
        
        if count > max_count:
            return {
                'violated': True,
                'message': f"External call count ({count}) exceeds limit ({max_count})",
                'details': {'count': count, 'limit': max_count}
            }
        
        return {'violated': False}
    
    def _rule_score_threshold(
        self,
        config: Dict,
        scan_result: Dict,
        source_code: Optional[str]
    ) -> Dict:
        """
        Check if safety score meets threshold
        """
        min_score = config.get('min_score', 80)
        score = scan_result.get('safety_score', 0)
        
        if score < min_score:
            return {
                'violated': True,
                'message': f"Safety score ({score}) below threshold ({min_score})",
                'details': {'score': score, 'threshold': min_score}
            }
        
        return {'violated': False}
    
    def _rule_vulnerability_type(
        self,
        config: Dict,
        scan_result: Dict,
        source_code: Optional[str]
    ) -> Dict:
        """
        Check for specific vulnerability type
        """
        vuln_type = config.get('vulnerability_type', '')
        vulnerabilities = scan_result.get('vulnerabilities', [])
        
        for vuln in vulnerabilities:
            if vuln_type.lower() in vuln.get('type', '').lower():
                return {
                    'violated': True,
                    'message': f"Vulnerability type '{vuln_type}' detected",
                    'details': {'vulnerability': vuln}
                }
        
        return {'violated': False}
    
    def _rule_rug_indicator_type(
        self,
        config: Dict,
        scan_result: Dict,
        source_code: Optional[str]
    ) -> Dict:
        """
        Check for specific rug-pull indicator type
        """
        indicator_type = config.get('indicator_type', '')
        indicators = scan_result.get('rug_pull_indicators', [])
        
        for indicator in indicators:
            if indicator_type.lower() in indicator.get('type', '').lower():
                return {
                    'violated': True,
                    'message': f"Rug-pull indicator '{indicator_type}' detected",
                    'details': {'indicator': indicator}
                }
        
        return {'violated': False}


