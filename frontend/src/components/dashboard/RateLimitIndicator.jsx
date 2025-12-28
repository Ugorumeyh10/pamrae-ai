import { AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react'

function RateLimitIndicator({ usage }) {
  if (!usage) return null

  const dailyPercentage = usage.daily_limit ? (usage.daily_scans / usage.daily_limit) * 100 : 0
  const hourlyPercentage = usage.hourly_limit ? (usage.hourly_scans / usage.hourly_limit) * 100 : 0

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return '#ef4444' // red
    if (percentage >= 70) return '#f59e0b' // orange
    return '#10b981' // green
  }

  const getStatusIcon = (percentage) => {
    if (percentage >= 90) return AlertCircle
    if (percentage >= 70) return Clock
    return CheckCircle
  }

  const getStatusText = (percentage) => {
    if (percentage >= 90) return 'Critical'
    if (percentage >= 70) return 'Warning'
    return 'Normal'
  }

  const dailyStatus = getStatusColor(dailyPercentage)
  const hourlyStatus = getStatusColor(hourlyPercentage)
  const DailyIcon = getStatusIcon(dailyPercentage)
  const HourlyIcon = getStatusIcon(hourlyPercentage)

  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    borderColor: 'var(--border)',
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Rate Limit Status
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Monitor your API usage limits
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Daily Limit */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Daily
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {usage.daily_scans || 0} / {usage.daily_limit || 1000}
              </div>
            </div>
            <div className="w-24 h-2 rounded-full overflow-hidden relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: dailyStatus,
                  width: `${Math.min(dailyPercentage, 100)}%`
                }}
              />
            </div>
            <DailyIcon className="w-4 h-4" style={{ color: dailyStatus }} />
            <span className="text-xs font-medium" style={{ color: dailyStatus }}>
              {getStatusText(dailyPercentage)}
            </span>
          </div>

          {/* Hourly Limit */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Hourly
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {usage.hourly_scans || 0} / {usage.hourly_limit || 100}
              </div>
            </div>
            <div className="w-24 h-2 rounded-full overflow-hidden relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: hourlyStatus,
                  width: `${Math.min(hourlyPercentage, 100)}%`
                }}
              />
            </div>
            <HourlyIcon className="w-4 h-4" style={{ color: hourlyStatus }} />
            <span className="text-xs font-medium" style={{ color: hourlyStatus }}>
              {getStatusText(hourlyPercentage)}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      {(dailyPercentage >= 70 || hourlyPercentage >= 70) && (
        <div className="mt-4 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: dailyPercentage >= 90 || hourlyPercentage >= 90 ? '#ef4444' : '#f59e0b' }} />
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {dailyPercentage >= 90 || hourlyPercentage >= 90
              ? 'You are approaching your rate limit. Consider upgrading your plan to avoid interruptions.'
              : 'You are using a high percentage of your rate limit. Monitor your usage to avoid hitting the limit.'}
          </div>
        </div>
      )}
    </div>
  )
}

export default RateLimitIndicator

