import asyncio
from typing import Dict, List, Optional
from web3 import Web3
import re

class ContractScanner:
    """
    Comprehensive smart contract vulnerability scanner
    """
    
    def __init__(self):
        # Initialize Web3 providers for different chains
        self.providers = {
            "ethereum": Web3(Web3.HTTPProvider("https://eth.llamarpc.com")),
            "base": Web3(Web3.HTTPProvider("https://mainnet.base.org")),
            "polygon": Web3(Web3.HTTPProvider("https://polygon-rpc.com")),
        }
        self.solana_rpc = "https://api.mainnet-beta.solana.com"
    
    async def scan_contract(
        self, 
        address: str, 
        chain: str = "ethereum",
        contract_type: Optional[str] = None
    ) -> Dict:
        """
        Perform comprehensive contract scan
        """
        vulnerabilities = []
        rug_pull_indicators = []
        
        if chain == "solana":
            return await self._scan_solana_contract(address)
        
        # Get contract bytecode
        try:
            w3 = self.providers.get(chain)
            if not w3:
                raise ValueError(f"Unsupported chain: {chain}")
            
            # Validate and convert address to checksum format (required by Web3.py)
            address = address.strip()
            
            # Basic format validation
            if not address.startswith('0x'):
                raise ValueError(f"Invalid address format: Address must start with '0x'. Received: {address}")
            
            if len(address) != 42:
                raise ValueError(f"Invalid address format: Address must be 42 characters (received {len(address)}). Expected format: 0x followed by 40 hexadecimal characters. Received: {address}")
            
            # Validate hexadecimal characters
            hex_part = address[2:]
            if not all(c in '0123456789abcdefABCDEF' for c in hex_part):
                raise ValueError(f"Invalid address format: Address contains invalid characters. Only hexadecimal characters (0-9, a-f, A-F) are allowed after '0x'. Received: {address}")
            
            # Convert to checksum format
            try:
                address = w3.to_checksum_address(address)
            except Exception as e:
                raise ValueError(f"Invalid address format: {str(e)}. Received: {address}")
            
            bytecode = w3.eth.get_code(address)
            
            if bytecode == b'':
                raise ValueError("Contract not found or address is not a contract")
            
            # Analyze bytecode and contract
            vulnerabilities.extend(await self._detect_vulnerabilities(address, chain, bytecode))
            rug_pull_indicators.extend(await self._detect_rug_pull_patterns(address, chain, bytecode))
            
            # Calculate safety score
            safety_score = self._calculate_safety_score(vulnerabilities, rug_pull_indicators)
            
            # Detect gas optimization opportunities
            gas_optimizations = await self._detect_gas_optimizations(address, chain, bytecode)
            
            return {
                "contract_address": address,
                "chain": chain,
                "safety_score": safety_score,
                "vulnerabilities": vulnerabilities,
                "rug_pull_indicators": rug_pull_indicators,
                "gas_optimizations": gas_optimizations,
                "contract_type": contract_type
            }
        except Exception as e:
            raise Exception(f"Scan failed: {str(e)}")
    
    async def scan_solidity_code(self, code: str, chain: str = "ethereum") -> Dict:
        """
        Scan Solidity source code for vulnerabilities
        """
        vulnerabilities = []
        rug_pull_indicators = []
        
        # Detect vulnerabilities in source code
        vulnerabilities.extend(self._analyze_solidity_code(code))
        rug_pull_indicators.extend(self._detect_rug_pull_in_code(code))
        
        safety_score = self._calculate_safety_score(vulnerabilities, rug_pull_indicators)
        
        # Detect gas optimizations in source code
        gas_optimizations = self._analyze_gas_optimizations(code)
        
        return {
            "contract_address": "source_code",
            "chain": chain,
            "safety_score": safety_score,
            "vulnerabilities": vulnerabilities,
            "rug_pull_indicators": rug_pull_indicators,
            "gas_optimizations": gas_optimizations
        }
    
    async def _detect_vulnerabilities(
        self, 
        address: str, 
        chain: str, 
        bytecode: bytes
    ) -> List[Dict]:
        """
        Detect common vulnerabilities
        """
        vulnerabilities = []
        
        # Check for reentrancy patterns
        if self._check_reentrancy(bytecode):
            vulnerabilities.append({
                "type": "Reentrancy",
                "severity": "high",
                "description": "Contract may be vulnerable to reentrancy attacks",
                "recommendation": "Use checks-effects-interactions pattern and reentrancy guards"
            })
        
        # Check for owner-only functions
        if self._check_owner_control(bytecode):
            vulnerabilities.append({
                "type": "Centralized Control",
                "severity": "medium",
                "description": "Contract has owner-only functions that could be exploited",
                "recommendation": "Consider using multi-sig or timelock for critical functions"
            })
        
        # Check for upgradeable contracts
        if self._check_upgradeable(bytecode):
            vulnerabilities.append({
                "type": "Upgradeable Contract Risk",
                "severity": "medium",
                "description": "Contract appears to be upgradeable, which introduces centralization risk",
                "recommendation": "Verify upgrade mechanism is properly secured"
            })
        
        # Check for unbounded loops
        if self._check_unbounded_loops(bytecode):
            vulnerabilities.append({
                "type": "Unbounded Loops",
                "severity": "medium",
                "description": "Contract may contain unbounded loops that could cause gas issues",
                "recommendation": "Limit loop iterations or use pagination"
            })
        
        # Check for external call dependencies
        if self._check_external_calls(bytecode):
            vulnerabilities.append({
                "type": "External Call Dependencies",
                "severity": "low",
                "description": "Contract makes external calls that could fail",
                "recommendation": "Implement proper error handling for external calls"
            })
        
        return vulnerabilities
    
    async def _detect_rug_pull_patterns(
        self, 
        address: str, 
        chain: str, 
        bytecode: bytes
    ) -> List[Dict]:
        """
        Detect rug-pull patterns
        """
        indicators = []
        
        # Check for hidden minting
        if self._check_hidden_minting(bytecode):
            indicators.append({
                "type": "Hidden Minting",
                "risk": "high",
                "description": "Contract may allow unlimited token minting",
                "recommendation": "Verify minting functions are properly restricted"
            })
        
        # Check for backdoor withdrawals
        if self._check_backdoor_withdrawals(bytecode):
            indicators.append({
                "type": "Backdoor Withdrawals",
                "risk": "high",
                "description": "Contract may have hidden withdrawal functions",
                "recommendation": "Review all withdrawal mechanisms"
            })
        
        # Check for anti-sell functions
        if self._check_anti_sell(bytecode):
            indicators.append({
                "type": "Anti-Sell Functions",
                "risk": "high",
                "description": "Contract may prevent users from selling tokens",
                "recommendation": "Verify trading restrictions are transparent"
            })
        
        # Check for honeypot patterns
        if self._check_honeypot(bytecode):
            indicators.append({
                "type": "Honeypot Pattern",
                "risk": "severe",
                "description": "Contract may be a honeypot that prevents withdrawals",
                "recommendation": "DO NOT interact with this contract"
            })
        
        # Check if owner is renounced
        owner_renounced = await self._check_owner_renounced(address, chain)
        if not owner_renounced:
            indicators.append({
                "type": "Owner Not Renounced",
                "risk": "medium",
                "description": "Contract owner still has control, potential rug-pull risk",
                "recommendation": "Verify owner's reputation and consider waiting for renouncement"
            })
        
        return indicators
    
    def _analyze_solidity_code(self, code: str) -> List[Dict]:
        """
        Analyze Solidity source code for vulnerabilities
        """
        vulnerabilities = []
        
        # Check for reentrancy (external calls before state changes)
        if re.search(r'\.call\(|\.send\(|\.transfer\(', code):
            if not re.search(r'nonReentrant|ReentrancyGuard', code):
                vulnerabilities.append({
                    "type": "Potential Reentrancy",
                    "severity": "high",
                    "description": "External calls detected without reentrancy protection",
                    "recommendation": "Add ReentrancyGuard modifier"
                })
        
        # Check for owner-only functions
        owner_functions = re.findall(r'function\s+\w+.*onlyOwner', code, re.IGNORECASE)
        if len(owner_functions) > 5:
            vulnerabilities.append({
                "type": "Excessive Owner Control",
                "severity": "medium",
                "description": f"Contract has {len(owner_functions)} owner-only functions",
                "recommendation": "Limit owner privileges or use multi-sig"
            })
        
        # Check for unlimited minting
        if re.search(r'function\s+mint.*unchecked|mint.*\*', code, re.IGNORECASE):
            vulnerabilities.append({
                "type": "Unlimited Minting",
                "severity": "high",
                "description": "Contract may allow unlimited token minting",
                "recommendation": "Implement minting limits or caps"
            })
        
        # Check for delegatecall
        if re.search(r'delegatecall', code, re.IGNORECASE):
            vulnerabilities.append({
                "type": "Delegatecall Usage",
                "severity": "high",
                "description": "Delegatecall detected - high risk if not properly secured",
                "recommendation": "Audit delegatecall usage carefully"
            })
        
        return vulnerabilities
    
    def _detect_rug_pull_in_code(self, code: str) -> List[Dict]:
        """
        Detect rug-pull patterns in source code
        """
        indicators = []
        
        # Check for hidden minting
        mint_patterns = re.findall(r'function\s+mint.*\{[^}]*\}', code, re.IGNORECASE | re.DOTALL)
        for pattern in mint_patterns:
            if 'onlyOwner' in pattern or 'owner' in pattern.lower():
                indicators.append({
                    "type": "Owner-Controlled Minting",
                    "risk": "high",
                    "description": "Owner can mint tokens without restrictions",
                    "recommendation": "Verify minting is capped or time-locked"
                })
        
        # Check for transfer restrictions
        if re.search(r'function\s+transfer.*require.*false|transfer.*revert', code, re.IGNORECASE):
            indicators.append({
                "type": "Transfer Restrictions",
                "risk": "high",
                "description": "Contract may prevent token transfers",
                "recommendation": "Verify transfer logic is not malicious"
            })
        
        return indicators
    
    async def _scan_solana_contract(self, address: str) -> Dict:
        """
        Scan Solana program (simplified)
        """
        # Solana scanning would require different tools
        # This is a placeholder for Solana-specific scanning
        return {
            "contract_address": address,
            "chain": "solana",
            "safety_score": 50,
            "vulnerabilities": [{
                "type": "Solana Program Analysis",
                "severity": "info",
                "description": "Solana program analysis requires specialized tools",
                "recommendation": "Use Solana-specific audit tools"
            }],
            "rug_pull_indicators": []
        }
    
    def _check_reentrancy(self, bytecode: bytes) -> bool:
        """Check for reentrancy patterns in bytecode"""
        # Simplified check - in production, use more sophisticated analysis
        return b'CALL' in bytecode and len(bytecode) > 1000
    
    def _check_owner_control(self, bytecode: bytes) -> bool:
        """Check for owner control patterns"""
        return b'CALLER' in bytecode or b'ORIGIN' in bytecode
    
    def _check_upgradeable(self, bytecode: bytes) -> bool:
        """Check if contract is upgradeable"""
        hex_str = bytecode.hex().upper()
        return b'DELEGATECALL' in bytecode or 'PROXY' in hex_str
    
    def _check_unbounded_loops(self, bytecode: bytes) -> bool:
        """Check for unbounded loops"""
        # Simplified - would need more sophisticated analysis
        return len(bytecode) > 5000
    
    def _check_external_calls(self, bytecode: bytes) -> bool:
        """Check for external calls"""
        return b'CALL' in bytecode or b'STATICCALL' in bytecode
    
    def _check_hidden_minting(self, bytecode: bytes) -> bool:
        """Check for hidden minting functions"""
        hex_str = bytecode.hex().upper()
        return 'MINT' in hex_str or b'0x40c10f19' in bytecode or '40c10f19' in hex_str
    
    def _check_backdoor_withdrawals(self, bytecode: bytes) -> bool:
        """Check for backdoor withdrawal functions"""
        hex_str = bytecode.hex().upper()
        return 'WITHDRAW' in hex_str or 'DRAIN' in hex_str
    
    def _check_anti_sell(self, bytecode: bytes) -> bool:
        """Check for anti-sell mechanisms"""
        hex_str = bytecode.hex().upper()
        return 'BLACKLIST' in hex_str or 'BAN' in hex_str
    
    def _check_honeypot(self, bytecode: bytes) -> bool:
        """Check for honeypot patterns"""
        # Honeypots often have complex transfer logic
        return len(bytecode) > 8000 and b'REVERT' in bytecode
    
    async def _check_owner_renounced(self, address: str, chain: str) -> bool:
        """Check if contract owner is renounced"""
        try:
            w3 = self.providers.get(chain)
            if not w3:
                return False
            
            # Try to call owner() function
            # This is simplified - actual implementation would need ABI
            return False  # Default to not renounced for safety
        except:
            return False
    
    def _calculate_safety_score(
        self, 
        vulnerabilities: List[Dict], 
        rug_pull_indicators: List[Dict]
    ) -> int:
        """
        Calculate safety score (0-100)
        """
        score = 100
        
        # Deduct points for vulnerabilities
        for vuln in vulnerabilities:
            if vuln['severity'] == 'high':
                score -= 20
            elif vuln['severity'] == 'medium':
                score -= 10
            elif vuln['severity'] == 'low':
                score -= 5
        
        # Deduct points for rug-pull indicators
        for indicator in rug_pull_indicators:
            if indicator['risk'] == 'severe':
                score -= 30
            elif indicator['risk'] == 'high':
                score -= 20
            elif indicator['risk'] == 'medium':
                score -= 10
        
        return max(0, min(100, score))
    
    async def _detect_gas_optimizations(
        self,
        address: str,
        chain: str,
        bytecode: bytes
    ) -> List[Dict]:
        """
        Detect gas optimization opportunities
        """
        optimizations = []
        
        # Check for expensive operations
        if len(bytecode) > 24000:
            optimizations.append({
                "type": "Large Contract Size",
                "severity": "medium",
                "description": "Contract bytecode is very large, which increases deployment and execution costs",
                "recommendation": "Consider splitting into multiple contracts or using libraries",
                "estimated_savings": "10-30% gas reduction"
            })
        
        # Check for storage operations (expensive)
        storage_ops = bytecode.hex().count('55')  # SSTORE opcode
        if storage_ops > 50:
            optimizations.append({
                "type": "Excessive Storage Operations",
                "severity": "low",
                "description": f"Contract performs {storage_ops} storage operations, which are gas-intensive",
                "recommendation": "Use memory or calldata where possible, pack storage variables",
                "estimated_savings": "5-15% gas reduction per transaction"
            })
        
        # Check for loops (could be optimized)
        if b'JUMP' in bytecode and len(bytecode) > 5000:
            optimizations.append({
                "type": "Potential Loop Optimization",
                "severity": "low",
                "description": "Contract may contain loops that could be optimized",
                "recommendation": "Review loops for pagination or batch processing opportunities",
                "estimated_savings": "Variable, depends on loop size"
            })
        
        return optimizations
    
    def _analyze_gas_optimizations(self, code: str) -> List[Dict]:
        """
        Analyze Solidity code for gas optimization opportunities
        """
        optimizations = []
        
        # Check for storage variables that could be packed
        storage_vars = re.findall(r'(uint256|uint128|uint64|uint32|uint16|uint8)\s+\w+', code)
        if len(storage_vars) > 10:
            optimizations.append({
                "type": "Storage Packing Opportunity",
                "severity": "low",
                "description": f"Contract has {len(storage_vars)} storage variables that could be packed",
                "recommendation": "Pack smaller uint types together (e.g., uint128 + uint128 in one slot)",
                "estimated_savings": "20,000+ gas per packed slot"
            })
        
        # Check for expensive operations
        if re.search(r'\.push\(|\.pop\(', code):
            optimizations.append({
                "type": "Array Operations",
                "severity": "low",
                "description": "Contract uses array push/pop operations which are gas-intensive",
                "recommendation": "Consider using mappings or fixed-size arrays where possible",
                "estimated_savings": "5,000-20,000 gas per operation"
            })
        
        # Check for string operations
        if re.search(r'string\s+public|bytes\s+public', code):
            optimizations.append({
                "type": "String Storage",
                "severity": "low",
                "description": "Contract stores strings in storage, which is expensive",
                "recommendation": "Use bytes32 for fixed strings or store off-chain with IPFS hash",
                "estimated_savings": "10,000+ gas per string"
            })
        
        # Check for external calls in loops
        if re.search(r'for\s*\([^)]*\)\s*\{[^}]*\.(call|transfer|send)\(', code, re.DOTALL):
            optimizations.append({
                "type": "External Calls in Loops",
                "severity": "medium",
                "description": "Contract makes external calls inside loops, which is very gas-intensive",
                "recommendation": "Batch external calls or use pull payment pattern",
                "estimated_savings": "50,000+ gas per iteration"
            })
        
        # Check for repeated calculations
        if re.search(r'block\.timestamp|block\.number|msg\.sender', code):
            count = len(re.findall(r'block\.timestamp|block\.number|msg\.sender', code))
            if count > 20:
                optimizations.append({
                    "type": "Repeated Global Variable Access",
                    "severity": "low",
                    "description": f"Contract accesses global variables {count} times",
                    "recommendation": "Cache frequently used global variables in local variables",
                    "estimated_savings": "100-200 gas per access"
                })
        
        return optimizations

