import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react'

function PriceHistory({ history }) {
  if (!history || history.error) {
    return null
  }

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A'
    if (price >= 1) return `$${price.toFixed(4)}`
    if (price >= 0.0001) return `$${price.toFixed(6)}`
    return `$${price.toExponential(2)}`
  }

  const formatMarketCap = (cap) => {
    if (!cap && cap !== 0) return 'N/A'
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`
    return `$${(cap / 1e3).toFixed(2)}K`
  }

  const calculateChange = (current, previous) => {
    if (!current || !previous) return null
    return ((current - previous) / previous) * 100
  }

  const athChange = calculateChange(history.current_price, history.all_time_high)

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-400" />
        Price History
      </h3>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {history.all_time_high !== undefined && history.all_time_high !== null && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              All Time High
            </div>
            <div className="text-sm font-medium text-gray-50">
              {formatPrice(history.all_time_high)}
            </div>
            {athChange !== null && (
              <div className="text-xs text-red-400 mt-1">
                {athChange.toFixed(2)}% from ATH
              </div>
            )}
          </div>
        )}

        {history.all_time_low !== undefined && history.all_time_low !== null && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <TrendingDown className="w-3 h-3 text-red-400" />
              All Time Low
            </div>
            <div className="text-sm font-medium text-gray-50">
              {formatPrice(history.all_time_low)}
            </div>
          </div>
        )}

        {history.launch_price !== undefined && history.launch_price !== null && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Calendar className="w-3 h-3" />
              Launch Price
            </div>
            <div className="text-sm font-medium text-gray-50">
              {formatPrice(history.launch_price)}
            </div>
            {history.current_price && history.launch_price && (
              <div className={`text-xs mt-1 ${history.current_price >= history.launch_price ? 'text-green-400' : 'text-red-400'}`}>
                {calculateChange(history.current_price, history.launch_price)?.toFixed(2)}% from launch
              </div>
            )}
          </div>
        )}

        {history.market_cap_at_launch !== undefined && history.market_cap_at_launch !== null && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <DollarSign className="w-3 h-3" />
              Market Cap at Launch
            </div>
            <div className="text-sm font-medium text-gray-50">
              {formatMarketCap(history.market_cap_at_launch)}
            </div>
          </div>
        )}

        {history.current_price !== undefined && history.current_price !== null && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <DollarSign className="w-3 h-3" />
              Current Price
            </div>
            <div className="text-sm font-medium text-gray-50">
              {formatPrice(history.current_price)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PriceHistory

