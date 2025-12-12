import { useState } from 'react'
import { Upload, Search, Loader2, FileText, Plus, X } from 'lucide-react'
import axios from 'axios'
import API_URL from '../config'

function BatchScanner({ onBatchScan, loading }) {
  const [contracts, setContracts] = useState([
    { address: '', chain: 'ethereum' }
  ])
  const [results, setResults] = useState(null)

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
    
    const validContracts = contracts.filter(c => c.address.trim())
    if (validContracts.length === 0) {
      alert('Please add at least one contract address')
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
        
        // Handle rate limit errors specifically
        if (data.error === 'Rate limit exceeded' || data.error?.includes('Rate limit')) {
          const resetTime = data.reset_time ? new Date(data.reset_time).toLocaleTimeString() : 'soon'
          const tier = data.tier || 'free'
          const reason = data.reason || 'You\'ve reached your hourly limit'
          errorMessage = `⏱️ Rate limit exceeded (${tier} tier)\n\n${reason}\n\nLimit resets at: ${resetTime}\n\n💡 Upgrade your plan for higher limits!`
        }
        // Handle other error formats
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
      
      alert(errorMessage)
    }
  }

  return (
    <div className="glass-effect rounded-2xl p-8 shadow-2xl border-glow relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 text-glow">Batch Contract Scanner</h2>
        <p className="text-gray-300 mb-6">Scan multiple contracts at once</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {contracts.map((contract, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={contract.address}
                  onChange={(e) => updateContract(index, 'address', e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/40 bg-white/5 text-white font-mono backdrop-blur-sm transition-all duration-300 hover:bg-white/10 placeholder:text-gray-500"
                />
              </div>
              <select
                value={contract.chain}
                onChange={(e) => updateContract(index, 'chain', e.target.value)}
                className="px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/40 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                <option value="ethereum" className="bg-black text-white">Ethereum</option>
                <option value="base" className="bg-black text-white">Base</option>
                <option value="polygon" className="bg-black text-white">Polygon</option>
                <option value="solana" className="bg-black text-white">Solana</option>
              </select>
              {contracts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeContract(index)}
                  className="p-3 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addContract}
            className="w-full py-2 px-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Another Contract
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group/btn border border-white/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                <span className="relative z-10">Scanning {contracts.length} Contracts...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Scan {contracts.filter(c => c.address.trim()).length} Contracts</span>
              </>
            )}
          </button>
        </form>

        {results && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-white font-semibold mb-2">Batch Scan Results</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">Total: {results.total}</p>
              <p className="text-green-400">Successful: {results.successful}</p>
              {results.failed > 0 && (
                <p className="text-red-400">Failed: {results.failed}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BatchScanner

