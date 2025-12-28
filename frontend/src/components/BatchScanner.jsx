import { useState } from 'react'
import { Upload, Search, Loader2, FileText, Plus, X, AlertTriangle } from 'lucide-react'
import axios from 'axios'
import API_URL from '../config'
import ChainSelector from './ChainSelector'

function BatchScanner({ onBatchScan, loading }) {
  const [contracts, setContracts] = useState([
    { address: '', chain: 'ethereum' }
  ])
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const addContract = () => {
    setContracts([...contracts, { address: '', chain: 'ethereum' }])
  }

  const removeContract = (index) => {
    setContracts(contracts.filter((_, i) => i !== index))
  }

  const updateContract = (index, field, value) => {
    const updated = [...contracts]
    updated[index][field] = value
    setContracts(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    const validContracts = contracts.filter(c => c.address.trim())
    if (validContracts.length === 0) {
      setError('Please add at least one contract address')
      return
    }

    try {
      const response = await axios.post(`${API_URL}/api/v1/batch-scan`, {
        contracts: validContracts.map(c => ({
          address: c.address.trim(),
          chain: c.chain
        }))
      })
      
      setResults(response.data)
      if (onBatchScan) {
        onBatchScan(response.data)
      }
    } catch (error) {
      console.error('Batch scan error:', error)
      let errorMessage = 'Failed to scan contracts. Please try again.'
      
      if (error.response?.data) {
        const data = error.response.data
        
        if (data.error === 'Rate limit exceeded' || data.error?.includes('Rate limit')) {
          const resetTime = data.reset_time ? new Date(data.reset_time).toLocaleTimeString() : 'soon'
          const tier = data.tier || 'free'
          const reason = data.reason || 'You\'ve reached your hourly limit'
          errorMessage = `Rate limit exceeded (${tier} tier). ${reason} Limit resets at: ${resetTime}. Upgrade your plan for higher limits!`
        }
        else if (typeof data.detail === 'string') {
          errorMessage = data.detail
        } else if (typeof data.detail === 'object') {
          errorMessage = JSON.stringify(data.detail)
        } else if (typeof data.message === 'string') {
          errorMessage = data.message
        } else if (data.error) {
          errorMessage = typeof data.error === 'string' 
            ? data.error 
            : JSON.stringify(data.error)
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    }
  }

  return (
    <div className="card p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-50 mb-2">Batch Contract Scanner</h2>
      <p className="text-sm text-gray-400 mb-6">Scan multiple contracts at once</p>

      {error && (
        <div className="card p-4 border-red-500/50 bg-red-500/10 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-400 mb-1">Error</h3>
              <p className="text-sm text-red-300">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {contracts.map((contract, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={contract.address}
                onChange={(e) => updateContract(index, 'address', e.target.value)}
                placeholder="0x..."
                className="input font-mono"
              />
            </div>
            <div className="w-auto min-w-[160px]">
              <ChainSelector
                value={contract.chain}
                onChange={(value) => updateContract(index, 'chain', value)}
              />
            </div>
            {contracts.length > 1 && (
              <button
                type="button"
                onClick={() => removeContract(index)}
                className="p-3 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 hover:border-gray-700 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addContract}
          className="w-full py-2.5 px-4 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 hover:border-gray-700 text-gray-300 hover:text-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Contract
        </button>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Scanning {contracts.length} Contracts...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              <span>Scan {contracts.filter(c => c.address.trim()).length} Contracts</span>
            </div>
          )}
        </button>
      </form>

      {results && (
        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
          <h3 className="text-gray-50 font-semibold mb-3">Batch Scan Results</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-400">Total: <span className="text-gray-300 font-medium">{results.total}</span></p>
            <p className="text-green-400">Successful: <span className="font-medium">{results.successful}</span></p>
            {results.failed > 0 && (
              <p className="text-red-400">Failed: <span className="font-medium">{results.failed}</span></p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BatchScanner
