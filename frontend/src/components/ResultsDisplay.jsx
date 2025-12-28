import { useState } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Download, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Info
} from 'lucide-react'
import axios from 'axios'
import API_URL from '../config'
import TokenMetrics from './TokenMetrics'
import PriceHistory from './PriceHistory'
import NFTAnalysis from './NFTAnalysis'
import WalletAnalysis from './WalletAnalysis'

function ResultsDisplay({ results }) {
  const [expandedSections, setExpandedSections] = useState({
    vulnerabilities: true,
    rugPull: true,
    explanation: true
  })
  const [downloading, setDownloading] = useState(false)

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30 text-green-400'
    if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
    return 'bg-red-500/10 border-red-500/30 text-red-400'
  }

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="w-6 h-6" />
    if (score >= 50) return <AlertTriangle className="w-6 h-6" />
    return <XCircle className="w-6 h-6" />
  }

  const getSeverityBadge = (severity) => {
    const styles = {
      high: 'bg-red-500/10 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      info: 'bg-gray-800 text-gray-400 border-gray-700'
    }
    return styles[severity] || styles.info
  }

  const getRiskBadge = (risk) => {
    const styles = {
      severe: 'bg-red-500/10 text-red-400 border-red-500/30',
      high: 'bg-red-500/10 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      low: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    }
    return styles[risk] || styles.low
  }

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/report`,
        results,
        { 
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `security_report_${results.contract_address.slice(0, 10)}_${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      let errorMessage = 'Failed to download PDF. Please try again.'
      if (error.response?.data) {
        if (error.response.data instanceof Blob) {
          const text = await error.response.data.text()
          try {
            const errorData = JSON.parse(text)
            errorMessage = errorData.detail || errorData.message || errorMessage
          } catch {
            errorMessage = 'PDF generation failed. Please check if the report data is valid.'
          }
        } else {
          errorMessage = error.response.data.detail || error.response.data.message || errorMessage
        }
      }
      alert(`Error: ${errorMessage}`)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-50 mb-3">Security Analysis Results</h2>
            <div className="space-y-1 text-sm">
              <p className="text-gray-400">
                Contract: <span className="font-mono text-gray-300">{results.contract_address}</span>
              </p>
              <p className="text-gray-400">
                Chain: <span className="font-medium text-gray-300 capitalize">{results.chain}</span>
              </p>
            </div>
          </div>
          <div className={`${getScoreColor(results.safety_score)} rounded-xl p-6 text-center min-w-[140px] border`}>
            <div className="flex items-center justify-center mb-2">
              {getScoreIcon(results.safety_score)}
            </div>
            <div className="text-4xl font-bold mb-1">{results.safety_score}</div>
            <div className="text-sm font-medium opacity-90">Safety Score</div>
            <div className="text-xs mt-2 opacity-75">{results.risk_level}</div>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="btn-primary w-full"
        >
          {downloading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
              <span>Generating PDF...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </div>
          )}
        </button>
      </div>

      {results.token_metrics && <TokenMetrics metrics={results.token_metrics} />}
      {results.price_history && <PriceHistory history={results.price_history} />}
      {results.wallet_analysis && <WalletAnalysis analysis={results.wallet_analysis} />}
      {results.nft_analysis && <NFTAnalysis analysis={results.nft_analysis} />}

      <div className="card p-6">
        <button
          onClick={() => toggleSection('explanation')}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-50">AI Risk Explanation</h3>
          </div>
          {expandedSections.explanation ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.explanation && (
          <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-300 whitespace-pre-line">{results.ai_explanation}</p>
          </div>
        )}
      </div>

      {results.vulnerabilities && results.vulnerabilities.length > 0 && (
        <div className="card p-6">
          <button
            onClick={() => toggleSection('vulnerabilities')}
            className="w-full flex items-center justify-between text-left mb-4"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-gray-50">
                Vulnerabilities ({results.vulnerabilities.length})
              </h3>
            </div>
            {expandedSections.vulnerabilities ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {expandedSections.vulnerabilities && (
            <div className="space-y-3">
              {results.vulnerabilities.map((vuln, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-900/50 rounded-lg border border-gray-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-50">{vuln.type}</h4>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getSeverityBadge(vuln.severity)}`}>
                      {vuln.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{vuln.description}</p>
                  {vuln.recommendation && (
                    <p className="text-sm text-gray-300 mt-2 pt-2 border-t border-gray-800">
                      <span className="font-medium">Recommendation:</span> {vuln.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {results.rug_pull_indicators && results.rug_pull_indicators.length > 0 && (
        <div className="card p-6">
          <button
            onClick={() => toggleSection('rugPull')}
            className="w-full flex items-center justify-between text-left mb-4"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-gray-50">
                Rug-Pull Indicators ({results.rug_pull_indicators.length})
              </h3>
            </div>
            {expandedSections.rugPull ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {expandedSections.rugPull && (
            <div className="space-y-3">
              {results.rug_pull_indicators.map((indicator, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-900/50 rounded-lg border border-gray-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-50">{indicator.type}</h4>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getRiskBadge(indicator.risk)}`}>
                      {indicator.risk.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{indicator.description}</p>
                  {indicator.recommendation && (
                    <p className="text-sm text-gray-300 mt-2 pt-2 border-t border-gray-800">
                      <span className="font-medium">Warning:</span> {indicator.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {results.recommendations && results.recommendations.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-gray-50">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {results.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-gray-500 font-medium mt-0.5">{index + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.gas_optimizations && results.gas_optimizations.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-3 text-gray-50">
            <FileText className="w-5 h-5 text-blue-400" />
            Gas Optimization Opportunities ({results.gas_optimizations.length})
          </h3>
          <div className="space-y-3">
            {results.gas_optimizations.map((opt, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900/50 rounded-lg border border-gray-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-50">{opt.type}</h4>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-700 bg-gray-800 text-gray-400">
                    {opt.severity?.toUpperCase() || 'INFO'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{opt.description}</p>
                {opt.recommendation && (
                  <p className="text-sm text-gray-300 mt-2 pt-2 border-t border-gray-800">
                    <span className="font-medium">Recommendation:</span> {opt.recommendation}
                  </p>
                )}
                {opt.estimated_savings && (
                  <p className="text-xs text-gray-500 mt-2">
                    Estimated Savings: {opt.estimated_savings}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(!results.vulnerabilities || results.vulnerabilities.length === 0) &&
       (!results.rug_pull_indicators || results.rug_pull_indicators.length === 0) && (
        <div className="card p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-50 mb-2">No Critical Issues Detected</h3>
          <p className="text-sm text-gray-400">
            However, always conduct your own research (DYOR) before investing.
          </p>
        </div>
      )}
    </div>
  )
}

export default ResultsDisplay
