"""
Team Collaboration Service
Manages teams and shared scans
"""
import json
import time
from typing import Dict, List, Optional
from pathlib import Path
from datetime import datetime

class TeamService:
    """
    Service for team collaboration
    """
    
    def __init__(self, storage_path: str = "data/teams"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
    
    def create_team(
        self,
        owner_id: str,
        team_name: str,
        description: Optional[str] = None
    ) -> str:
        """
        Create a new team
        Returns team_id
        """
        import hashlib
        
        team_id = hashlib.sha256(f"{owner_id}{team_name}{time.time()}".encode()).hexdigest()[:16]
        
        team_data = {
            'team_id': team_id,
            'name': team_name,
            'description': description,
            'owner_id': owner_id,
            'created_at': datetime.utcnow().isoformat(),
            'members': [
                {
                    'user_id': owner_id,
                    'role': 'owner',
                    'joined_at': datetime.utcnow().isoformat()
                }
            ],
            'shared_scans': [],
            'settings': {
                'public': False,
                'allow_invites': True
            }
        }
        
        team_file = self.storage_path / f"team_{team_id}.json"
        with open(team_file, 'w') as f:
            json.dump(team_data, f, indent=2)
        
        return team_id
    
    def get_team(self, team_id: str) -> Optional[Dict]:
        """
        Get team by ID
        """
        team_file = self.storage_path / f"team_{team_id}.json"
        if team_file.exists():
            with open(team_file, 'r') as f:
                return json.load(f)
        return None
    
    def add_member(self, team_id: str, user_id: str, role: str = "member") -> bool:
        """
        Add member to team
        """
        team = self.get_team(team_id)
        if not team:
            return False
        
        # Check if already member
        if any(m['user_id'] == user_id for m in team['members']):
            return False
        
        team['members'].append({
            'user_id': user_id,
            'role': role,
            'joined_at': datetime.utcnow().isoformat()
        })
        
        team_file = self.storage_path / f"team_{team_id}.json"
        with open(team_file, 'w') as f:
            json.dump(team, f, indent=2)
        
        return True
    
    def remove_member(self, team_id: str, user_id: str, requester_id: str) -> bool:
        """
        Remove member from team
        """
        team = self.get_team(team_id)
        if not team:
            return False
        
        # Check permissions
        requester = next((m for m in team['members'] if m['user_id'] == requester_id), None)
        if not requester or requester['role'] not in ['owner', 'admin']:
            return False
        
        # Can't remove owner
        if user_id == team['owner_id']:
            return False
        
        team['members'] = [m for m in team['members'] if m['user_id'] != user_id]
        
        team_file = self.storage_path / f"team_{team_id}.json"
        with open(team_file, 'w') as f:
            json.dump(team, f, indent=2)
        
        return True
    
    def share_scan(self, team_id: str, scan_id: str, contract_address: str, chain: str, shared_by: str) -> bool:
        """
        Share scan with team
        """
        team = self.get_team(team_id)
        if not team:
            return False
        
        # Check if user is member
        if not any(m['user_id'] == shared_by for m in team['members']):
            return False
        
        scan_entry = {
            'scan_id': scan_id,
            'contract_address': contract_address,
            'chain': chain,
            'shared_by': shared_by,
            'shared_at': datetime.utcnow().isoformat()
        }
        
        # Check if already shared
        if scan_entry not in team['shared_scans']:
            team['shared_scans'].append(scan_entry)
            
            # Keep only last 500 shared scans
            team['shared_scans'] = team['shared_scans'][-500:]
            
            team_file = self.storage_path / f"team_{team_id}.json"
            with open(team_file, 'w') as f:
                json.dump(team, f, indent=2)
        
        return True
    
    def get_shared_scans(self, team_id: str, limit: int = 50) -> List[Dict]:
        """
        Get shared scans for team
        """
        team = self.get_team(team_id)
        if not team:
            return []
        
        return team.get('shared_scans', [])[-limit:]
    
    def get_user_teams(self, user_id: str) -> List[Dict]:
        """
        Get all teams user belongs to
        """
        teams = []
        for team_file in self.storage_path.glob("team_*.json"):
            try:
                with open(team_file, 'r') as f:
                    team = json.load(f)
                    if any(m['user_id'] == user_id for m in team['members']):
                        teams.append(team)
            except:
                continue
        
        return teams
    
    def update_team_settings(self, team_id: str, user_id: str, settings: Dict) -> bool:
        """
        Update team settings (owner/admin only)
        """
        team = self.get_team(team_id)
        if not team:
            return False
        
        # Check permissions
        member = next((m for m in team['members'] if m['user_id'] == user_id), None)
        if not member or member['role'] not in ['owner', 'admin']:
            return False
        
        team['settings'].update(settings)
        
        team_file = self.storage_path / f"team_{team_id}.json"
        with open(team_file, 'w') as f:
            json.dump(team, f, indent=2)
        
        return True
    
    def delete_team(self, team_id: str, user_id: str) -> bool:
        """
        Delete team (owner only)
        """
        team = self.get_team(team_id)
        if not team:
            return False
        
        # Only owner can delete
        if team['owner_id'] != user_id:
            return False
        
        team_file = self.storage_path / f"team_{team_id}.json"
        if team_file.exists():
            team_file.unlink()
            return True
        
        return False

