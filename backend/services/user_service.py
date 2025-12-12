"""
User Account Service
Manages user accounts, authentication, and preferences
"""
import hashlib
import secrets
import json
import time
from typing import Dict, Optional, List
from pathlib import Path
from datetime import datetime, timedelta

class UserService:
    """
    Service for user account management
    """
    
    def __init__(self, storage_path: str = "data/users"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        
        # Session management
        self.sessions: Dict[str, Dict] = {}
    
    def create_user(
        self,
        email: str,
        password: str,
        name: Optional[str] = None,
        tier: str = "free"
    ) -> Dict:
        """
        Create a new user account
        Returns: {'user_id': str, 'api_key': str}
        """
        # Check if user exists
        if self._user_exists(email):
            raise ValueError("User already exists")
        
        # Generate user ID
        user_id = hashlib.sha256(f"{email}{time.time()}".encode()).hexdigest()[:16]
        
        # Hash password
        password_hash = self._hash_password(password)
        
        # Generate API key
        api_key = self._generate_api_key(tier)
        
        # Create user data
        user_data = {
            'user_id': user_id,
            'email': email,
            'password_hash': password_hash,
            'name': name or email.split('@')[0],
            'tier': tier,
            'api_key': api_key,
            'created_at': datetime.utcnow().isoformat(),
            'preferences': {
                'default_chain': 'ethereum',
                'notifications_enabled': True,
                'email_notifications': False,
                'theme': 'dark'
            },
            'scan_history': [],
            'favorite_contracts': [],
            'teams': []
        }
        
        # Save user
        user_file = self.storage_path / f"user_{user_id}.json"
        with open(user_file, 'w') as f:
            json.dump(user_data, f, indent=2)
        
        # Also save by email for lookup
        email_file = self.storage_path / f"email_{email.lower().replace('@', '_at_')}.json"
        with open(email_file, 'w') as f:
            json.dump({'user_id': user_id}, f)
        
        return {
            'user_id': user_id,
            'api_key': api_key,
            'tier': tier
        }
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict]:
        """
        Authenticate user and return session
        Returns: {'user_id': str, 'api_key': str, 'session_token': str}
        """
        user = self.get_user_by_email(email)
        if not user:
            return None
        
        # Verify password
        if not self._verify_password(password, user['password_hash']):
            return None
        
        # Create session
        session_token = secrets.token_urlsafe(32)
        session_data = {
            'user_id': user['user_id'],
            'email': email,
            'created_at': datetime.utcnow().isoformat(),
            'expires_at': (datetime.utcnow() + timedelta(days=30)).isoformat()
        }
        
        self.sessions[session_token] = session_data
        
        return {
            'user_id': user['user_id'],
            'api_key': user['api_key'],
            'session_token': session_token,
            'tier': user['tier']
        }
    
    def get_user(self, user_id: str) -> Optional[Dict]:
        """
        Get user by ID
        """
        user_file = self.storage_path / f"user_{user_id}.json"
        if user_file.exists():
            with open(user_file, 'r') as f:
                return json.load(f)
        return None
    
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """
        Get user by email
        """
        email_file = self.storage_path / f"email_{email.lower().replace('@', '_at_')}.json"
        if email_file.exists():
            with open(email_file, 'r') as f:
                email_data = json.load(f)
                return self.get_user(email_data['user_id'])
        return None
    
    def get_user_by_api_key(self, api_key: str) -> Optional[Dict]:
        """
        Get user by API key
        """
        # Search all users (in production, use database index)
        for user_file in self.storage_path.glob("user_*.json"):
            try:
                with open(user_file, 'r') as f:
                    user = json.load(f)
                    if user.get('api_key') == api_key:
                        return user
            except:
                continue
        return None
    
    def update_preferences(self, user_id: str, preferences: Dict) -> bool:
        """
        Update user preferences
        """
        user = self.get_user(user_id)
        if not user:
            return False
        
        user['preferences'].update(preferences)
        
        user_file = self.storage_path / f"user_{user_id}.json"
        with open(user_file, 'w') as f:
            json.dump(user, f, indent=2)
        
        return True
    
    def add_favorite_contract(self, user_id: str, contract_address: str, chain: str) -> bool:
        """
        Add contract to favorites
        """
        user = self.get_user(user_id)
        if not user:
            return False
        
        favorite = {
            'contract_address': contract_address,
            'chain': chain,
            'added_at': datetime.utcnow().isoformat()
        }
        
        # Check if already favorited
        if favorite not in user['favorite_contracts']:
            user['favorite_contracts'].append(favorite)
            
            user_file = self.storage_path / f"user_{user_id}.json"
            with open(user_file, 'w') as f:
                json.dump(user, f, indent=2)
        
        return True
    
    def get_favorite_contracts(self, user_id: str) -> List[Dict]:
        """
        Get user's favorite contracts
        """
        user = self.get_user(user_id)
        if not user:
            return []
        
        return user.get('favorite_contracts', [])
    
    def add_scan_to_history(self, user_id: str, scan_id: str, contract_address: str, chain: str):
        """
        Add scan to user history
        """
        user = self.get_user(user_id)
        if not user:
            return False
        
        scan_entry = {
            'scan_id': scan_id,
            'contract_address': contract_address,
            'chain': chain,
            'scanned_at': datetime.utcnow().isoformat()
        }
        
        user['scan_history'].append(scan_entry)
        
        # Keep only last 1000 scans
        user['scan_history'] = user['scan_history'][-1000:]
        
        user_file = self.storage_path / f"user_{user_id}.json"
        with open(user_file, 'w') as f:
            json.dump(user, f, indent=2)
        
        return True
    
    def get_scan_history(self, user_id: str, limit: int = 50) -> List[Dict]:
        """
        Get user's scan history
        """
        user = self.get_user(user_id)
        if not user:
            return []
        
        return user.get('scan_history', [])[-limit:]
    
    def upgrade_tier(self, user_id: str, new_tier: str) -> bool:
        """
        Upgrade user tier
        """
        user = self.get_user(user_id)
        if not user:
            return False
        
        user['tier'] = new_tier
        
        # Generate new API key with tier prefix
        user['api_key'] = self._generate_api_key(new_tier)
        
        user_file = self.storage_path / f"user_{user_id}.json"
        with open(user_file, 'w') as f:
            json.dump(user, f, indent=2)
        
        return True
    
    def validate_session(self, session_token: str) -> Optional[Dict]:
        """
        Validate session token
        """
        if session_token not in self.sessions:
            return None
        
        session = self.sessions[session_token]
        expires_at = datetime.fromisoformat(session['expires_at'])
        
        if datetime.utcnow() > expires_at:
            del self.sessions[session_token]
            return None
        
        return session
    
    def _user_exists(self, email: str) -> bool:
        """
        Check if user exists
        """
        email_file = self.storage_path / f"email_{email.lower().replace('@', '_at_')}.json"
        return email_file.exists()
    
    def _hash_password(self, password: str) -> str:
        """
        Hash password using SHA256 (in production, use bcrypt)
        """
        return hashlib.sha256(password.encode()).hexdigest()
    
    def _verify_password(self, password: str, password_hash: str) -> bool:
        """
        Verify password
        """
        return self._hash_password(password) == password_hash
    
    def _generate_api_key(self, tier: str) -> str:
        """
        Generate API key with tier prefix
        """
        random_part = secrets.token_urlsafe(24)
        prefix = {
            'free': '',
            'basic': 'basic_',
            'pro': 'pro_',
            'enterprise': 'enterprise_'
        }.get(tier, '')
        
        return f"{prefix}{random_part}"

