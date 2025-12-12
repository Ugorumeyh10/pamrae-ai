"""
Webhook Service for Real-time Notifications
"""
import asyncio
import aiohttp
import json
from typing import Dict, List, Optional
from datetime import datetime
from pathlib import Path

class WebhookService:
    """
    Service for sending webhook notifications
    """
    
    def __init__(self, storage_path: str = "data/webhooks"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
    
    async def send_webhook(
        self,
        url: str,
        event_type: str,
        data: Dict,
        secret: Optional[str] = None
    ) -> Dict:
        """
        Send webhook notification
        Returns: {'success': bool, 'status_code': int, 'error': str}
        """
        payload = {
            'event_type': event_type,
            'timestamp': datetime.utcnow().isoformat(),
            'data': data
        }
        
        headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'ContractScanner/1.0'
        }
        
        if secret:
            # In production, use proper HMAC signing
            headers['X-Webhook-Secret'] = secret
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    result = {
                        'success': response.status in [200, 201, 202],
                        'status_code': response.status,
                        'response_text': await response.text()
                    }
                    
                    # Log webhook delivery
                    self._log_webhook(url, event_type, result)
                    
                    return result
        except asyncio.TimeoutError:
            error = {'success': False, 'status_code': 0, 'error': 'Timeout'}
            self._log_webhook(url, event_type, error)
            return error
        except Exception as e:
            error = {'success': False, 'status_code': 0, 'error': str(e)}
            self._log_webhook(url, event_type, error)
            return error
    
    async def notify_scan_complete(
        self,
        webhook_url: str,
        scan_result: Dict,
        secret: Optional[str] = None
    ):
        """
        Notify when scan is complete
        """
        return await self.send_webhook(
            webhook_url,
            'scan.complete',
            {
                'contract_address': scan_result.get('contract_address'),
                'chain': scan_result.get('chain'),
                'safety_score': scan_result.get('safety_score'),
                'risk_level': scan_result.get('risk_level'),
                'vulnerability_count': len(scan_result.get('vulnerabilities', [])),
                'rug_indicator_count': len(scan_result.get('rug_pull_indicators', [])),
                'scan_id': scan_result.get('scan_id')
            },
            secret
        )
    
    async def notify_high_risk(
        self,
        webhook_url: str,
        scan_result: Dict,
        secret: Optional[str] = None
    ):
        """
        Notify when high risk is detected
        """
        if scan_result.get('safety_score', 100) < 50:
            return await self.send_webhook(
                webhook_url,
                'scan.high_risk',
                {
                    'contract_address': scan_result.get('contract_address'),
                    'chain': scan_result.get('chain'),
                    'safety_score': scan_result.get('safety_score'),
                    'risk_level': scan_result.get('risk_level'),
                    'critical_vulnerabilities': [
                        v for v in scan_result.get('vulnerabilities', [])
                        if v.get('severity') == 'high'
                    ],
                    'severe_rug_indicators': [
                        r for r in scan_result.get('rug_pull_indicators', [])
                        if r.get('risk') == 'severe'
                    ]
                },
                secret
            )
        return {'success': False, 'reason': 'Not high risk'}
    
    async def notify_contract_change(
        self,
        webhook_url: str,
        contract_address: str,
        chain: str,
        changes: Dict,
        secret: Optional[str] = None
    ):
        """
        Notify when contract changes are detected
        """
        return await self.send_webhook(
            webhook_url,
            'contract.changed',
            {
                'contract_address': contract_address,
                'chain': chain,
                'changes': changes,
                'timestamp': datetime.utcnow().isoformat()
            },
            secret
        )
    
    def register_webhook(
        self,
        api_key: str,
        url: str,
        events: List[str],
        secret: Optional[str] = None
    ) -> str:
        """
        Register a webhook
        Returns webhook_id
        """
        import hashlib
        import time
        
        webhook_id = hashlib.md5(
            f"{api_key}{url}{time.time()}".encode()
        ).hexdigest()[:16]
        
        webhook_config = {
            'id': webhook_id,
            'api_key': api_key,
            'url': url,
            'events': events,
            'secret': secret,
            'created_at': datetime.utcnow().isoformat(),
            'active': True
        }
        
        webhook_file = self.storage_path / f"webhook_{webhook_id}.json"
        with open(webhook_file, 'w') as f:
            json.dump(webhook_config, f, indent=2)
        
        return webhook_id
    
    def get_webhooks(self, api_key: str) -> List[Dict]:
        """
        Get all webhooks for an API key
        """
        webhooks = []
        for webhook_file in self.storage_path.glob("webhook_*.json"):
            try:
                with open(webhook_file, 'r') as f:
                    webhook = json.load(f)
                    if webhook.get('api_key') == api_key:
                        webhooks.append(webhook)
            except:
                continue
        
        return webhooks
    
    def delete_webhook(self, webhook_id: str, api_key: str) -> bool:
        """
        Delete a webhook
        """
        webhook_file = self.storage_path / f"webhook_{webhook_id}.json"
        if webhook_file.exists():
            try:
                with open(webhook_file, 'r') as f:
                    webhook = json.load(f)
                    if webhook.get('api_key') == api_key:
                        webhook_file.unlink()
                        return True
            except:
                pass
        
        return False
    
    async def trigger_webhooks(
        self,
        api_key: str,
        event_type: str,
        data: Dict
    ):
        """
        Trigger all webhooks for an API key matching the event type
        """
        webhooks = self.get_webhooks(api_key)
        
        results = []
        for webhook in webhooks:
            if not webhook.get('active', True):
                continue
            
            if event_type in webhook.get('events', []):
                result = await self.send_webhook(
                    webhook['url'],
                    event_type,
                    data,
                    webhook.get('secret')
                )
                results.append({
                    'webhook_id': webhook['id'],
                    'url': webhook['url'],
                    'result': result
                })
        
        return results
    
    def _log_webhook(self, url: str, event_type: str, result: Dict):
        """
        Log webhook delivery attempt
        """
        log_file = self.storage_path / "webhook_logs.jsonl"
        log_entry = {
            'url': url,
            'event_type': event_type,
            'timestamp': datetime.utcnow().isoformat(),
            'result': result
        }
        
        with open(log_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')

