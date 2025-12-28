import React from 'react'

const ChainLogos = {
  ethereum: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#627EEA"/>
      <path d="M12.498 3v6.87l5.497 2.44L12.498 3z" fill="#fff" fillOpacity="0.602"/>
      <path d="M12.498 3L7 12.31l5.498-2.44V3z" fill="#fff"/>
      <path d="M12.498 16.988v4.008L18 13.12l-5.502 3.869z" fill="#fff" fillOpacity="0.602"/>
      <path d="M12.498 21.005V16.99L7 13.12l5.498 7.885z" fill="#fff"/>
      <path d="M12.498 15.43l5.497-3.12-5.497-2.44v5.56z" fill="#fff" fillOpacity="0.2"/>
      <path d="M7 12.31l5.498 3.12v-5.56L7 12.31z" fill="#fff" fillOpacity="0.602"/>
    </svg>
  ),
  base: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#0052FF"/>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="#fff" fillOpacity="0.1"/>
      <path d="M12 5l7 12H5l7-12z" fill="#fff"/>
    </svg>
  ),
  polygon: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#8247E5"/>
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l8 4v8.64l-8 4-8-4V8.18l8-4z" fill="#fff"/>
    </svg>
  ),
  solana: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#14F195"/>
      <path d="M7.25 14.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 .53 1.28l-2.72 2.72a.75.75 0 0 1-1.06 0l-2.72-2.72a.75.75 0 0 1-.53-.22zm0-5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 .53 1.28l-2.72 2.72a.75.75 0 0 1-1.06 0L7.47 10.78A.75.75 0 0 1 7.25 9.5z" fill="#000"/>
    </svg>
  )
}

function ChainSelector({ value, onChange, className = "" }) {
  const chains = [
    { value: 'ethereum', label: 'Ethereum', logo: ChainLogos.ethereum },
    { value: 'base', label: 'Base', logo: ChainLogos.base },
    { value: 'polygon', label: 'Polygon', logo: ChainLogos.polygon },
    { value: 'solana', label: 'Solana', logo: ChainLogos.solana }
  ]

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input appearance-none pr-10"
      >
        {chains.map((chain) => (
          <option key={chain.value} value={chain.value} className="bg-gray-900">
            {chain.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {chains.find(c => c.value === value)?.logo || ChainLogos.ethereum}
      </div>
    </div>
  )
}

export default ChainSelector
