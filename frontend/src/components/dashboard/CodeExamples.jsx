import { useState } from 'react'
import { Copy, Check, Code, Globe, Terminal } from 'lucide-react'

function CodeExamples({ user }) {
  const [copiedExample, setCopiedExample] = useState(null)
  const [activeTab, setActiveTab] = useState('curl')

  const apiKey = user?.api_key || 'YOUR_API_KEY'

  const examples = {
    curl: `curl -X POST "https://api.pamrae.ai/api/v1/scan" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${apiKey}" \\
  -d '{
    "contract_address": "0x...",
    "chain": "ethereum",
    "contract_type": "token"
  }'`,
    javascript: `const axios = require('axios');

const response = await axios.post(
  'https://api.pamrae.ai/api/v1/scan',
  {
    contract_address: '0x...',
    chain: 'ethereum',
    contract_type: 'token'
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': '${apiKey}'
    }
  }
);

console.log(response.data);`,
    python: `import requests

url = "https://api.pamrae.ai/api/v1/scan"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "${apiKey}"
}
data = {
    "contract_address": "0x...",
    "chain": "ethereum",
    "contract_type": "token"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())`,
    nodejs: `const fetch = require('node-fetch');

const response = await fetch('https://api.pamrae.ai/api/v1/scan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '${apiKey}'
  },
  body: JSON.stringify({
    contract_address: '0x...',
    chain: 'ethereum',
    contract_type: 'token'
  })
});

const data = await response.json();
console.log(data);`,
  }

  const endpoints = [
    {
      name: 'Scan Contract',
      method: 'POST',
      path: '/api/v1/scan',
      description: 'Scan a smart contract for vulnerabilities and security risks'
    },
    {
      name: 'Get Token Metrics',
      method: 'GET',
      path: '/api/v1/token-metrics/{chain}/{address}',
      description: 'Get token metrics including market cap, supply, and liquidity'
    },
    {
      name: 'Get Price History',
      method: 'GET',
      path: '/api/v1/price-history/{chain}/{address}',
      description: 'Get historical price data including ATH and launch price'
    },
    {
      name: 'NFT Analysis',
      method: 'GET',
      path: '/api/v1/nft-analysis/{chain}/{address}',
      description: 'Analyze NFT contracts for security risks'
    },
  ]

  const copyExample = async (tab) => {
    try {
      await navigator.clipboard.writeText(examples[tab])
      setCopiedExample(tab)
      setTimeout(() => setCopiedExample(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const codeStyle = {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    borderColor: 'var(--border)',
  }

  return (
    <div className="space-y-6">
      {/* Quick Start */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Quick Start
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Make your first API call using one of these examples. Replace <code className="px-1 py-0.5 rounded" style={codeStyle}>YOUR_API_KEY</code> with your actual API key.
        </p>

        {/* Language Tabs */}
        <div className="flex gap-2 mb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          {Object.keys(examples).map((tab) => {
            const icons = {
              curl: Terminal,
              javascript: Code,
              python: Code,
              nodejs: Code,
            }
            const Icon = icons[tab] || Code
            const isActive = activeTab === tab
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  isActive ? '' : 'border-transparent'
                }`}
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
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          })}
        </div>

        {/* Code Block */}
        <div className="relative">
          <pre
            className="p-4 rounded-lg overflow-x-auto text-sm font-mono"
            style={codeStyle}
          >
            <code>{examples[activeTab]}</code>
          </pre>
          <button
            onClick={() => copyExample(activeTab)}
            className="absolute top-4 right-4 p-2 rounded border transition-colors"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border)'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bg-primary)'}
            title="Copy code"
          >
            {copiedExample === activeTab ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Available Endpoints
        </h3>
        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--bg-secondary)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.method === 'GET' ? 'text-blue-400' : 'text-green-400'
                      }`}
                      style={{ backgroundColor: 'var(--bg-primary)' }}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                      {endpoint.path}
                    </code>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {endpoint.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Authentication Note */}
      <div className="card p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-secondary)' }} />
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              Authentication Required
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              All API requests require your API key in the <code className="px-1 py-0.5 rounded" style={codeStyle}>X-API-Key</code> header.
              Get your API key from the API Keys tab.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeExamples

