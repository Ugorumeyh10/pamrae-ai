import { DollarSign, Users, Calendar, Lock, TrendingUp, Package } from 'lucide-react'

function TokenMetrics({ metrics }) {
  if (!metrics || metrics.error) {
    return null
  }

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A'
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const formatSupply = (supply) => {
    if (!supply && supply !== 0) return 'N/A'
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`
    if (supply >= 1e3) return `${(supply / 1e3).toFixed(2)}K`
    return supply.toFixed(2)
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-blue-400" />
        Token Metrics
      </h3>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.name && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="text-xs text-gray-400 mb-1">Token Name</div>
            <div className="text-sm font-medium text-gray-50">{metrics.name}</div>
            {metrics.symbol && (
              <div className="text-xs text-gray-400 mt-1">({metrics.symbol})</div>
            )}
          </div>
        )}

        {metrics.total_supply !== undefined && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Package className="w-3 h-3" />
              Total Supply
            </div>
            <div className="text-sm font-medium text-gray-50">
              {formatSupply(metrics.total_supply)}
            </div>
          </div>
        )}

        {metrics.market_cap !== undefined && metrics.market_cap !== null && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <DollarSign className="w-3 h-3" />
              Market Cap
            </div>
            <div className="text-sm font-medium text-gray-50">
              {formatNumber(metrics.market_cap)}
            </div>
          </div>
        )}

        {metrics.current_price !== undefined && metrics.current_price !== null && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <TrendingUp className="w-3 h-3" />
              Current Price
            </div>
            <div className="text-sm font-medium text-gray-50">
              {formatNumber(metrics.current_price)}
            </div>
            {metrics.price_change_24h && (
              <div className={`text-xs mt-1 ${metrics.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.price_change_24h >= 0 ? '+' : ''}{metrics.price_change_24h.toFixed(2)}%
              </div>
            )}
          </div>
        )}

        {metrics.holder_count !== undefined && metrics.holder_count !== null && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Users className="w-3 h-3" />
              Holders
            </div>
            <div className="text-sm font-medium text-gray-50">
              {metrics.holder_count.toLocaleString()}
            </div>
          </div>
        )}

        {metrics.creation_date && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Calendar className="w-3 h-3" />
              Created
            </div>
            <div className="text-sm font-medium text-gray-50">
              {new Date(metrics.creation_date).toLocaleDateString()}
            </div>
          </div>
        )}

        {metrics.liquidity_usd !== undefined && metrics.liquidity_usd !== null && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <DollarSign className="w-3 h-3" />
              Liquidity
            </div>
            <div className="text-sm font-medium text-gray-50">
              {formatNumber(metrics.liquidity_usd)}
            </div>
          </div>
        )}

        {metrics.liquidity_locked !== undefined && metrics.liquidity_locked !== null && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Lock className="w-3 h-3" />
              Liquidity Lock
            </div>
            <div className={`text-sm font-medium ${metrics.liquidity_locked ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.liquidity_locked ? 'Locked' : 'Not Locked'}
            </div>
            {metrics.liquidity_lock_info && (
              <div className="text-xs text-gray-400 mt-1">
                {metrics.liquidity_lock_info}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TokenMetrics

