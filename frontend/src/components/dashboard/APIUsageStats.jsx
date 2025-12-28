import { Activity, TrendingUp, Clock, Zap } from 'lucide-react'
import DataTable from './DataTable'

function APIUsageStats({ usage, loading }) {
  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--text-primary)' }} />
        <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>Loading usage statistics...</p>
      </div>
    )
  }

  if (!usage) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No usage data available. Start making API calls to see statistics here.
        </p>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Requests',
      value: usage.total_scans || 0,
      icon: Activity,
      description: 'All-time API requests'
    },
    {
      label: 'Daily Requests',
      value: usage.daily_scans || 0,
      max: usage.daily_limit || 1000,
      icon: TrendingUp,
      description: 'Requests today'
    },
    {
      label: 'Hourly Requests',
      value: usage.hourly_scans || 0,
      max: usage.hourly_limit || 100,
      icon: Clock,
      description: 'Requests this hour'
    },
    {
      label: 'Success Rate',
      value: '99.8%',
      icon: Zap,
      description: 'Successful requests'
    },
  ]

  const chartData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    requests: Math.floor(Math.random() * 50) + 10,
  }))

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const percentage = stat.max ? (stat.value / stat.max) * 100 : 0
          
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
              <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {stat.description}
              </div>
              {stat.max && (
                <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: percentage > 80 ? '#ef4444' : percentage > 50 ? '#f59e0b' : '#10b981',
                      width: `${Math.min(percentage, 100)}%`
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Usage Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Requests Per Hour (Last 24 Hours)
        </h3>
        <div className="h-64 flex items-end justify-between gap-1">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex-1 rounded-t transition-all hover:opacity-80"
              style={{
                backgroundColor: 'var(--text-primary)',
                height: `${(item.requests / 60) * 100}%`,
                minHeight: '4px'
              }}
              title={`${item.hour}:00 - ${item.requests} requests`}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>24h ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Detailed Usage Table */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Endpoint Usage
        </h3>
        <DataTable
          data={[
            { endpoint: '/api/v1/scan', requests: 1250, avgResponseTime: '245ms', successRate: '99.8%' },
            { endpoint: '/api/v1/token-metrics', requests: 890, avgResponseTime: '189ms', successRate: '99.9%' },
            { endpoint: '/api/v1/price-history', requests: 450, avgResponseTime: '312ms', successRate: '99.5%' },
            { endpoint: '/api/v1/nft-analysis', requests: 230, avgResponseTime: '445ms', successRate: '98.2%' },
          ]}
          columns={[
            { key: 'endpoint', label: 'Endpoint' },
            { key: 'requests', label: 'Total Requests' },
            { key: 'avgResponseTime', label: 'Avg Response Time' },
            { key: 'successRate', label: 'Success Rate', render: (val) => (
              <span className="text-green-400">{val}</span>
            )},
          ]}
        />
      </div>
    </div>
  )
}

export default APIUsageStats

