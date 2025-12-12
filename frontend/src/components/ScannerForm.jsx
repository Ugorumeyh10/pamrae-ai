import { useState } from 'react'
import { Upload, Search, Loader2, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import API_URL from '../config'

function ScannerForm({ onScan, loading }) {
  const [mode, setMode] = useState('address') // 'address' or 'upload'
  const [address, setAddress] = useState('')
  const [chain, setChain] = useState('ethereum')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let response
      
      if (mode === 'address') {
        if (!address.trim()) {
          alert('Please enter a contract address')
          return
        }
        
        response = await axios.post(`${API_URL}/api/v1/scan`, {
          contract_address: address.trim(),
          chain: chain
        })
      } else {
        if (!file) {
          alert('Please upload a Solidity file')
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
      alert(error.response?.data?.detail || 'Failed to scan contract. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect rounded-2xl p-4 md:p-8 shadow-2xl border-glow relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="flex gap-4 mb-6 relative z-10">
        <button
          onClick={() => setMode('address')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
            mode === 'address'
              ? 'bg-white text-black shadow-lg scale-105 border border-white/30'
              : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-white/20'
          }`}
        >
          {mode === 'address' && <div className="absolute inset-0 shimmer"></div>}
          <div className="flex items-center justify-center gap-2 relative z-10">
            <Search className="w-5 h-5" />
            Scan by Address
          </div>
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
            mode === 'upload'
              ? 'bg-white text-black shadow-lg scale-105 border border-white/30'
              : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:border-white/20'
          }`}
        >
          {mode === 'upload' && <div className="absolute inset-0 shimmer"></div>}
          <div className="flex items-center justify-center gap-2 relative z-10">
            <Upload className="w-5 h-5" />
            Upload Solidity Code
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chain Selection */}
        <div className="relative z-10">
          <label className="block text-sm font-medium text-white mb-2">
            Blockchain Network
          </label>
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/40 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            <option value="ethereum" className="bg-black text-white">Ethereum</option>
            <option value="base" className="bg-black text-white">Base</option>
            <option value="polygon" className="bg-black text-white">Polygon</option>
            <option value="solana" className="bg-black text-white">Solana</option>
          </select>
        </div>

        {/* Address Input */}
        {mode === 'address' && (
          <div className="relative z-10">
            <label className="block text-sm font-medium text-white mb-2">
              Contract Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/40 bg-white/5 text-white font-mono backdrop-blur-sm transition-all duration-300 hover:bg-white/10 placeholder:text-gray-500"
            />
            <p className="mt-2 text-sm text-gray-400">
              Enter the smart contract address you want to analyze
            </p>
          </div>
        )}

        {/* File Upload */}
        {mode === 'upload' && (
          <div className="relative z-10">
            <label className="block text-sm font-medium text-white mb-2">
              Solidity Source Code
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-all duration-300 bg-white/5 backdrop-blur-sm group/upload">
              <input
                type="file"
                id="file-upload"
                accept=".sol,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {fileName ? (
                  <div className="flex items-center justify-center gap-2 text-white">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">{fileName}</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2 group-hover/upload:text-white transition-colors" />
                    <p className="text-gray-300">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      .sol or .txt files only
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group/btn border border-white/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin relative z-10" />
              <span className="relative z-10">Scanning...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Scan Contract</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}

export default ScannerForm

