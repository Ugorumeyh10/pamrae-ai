import { useState } from 'react'
import { Upload, Search, Loader2, FileText, AlertTriangle, X } from 'lucide-react'
import axios from 'axios'
import API_URL from '../config'
import ChainSelector from './ChainSelector'

function ScannerForm({ onScan, loading: externalLoading }) {
  const [internalLoading, setInternalLoading] = useState(false)
  const loading = externalLoading || internalLoading
  const [mode, setMode] = useState('address')
  const [address, setAddress] = useState('')
  const [chain, setChain] = useState('ethereum')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Validate address format
    if (mode === 'address') {
      const trimmedAddress = address.trim()
      if (!trimmedAddress) {
        setError('Please enter a contract address')
        return
      }
      
      // Basic address validation
      if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) {
        if (trimmedAddress.length < 42) {
          setError(`Invalid address format: Address is too short (${trimmedAddress.length} characters, expected 42). Please check the address.`)
        } else if (trimmedAddress.length > 42) {
          setError(`Invalid address format: Address is too long (${trimmedAddress.length} characters, expected 42). Please check the address.`)
        } else if (!trimmedAddress.startsWith('0x')) {
          setError('Invalid address format: Address must start with "0x"')
        } else {
          setError('Invalid address format: Address must be 42 characters (0x + 40 hex characters). Please check the address.')
        }
        return
      }
    }
    
    setInternalLoading(true)
    try {
      let response
      
      if (mode === 'address') {
        response = await axios.post(`${API_URL}/api/v1/scan`, {
          contract_address: address.trim(),
          chain: chain
        })
      } else {
        if (!file) {
          setError('Please upload a Solidity file')
          return
        }
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('chain', chain)
        
        response = await axios.post(`${API_URL}/api/v1/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
      
      onScan(response.data)
    } catch (error) {
      console.error('Scan error:', error)
      let errorMessage = 'Failed to scan contract. Please try again.'
      
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
          // Clean up "Scan failed: " prefix if present
          if (errorMessage.startsWith('Scan failed: ')) {
            errorMessage = errorMessage.replace('Scan failed: ', '')
          }
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
    } finally {
      setInternalLoading(false)
    }
  }

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('address')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
            mode === 'address'
              ? 'bg-white text-gray-950'
              : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Scan by Address
          </div>
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-white text-gray-950'
              : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Code
          </div>
        </button>
      </div>

      {error && (
        <div className="card p-4 border-red-500/50 bg-red-500/10 mb-6 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-400 mb-1">Error</h3>
              <p className="text-sm text-red-300 break-words">{error}</p>
              {error.includes('Invalid address format') && (
                <div className="mt-2 text-xs text-red-400/80">
                  <p>💡 Tip: Ethereum addresses should be:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    <li>42 characters long (including "0x")</li>
                    <li>Start with "0x"</li>
                    <li>Contain only hexadecimal characters (0-9, a-f, A-F)</li>
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              aria-label="Close error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Blockchain Network
          </label>
          <ChainSelector
            value={chain}
            onChange={setChain}
          />
        </div>

        {mode === 'address' && (
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Contract Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="input font-mono"
            />
            <p className="mt-2 text-xs text-gray-500">
              Enter the smart contract address you want to analyze
            </p>
          </div>
        )}

        {mode === 'upload' && (
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Solidity Source Code
            </label>
            <div className="border-2 border-dashed border-gray-800 rounded-xl p-8 text-center hover:border-gray-700 transition-colors bg-gray-900/30">
              <input
                type="file"
                id="file-upload"
                accept=".sol,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {fileName ? (
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium">{fileName}</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      .sol or .txt files only
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-base min-h-[48px] flex items-center justify-center"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Scanning contract...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              <span>Scan Contract</span>
            </div>
          )}
        </button>
        
        {loading && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>Analyzing contract security...</span>
              <span className="animate-pulse">⏳</span>
            </div>
            <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div 
                className="h-full rounded-full animate-pulse" 
                style={{ 
                  backgroundColor: 'var(--text-primary)',
                  width: '100%',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              ></div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default ScannerForm
