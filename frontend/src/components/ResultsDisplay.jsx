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
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

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
    if (score >= 80) return 'text-white bg-white/20 border-white/30'
    if (score >= 50) return 'text-white bg-white/15 border-white/20'
    return 'text-white bg-white/10 border-white/20'
  }

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="w-6 h-6 text-white" />
    if (score >= 50) return <AlertTriangle className="w-6 h-6 text-white" />
    return <XCircle className="w-6 h-6 text-white" />
  }

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-white/20 text-white border-white/30',
      medium: 'bg-white/15 text-white border-white/25',
      low: 'bg-white/10 text-white border-white/20',
      info: 'bg-white/5 text-gray-300 border-white/10'
    }
    return colors[severity] || colors.info
  }

  const getRiskColor = (risk) => {
    const colors = {
      severe: 'bg-white/20 text-white border-white/30',
      high: 'bg-white/15 text-white border-white/25',
      medium: 'bg-white/10 text-white border-white/20',
      low: 'bg-white/5 text-gray-300 border-white/10'
    }
    return colors[risk] || colors.low
  }

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/report`,
        results,
        { 
          responseType: 'blob'
        }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `security_report_${results.contract_address.slice(0, 10)}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Safety Score Card */}
      <div className="glass-effect rounded-2xl p-8 shadow-xl border-glow relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 text-glow">Security Analysis Results</h2>
            <p className="text-gray-300">
              Contract: <span className="font-mono text-sm text-white">{results.contract_address}</span>
            </p>
            <p className="text-gray-300">
              Chain: <span className="font-semibold capitalize text-white">{results.chain}</span>
            </p>
          </div>
          <div className={`${getScoreColor(results.safety_score)} rounded-2xl p-6 text-center min-w-[140px] border-glow pulse-glow relative overflow-hidden`}>
            <div className="absolute inset-0 shimmer"></div>
            <div className="flex items-center justify-center mb-2 relative z-10">
              {getScoreIcon(results.safety_score)}
            </div>
            <div className="text-4xl font-bold mb-1 relative z-10 text-glow">{results.safety_score}</div>
            <div className="text-sm font-medium relative z-10">Safety Score</div>
            <div className="text-xs mt-2 opacity-75 relative z-10">{results.risk_level}</div>
          </div>
        </div>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 border border-white/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
          {downloading ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin relative z-10" />
              <span className="relative z-10">Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Download PDF Report</span>
            </>
          )}
        </button>
      </div>

      {/* AI Explanation */}
      <div className="glass-effect rounded-2xl p-6 shadow-xl border-glow card-hover">
        <button
          onClick={() => toggleSection('explanation')}
          className="w-full flex items-center justify-between text-left hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-white pulse-glow" />
            <h3 className="text-xl font-semibold text-white">AI Risk Explanation</h3>
          </div>
          {expandedSections.explanation ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.explanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                <p className="text-gray-300 whitespace-pre-line">{results.ai_explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vulnerabilities */}
      {results.vulnerabilities && results.vulnerabilities.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 shadow-xl border-glow card-hover">
          <button
            onClick={() => toggleSection('vulnerabilities')}
            className="w-full flex items-center justify-between text-left mb-4 hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-white pulse-glow" />
              <h3 className="text-xl font-semibold text-white">
                Vulnerabilities ({results.vulnerabilities.length})
              </h3>
            </div>
            {expandedSections.vulnerabilities ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.vulnerabilities && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                {results.vulnerabilities.map((vuln, index) => (
                  <div
                    key={index}
                    className="border border-white/10 rounded-lg p-4 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{vuln.type}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{vuln.description}</p>
                    {vuln.recommendation && (
                      <p className="text-sm text-white mt-2">
                        💡 <span className="font-medium">Recommendation:</span> {vuln.recommendation}
                      </p>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Rug-Pull Indicators */}
      {results.rug_pull_indicators && results.rug_pull_indicators.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 shadow-xl border-glow card-hover">
          <button
            onClick={() => toggleSection('rugPull')}
            className="w-full flex items-center justify-between text-left mb-4 hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-white pulse-glow" />
              <h3 className="text-xl font-semibold text-white">
                Rug-Pull Indicators ({results.rug_pull_indicators.length})
              </h3>
            </div>
            {expandedSections.rugPull ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.rugPull && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                {results.rug_pull_indicators.map((indicator, index) => (
                  <div
                    key={index}
                    className="border border-white/20 rounded-lg p-4 bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{indicator.type}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(indicator.risk)}`}>
                        {indicator.risk.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{indicator.description}</p>
                    {indicator.recommendation && (
                      <p className="text-sm text-white mt-2">
                        ⚠️ <span className="font-medium">Warning:</span> {indicator.recommendation}
                      </p>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 shadow-xl border-glow card-hover">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-white">
            <CheckCircle className="w-6 h-6 text-white pulse-glow" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {results.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors">
                <span className="text-white font-bold">{index + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gas Optimizations */}
      {results.gas_optimizations && results.gas_optimizations.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 shadow-xl border-glow card-hover">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-white">
            <FileText className="w-6 h-6 text-white pulse-glow" />
            Gas Optimization Opportunities ({results.gas_optimizations.length})
          </h3>
          <div className="space-y-3">
            {results.gas_optimizations.map((opt, index) => (
              <div
                key={index}
                className="border border-white/10 rounded-lg p-4 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 bg-white/5 backdrop-blur-sm hover:bg-white/10"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{opt.type}</h4>
                  <span className="px-3 py-1 rounded-full text-xs font-medium border border-white/20 bg-white/10 text-white">
                    {opt.severity?.toUpperCase() || 'INFO'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{opt.description}</p>
                {opt.recommendation && (
                  <p className="text-sm text-white mt-2">
                    💡 <span className="font-medium">Recommendation:</span> {opt.recommendation}
                  </p>
                )}
                {opt.estimated_savings && (
                  <p className="text-sm text-gray-400 mt-1">
                    💰 Estimated Savings: {opt.estimated_savings}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Issues Found */}
      {(!results.vulnerabilities || results.vulnerabilities.length === 0) &&
       (!results.rug_pull_indicators || results.rug_pull_indicators.length === 0) && (
        <div className="glass-effect rounded-2xl p-8 shadow-xl text-center border-glow">
          <CheckCircle className="w-16 h-16 text-white mx-auto mb-4 pulse-glow" />
          <h3 className="text-2xl font-semibold text-white mb-2 text-glow">No Critical Issues Detected</h3>
          <p className="text-gray-300">
            However, always conduct your own research (DYOR) before investing.
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default ResultsDisplay

