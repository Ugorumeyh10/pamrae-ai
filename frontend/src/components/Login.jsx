import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import axios from 'axios'
import Logo from './Logo'
import API_URL from '../config'

function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
        email,
        password
      })

      // Store session
      localStorage.setItem('pamrae_session', response.data.session_token)
      localStorage.setItem('pamrae_api_key', response.data.api_key)
      localStorage.setItem('pamrae_user_id', response.data.user_id)

      if (onLogin) {
        onLogin(response.data)
      }
    } catch (err) {
      let errorMessage = 'Login failed. Please check your credentials.'
      
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

  return (
    <div className="min-h-screen flex items-center justify-center py-8 md:py-12 px-4">
      <div className="glass-effect rounded-2xl p-6 md:p-8 w-full max-w-md border-glow relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size={60} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300">Sign in to your Pamrae AI account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-white/10 border border-white/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/40 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 placeholder:text-gray-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/40 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 placeholder:text-gray-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group/btn border border-white/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin relative z-10"></div>
                  <span className="relative z-10">Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-white font-semibold hover:underline"
                style={{color: '#FFD700'}}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

