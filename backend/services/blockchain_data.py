"""
Blockchain Data Service
Fetches token metrics, price data, liquidity information, and holder data
"""
import asyncio
import aiohttp
from typing import Dict, Optional, List
from datetime import datetime
from web3 import Web3
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class BlockchainDataService:
    """
    Service for fetching blockchain data including token metrics, prices, and liquidity
    """
    
    def __init__(self):
        self.providers = {
            "ethereum": Web3(Web3.HTTPProvider("https://eth.llamarpc.com")),
            "base": Web3(Web3.HTTPProvider("https://mainnet.base.org")),
            "polygon": Web3(Web3.HTTPProvider("https://polygon-rpc.com")),
        }
        
        # API endpoints
        self.coingecko_api = "https://api.coingecko.com/api/v3"
        self.etherscan_api = "https://api.etherscan.io/api"
        self.basescan_api = "https://api.basescan.org/api"
        self.polygonscan_api = "https://api.polygonscan.com/api"
        self.dexscreener_api = "https://api.dexscreener.com/latest"
        
        # API Keys from environment variables
        self.etherscan_api_key = os.getenv("ETHERSCAN_API_KEY", "")
        self.basescan_api_key = os.getenv("BASESCAN_API_KEY", "")
        self.polygonscan_api_key = os.getenv("POLYGONSCAN_API_KEY", "")
        self.coingecko_api_key = os.getenv("COINGECKO_API_KEY", "")
        self.opensea_api_key = os.getenv("OPENSEA_API_KEY", "")
        
        # Standard ERC-20 ABI for token functions
        self.erc20_abi = [
            {
                "constant": True,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{"name": "", "type": "uint256"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [{"name": "_owner", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"name": "balance", "type": "uint256"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [],
                "name": "decimals",
                "outputs": [{"name": "", "type": "uint8"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [],
                "name": "symbol",
                "outputs": [{"name": "", "type": "string"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [],
                "name": "name",
                "outputs": [{"name": "", "type": "string"}],
                "type": "function"
            }
        ]
    
    async def get_token_metrics(
        self, 
        contract_address: str, 
        chain: str = "ethereum"
    ) -> Dict:
        """
        Get comprehensive token metrics including supply, market cap, liquidity
        """
        try:
            if chain == "solana":
                return await self._get_solana_token_metrics(contract_address)
            
            w3 = self.providers.get(chain)
            if not w3:
                raise ValueError(f"Unsupported chain: {chain}")
            
            # Get contract instance
            contract = w3.eth.contract(
                address=Web3.to_checksum_address(contract_address),
                abi=self.erc20_abi
            )
            
            # Fetch basic token info
            decimals = contract.functions.decimals().call()
            total_supply_raw = contract.functions.totalSupply().call()
            total_supply = total_supply_raw / (10 ** decimals)
            
            symbol = contract.functions.symbol().call()
            name = contract.functions.name().call()
            
            # Get contract creation date (first transaction)
            creation_block = await self._get_contract_creation_block(contract_address, chain)
            creation_date = None
            if creation_block:
                block = w3.eth.get_block(creation_block)
                creation_date = datetime.fromtimestamp(block['timestamp']).isoformat()
            
            # Get holder count (approximate - may require indexing service)
            holder_count = await self._get_holder_count(contract_address, chain)
            
            # Get price and market cap
            price_data = await self._get_token_price(contract_address, chain, symbol)
            
            # Calculate market cap
            market_cap = None
            if price_data and price_data.get('price') and total_supply:
                market_cap = price_data['price'] * total_supply
            
            # Get liquidity data
            liquidity_data = await self._get_liquidity_data(contract_address, chain)
            
            return {
                "contract_address": contract_address,
                "chain": chain,
                "name": name,
                "symbol": symbol,
                "decimals": decimals,
                "total_supply": total_supply,
                "total_supply_raw": str(total_supply_raw),
                "creation_date": creation_date,
                "creation_block": creation_block,
                "holder_count": holder_count,
                "current_price": price_data.get('price') if price_data else None,
                "market_cap": market_cap,
                "price_change_24h": price_data.get('price_change_24h') if price_data else None,
                "liquidity_usd": liquidity_data.get('liquidity_usd') if liquidity_data else None,
                "liquidity_locked": liquidity_data.get('locked') if liquidity_data else None,
                "liquidity_lock_info": liquidity_data.get('lock_info') if liquidity_data else None,
                "price_history": price_data.get('history') if price_data else None
            }
        except Exception as e:
            return {
                "error": str(e),
                "contract_address": contract_address,
                "chain": chain
            }
    
    async def get_price_history(
        self,
        contract_address: str,
        chain: str = "ethereum"
    ) -> Dict:
        """
        Get price history including ATH, launch price, and historical data
        """
        try:
            # Get token info
            metrics = await self.get_token_metrics(contract_address, chain)
            symbol = metrics.get('symbol')
            
            if not symbol:
                return {"error": "Could not fetch token symbol"}
            
            # Fetch from CoinGecko or DEX aggregator
            price_history = await self._get_extended_price_history(contract_address, chain, symbol)
            
            return {
                "contract_address": contract_address,
                "chain": chain,
                "symbol": symbol,
                "all_time_high": price_history.get('ath'),
                "all_time_low": price_history.get('atl'),
                "launch_price": price_history.get('launch_price'),
                "current_price": price_history.get('current_price'),
                "market_cap_at_launch": price_history.get('market_cap_at_launch'),
                "price_history_7d": price_history.get('history_7d', []),
                "price_history_30d": price_history.get('history_30d', []),
                "price_history_all": price_history.get('history_all', [])
            }
        except Exception as e:
            return {
                "error": str(e),
                "contract_address": contract_address,
                "chain": chain
            }
    
    async def _get_contract_creation_block(self, address: str, chain: str) -> Optional[int]:
        """Get the block number where contract was created"""
        try:
            # Use chain-specific block explorer API
            if chain == "ethereum":
                api_url = self.etherscan_api
                api_key = self.etherscan_api_key
            elif chain == "base":
                api_url = self.basescan_api
                api_key = self.basescan_api_key
            elif chain == "polygon":
                api_url = self.polygonscan_api
                api_key = self.polygonscan_api_key
            else:
                return None
            
            # Skip if no API key provided
            if not api_key:
                return None
            
            async with aiohttp.ClientSession() as session:
                params = {
                    "module": "contract",
                    "action": "getcontractcreation",
                    "contractaddresses": address,
                    "apikey": api_key
                }
                async with session.get(api_url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    data = await response.json()
                    if data.get('status') == '1' and data.get('result'):
                        tx_hash = data['result'][0].get('txHash')
                        if tx_hash:
                            w3 = self.providers.get(chain)
                            tx = w3.eth.get_transaction_receipt(tx_hash)
                            return tx['blockNumber']
        except Exception as e:
            print(f"Error fetching creation block: {e}")
        return None
    
    async def _get_holder_count(self, address: str, chain: str) -> Optional[int]:
        """Get approximate holder count using Etherscan API"""
        try:
            if chain == "ethereum":
                api_url = self.etherscan_api
                api_key = self.etherscan_api_key
            elif chain == "base":
                api_url = self.basescan_api
                api_key = self.basescan_api_key
            elif chain == "polygon":
                api_url = self.polygonscan_api
                api_key = self.polygonscan_api_key
            else:
                return None
            
            if not api_key:
                return None
            
            async with aiohttp.ClientSession() as session:
                params = {
                    "module": "token",
                    "action": "tokenholderlist",
                    "contractaddress": address,
                    "apikey": api_key,
                    "page": 1,
                    "offset": 1  # Just get first page to check
                }
                async with session.get(api_url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('status') == '1':
                            # Return total holders if available
                            return data.get('result', []) and len(data.get('result', [])) or None
        except Exception as e:
            print(f"Error fetching holder count: {e}")
        return None
    
    async def _get_token_price(
        self, 
        contract_address: str, 
        chain: str, 
        symbol: str
    ) -> Optional[Dict]:
        """Get current token price using CoinGecko API"""
        try:
            chain_id_map = {
                "ethereum": "ethereum",
                "base": "base",
                "polygon": "polygon-pos"
            }
            
            chain_id = chain_id_map.get(chain)
            if not chain_id:
                return None
            
            async with aiohttp.ClientSession() as session:
                # Build URL with optional API key
                url = f"{self.coingecko_api}/coins/{chain_id}/contract/{contract_address}"
                headers = {}
                if self.coingecko_api_key:
                    headers['x-cg-demo-api-key'] = self.coingecko_api_key
                
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "price": data.get('market_data', {}).get('current_price', {}).get('usd'),
                            "price_change_24h": data.get('market_data', {}).get('price_change_percentage_24h'),
                            "market_cap": data.get('market_data', {}).get('market_cap', {}).get('usd'),
                            "ath": data.get('market_data', {}).get('ath', {}).get('usd'),
                            "atl": data.get('market_data', {}).get('atl', {}).get('usd')
                        }
                    elif response.status == 429:
                        print("CoinGecko rate limit exceeded. Consider adding API key or waiting.")
        except Exception as e:
            print(f"Error fetching price: {e}")
        
        return None
    
    async def _get_liquidity_data(
        self, 
        contract_address: str, 
        chain: str
    ) -> Optional[Dict]:
        """
        Get liquidity data using DEXScreener API (free, no key required)
        """
        try:
            async with aiohttp.ClientSession() as session:
                # DEXScreener API - free, no key required
                url = f"{self.dexscreener_api}/dex/tokens/{contract_address}"
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        pairs = data.get('pairs', [])
                        
                        if pairs:
                            # Get the pair with highest liquidity
                            best_pair = max(pairs, key=lambda p: float(p.get('liquidity', {}).get('usd', 0) or 0))
                            liquidity_usd = float(best_pair.get('liquidity', {}).get('usd', 0) or 0)
                            
                            return {
                                "liquidity_usd": liquidity_usd if liquidity_usd > 0 else None,
                                "locked": None,  # Would need to check lock contracts
                                "lock_info": None,
                                "dex": best_pair.get('dexId'),
                                "pair_address": best_pair.get('pairAddress')
                            }
        except Exception as e:
            print(f"Error fetching liquidity data: {e}")
        
        return {
            "liquidity_usd": None,
            "locked": None,
            "lock_info": None
        }
    
    async def _get_extended_price_history(
        self,
        contract_address: str,
        chain: str,
        symbol: str
    ) -> Dict:
        """Get extended price history"""
        try:
            chain_id_map = {
                "ethereum": "ethereum",
                "base": "base",
                "polygon": "polygon-pos"
            }
            
            chain_id = chain_id_map.get(chain)
            if not chain_id:
                return {}
            
            async with aiohttp.ClientSession() as session:
                url = f"{self.coingecko_api}/coins/{chain_id}/contract/{contract_address}/market_chart"
                params = {"vs_currency": "usd", "days": "max"}
                headers = {}
                if self.coingecko_api_key:
                    headers['x-cg-demo-api-key'] = self.coingecko_api_key
                
                async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        prices = data.get('prices', [])
                        
                        if prices:
                            # Find ATH and ATL
                            price_values = [p[1] for p in prices]
                            ath = max(price_values)
                            atl = min(price_values)
                            launch_price = price_values[0] if price_values else None
                            current_price = price_values[-1] if price_values else None
                            
                            # Get 7d and 30d history
                            days_7_ago = datetime.now().timestamp() * 1000 - (7 * 24 * 60 * 60 * 1000)
                            days_30_ago = datetime.now().timestamp() * 1000 - (30 * 24 * 60 * 60 * 1000)
                            
                            history_7d = [p for p in prices if p[0] >= days_7_ago]
                            history_30d = [p for p in prices if p[0] >= days_30_ago]
                            
                            return {
                                "ath": ath,
                                "atl": atl,
                                "launch_price": launch_price,
                                "current_price": current_price,
                                "history_7d": history_7d,
                                "history_30d": history_30d,
                                "history_all": prices
                            }
        except Exception as e:
            print(f"Error fetching price history: {e}")
        
        return {}
    
    async def _get_solana_token_metrics(self, address: str) -> Dict:
        """Get Solana token metrics"""
        # Placeholder for Solana implementation
        # Would use Solana RPC and token program
        return {
            "contract_address": address,
            "chain": "solana",
            "error": "Solana token metrics not yet implemented"
        }

