"""
Machine Learning Model for Smart Contract Security Analysis
Uses historical scan data to predict security risks
"""
import json
import os
from typing import Dict, List, Optional
from pathlib import Path
from collections import Counter
import numpy as np

class SecurityMLModel:
    """
    Machine Learning model for predicting contract security risks
    Uses pattern recognition on historical data
    """
    
    def __init__(self, model_path: str = "data/models"):
        self.model_path = Path(model_path)
        self.model_path.mkdir(parents=True, exist_ok=True)
        
        # Feature weights learned from historical data
        self.feature_weights = self._load_or_initialize_weights()
        
        # Pattern database from historical scans
        self.pattern_db = self._load_pattern_database()
    
    def predict_risk(self, contract_features: Dict) -> Dict:
        """
        Predict security risk based on contract features
        Returns: {
            'risk_score': float (0-1),
            'confidence': float (0-1),
            'predicted_vulnerabilities': List[str],
            'risk_factors': Dict
        }
        """
        # Extract features
        features = self._extract_features(contract_features)
        
        # Calculate risk score using weighted features
        risk_score = self._calculate_risk_score(features)
        
        # Find similar patterns
        similar_patterns = self._find_similar_patterns(features)
        
        # Predict vulnerabilities based on patterns
        predicted_vulns = self._predict_vulnerabilities(features, similar_patterns)
        
        # Calculate confidence based on pattern matches
        confidence = min(1.0, len(similar_patterns) / 10.0) if similar_patterns else 0.3
        
        return {
            'risk_score': risk_score,
            'confidence': confidence,
            'predicted_vulnerabilities': predicted_vulns,
            'risk_factors': self._identify_risk_factors(features),
            'similar_patterns_count': len(similar_patterns)
        }
    
    def train_on_scan(self, scan_result: Dict, actual_outcome: Optional[Dict] = None):
        """
        Train model on a new scan result
        actual_outcome: {'had_vulnerabilities': bool, 'was_rug_pull': bool, etc.}
        """
        features = self._extract_features(scan_result)
        
        # Store pattern
        pattern_id = self._save_pattern(features, scan_result, actual_outcome)
        
        # Update weights if outcome is provided
        if actual_outcome:
            self._update_weights(features, actual_outcome)
        
        return pattern_id
    
    def _extract_features(self, contract_data: Dict) -> Dict:
        """
        Extract ML features from contract data
        """
        features = {
            'safety_score': contract_data.get('safety_score', 50) / 100.0,
            'vulnerability_count': len(contract_data.get('vulnerabilities', [])),
            'rug_indicator_count': len(contract_data.get('rug_pull_indicators', [])),
            'high_severity_count': len([v for v in contract_data.get('vulnerabilities', []) 
                                       if v.get('severity') == 'high']),
            'medium_severity_count': len([v for v in contract_data.get('vulnerabilities', []) 
                                         if v.get('severity') == 'medium']),
            'severe_risk_count': len([r for r in contract_data.get('rug_pull_indicators', []) 
                                     if r.get('risk') == 'severe']),
            'high_risk_count': len([r for r in contract_data.get('rug_pull_indicators', []) 
                                   if r.get('risk') == 'high']),
            'gas_optimization_count': len(contract_data.get('gas_optimizations', [])),
            'has_reentrancy': any('reentrancy' in v.get('type', '').lower() 
                                 for v in contract_data.get('vulnerabilities', [])),
            'has_honeypot': any('honeypot' in r.get('type', '').lower() 
                               for r in contract_data.get('rug_pull_indicators', [])),
            'has_hidden_minting': any('minting' in r.get('type', '').lower() 
                                     for r in contract_data.get('rug_pull_indicators', [])),
            'has_owner_control': any('owner' in v.get('type', '').lower() 
                                    for v in contract_data.get('vulnerabilities', [])),
        }
        
        return features
    
    def _calculate_risk_score(self, features: Dict) -> float:
        """
        Calculate risk score using weighted features
        """
        score = 0.0
        
        # Safety score (inverse - lower safety = higher risk)
        score += (1.0 - features['safety_score']) * self.feature_weights.get('safety_score', 0.3)
        
        # Vulnerability counts
        score += min(features['vulnerability_count'] / 10.0, 1.0) * self.feature_weights.get('vulnerability_count', 0.2)
        score += min(features['high_severity_count'] / 5.0, 1.0) * self.feature_weights.get('high_severity', 0.25)
        
        # Rug-pull indicators
        score += min(features['rug_indicator_count'] / 5.0, 1.0) * self.feature_weights.get('rug_indicators', 0.15)
        score += features['has_honeypot'] * self.feature_weights.get('honeypot', 0.1)
        
        return min(1.0, score)
    
    def _find_similar_patterns(self, features: Dict) -> List[Dict]:
        """
        Find similar patterns in historical data
        """
        similar = []
        
        for pattern in self.pattern_db:
            similarity = self._calculate_similarity(features, pattern['features'])
            if similarity > 0.7:  # 70% similarity threshold
                similar.append({
                    'pattern_id': pattern.get('id'),
                    'similarity': similarity,
                    'outcome': pattern.get('outcome')
                })
        
        return sorted(similar, key=lambda x: x['similarity'], reverse=True)[:5]
    
    def _calculate_similarity(self, features1: Dict, features2: Dict) -> float:
        """
        Calculate cosine similarity between feature vectors
        """
        keys = set(features1.keys()) & set(features2.keys())
        if not keys:
            return 0.0
        
        vec1 = np.array([features1[k] for k in keys])
        vec2 = np.array([features2[k] for k in keys])
        
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    
    def _predict_vulnerabilities(self, features: Dict, similar_patterns: List[Dict]) -> List[str]:
        """
        Predict vulnerabilities based on similar patterns
        """
        predicted = []
        
        # Count vulnerabilities in similar patterns
        vuln_counts = Counter()
        for pattern in similar_patterns:
            pattern_data = self._load_pattern(pattern['pattern_id'])
            if pattern_data:
                for vuln in pattern_data.get('vulnerabilities', []):
                    vuln_counts[vuln.get('type')] += pattern['similarity']
        
        # Predict top vulnerabilities
        for vuln_type, score in vuln_counts.most_common(5):
            if score > 0.5:  # Threshold
                predicted.append(vuln_type)
        
        # Rule-based predictions
        if features['has_reentrancy']:
            predicted.append('Reentrancy')
        if features['has_honeypot']:
            predicted.append('Honeypot Pattern')
        if features['has_hidden_minting']:
            predicted.append('Hidden Minting')
        
        return list(set(predicted))  # Remove duplicates
    
    def _identify_risk_factors(self, features: Dict) -> Dict:
        """
        Identify key risk factors
        """
        factors = {}
        
        if features['high_severity_count'] > 0:
            factors['high_severity_vulnerabilities'] = features['high_severity_count']
        
        if features['has_honeypot']:
            factors['honeypot_detected'] = True
        
        if features['severe_risk_count'] > 0:
            factors['severe_rug_indicators'] = features['severe_risk_count']
        
        if features['safety_score'] < 0.5:
            factors['low_safety_score'] = features['safety_score']
        
        return factors
    
    def _save_pattern(self, features: Dict, scan_result: Dict, outcome: Optional[Dict]) -> str:
        """
        Save pattern to database
        """
        import hashlib
        import time
        
        pattern_id = hashlib.md5(
            json.dumps(features, sort_keys=True).encode()
        ).hexdigest()[:16]
        
        pattern = {
            'id': pattern_id,
            'features': features,
            'scan_result': scan_result,
            'outcome': outcome,
            'timestamp': time.time()
        }
        
        pattern_file = self.model_path / f"pattern_{pattern_id}.json"
        with open(pattern_file, 'w') as f:
            json.dump(pattern, f, indent=2)
        
        # Add to in-memory database
        self.pattern_db.append({
            'id': pattern_id,
            'features': features,
            'outcome': outcome
        })
        
        # Keep only last 1000 patterns in memory
        if len(self.pattern_db) > 1000:
            self.pattern_db = self.pattern_db[-1000:]
        
        return pattern_id
    
    def _load_pattern(self, pattern_id: str) -> Optional[Dict]:
        """
        Load pattern from database
        """
        pattern_file = self.model_path / f"pattern_{pattern_id}.json"
        if pattern_file.exists():
            with open(pattern_file, 'r') as f:
                return json.load(f)
        return None
    
    def _update_weights(self, features: Dict, outcome: Dict):
        """
        Update feature weights based on actual outcome
        Simple reinforcement learning approach
        """
        learning_rate = 0.01
        
        # If contract had issues, increase weights for features that were present
        if outcome.get('had_vulnerabilities') or outcome.get('was_rug_pull'):
            for key in features:
                if features[key] > 0:
                    self.feature_weights[key] = self.feature_weights.get(key, 0.1) + learning_rate
        
        # Save updated weights
        self._save_weights()
    
    def _load_or_initialize_weights(self) -> Dict:
        """
        Load weights from file or initialize defaults
        """
        weights_file = self.model_path / "weights.json"
        if weights_file.exists():
            with open(weights_file, 'r') as f:
                return json.load(f)
        
        # Default weights
        return {
            'safety_score': 0.3,
            'vulnerability_count': 0.2,
            'high_severity': 0.25,
            'rug_indicators': 0.15,
            'honeypot': 0.1
        }
    
    def _save_weights(self):
        """
        Save weights to file
        """
        weights_file = self.model_path / "weights.json"
        with open(weights_file, 'w') as f:
            json.dump(self.feature_weights, f, indent=2)
    
    def _load_pattern_database(self) -> List[Dict]:
        """
        Load pattern database from files
        """
        patterns = []
        pattern_files = list(self.model_path.glob("pattern_*.json"))
        
        for pattern_file in pattern_files[-500:]:  # Load last 500 patterns
            try:
                with open(pattern_file, 'r') as f:
                    pattern = json.load(f)
                    patterns.append({
                        'id': pattern['id'],
                        'features': pattern['features'],
                        'outcome': pattern.get('outcome')
                    })
            except:
                continue
        
        return patterns
    
    def get_model_stats(self) -> Dict:
        """
        Get model statistics
        """
        return {
            'patterns_in_database': len(self.pattern_db),
            'feature_weights': self.feature_weights,
            'model_path': str(self.model_path)
        }

