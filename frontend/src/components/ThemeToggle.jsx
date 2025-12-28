import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const buttonStyle = {
    color: 'var(--text-secondary)',
  }

  const activeButtonStyle = {
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="theme-toggle-container">
      <div className="theme-toggle">
        <button
          onClick={() => toggleTheme('light')}
          className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
          title="Light theme"
          style={theme === 'light' ? activeButtonStyle : buttonStyle}
        >
          <Sun className="w-4 h-4" />
          <span>Light</span>
        </button>
        <button
          onClick={() => toggleTheme('dark')}
          className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
          title="Dark theme"
          style={theme === 'dark' ? activeButtonStyle : buttonStyle}
        >
          <Moon className="w-4 h-4" />
          <span>Dark</span>
        </button>
        <button
          onClick={() => toggleTheme('dim')}
          className={`theme-btn ${theme === 'dim' ? 'active' : ''}`}
          title="Dim theme"
          style={theme === 'dim' ? activeButtonStyle : buttonStyle}
        >
          <Monitor className="w-4 h-4" />
          <span>Dim</span>
        </button>
      </div>
    </div>
  )
}

export default ThemeToggle

