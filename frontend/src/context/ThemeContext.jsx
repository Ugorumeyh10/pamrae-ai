import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      // Check localStorage first
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) return savedTheme
      }
      
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark'
        }
      }
    } catch (e) {
      console.error('Error loading theme:', e)
    }
    return 'dark' // Default to dark
  })

  useEffect(() => {
    try {
      // Save theme to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('theme', theme)
      }
      
      // Apply theme class to document root
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme)
        
        // Remove old theme classes
        document.documentElement.classList.remove('light-theme', 'dark-theme', 'dim-theme')
        
        // Add current theme class
        document.documentElement.classList.add(`${theme}-theme`)
      }
    } catch (e) {
      console.error('Error applying theme:', e)
    }
  }, [theme])

  const toggleTheme = (newTheme) => {
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

