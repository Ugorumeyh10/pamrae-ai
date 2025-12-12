import { useState, useEffect } from 'react'
import { User, LogOut, CreditCard } from 'lucide-react'
import Logo from './Logo'

function Header({ onPageChange, onAuthChange, user, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="glass-effect border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); onPageChange && onPageChange('home') }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Logo size={40} />
            <div className="hidden sm:block">
              <p className="text-xs text-gray-400">AI-Powered Security Analysis</p>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onPageChange && onPageChange('home')}
              className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
            >
              Features
            </button>
            <button 
              onClick={() => onPageChange && onPageChange('about')}
              className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
            >
              About
            </button>
            <button 
              onClick={() => onPageChange && onPageChange('pricing')}
              className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 flex items-center gap-1"
            >
              <CreditCard className="w-4 h-4" />
              Pricing
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="text-white text-sm">Account</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 glass-effect rounded-lg p-2 border-glow min-w-[200px]">
                    <button
                      onClick={() => {
                        onPageChange && onPageChange('pricing')
                        setShowUserMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-all flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Upgrade Plan
                    </button>
                    <button
                      onClick={() => {
                        onLogout && onLogout()
                        setShowUserMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-all flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAuthChange && onAuthChange('login')}
                  className="text-gray-300 hover:text-white transition-all duration-300"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onAuthChange && onAuthChange('signup')}
                  className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 font-semibold border border-white/20 shadow-lg"
                >
                  Get Started
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

