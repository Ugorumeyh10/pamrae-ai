import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, FileText, Upload, Search, Loader2, Layers, History, CreditCard, User, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
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

function App() {
  const [scanResults, setScanResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('single') // 'single', 'batch', 'history'
  const [authMode, setAuthMode] = useState(null) // 'login', 'signup', null
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'pricing', 'about'
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
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
    setAuthMode('login') // Switch to login after signup
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
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Show auth pages
  if (authMode === 'login') {
    return (
      <div className="min-h-screen">
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
      <div className="min-h-screen">
        <Header />
        <Signup 
          onSignup={handleSignup} 
          onSwitchToLogin={() => setAuthMode('login')} 
        />
      </div>
    )
  }

  // Show pricing page
  if (currentPage === 'pricing') {
    return (
      <div className="min-h-screen">
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
            // Refresh user data
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
    <div className="min-h-screen">
      <Header 
        onPageChange={setCurrentPage}
        onAuthChange={setAuthMode}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-4 md:py-8">
        {currentPage === 'home' && (
          <>
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12 relative"
            >
          <div className="inline-flex items-center justify-center mb-6">
            <Logo size={80} />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span 
              className="text-5xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))'
              }}
            >
              P
            </span>
            <span className="text-white">amrae</span>
            <span className="text-gray-300"> AI</span>
          </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                Protect your investments with AI-powered security analysis. 
                Detect vulnerabilities, rug-pull patterns, and get instant safety scores.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
            >
          <div className="glass-effect rounded-2xl p-6 card-hover border-glow relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center mb-4 glow-effect relative z-10">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white relative z-10">Vulnerability Detection</h3>
            <p className="text-gray-300 relative z-10">
              Advanced AI scans for reentrancy, honeypots, and 20+ vulnerability patterns
            </p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 card-hover border-glow relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center mb-4 glow-effect relative z-10">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white relative z-10">Rug-Pull Detection</h3>
            <p className="text-gray-300 relative z-10">
              Identifies hidden minting, backdoor withdrawals, and suspicious patterns
            </p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 card-hover border-glow relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center mb-4 glow-effect relative z-10">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white relative z-10">PDF Reports</h3>
            <p className="text-gray-300 relative z-10">
              Generate professional security audit reports for your records
            </p>
              </div>
            </motion.div>

            {/* Mode Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-4xl mx-auto mb-4 md:mb-6"
            >
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setViewMode('single')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                viewMode === 'single'
                  ? 'bg-white text-black border border-white/30'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Single Scan
              </div>
            </button>
            <button
              onClick={() => setViewMode('batch')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                viewMode === 'batch'
                  ? 'bg-white text-black border border-white/30'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Batch Scan
              </div>
            </button>
            {scanResults && (
              <button
                onClick={() => setViewMode('history')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  viewMode === 'history'
                    ? 'bg-white text-black border border-white/30'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  History
                </div>
              </button>
            )}
              </div>
            </motion.div>

            {/* Scanner Form / Batch Scanner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
          {viewMode === 'single' && (
            <ScannerForm onScan={handleScan} loading={loading} />
          )}
          {viewMode === 'batch' && (
            <BatchScanner onBatchScan={(data) => {
              console.log('Batch scan results:', data)
              // You can handle batch results here
            }} loading={loading} />
          )}
            </motion.div>

            {/* Loading State */}
            {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-white animate-spin mb-4 pulse-glow" />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <p className="text-gray-300 text-glow">Analyzing contract security...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="glass-effect border border-white/20 rounded-xl p-6 border-glow">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-white pulse-glow" />
                <div>
                  <h3 className="font-semibold text-white">Error</h3>
                  <p className="text-gray-300">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {scanResults && !loading && viewMode !== 'history' && (
          <div className="max-w-4xl mx-auto mt-8">
            <ResultsDisplay results={scanResults} />
          </div>
        )}

        {/* History Viewer */}
        {scanResults && viewMode === 'history' && (
          <div className="max-w-4xl mx-auto mt-8">
            <HistoryViewer 
              contractAddress={scanResults.contract_address} 
              chain={scanResults.chain} 
            />
          </div>
        )}

            {/* Supported Chains */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 md:mt-16 text-center"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white text-glow">Supported Blockchains</h2>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {['Ethereum', 'Base', 'Polygon', 'Solana'].map((chain, index) => (
                  <motion.div
                    key={chain}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="glass-effect px-4 md:px-6 py-2 md:py-3 rounded-full border-glow card-hover"
                  >
                    <span className="font-medium text-white text-sm md:text-base">{chain}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* About Us Section */}
        {currentPage === 'about' && (
          <div id="about">
            <AboutUs />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo size={32} />
              <p className="text-gray-400 text-sm">
                © 2025 <span className="text-white font-semibold">Pamrae AI</span>. Founded by Ugorume Henry & Pamela Odunna.
              </p>
            </div>
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>Always DYOR (Do Your Own Research).</p>
              <p className="mt-1">Built with ❤️ for the Web3 community</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

