import React from 'react'

function Logo({ size = 40, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Eye Logo in Gold */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#FFD700", stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:"#FFA500", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#FFD700", stopOpacity:1}} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Eye Shape */}
        <ellipse 
          cx="50" 
          cy="50" 
          rx="35" 
          ry="20" 
          fill="url(#goldGradient)" 
          stroke="#FFD700" 
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Pupil */}
        <circle 
          cx="50" 
          cy="50" 
          r="12" 
          fill="#1a1a1a"
        />
        
        {/* Highlight */}
        <ellipse 
          cx="45" 
          cy="45" 
          rx="4" 
          ry="6" 
          fill="#ffffff" 
          opacity="0.8"
        />
        
        {/* Eyelashes/Details */}
        <path 
          d="M 20 40 Q 15 35 10 30" 
          stroke="url(#goldGradient)" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M 20 60 Q 15 65 10 70" 
          stroke="url(#goldGradient)" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M 80 40 Q 85 35 90 30" 
          stroke="url(#goldGradient)" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M 80 60 Q 85 65 90 70" 
          stroke="url(#goldGradient)" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Text Logo */}
      <div className="flex items-baseline">
        <span 
          className="text-2xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))'
          }}
        >
          P
        </span>
        <span className="text-2xl font-bold text-white">amrae</span>
        <span className="text-lg font-semibold text-gray-300 ml-1">AI</span>
      </div>
    </div>
  )
}

export default Logo

