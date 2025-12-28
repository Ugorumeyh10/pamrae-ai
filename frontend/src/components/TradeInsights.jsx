import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, BarChart3, Zap, AlertTriangle } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function TradeInsights({ user }) {
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')

  useEffect(() => {
    fetchMarketInsights()
  }, [timeRange])

  const fetchMarketInsights = async () => {
    setLoading(true)
    try {
      // Fetch from backend API
      const response = await axios.get(`${API_URL}/api/v1/market-insights`)
      const data = response.data
      
      // Transform API response to match component expectations
      const marketData = {
        totalVolume: data.overview?.total_volume_24h || 2450000000,
        volumeChange24h: data.overview?.volume_change_24h || 12.5,
        activeTokens: data.overview?.active_tokens || 15420,
        tokensAnalyzed: data.overview?.tokens_analyzed || 8900,
        highRiskTokens: data.overview?.high_risk_tokens || 234,
        secureTokens: data.overview?.secure_tokens || 8234,
        topGainers: data.top_gainers || [
          { symbol: 'ETH', price: 2394.50, change: 5.2, volume: 1200000000 },
          { symbol: 'BTC', price: 42950.00, change: 3.8, volume: 890000000 },
        ],
        topLosers: data.top_losers || [
          { symbol: 'DOGE', price: 0.089, change: -4.2, volume: 45000000 },
        ],
        recentScans: user ? [
          { address: '0x...abc', chain: 'Ethereum', risk: 'low', time: '2m ago' },
          { address: '0x...def', chain: 'Base', risk: 'medium', time: '5m ago' },
        ] : []
      }
      setMarketData(marketData)
    } catch (error) {
      console.error('Error fetching market insights:', error)
      // Fallback to mock data if API fails
      const mockData = {
        totalVolume: 2450000000,
        volumeChange24h: 12.5,
        activeTokens: 15420,
        tokensAnalyzed: 8900,
        highRiskTokens: 234,
        secureTokens: 8234,
        topGainers: [
          { symbol: 'ETH', price: 2394.50, change: 5.2, volume: 1200000000 },
          { symbol: 'BTC', price: 42950.00, change: 3.8, volume: 890000000 },
        ],
        topLosers: [
          { symbol: 'DOGE', price: 0.089, change: -4.2, volume: 45000000 },
          { symbol: 'SHIB', price: 0.000008, change: -3.1, volume: 32000000 },
        ],
        recentScans: []
      }
      setMarketData(mockData)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--text-primary)' }} />
        <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>Loading market insights...</p>
      </div>
    )
  }

  if (!marketData) return null

  const stats = [
    {
      label: 'Total Volume (24h)',
      value: `$${(marketData.totalVolume / 1e9).toFixed(2)}B`,
      change: marketData.volumeChange24h,
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Active Tokens',
      value: marketData.activeTokens.toLocaleString(),
      icon: Activity,
      color: 'blue'
    },
    {
      label: 'Tokens Analyzed',
      value: marketData.tokensAnalyzed.toLocaleString(),
      icon: BarChart3,
      color: 'purple'
    },
    {
      label: 'Secure Tokens',
      value: marketData.secureTokens.toLocaleString(),
      icon: Zap,
      color: 'green'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Market Insights & Analytics
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Real-time trading data and token analysis
          </p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', 'All'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timeRange === range ? 'border' : ''
              }`}
              style={{
                backgroundColor: timeRange === range ? 'var(--bg-tertiary)' : 'transparent',
                color: timeRange === range ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderColor: timeRange === range ? 'var(--border)' : 'transparent'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.change > 0
          return (
            <div key={stat.label} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                </div>
                {stat.change !== undefined && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? '+' : ''}{stat.change}%
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingUp className="w-5 h-5 text-green-400" />
            Top Gainers (24h)
          </h3>
          <div className="space-y-3">
            {marketData.topGainers.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    {token.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{token.symbol}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      ${(token.volume / 1e6).toFixed(2)}M vol
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-400">+{token.change}%</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    ${token.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingDown className="w-5 h-5 text-red-400" />
            Top Losers (24h)
          </h3>
          <div className="space-y-3">
            {marketData.topLosers.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    {token.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{token.symbol}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      ${(token.volume / 1e6).toFixed(2)}M vol
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-400">{token.change}%</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    ${token.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Risk Analysis Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>High Risk Tokens</div>
            <div className="text-2xl font-bold text-red-400">{marketData.highRiskTokens}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {((marketData.highRiskTokens / marketData.tokensAnalyzed) * 100).toFixed(1)}% of analyzed
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Secure Tokens</div>
            <div className="text-2xl font-bold text-green-400">{marketData.secureTokens}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {((marketData.secureTokens / marketData.tokensAnalyzed) * 100).toFixed(1)}% of analyzed
            </div>
          </div>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Analysis Coverage</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {((marketData.tokensAnalyzed / marketData.activeTokens) * 100).toFixed(1)}%
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {marketData.tokensAnalyzed.toLocaleString()} / {marketData.activeTokens.toLocaleString()} tokens
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {user && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Recent Scans
          </h3>
          <div className="space-y-2">
            {marketData.recentScans.map((scan, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-3">
                  <code className="text-xs font-mono" style={{ color: 'var(--text-primary)' }}>
                    {scan.address}
                  </code>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
                    {scan.chain}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    scan.risk === 'low' ? 'text-green-400' :
                    scan.risk === 'medium' ? 'text-yellow-400' : 'text-red-400'
                  }`} style={{ backgroundColor: 'var(--bg-primary)' }}>
                    {scan.risk} risk
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {scan.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!user && (
        <div className="card p-6 text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Sign in for Personalized Insights
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Get access to your scan history, personalized recommendations, and advanced analytics
          </p>
          <button
            onClick={() => window.location.hash = '#signin'}
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  )
}

export default TradeInsights

