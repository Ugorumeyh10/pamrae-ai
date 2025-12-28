import React from 'react'
import { Shield } from 'lucide-react'

function Logo({ size = 40, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-shrink-0">
        <Shield className="text-yellow-500" size={size} />
      </div>
    </div>
  )
}

export default Logo
