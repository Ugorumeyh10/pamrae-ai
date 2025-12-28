import { useState, useEffect } from 'react'
import { User, LogOut, CreditCard, Menu, X, ChevronDown, BarChart3, TrendingUp } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

function Header({ onPageChange, onAuthChange, user, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('header')) {
        setMobileMenuOpen(false)
      }
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [mobileMenuOpen, showUserMenu])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [onPageChange])

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'about', label: 'About' },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'dashboard', label: 'API Dashboard', icon: BarChart3, requiresAuth: true },
  ]

  const headerStyle = {
    backgroundColor: 'var(--bg-primary)',
    borderColor: 'var(--border)',
  }

  const textPrimaryStyle = { color: 'var(--text-primary)' }
  const textSecondaryStyle = { color: 'var(--text-secondary)' }
  const bgSecondaryStyle = { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }
  const hoverStyle = { backgroundColor: 'var(--hover)' }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={headerStyle}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onPageChange && onPageChange('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Logo size={32} />
            <div className="hidden sm:block">
              <div className="text-sm font-semibold" style={textPrimaryStyle}>Pamrae AI</div>
              <div className="text-xs" style={textSecondaryStyle}>Security Scanner</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.requiresAuth && !user) return null
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange && onPageChange(item.id)}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={textSecondaryStyle}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--text-primary)'
                    e.target.style.backgroundColor = 'var(--hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--text-secondary)'
                    e.target.style.backgroundColor = 'transparent'
                  }}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </div>
                </button>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors"
                  style={bgSecondaryStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--hover)'
                    e.currentTarget.style.borderColor = 'var(--hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  <User className="w-4 h-4" style={textSecondaryStyle} />
                  <span className="text-sm font-medium" style={textPrimaryStyle}>Account</span>
                  <ChevronDown className="w-4 h-4" style={textSecondaryStyle} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 border rounded-xl shadow-lg overflow-hidden" style={bgSecondaryStyle}>
                    <button
                      onClick={() => {
                        onPageChange && onPageChange('pricing')
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2"
                      style={textPrimaryStyle}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--hover)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                      }}
                    >
                      <CreditCard className="w-4 h-4" />
                      Upgrade Plan
                    </button>
                    <button
                      onClick={() => {
                        onLogout && onLogout()
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2"
                      style={textPrimaryStyle}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--hover)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAuthChange && onAuthChange('login')}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={textSecondaryStyle}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthChange && onAuthChange('signup')}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={textSecondaryStyle}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--text-primary)'
              e.target.style.backgroundColor = 'var(--hover)'
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--text-secondary)'
              e.target.style.backgroundColor = 'transparent'
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                if (item.requiresAuth && !user) return null
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange && onPageChange(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className="px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    style={textSecondaryStyle}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--text-primary)'
                      e.target.style.backgroundColor = 'var(--hover)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-secondary)'
                      e.target.style.backgroundColor = 'transparent'
                    }}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </button>
                )
              })}
              <div className="py-2">
                <ThemeToggle />
              </div>
              {user ? (
                <>
                  <div className="h-px my-2" style={{ backgroundColor: 'var(--border)' }} />
                  <button
                    onClick={() => {
                      onPageChange && onPageChange('pricing')
                      setMobileMenuOpen(false)
                    }}
                    className="px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    style={textSecondaryStyle}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--text-primary)'
                      e.target.style.backgroundColor = 'var(--hover)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-secondary)'
                      e.target.style.backgroundColor = 'transparent'
                    }}
                  >
                    <CreditCard className="w-4 h-4" />
                    Upgrade Plan
                  </button>
                  <button
                    onClick={() => {
                      onLogout && onLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    style={textSecondaryStyle}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--text-primary)'
                      e.target.style.backgroundColor = 'var(--hover)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-secondary)'
                      e.target.style.backgroundColor = 'transparent'
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px my-2" style={{ backgroundColor: 'var(--border)' }} />
                  <button
                    onClick={() => {
                      onAuthChange && onAuthChange('login')
                      setMobileMenuOpen(false)
                    }}
                    className="px-4 py-2.5 text-left text-sm font-medium rounded-lg transition-colors"
                    style={textSecondaryStyle}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--text-primary)'
                      e.target.style.backgroundColor = 'var(--hover)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-secondary)'
                      e.target.style.backgroundColor = 'transparent'
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onAuthChange && onAuthChange('signup')
                      setMobileMenuOpen(false)
                    }}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
