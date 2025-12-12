"""
Contract Monitoring Service
Tracks contract changes over time and provides historical analysis
"""
import json
import os
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from pathlib import Path

class ContractMonitor:
    """
    Monitor contracts for changes and maintain historical data
    """
    
    def __init__(self, storage_path: str = "data/scans"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
    
    def save_scan(self, contract_address: str, chain: str, scan_data: Dict) -> str:
        """
        Save scan results for historical tracking
        Returns scan_id
        """
        scan_id = f"{chain}_{contract_address}_{datetime.utcnow().timestamp()}"
        scan_data['scan_id'] = scan_id
        scan_data['timestamp'] = datetime.utcnow().isoformat()
        
        # Save to file
        file_path = self.storage_path / f"{scan_id}.json"
        with open(file_path, 'w') as f:
            json.dump(scan_data, f, indent=2)
        
        # Also save to contract-specific history
        contract_file = self.storage_path / f"{chain}_{contract_address}_history.json"
        history = self._load_history(contract_file)
        history.append({
            'scan_id': scan_id,
            'timestamp': scan_data['timestamp'],
            'safety_score': scan_data.get('safety_score', 0),
            'vulnerability_count': len(scan_data.get('vulnerabilities', [])),
            'rug_pull_count': len(scan_data.get('rug_pull_indicators', []))
        })
        self._save_history(contract_file, history)
        
        return scan_id
    
    def get_contract_history(self, contract_address: str, chain: str) -> List[Dict]:
        """
        Get historical scan data for a contract
        """
        contract_file = self.storage_path / f"{chain}_{contract_address}_history.json"
        return self._load_history(contract_file)
    
    def compare_scans(self, scan_id_1: str, scan_id_2: str) -> Dict:
        """
        Compare two scans and highlight differences
        """
        scan1 = self._load_scan(scan_id_1)
        scan2 = self._load_scan(scan_id_2)
        
        if not scan1 or not scan2:
            return {"error": "One or both scans not found"}
        
        comparison = {
            "scan1": {
                "scan_id": scan_id_1,
                "timestamp": scan1.get('timestamp'),
                "safety_score": scan1.get('safety_score', 0)
            },
            "scan2": {
                "scan_id": scan_id_2,
                "timestamp": scan2.get('timestamp'),
                "safety_score": scan2.get('safety_score', 0)
            },
            "differences": {
                "score_change": scan2.get('safety_score', 0) - scan1.get('safety_score', 0),
                "new_vulnerabilities": [],
                "resolved_vulnerabilities": [],
                "new_rug_indicators": [],
                "resolved_rug_indicators": []
            }
        }
        
        # Compare vulnerabilities
        vulns1 = {v.get('type'): v for v in scan1.get('vulnerabilities', [])}
        vulns2 = {v.get('type'): v for v in scan2.get('vulnerabilities', [])}
        
        for vuln_type, vuln in vulns2.items():
            if vuln_type not in vulns1:
                comparison['differences']['new_vulnerabilities'].append(vuln)
        
        for vuln_type, vuln in vulns1.items():
            if vuln_type not in vulns2:
                comparison['differences']['resolved_vulnerabilities'].append(vuln)
        
        # Compare rug-pull indicators
        rug1 = {r.get('type'): r for r in scan1.get('rug_pull_indicators', [])}
        rug2 = {r.get('type'): r for r in scan2.get('rug_pull_indicators', [])}
        
        for rug_type, rug in rug2.items():
            if rug_type not in rug1:
                comparison['differences']['new_rug_indicators'].append(rug)
        
        for rug_type, rug in rug1.items():
            if rug_type not in rug2:
                comparison['differences']['resolved_rug_indicators'].append(rug)
        
        return comparison
    
    def get_trends(self, contract_address: str, chain: str, days: int = 30) -> Dict:
        """
        Get trends for a contract over specified days
        """
        history = self.get_contract_history(contract_address, chain)
        
        # Filter by date range
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        recent_history = [
            h for h in history
            if datetime.fromisoformat(h['timestamp']) >= cutoff_date
        ]
        
        if not recent_history:
            return {"error": "No scan history found for the specified period"}
        
        scores = [h['safety_score'] for h in recent_history]
        vuln_counts = [h['vulnerability_count'] for h in recent_history]
        rug_counts = [h['rug_pull_count'] for h in recent_history]
        
        return {
            "contract_address": contract_address,
            "chain": chain,
            "period_days": days,
            "total_scans": len(recent_history),
            "trends": {
                "safety_score": {
                    "current": scores[-1] if scores else 0,
                    "average": sum(scores) / len(scores) if scores else 0,
                    "min": min(scores) if scores else 0,
                    "max": max(scores) if scores else 0,
                    "trend": "improving" if len(scores) > 1 and scores[-1] > scores[0] else "declining" if len(scores) > 1 and scores[-1] < scores[0] else "stable"
                },
                "vulnerabilities": {
                    "current": vuln_counts[-1] if vuln_counts else 0,
                    "average": sum(vuln_counts) / len(vuln_counts) if vuln_counts else 0,
                    "trend": "decreasing" if len(vuln_counts) > 1 and vuln_counts[-1] < vuln_counts[0] else "increasing" if len(vuln_counts) > 1 and vuln_counts[-1] > vuln_counts[0] else "stable"
                },
                "rug_indicators": {
                    "current": rug_counts[-1] if rug_counts else 0,
                    "average": sum(rug_counts) / len(rug_counts) if rug_counts else 0,
                    "trend": "decreasing" if len(rug_counts) > 1 and rug_counts[-1] < rug_counts[0] else "increasing" if len(rug_counts) > 1 and rug_counts[-1] > rug_counts[0] else "stable"
                }
            },
            "history": recent_history
        }
    
    def _load_scan(self, scan_id: str) -> Optional[Dict]:
        """Load a specific scan by ID"""
        file_path = self.storage_path / f"{scan_id}.json"
        if file_path.exists():
            with open(file_path, 'r') as f:
                return json.load(f)
        return None
    
    def _load_history(self, file_path: Path) -> List[Dict]:
        """Load contract history from file"""
        if file_path.exists():
            with open(file_path, 'r') as f:
                return json.load(f)
        return []
    
    def _save_history(self, file_path: Path, history: List[Dict]):
        """Save contract history to file"""
        # Keep only last 100 scans per contract
        history = history[-100:]
        with open(file_path, 'w') as f:
            json.dump(history, f, indent=2)

