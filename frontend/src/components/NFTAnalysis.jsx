import { Package, Users, Calendar, DollarSign, Lock, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react'

function NFTAnalysis({ analysis }) {
  if (!analysis || analysis.error) {
    return null
  }

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A'
    if (price >= 1) return `${price.toFixed(4)} ETH`
    if (price >= 0.0001) return `${price.toFixed(6)} ETH`
    return `${price.toExponential(2)} ETH`
  }

  const formatVolume = (volume) => {
    if (!volume && volume !== 0) return 'N/A'
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`
    return `$${volume.toFixed(2)}`
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-purple-400" />
        NFT Analysis
      </h3>
      
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysis.name && (
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="text-xs text-gray-400 mb-1">Collection Name</div>
              <div className="text-sm font-medium text-gray-50">{analysis.name}</div>
              {analysis.symbol && (
                <div className="text-xs text-gray-400 mt-1">({analysis.symbol})</div>
              )}
            </div>
          )}

          {analysis.total_supply !== undefined && analysis.total_supply !== null && (
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Package className="w-3 h-3" />
                Total Supply
              </div>
              <div className="text-sm font-medium text-gray-50">
                {analysis.total_supply.toLocaleString()}
              </div>
              {analysis.max_supply && (
                <div className="text-xs text-gray-400 mt-1">Max: {analysis.max_supply.toLocaleString()}</div>
              )}
            </div>
          )}

          {analysis.launch_date && (
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <Calendar className="w-3 h-3" />
                Launch Date
              </div>
              <div className="text-sm font-medium text-gray-50">
                {new Date(analysis.launch_date).toLocaleDateString()}
              </div>
            </div>
          )}

          {analysis.mint_price !== undefined && analysis.mint_price !== null && (
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <DollarSign className="w-3 h-3" />
                Mint Price
              </div>
              <div className="text-sm font-medium text-gray-50">
                {formatPrice(analysis.mint_price)}
              </div>
            </div>
          )}
        </div>

        {/* Price Data */}
        {(analysis.floor_price !== undefined || analysis.trading_volume_24h !== undefined) && (
          <div className="grid sm:grid-cols-2 gap-4">
            {analysis.floor_price !== undefined && analysis.floor_price !== null && (
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <TrendingDown className="w-3 h-3" />
                  Floor Price
                </div>
                <div className="text-sm font-medium text-gray-50">
                  {formatPrice(analysis.floor_price)}
                </div>
              </div>
            )}

            {analysis.trading_volume_24h !== undefined && analysis.trading_volume_24h !== null && (
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <DollarSign className="w-3 h-3" />
                  24h Volume
                </div>
                <div className="text-sm font-medium text-gray-50">
                  {formatVolume(analysis.trading_volume_24h)}
                </div>
                {analysis.trading_volume_all && (
                  <div className="text-xs text-gray-400 mt-1">
                    All-time: {formatVolume(analysis.trading_volume_all)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Safety Checks */}
        {analysis.safety_checks && (
          <div>
            <h4 className="text-sm font-semibold text-gray-50 mb-3">Security Checks</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(analysis.safety_checks).map(([key, value]) => {
                const labels = {
                  unlimited_minting: 'Unlimited Minting',
                  metadata_mutable: 'Metadata Mutable',
                  mint_pauseable: 'Mint Pauseable',
                  royalty_changeable: 'Royalty Changeable',
                  owner_controls_all: 'Owner Controls All'
                }
                return (
                  <div key={key} className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                    {value ? (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    <div className="flex-1">
                      <div className="text-xs text-gray-400">{labels[key] || key}</div>
                      <div className={`text-xs font-medium ${value ? 'text-red-400' : 'text-green-400'}`}>
                        {value ? 'Risk Detected' : 'Safe'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Ownership Concentration */}
        {analysis.ownership_concentration && analysis.ownership_concentration.concentration_risk && (
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Users className="w-3 h-3" />
              Ownership Concentration
            </div>
            <div className="text-sm font-medium text-gray-50 mb-1">
              Risk Level: <span className="capitalize">{analysis.ownership_concentration.concentration_risk}</span>
            </div>
            {analysis.ownership_concentration.top_10_holders_percentage && (
              <div className="text-xs text-gray-400">
                Top 10 holders: {analysis.ownership_concentration.top_10_holders_percentage}%
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default NFTAnalysis

