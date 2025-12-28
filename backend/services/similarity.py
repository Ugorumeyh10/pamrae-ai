"""
Code Similarity Detection Service
Finds similar contracts and detects code reuse patterns
"""
import hashlib
import re
from typing import Dict, List, Optional, Tuple
from collections import Counter

class CodeSimilarityDetector:
    """
    Detect similar contracts and code patterns
    """
    
    def __init__(self):
        self.function_signatures_cache = {}
        self.bytecode_hashes = {}
    
    def calculate_similarity(
        self,
        code1: str,
        code2: str,
        method: str = "jaccard"
    ) -> float:
        """
        Calculate similarity between two code snippets
        Returns similarity score 0-1
        """
        if method == "jaccard":
            return self._jaccard_similarity(code1, code2)
        elif method == "cosine":
            return self._cosine_similarity(code1, code2)
        elif method == "function_signatures":
            return self._function_signature_similarity(code1, code2)
        else:
            return self._jaccard_similarity(code1, code2)
    
    def find_similar_functions(self, code: str, reference_code: str) -> List[Dict]:
        """
        Find similar functions between two contracts
        """
        functions1 = self._extract_functions(code)
        functions2 = self._extract_functions(reference_code)
        
        similar_functions = []
        
        for func1 in functions1:
            for func2 in functions2:
                similarity = self._jaccard_similarity(func1['body'], func2['body'])
                if similarity > 0.7:  # 70% similarity threshold
                    similar_functions.append({
                        "function1": func1['signature'],
                        "function2": func2['signature'],
                        "similarity": similarity,
                        "type": "high_similarity" if similarity > 0.9 else "moderate_similarity"
                    })
        
        return sorted(similar_functions, key=lambda x: x['similarity'], reverse=True)
    
    def detect_code_reuse(self, code: str, known_contracts: List[Dict]) -> List[Dict]:
        """
        Detect if code reuses patterns from known contracts
        known_contracts: List of {"address": str, "code": str, "name": str}
        """
        matches = []
        
        for contract in known_contracts:
            similarity = self.calculate_similarity(code, contract['code'])
            
            if similarity > 0.6:  # 60% similarity threshold
                similar_functions = self.find_similar_functions(code, contract['code'])
                
                matches.append({
                    "contract_address": contract.get('address', 'unknown'),
                    "contract_name": contract.get('name', 'Unknown'),
                    "overall_similarity": similarity,
                    "similar_functions": similar_functions[:5],  # Top 5
                    "risk_level": "high" if similarity > 0.9 else "medium" if similarity > 0.7 else "low"
                })
        
        return sorted(matches, key=lambda x: x['overall_similarity'], reverse=True)
    
    def generate_code_fingerprint(self, code: str) -> str:
        """
        Generate a fingerprint for code comparison
        """
        # Normalize code (remove comments, whitespace)
        normalized = self._normalize_code(code)
        
        # Generate hash
        return hashlib.sha256(normalized.encode()).hexdigest()
    
    def _jaccard_similarity(self, code1: str, code2: str) -> float:
        """Calculate Jaccard similarity (intersection over union)"""
        # Tokenize code
        tokens1 = set(self._tokenize(code1))
        tokens2 = set(self._tokenize(code2))
        
        if not tokens1 and not tokens2:
            return 1.0
        
        intersection = len(tokens1 & tokens2)
        union = len(tokens1 | tokens2)
        
        return intersection / union if union > 0 else 0.0
    
    def _cosine_similarity(self, code1: str, code2: str) -> float:
        """Calculate cosine similarity"""
        tokens1 = self._tokenize(code1)
        tokens2 = self._tokenize(code2)
        
        # Create frequency vectors
        vec1 = Counter(tokens1)
        vec2 = Counter(tokens2)
        
        # Get all unique tokens
        all_tokens = set(tokens1) | set(tokens2)
        
        # Calculate dot product and magnitudes
        dot_product = sum(vec1.get(token, 0) * vec2.get(token, 0) for token in all_tokens)
        magnitude1 = sum(v * v for v in vec1.values()) ** 0.5
        magnitude2 = sum(v * v for v in vec2.values()) ** 0.5
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)
    
    def _function_signature_similarity(self, code1: str, code2: str) -> float:
        """Calculate similarity based on function signatures"""
        funcs1 = set(self._extract_function_signatures(code1))
        funcs2 = set(self._extract_function_signatures(code2))
        
        if not funcs1 and not funcs2:
            return 1.0
        
        intersection = len(funcs1 & funcs2)
        union = len(funcs1 | funcs2)
        
        return intersection / union if union > 0 else 0.0
    
    def _extract_functions(self, code: str) -> List[Dict]:
        """Extract function definitions from code"""
        functions = []
        
        # Match function definitions
        pattern = r'function\s+(\w+)\s*\([^)]*\)\s*(?:public|private|internal|external)?\s*(?:view|pure|payable)?\s*\{([^}]+)\}'
        matches = re.finditer(pattern, code, re.MULTILINE | re.DOTALL)
        
        for match in matches:
            func_name = match.group(1)
            func_body = match.group(2)
            functions.append({
                'signature': f"function {func_name}(...)",
                'body': func_body.strip()
            })
        
        return functions
    
    def _extract_function_signatures(self, code: str) -> List[str]:
        """Extract function signatures only"""
        signatures = []
        pattern = r'function\s+(\w+)\s*\([^)]*\)'
        matches = re.findall(pattern, code)
        return matches
    
    def _tokenize(self, code: str) -> List[str]:
        """Tokenize code into meaningful tokens"""
        # Normalize first
        normalized = self._normalize_code(code)
        
        # Split by common delimiters
        tokens = re.findall(r'\b\w+\b', normalized)
        
        # Filter out very common words
        common_words = {'function', 'return', 'if', 'else', 'for', 'while', 'public', 'private', 'internal', 'external'}
        tokens = [t for t in tokens if t not in common_words and len(t) > 2]
        
        return tokens
    
    def _normalize_code(self, code: str) -> str:
        """Normalize code for comparison"""
        # Remove comments
        code = re.sub(r'//.*', '', code)
        code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
        
        # Remove extra whitespace
        code = re.sub(r'\s+', ' ', code)
        
        # Remove string literals (keep structure)
        code = re.sub(r'"[^"]*"', '"STRING"', code)
        code = re.sub(r"'[^']*'", "'STRING'", code)
        
        return code.strip()
    
    def compare_bytecode(self, bytecode1: bytes, bytecode2: bytes) -> float:
        """
        Compare bytecode similarity
        """
        # Remove metadata (first 2 bytes are length)
        if len(bytecode1) < 2 or len(bytecode2) < 2:
            return 0.0
        
        # Compare bytecode chunks
        chunk_size = 32
        chunks1 = [bytecode1[i:i+chunk_size] for i in range(0, len(bytecode1), chunk_size)]
        chunks2 = [bytecode2[i:i+chunk_size] for i in range(0, len(bytecode2), chunk_size)]
        
        # Calculate similarity
        set1 = set(chunks1)
        set2 = set(chunks2)
        
        if not set1 and not set2:
            return 1.0
        
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        
        return intersection / union if union > 0 else 0.0


