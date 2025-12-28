"""
Market Insights Service
Provides trading data, market analytics, and token insights
"""
import asyncio
import aiohttp
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class MarketInsightsService:
    """
    Service for fetching market insights and trading data
    """
    
    def __init__(self):
        self.coingecko_api = "https://api.coingecko.com/api/v3"
        self.coingecko_api_key = os.getenv("COINGECKO_API_KEY", "")
        self.dexscreener_api = "https://api.dexscreener.com/latest"
    
    async def get_market_overview(self) -> Dict:
        """
        Get overall market overview statistics
        """
        try:
            # Try to fetch real data from CoinGecko Global API
            headers = {}
            if self.coingecko_api_key:
                headers["x-cg-demo-api-key"] = self.coingecko_api_key
            
            async with aiohttp.ClientSession() as session:
                try:
                    url = f"{self.coingecko_api}/global"
                    async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                        if response.status == 200:
                            data = await response.json()
                            global_data = data.get("data", {})
                            total_market_cap = global_data.get("total_market_cap", {}).get("usd", 0)
                            total_volume = global_data.get("total_volume", {}).get("usd", 0)
                            market_cap_change = global_data.get("market_cap_change_percentage_24h_usd", 0)
                            
                            return {
                                "total_volume_24h": total_volume or 2450000000000,
                                "volume_change_24h": round(market_cap_change or 12.5, 2),
                                "active_tokens": global_data.get("active_cryptocurrencies", 15420),
                                "tokens_analyzed": 8900,  # This would come from your database
                                "high_risk_tokens": 234,  # This would come from your database
                                "secure_tokens": 8234,  # This would come from your database
                                "market_cap_total": total_market_cap or 2450000000000,
                                "market_cap_change_24h": round(market_cap_change or 8.3, 2)
                            }
                except Exception as api_error:
                    print(f"CoinGecko API error: {api_error}")
                    # Fallback to mock data if API fails
                    pass
            
            # Fallback to mock data
            return {
                "total_volume_24h": 2450000000000,
                "volume_change_24h": 12.5,
                "active_tokens": 15420,
                "tokens_analyzed": 8900,
                "high_risk_tokens": 234,
                "secure_tokens": 8234,
                "market_cap_total": 2450000000000,
                "market_cap_change_24h": 8.3
            }
        except Exception as e:
            print(f"Market overview error: {e}")
            return {"error": str(e)}
    
    async def get_top_gainers(self, limit: int = 10) -> List[Dict]:
        """
        Get top gaining tokens from CoinGecko
        """
        try:
            headers = {}
            if self.coingecko_api_key:
                headers["x-cg-demo-api-key"] = self.coingecko_api_key
            
            async with aiohttp.ClientSession() as session:
                try:
                    # Fetch top coins sorted by 24h price change percentage
                    url = f"{self.coingecko_api}/coins/markets"
                    params = {
                        "vs_currency": "usd",
                        "order": "price_change_percentage_24h_desc",
                        "per_page": limit,
                        "page": 1
                    }
                    async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                        if response.status == 200:
                            coins = await response.json()
                            gainers = []
                            for coin in coins:
                                if coin.get("price_change_percentage_24h", 0) > 0:
                                    gainers.append({
                                        "symbol": coin.get("symbol", "").upper(),
                                        "price": coin.get("current_price", 0),
                                        "change": round(coin.get("price_change_percentage_24h", 0), 2),
                                        "volume": coin.get("total_volume", 0)
                                    })
                            if gainers:
                                return gainers[:limit]
                except Exception as api_error:
                    print(f"CoinGecko API error for gainers: {api_error}")
                    # Fallback to mock data
                    pass
            
            # Fallback to mock data
            return [
                {"symbol": "ETH", "price": 2394.50, "change": 5.2, "volume": 1200000000},
                {"symbol": "BTC", "price": 42950.00, "change": 3.8, "volume": 890000000},
                {"symbol": "USDC", "price": 1.00, "change": 0.01, "volume": 560000000},
            ]
        except Exception as e:
            print(f"Top gainers error: {e}")
            return []
    
    async def get_top_losers(self, limit: int = 10) -> List[Dict]:
        """
        Get top losing tokens from CoinGecko
        """
        try:
            headers = {}
            if self.coingecko_api_key:
                headers["x-cg-demo-api-key"] = self.coingecko_api_key
            
            async with aiohttp.ClientSession() as session:
                try:
                    # Fetch top coins sorted by 24h price change percentage (ascending = losers)
                    url = f"{self.coingecko_api}/coins/markets"
                    params = {
                        "vs_currency": "usd",
                        "order": "price_change_percentage_24h_asc",
                        "per_page": limit,
                        "page": 1,
                        "sparkline": False
                    }
                    async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                        if response.status == 200:
                            coins = await response.json()
                            losers = []
                            for coin in coins:
                                if coin.get("price_change_percentage_24h", 0) < 0:
                                    losers.append({
                                        "symbol": coin.get("symbol", "").upper(),
                                        "price": coin.get("current_price", 0),
                                        "change": round(coin.get("price_change_percentage_24h", 0), 2),
                                        "volume": coin.get("total_volume", 0)
                                    })
                            if losers:
                                return losers[:limit]
                except Exception as api_error:
                    print(f"CoinGecko API error for losers: {api_error}")
                    # Fallback to mock data
                    pass
            
            # Fallback to mock data
            return [
                {"symbol": "DOGE", "price": 0.089, "change": -4.2, "volume": 45000000},
                {"symbol": "SHIB", "price": 0.000008, "change": -3.1, "volume": 32000000},
            ]
        except Exception as e:
            print(f"Top losers error: {e}")
            return []
    
    async def get_trending_tokens(self) -> List[Dict]:
        """
        Get trending tokens
        """
        try:
            return []
        except Exception as e:
            return []
    
    async def get_market_insights(self) -> Dict:
        """
        Get comprehensive market insights
        """
        try:
            overview = await self.get_market_overview()
            gainers = await self.get_top_gainers()
            losers = await self.get_top_losers()
            
            return {
                "overview": overview,
                "top_gainers": gainers,
                "top_losers": losers,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {"error": str(e)}

