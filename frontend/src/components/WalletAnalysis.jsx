import { Shield, AlertTriangle, CheckCircle, Users, Calendar } from 'lucide-react'

function WalletAnalysis({ analysis }) {
  if (!analysis || analysis.error) {
    return null
  }

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    if (score >= 30) return 'text-orange-400'
    return 'text-red-400'
  }

  const getRiskBadge = (riskLevel) => {
    const colors = {
      'low risk': 'bg-green-500/10 text-green-400 border-green-500/30',
      'medium risk': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'high risk': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      'very high risk': 'bg-red-500/10 text-red-400 border-red-500/30'
    }
    return colors[riskLevel.toLowerCase()] || colors['medium risk']
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-400" />
        Wallet Credit Analysis
      </h3>
      
      <div className="space-y-6">
        {/* Credit Score */}
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Credit Score</div>
              <div className={`text-3xl font-bold ${getRiskColor(analysis.credit_score)}`}>
                {analysis.credit_score.toFixed(0)}/100
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${getRiskBadge(analysis.risk_level)}`}>
              <div className="text-sm font-medium">{analysis.risk_level}</div>
            </div>
          </div>
          
          {analysis.account_age_days > 0 && (
            <div className="text-xs text-gray-400">
              Account Age: {analysis.account_age_days} days
            </div>
          )}
        </div>

        {/* Project Statistics */}
        {analysis.total_projects > 0 && (
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="text-xs text-gray-400 mb-1">Total Projects</div>
              <div className="text-xl font-bold text-gray-50">{analysis.total_projects}</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Successful
              </div>
              <div className="text-xl font-bold text-green-400">{analysis.successful_projects}</div>
            </div>
            
            {analysis.rug_pull_projects > 0 && (
              <div className="bg-gray-900/50 rounded-lg p-4 border border-red-500/30">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Rug Pulls
                </div>
                <div className="text-xl font-bold text-red-400">{analysis.rug_pull_projects}</div>
              </div>
            )}
          </div>
        )}

        {/* Project Details */}
        {analysis.project_details && analysis.project_details.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-50 mb-3">Project History</h4>
            <div className="space-y-2">
              {analysis.project_details.slice(0, 5).map((project, index) => (
                <div key={index} className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-50">
                        {project.name || `Project ${index + 1}`}
                      </div>
                      {project.date && (
                        <div className="text-xs text-gray-400">
                          {new Date(project.date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      project.status === 'successful' ? 'bg-green-500/10 text-green-400' :
                      project.status === 'rug_pull' ? 'bg-red-500/10 text-red-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {project.status || 'Unknown'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning if rug pull history */}
        {analysis.rug_pull_projects > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-red-400 mb-1">
                  Rug Pull History Detected
                </div>
                <div className="text-xs text-red-300">
                  This wallet has been associated with {analysis.rug_pull_projects} project(s) that resulted in rug pulls.
                  Exercise extreme caution when interacting with contracts from this wallet.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletAnalysis

