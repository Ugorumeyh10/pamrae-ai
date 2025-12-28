import { useState } from 'react'
import { Key, Copy, Check, Trash2, Plus, Eye, EyeOff, AlertCircle } from 'lucide-react'
import axios from 'axios'
import API_URL from '../../config'

function APIKeyManager({ apiKeys: initialApiKeys, user, onRefresh }) {
  const [apiKeys, setApiKeys] = useState(initialApiKeys || [])
  const [copiedKey, setCopiedKey] = useState(null)
  const [showKeys, setShowKeys] = useState({})
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  const copyToClipboard = async (text, keyId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(keyId)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleKeyVisibility = (keyId) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const createAPIKey = async () => {
    if (!newKeyName.trim()) return
    
    // In a real app, this would call the backend
    const newKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: user?.api_key || 'pk_' + Math.random().toString(36).substring(2, 15),
      created: new Date().toISOString(),
      status: 'active',
      usage: '0/1000'
    }
    
    setApiKeys([...apiKeys, newKey])
    setShowCreateModal(false)
    setNewKeyName('')
  }

  const deleteAPIKey = async (keyId) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== keyId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            API Keys
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage your API keys for accessing the Pamrae AI API
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create API Key
        </button>
      </div>

      {/* Warning */}
      <div className="card p-4 flex items-start gap-3" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-secondary)' }} />
        <div className="flex-1">
          <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Keep your API keys secure
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Never share your API keys publicly or commit them to version control. Treat them like passwords.
          </div>
        </div>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <div className="card p-8 text-center">
            <Key className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              No API keys found. Create your first API key to get started.
            </p>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              Create API Key
            </button>
          </div>
        ) : (
          apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {apiKey.name || 'Unnamed Key'}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Created {new Date(apiKey.created).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        apiKey.status === 'active' ? 'text-green-400' : 'text-gray-400'
                      }`}
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                      {apiKey.status}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      API Key
                    </div>
                    <div className="flex items-center gap-2">
                      <code
                        className="flex-1 px-3 py-2 rounded text-sm font-mono"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        {showKeys[apiKey.id] ? apiKey.key : '•'.repeat(40)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-2 rounded border transition-colors"
                        style={{ borderColor: 'var(--border)' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {showKeys[apiKey.id] ? (
                          <EyeOff className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                        ) : (
                          <Eye className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        className="p-2 rounded border transition-colors"
                        style={{ borderColor: 'var(--border)' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        title="Copy to clipboard"
                      >
                        {copiedKey === apiKey.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                        )}
                      </button>
                    </div>
                  </div>

                  {apiKey.usage && (
                    <div className="mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Usage: {apiKey.usage} requests
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteAPIKey(apiKey.id)}
                  className="p-2 rounded border ml-4 transition-colors text-red-400"
                  style={{ borderColor: 'var(--border)' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  title="Delete API key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Create New API Key
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Key Name
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production, Development"
                className="input"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewKeyName('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={createAPIKey} className="btn-primary">
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default APIKeyManager

