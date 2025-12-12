import { useState, useEffect } from 'react'
import { Clock, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react'
import axios from 'axios'
import API_URL from '../config'

function HistoryViewer({ contractAddress, chain }) {
  const [history, setHistory] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState(30)

  useEffect(() => {
    if (contractAddress && chain) {
      loadHistory()
      loadTrends()
    }
  }, [contractAddress, chain, days])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/history/${chain}/${contractAddress}`
      )
      setHistory(response.data)
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTrends = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/trends/${chain}/${contractAddress}?days=${days}`
      )
      setTrends(response.data)
    } catch (error) {
      console.error('Error loading trends:', error)
    }
  }

  if (!contractAddress || !chain) {
    return null
  }

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-6 border-glow">
        <p className="text-gray-300">Loading history...</p>
      </div>
    )
  }

  if (!history || history.total_scans === 0) {
    return (
      <div className="glass-effect rounded-2xl p-6 border-glow">
        <p className="text-gray-300">No scan history available for this contract.</p>
      </div>
    )
  }

  const getTrendIcon = (trend) => {
    if (trend === 'improving' || trend === 'decreasing') {
      return <TrendingUp className="w-5 h-5 text-green-400" />
    } else if (trend === 'declining' || trend === 'increasing') {
      return <TrendingDown className="w-5 h-5 text-red-400" />
    }
    return <Minus className="w-5 h-5 text-gray-400" />
  }

  return (
    <div className="space-y-6">
      {/* Trends Summary */}
      {trends && trends.trends && (
        <div className="glass-effect rounded-2xl p-6 border-glow card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-white pulse-glow" />
              Security Trends ({days} days)
            </h3>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white text-sm"
            >
              <option value={7} className="bg-black">7 days</option>
              <option value={30} className="bg-black">30 days</option>
              <option value={90} className="bg-black">90 days</option>
            </select>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Safety Score Trend */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">Safety Score</span>
                {getTrendIcon(trends.trends.safety_score.trend)}
              </div>
              <div className="text-2xl font-bold text-white">{trends.trends.safety_score.current}</div>
              <div className="text-xs text-gray-400 mt-1">
                Avg: {trends.trends.safety_score.average.toFixed(1)} | 
                Range: {trends.trends.safety_score.min}-{trends.trends.safety_score.max}
              </div>
              <div className="text-xs text-gray-500 mt-1 capitalize">
                Trend: {trends.trends.safety_score.trend}
              </div>
            </div>

            {/* Vulnerabilities Trend */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">Vulnerabilities</span>
                {getTrendIcon(trends.trends.vulnerabilities.trend)}
              </div>
              <div className="text-2xl font-bold text-white">{trends.trends.vulnerabilities.current}</div>
              <div className="text-xs text-gray-400 mt-1">
                Avg: {trends.trends.vulnerabilities.average.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 mt-1 capitalize">
                Trend: {trends.trends.vulnerabilities.trend}
              </div>
            </div>

            {/* Rug Indicators Trend */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">Rug Indicators</span>
                {getTrendIcon(trends.trends.rug_indicators.trend)}
              </div>
              <div className="text-2xl font-bold text-white">{trends.trends.rug_indicators.current}</div>
              <div className="text-xs text-gray-400 mt-1">
                Avg: {trends.trends.rug_indicators.average.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 mt-1 capitalize">
                Trend: {trends.trends.rug_indicators.trend}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan History */}
      <div className="glass-effect rounded-2xl p-6 border-glow card-hover">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-white pulse-glow" />
          Scan History ({history.total_scans} scans)
        </h3>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.history.slice().reverse().map((scan, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">
                    Score: {scan.safety_score}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(scan.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-300">
                  <div>Vulns: {scan.vulnerability_count}</div>
                  <div>Rug: {scan.rug_pull_count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HistoryViewer

