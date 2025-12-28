import { useState, useEffect } from 'react'
import { 
  Key, 
  Activity, 
  Code, 
  FileText, 
  Copy, 
  Check, 
  TrendingUp,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Zap
} from 'lucide-react'
import APIUsageStats from './dashboard/APIUsageStats'
import APIKeyManager from './dashboard/APIKeyManager'
import CodeExamples from './dashboard/CodeExamples'
import DataTable from './dashboard/DataTable'
import RateLimitIndicator from './dashboard/RateLimitIndicator'
import API_URL from '../config'
import axios from 'axios'

function APIDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [apiUsage, setApiUsage] = useState(null)
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.api_key) {
      fetchAPIUsage()
      fetchAPIKeys()
    }
  }, [user])

  const fetchAPIUsage = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/usage`, {
        headers: { 'X-API-Key': user.api_key }
      })
      setApiUsage(response.data)
    } catch (error) {
      console.error('Error fetching API usage:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAPIKeys = async () => {
    // In a real app, this would fetch user's API keys
    setApiKeys([{
      id: user.api_key?.substring(0, 8) + '...',
      key: user.api_key,
      created: new Date().toISOString(),
      status: 'active',
      usage: '100/1000'
    }])
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'keys', label: 'API Keys', icon: Key },
    { id: 'usage', label: 'Usage Statistics', icon: Activity },
    { id: 'code', label: 'Code Examples', icon: Code },
    { id: 'docs', label: 'Documentation', icon: FileText },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            API Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage your API keys, monitor usage, and access documentation
          </p>
        </div>

        {/* Rate Limit Indicator */}
        {apiUsage && (
          <div className="mb-6">
            <RateLimitIndicator usage={apiUsage} />
          </div>
        )}

        {/* Tabs */}
        <div className="border-b mb-6" style={{ borderColor: 'var(--border)' }}>
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors
                    ${isActive ? '' : 'border-transparent'}
                  `}
                  style={{
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderBottomColor: isActive ? 'var(--text-primary)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = 'var(--text-secondary)'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <OverviewTab apiUsage={apiUsage} user={user} />
          )}
          {activeTab === 'keys' && (
            <APIKeyManager 
              apiKeys={apiKeys} 
              user={user}
              onRefresh={fetchAPIKeys}
            />
          )}
          {activeTab === 'usage' && (
            <APIUsageStats usage={apiUsage} loading={loading} />
          )}
          {activeTab === 'code' && (
            <CodeExamples user={user} />
          )}
          {activeTab === 'docs' && (
            <DocumentationTab />
          )}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ apiUsage, user }) {
  const stats = [
    {
      label: 'Total Requests',
      value: apiUsage?.total_scans || 0,
      icon: Activity,
      color: 'blue'
    },
    {
      label: 'Daily Requests',
      value: apiUsage?.daily_scans || 0,
      max: apiUsage?.daily_limit || 1000,
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Hourly Requests',
      value: apiUsage?.hourly_scans || 0,
      max: apiUsage?.hourly_limit || 100,
      icon: Clock,
      color: 'orange'
    },
    {
      label: 'Plan Tier',
      value: apiUsage?.tier || 'Free',
      icon: Shield,
      color: 'purple'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                </div>
                {stat.max && (
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {stat.value} / {stat.max}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
              {stat.max && (
                <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: 'var(--text-primary)',
                      width: `${Math.min((stat.value / stat.max) * 100, 100)}%`
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="card-hover p-4 text-left rounded-lg">
            <Key className="w-5 h-5 mb-2" style={{ color: 'var(--text-primary)' }} />
            <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Create API Key
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Generate a new API key for your projects
            </div>
          </button>
          <button className="card-hover p-4 text-left rounded-lg">
            <Code className="w-5 h-5 mb-2" style={{ color: 'var(--text-primary)' }} />
            <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              View Examples
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Browse code examples and snippets
            </div>
          </button>
          <button className="card-hover p-4 text-left rounded-lg">
            <FileText className="w-5 h-5 mb-2" style={{ color: 'var(--text-primary)' }} />
            <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Read Docs
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Complete API documentation
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Recent API Calls
        </h3>
        <DataTable
          data={[
            { timestamp: new Date(), endpoint: '/api/v1/scan', status: 200, responseTime: '245ms' },
            { timestamp: new Date(Date.now() - 3600000), endpoint: '/api/v1/token-metrics', status: 200, responseTime: '189ms' },
            { timestamp: new Date(Date.now() - 7200000), endpoint: '/api/v1/scan', status: 200, responseTime: '312ms' },
          ]}
          columns={[
            { key: 'timestamp', label: 'Time', render: (val) => val.toLocaleString() },
            { key: 'endpoint', label: 'Endpoint' },
            { key: 'status', label: 'Status', render: (val) => (
              <span className={`px-2 py-1 rounded text-xs ${val === 200 ? 'text-green-400' : 'text-red-400'}`}>
                {val}
              </span>
            )},
            { key: 'responseTime', label: 'Response Time' },
          ]}
        />
      </div>
    </div>
  )
}

function DocumentationTab() {
  const sections = [
    {
      title: 'Getting Started',
      content: 'Learn how to authenticate and make your first API call.'
    },
    {
      title: 'Authentication',
      content: 'All API requests require an API key in the X-API-Key header.'
    },
    {
      title: 'Rate Limits',
      content: 'Free tier: 10 requests/day. Pro tier: 1000 requests/day.'
    },
    {
      title: 'Endpoints',
      content: 'Complete list of available endpoints and their parameters.'
    },
  ]

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="card p-6">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {section.title}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {section.content}
          </p>
        </div>
      ))}
    </div>
  )
}

export default APIDashboard

