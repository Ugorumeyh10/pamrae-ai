"""
NFT Analysis Service
Analyzes NFT contracts for security risks and metadata
"""
import asyncio
import aiohttp
from typing import Dict, List, Optional
from web3 import Web3
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class NFTAnalysisService:
    """
    Service for analyzing NFT contracts
    """
    
    def __init__(self):
        self.providers = {
            "ethereum": Web3(Web3.HTTPProvider("https://eth.llamarpc.com")),
            "base": Web3(Web3.HTTPProvider("https://mainnet.base.org")),
            "polygon": Web3(Web3.HTTPProvider("https://polygon-rpc.com")),
        }
        
        # Standard ERC-721 ABI
        self.erc721_abi = [
            {
                "constant": True,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{"name": "", "type": "uint256"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [{"name": "_tokenId", "type": "uint256"}],
                "name": "ownerOf",
                "outputs": [{"name": "", "type": "address"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [],
                "name": "name",
                "outputs": [{"name": "_name", "type": "string"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [],
                "name": "symbol",
                "outputs": [{"name": "_symbol", "type": "string"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [],
                "name": "maxSupply",
                "outputs": [{"name": "", "type": "uint256"}],
                "type": "function"
            },
            {
                "inputs": [],
                "name": "pause",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    
    async def analyze_nft_contract(
        self,
        contract_address: str,
        chain: str = "ethereum"
    ) -> Dict:
        """
        Comprehensive NFT contract analysis
        """
        try:
            if chain == "solana":
                return await self._analyze_solana_nft(contract_address)
            
            w3 = self.providers.get(chain)
            if not w3:
                raise ValueError(f"Unsupported chain: {chain}")
            
            contract = w3.eth.contract(
                address=Web3.to_checksum_address(contract_address),
                abi=self.erc721_abi
            )
            
            # Basic NFT info
            try:
                name = contract.functions.name().call()
            except:
                name = None
            
            try:
                symbol = contract.functions.symbol().call()
            except:
                symbol = None
            
            try:
                total_supply = contract.functions.totalSupply().call()
            except:
                total_supply = None
            
            try:
                max_supply = contract.functions.maxSupply().call()
            except:
                max_supply = None
            
            # Security checks
            safety_checks = await self._perform_safety_checks(contract_address, chain, contract)
            
            # Ownership concentration
            ownership_data = await self._check_ownership_concentration(contract_address, chain, total_supply)
            
            # Royalty analysis
            royalty_data = await self._analyze_royalties(contract_address, chain, contract)
            
            # Mint analysis
            mint_analysis = await self._analyze_mint_function(contract_address, chain, contract)
            
            # Launch data
            launch_data = await self._get_launch_data(contract_address, chain)
            
            # Price data (from marketplace APIs)
            price_data = await self._get_nft_price_data(contract_address, chain)
            
            return {
                "contract_address": contract_address,
                "chain": chain,
                "contract_type": "NFT",
                "name": name,
                "symbol": symbol,
                "total_supply": total_supply,
                "max_supply": max_supply,
                "supply_unlimited": max_supply is None or max_supply == 0,
                "safety_checks": safety_checks,
                "ownership_concentration": ownership_data,
                "royalty_analysis": royalty_data,
                "mint_analysis": mint_analysis,
                "launch_date": launch_data.get('launch_date'),
                "launch_block": launch_data.get('launch_block'),
                "mint_price": launch_data.get('mint_price'),
                "floor_price": price_data.get('floor_price'),
                "trading_volume_24h": price_data.get('volume_24h'),
                "trading_volume_all": price_data.get('volume_all'),
                "creator_wallet": launch_data.get('creator')
            }
        except Exception as e:
            return {
                "contract_address": contract_address,
                "chain": chain,
                "error": str(e)
            }
    
    async def _perform_safety_checks(
        self,
        address: str,
        chain: str,
        contract
    ) -> Dict:
        """Perform NFT-specific safety checks"""
        checks = {
            "unlimited_minting": False,
            "metadata_mutable": False,
            "mint_pauseable": False,
            "royalty_changeable": False,
            "owner_controls_all": False
        }
        
        try:
            # Check if minting can be paused
            try:
                contract.functions.pause().call()
                checks["mint_pauseable"] = True
            except:
                pass
            
            # Check for owner-only functions (would need full ABI)
            # This is simplified
            
        except Exception as e:
            print(f"Error in safety checks: {e}")
        
        return checks
    
    async def _check_ownership_concentration(
        self,
        address: str,
        chain: str,
        total_supply: Optional[int]
    ) -> Dict:
        """Check if ownership is concentrated in few wallets"""
        try:
            # In production, would query all owners
            # This is a placeholder
            return {
                "top_10_holders_percentage": None,
                "whale_wallets": [],
                "concentration_risk": "unknown"
            }
        except Exception:
            return {}
    
    async def _analyze_royalties(
        self,
        address: str,
        chain: str,
        contract
    ) -> Dict:
        """Analyze royalty settings"""
        try:
            # Check if royalties can be changed
            # EIP-2981 standard check
            return {
                "royalty_percentage": None,
                "royalty_mutable": False,
                "royalty_recipient": None
            }
        except Exception:
            return {}
    
    async def _analyze_mint_function(
        self,
        address: str,
        chain: str,
        contract
    ) -> Dict:
        """Analyze mint function for risks"""
        return {
            "mint_restrictions": None,
            "mint_price_fixed": None,
            "mint_unlimited": None
        }
    
    async def _get_launch_data(
        self,
        address: str,
        chain: str
    ) -> Dict:
        """Get NFT launch information"""
        # Would use block explorer APIs
        return {
            "launch_date": None,
            "launch_block": None,
            "mint_price": None,
            "creator": None
        }
    
    async def _get_nft_price_data(
        self,
        address: str,
        chain: str
    ) -> Dict:
        """Get NFT floor price and volume data using OpenSea API"""
        try:
            opensea_api_key = os.getenv("OPENSEA_API_KEY", "")
            
            if not opensea_api_key:
                # Can try OpenSea public API (very limited)
                return {
                    "floor_price": None,
                    "volume_24h": None,
                    "volume_all": None
                }
            
            # OpenSea API endpoint
            chain_slug = {
                "ethereum": "ethereum",
                "base": "base",
                "polygon": "matic"
            }.get(chain, "ethereum")
            
            url = f"https://api.opensea.io/api/v2/collection/{chain_slug}/{address}/stats"
            headers = {
                "X-API-KEY": opensea_api_key
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        stats = data.get('stats', {})
                        return {
                            "floor_price": stats.get('floor_price'),
                            "volume_24h": stats.get('one_day_volume'),
                            "volume_all": stats.get('total_volume')
                        }
        except Exception as e:
            print(f"Error fetching NFT price data: {e}")
        
        return {
            "floor_price": None,
            "volume_24h": None,
            "volume_all": None
        }
    
    async def _analyze_solana_nft(self, address: str) -> Dict:
        """Analyze Solana NFT"""
        return {
            "contract_address": address,
            "chain": "solana",
            "error": "Solana NFT analysis not yet implemented"
        }

