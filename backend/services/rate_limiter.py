"""
API Rate Limiting Service
Implements usage tiers and rate limiting
"""
import time
from typing import Dict, Optional
from collections import defaultdict
from datetime import datetime, timedelta

class RateLimiter:
    """
    Rate limiter with tiered usage limits
    """
    
    def __init__(self):
        # Usage tiers
        self.tiers = {
            'free': {
                'scans_per_day': 10,
                'scans_per_hour': 3,
                'batch_size': 1,
                'features': ['basic_scan', 'pdf_report']
            },
            'basic': {
                'scans_per_day': 100,
                'scans_per_hour': 20,
                'batch_size': 5,
                'features': ['basic_scan', 'pdf_report', 'history', 'trends']
            },
            'pro': {
                'scans_per_day': 1000,
                'scans_per_hour': 100,
                'batch_size': 50,
                'features': ['basic_scan', 'pdf_report', 'history', 'trends', 'ml_predictions', 'webhooks', 'custom_rules']
            },
            'enterprise': {
                'scans_per_day': -1,  # Unlimited
                'scans_per_hour': -1,
                'batch_size': 200,
                'features': ['all']
            }
        }
        
        # Track usage per API key/user
        self.usage_tracking: Dict[str, Dict] = defaultdict(lambda: {
            'tier': 'free',
            'daily_scans': [],
            'hourly_scans': [],
            'total_scans': 0,
            'created_at': datetime.utcnow().isoformat()
        })
    
    def check_rate_limit(
        self, 
        api_key: Optional[str] = None,
        endpoint: str = 'scan',
        batch_size: int = 1
    ) -> Dict:
        """
        Check if request is within rate limits
        Returns: {
            'allowed': bool,
            'tier': str,
            'remaining_daily': int,
            'remaining_hourly': int,
            'reset_time': str
        }
        """
        # Default to free tier if no API key
        tier = self._get_tier(api_key)
        limits = self.tiers[tier]
        
        user_id = api_key or 'anonymous'
        usage = self.usage_tracking[user_id]
        usage['tier'] = tier
        
        now = datetime.utcnow()
        
        # Clean old scan records
        usage['daily_scans'] = [
            s for s in usage['daily_scans'] 
            if (now - datetime.fromisoformat(s)).total_seconds() < 86400
        ]
        usage['hourly_scans'] = [
            s for s in usage['hourly_scans'] 
            if (now - datetime.fromisoformat(s)).total_seconds() < 3600
        ]
        
        # Check daily limit
        daily_count = len(usage['daily_scans'])
        daily_limit = limits['scans_per_day']
        daily_allowed = daily_limit == -1 or daily_count < daily_limit
        
        # Check hourly limit
        hourly_count = len(usage['hourly_scans'])
        hourly_limit = limits['scans_per_hour']
        hourly_allowed = hourly_limit == -1 or hourly_count < hourly_limit
        
        # Check batch size limit
        batch_allowed = batch_size <= limits['batch_size']
        
        # Check feature access
        feature_allowed = self._check_feature_access(tier, endpoint)
        
        allowed = daily_allowed and hourly_allowed and batch_allowed and feature_allowed
        
        # Calculate reset times
        next_hour = (now + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)
        next_day = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        
        return {
            'allowed': allowed,
            'tier': tier,
            'remaining_daily': daily_limit - daily_count if daily_limit != -1 else -1,
            'remaining_hourly': hourly_limit - hourly_count if hourly_limit != -1 else -1,
            'remaining_batch': limits['batch_size'] - batch_size if limits['batch_size'] != -1 else -1,
            'reset_time_hourly': next_hour.isoformat(),
            'reset_time_daily': next_day.isoformat(),
            'reason': self._get_rejection_reason(
                daily_allowed, hourly_allowed, batch_allowed, feature_allowed
            )
        }
    
    def record_usage(self, api_key: Optional[str] = None, count: int = 1):
        """
        Record API usage
        """
        user_id = api_key or 'anonymous'
        usage = self.usage_tracking[user_id]
        
        now = datetime.utcnow().isoformat()
        
        for _ in range(count):
            usage['daily_scans'].append(now)
            usage['hourly_scans'].append(now)
            usage['total_scans'] += 1
    
    def upgrade_tier(self, api_key: str, new_tier: str):
        """
        Upgrade user to a new tier
        """
        if new_tier in self.tiers:
            self.usage_tracking[api_key]['tier'] = new_tier
    
    def get_usage_stats(self, api_key: Optional[str] = None) -> Dict:
        """
        Get usage statistics for a user
        """
        user_id = api_key or 'anonymous'
        usage = self.usage_tracking[user_id]
        tier = usage['tier']
        limits = self.tiers[tier]
        
        now = datetime.utcnow()
        
        # Clean old records
        usage['daily_scans'] = [
            s for s in usage['daily_scans'] 
            if (now - datetime.fromisoformat(s)).total_seconds() < 86400
        ]
        usage['hourly_scans'] = [
            s for s in usage['hourly_scans'] 
            if (now - datetime.fromisoformat(s)).total_seconds() < 3600
        ]
        
        return {
            'tier': tier,
            'total_scans': usage['total_scans'],
            'daily_scans': len(usage['daily_scans']),
            'daily_limit': limits['scans_per_day'],
            'hourly_scans': len(usage['hourly_scans']),
            'hourly_limit': limits['scans_per_hour'],
            'batch_size_limit': limits['batch_size'],
            'available_features': limits['features'],
            'created_at': usage['created_at']
        }
    
    def _get_tier(self, api_key: Optional[str]) -> str:
        """
        Determine user tier from API key
        In production, this would check a database
        """
        if not api_key:
            return 'free'
        
        # Simple tier detection from API key prefix
        # In production, use database lookup
        if api_key.startswith('pro_'):
            return 'pro'
        elif api_key.startswith('basic_'):
            return 'basic'
        elif api_key.startswith('enterprise_'):
            return 'enterprise'
        
        return 'free'
    
    def _check_feature_access(self, tier: str, endpoint: str) -> bool:
        """
        Check if tier has access to endpoint
        """
        features = self.tiers[tier]['features']
        
        if 'all' in features:
            return True
        
        feature_map = {
            'scan': 'basic_scan',
            'upload': 'basic_scan',
            'report': 'pdf_report',
            'history': 'history',
            'trends': 'trends',
            'batch-scan': 'batch_scan',
            'ml-predict': 'ml_predictions',
            'webhook': 'webhooks',
            'custom-rule': 'custom_rules'
        }
        
        required_feature = feature_map.get(endpoint, 'basic_scan')
        return required_feature in features or 'all' in features
    
    def _get_rejection_reason(
        self, 
        daily_allowed: bool, 
        hourly_allowed: bool, 
        batch_allowed: bool,
        feature_allowed: bool
    ) -> Optional[str]:
        """
        Get reason for rejection
        """
        if not feature_allowed:
            return "Feature not available in your tier"
        if not daily_allowed:
            return "Daily limit exceeded"
        if not hourly_allowed:
            return "Hourly limit exceeded"
        if not batch_allowed:
            return "Batch size exceeds tier limit"
        return None

