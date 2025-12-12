import { useState, useEffect } from 'react'
import { User, LogOut, CreditCard, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

function Header({ onPageChange, onAuthChange, user, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('header')) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [mobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [onPageChange])

  return (
    <header className="glass-effect border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onPageChange && onPageChange('home')}
              className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => onPageChange && onPageChange('about')}
              className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => onPageChange && onPageChange('pricing')}
              className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 flex items-center gap-1 relative group"
            >
              <CreditCard className="w-4 h-4" />
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-all hover:scale-105"
                >
                  <User className="w-4 h-4" />
                  <span className="text-white text-sm">Account</span>
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 glass-effect rounded-lg p-2 border-glow min-w-[200px] shadow-2xl"
                    >
                      <button
                        onClick={() => {
                          onPageChange && onPageChange('pricing')
                          setShowUserMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-all flex items-center gap-2 hover:scale-105"
                      >
                        <CreditCard className="w-4 h-4" />
                        Upgrade Plan
                      </button>
                      <button
                        onClick={() => {
                          onLogout && onLogout()
                          setShowUserMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-all flex items-center gap-2 hover:scale-105"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAuthChange && onAuthChange('login')}
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onAuthChange && onAuthChange('signup')}
                  className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 font-semibold border border-white/20 shadow-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4 overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onPageChange && onPageChange('home')
                    setMobileMenuOpen(false)
                  }}
                  className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 hover:scale-105"
                >
                  <span>Features</span>
                </button>
                <button
                  onClick={() => {
                    onPageChange && onPageChange('about')
                    setMobileMenuOpen(false)
                  }}
                  className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 hover:scale-105"
                >
                  <span>About</span>
                </button>
                <button
                  onClick={() => {
                    onPageChange && onPageChange('pricing')
                    setMobileMenuOpen(false)
                  }}
                  className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 hover:scale-105"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pricing</span>
                </button>
                {user ? (
                  <>
                    <div className="border-t border-white/10 my-2"></div>
                    <button
                      onClick={() => {
                        onPageChange && onPageChange('pricing')
                        setMobileMenuOpen(false)
                      }}
                      className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 hover:scale-105"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Upgrade Plan</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout && onLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 hover:scale-105"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-white/10 my-2"></div>
                    <button
                      onClick={() => {
                        onAuthChange && onAuthChange('login')
                        setMobileMenuOpen(false)
                      }}
                      className="text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        onAuthChange && onAuthChange('signup')
                        setMobileMenuOpen(false)
                      }}
                      className="text-left px-4 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-all font-semibold"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header

