import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, FileText, Upload, Search, Loader2, Layers, History } from 'lucide-react'
import ScannerForm from './components/ScannerForm'
import ResultsDisplay from './components/ResultsDisplay'
import Header from './components/Header'
import BatchScanner from './components/BatchScanner'
import HistoryViewer from './components/HistoryViewer'
import AboutUs from './components/AboutUs'
import Logo from './components/Logo'
import Login from './components/Login'
import Signup from './components/Signup'
import Pricing from './components/Pricing'
import APIDashboard from './components/APIDashboard'
import TradeInsights from './components/TradeInsights'

function App() {
  const [scanResults, setScanResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('single')
  const [authMode, setAuthMode] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const apiKey = localStorage.getItem('pamrae_api_key')
    const userId = localStorage.getItem('pamrae_user_id')
    if (apiKey && userId) {
      setUser({ api_key: apiKey, user_id: userId })
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setAuthMode(null)
    setCurrentPage('home')
  }

  const handleSignup = (userData) => {
    setUser(userData)
    setAuthMode('login')
  }

  const handleLogout = () => {
    localStorage.removeItem('pamrae_session')
    localStorage.removeItem('pamrae_api_key')
    localStorage.removeItem('pamrae_user_id')
    setUser(null)
    setCurrentPage('home')
  }

  const handleScan = async (scanData) => {
    setLoading(true)
    setError(null)
    setScanResults(null)
    
    try {
      setScanResults(scanData)
    } catch (err) {
      let errorMessage = 'An error occurred'
      
      if (err.response?.data) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail
        } else if (typeof err.response.data.detail === 'object') {
          errorMessage = JSON.stringify(err.response.data.detail)
        } else if (typeof err.response.data.message === 'string') {
          errorMessage = err.response.data.message
        } else if (err.response.data.error) {
          errorMessage = typeof err.response.data.error === 'string' 
            ? err.response.data.error 
            : JSON.stringify(err.response.data.error)
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (authMode === 'login') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <Login 
          onLogin={handleLogin} 
          onSwitchToSignup={() => setAuthMode('signup')} 
        />
      </div>
    )
  }

  if (authMode === 'signup') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <Signup 
          onSignup={handleSignup} 
          onSwitchToLogin={() => setAuthMode('login')} 
        />
      </div>
    )
  }

  if (currentPage === 'pricing') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header 
          onPageChange={setCurrentPage}
          onAuthChange={setAuthMode}
          user={user}
          onLogout={handleLogout}
        />
        <Pricing 
          user={user}
          onPaymentSuccess={(plan) => {
            alert(`Successfully upgraded to ${plan} plan!`)
            const apiKey = localStorage.getItem('pamrae_api_key')
            if (apiKey) {
              // User tier will be updated automatically
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header 
        onPageChange={setCurrentPage}
        onAuthChange={setAuthMode}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {currentPage === 'home' && (
          <>
            {/* Trade Insights Section - Always Visible */}
            <div className="mb-12">
              <TradeInsights user={user} />
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <Logo size={64} />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-50 mb-4">
                  <span className="text-white">Pamrae</span>
                  <span className="text-gray-400"> AI</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-2">
                  AI-powered security analysis for smart contracts. Detect vulnerabilities, rug-pull patterns, and get instant safety scores.
                </p>
                <p className="text-sm text-gray-500 max-w-xl mx-auto">
                  Enter a contract address below to begin your security analysis
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-10">
                <div className="card p-6 card-hover">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-50 mb-2">Vulnerability Detection</h3>
                  <p className="text-sm text-gray-400">
                    Advanced AI scans for reentrancy, honeypots, and 20+ vulnerability patterns
                  </p>
                </div>
                
                <div className="card p-6 card-hover">
                  <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-50 mb-2">Rug-Pull Detection</h3>
                  <p className="text-sm text-gray-400">
                    Identifies hidden minting, backdoor withdrawals, and suspicious patterns
                  </p>
                </div>
                
                <div className="card p-6 card-hover">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-50 mb-2">PDF Reports</h3>
                  <p className="text-sm text-gray-400">
                    Generate professional security audit reports for your records
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setViewMode('single')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'single'
                        ? 'bg-white text-gray-950'
                        : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Single Scan
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('batch')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'batch'
                        ? 'bg-white text-gray-950'
                        : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Batch Scan
                    </div>
                  </button>
                  {scanResults && (
                    <button
                      onClick={() => setViewMode('history')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'history'
                          ? 'bg-white text-gray-950'
                          : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4" />
                        History
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {viewMode === 'single' && (
                <ScannerForm onScan={handleScan} loading={loading} />
              )}
              {viewMode === 'batch' && (
                <BatchScanner onBatchScan={(data) => {
                  console.log('Batch scan results:', data)
                }} loading={loading} />
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-4" />
                  <p className="text-sm text-gray-500">Analyzing contract security...</p>
                </div>
              )}

              {error && (
                <div className="card p-4 border-red-500/20 bg-red-500/5 mt-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-red-400">Error</h3>
                      <p className="text-sm text-red-300 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {scanResults && !loading && viewMode !== 'history' && (
                <div className="mt-8">
                  <ResultsDisplay results={scanResults} />
                </div>
              )}

              {scanResults && viewMode === 'history' && (
                <div className="mt-8">
                  <HistoryViewer 
                    contractAddress={scanResults.contract_address} 
                    chain={scanResults.chain} 
                  />
                </div>
              )}

              <div className="mt-16 text-center">
                <h2 className="text-xl font-semibold text-gray-50 mb-6">Supported Blockchains</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Ethereum', 'Base', 'Polygon', 'Solana'].map((chain) => (
                    <div
                      key={chain}
                      className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-300">{chain}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {currentPage === 'insights' && (
          <TradeInsights user={user} />
        )}

        {currentPage === 'about' && (
          <div id="about">
            <AboutUs />
          </div>
        )}

        {currentPage === 'dashboard' && user && (
          <APIDashboard user={user} />
        )}

        {currentPage === 'dashboard' && !user && (
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Sign In Required
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Please sign in to access the API Dashboard
              </p>
              <button
                onClick={() => setAuthMode('login')}
                className="btn-primary"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
