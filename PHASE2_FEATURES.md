# Phase 2 Features Implementation

## ✅ Completed Features

### 1. Machine Learning Model
**Location:** `backend/services/ml_model.py`

**Features:**
- Risk prediction based on historical patterns
- Pattern matching from past scans
- Feature extraction from contract data
- Weighted risk scoring
- Vulnerability prediction
- Continuous learning from scan outcomes

**API Endpoints:**
- `POST /api/v1/ml/predict` - Get ML-based risk prediction
- `GET /api/v1/ml/stats` - Get model statistics

**Usage:**
```python
# Enable ML in scan request
{
  "contract_address": "0x...",
  "chain": "ethereum",
  "enable_ml": true
}

# Direct ML prediction
POST /api/v1/ml/predict
{
  "contract_features": {
    "safety_score": 0.65,
    "vulnerability_count": 3,
    ...
  }
}
```

**Response:**
```json
{
  "risk_score": 0.75,
  "confidence": 0.85,
  "predicted_vulnerabilities": ["Reentrancy", "Centralized Control"],
  "risk_factors": {
    "high_severity_vulnerabilities": 2,
    "low_safety_score": 0.65
  },
  "similar_patterns_count": 5
}
```

### 2. API Rate Limiting
**Location:** `backend/services/rate_limiter.py`

**Features:**
- Tiered usage limits (Free, Basic, Pro, Enterprise)
- Daily and hourly limits
- Batch size restrictions
- Feature access control
- Usage tracking and statistics

**Usage Tiers:**
- **Free**: 10 scans/day, 3 scans/hour, batch size 1
- **Basic**: 100 scans/day, 20 scans/hour, batch size 5
- **Pro**: 1000 scans/day, 100 scans/hour, batch size 50
- **Enterprise**: Unlimited

**API Endpoints:**
- `GET /api/v1/usage` - Get usage statistics

**Usage:**
```bash
# Include API key in header
X-API-Key: your_api_key_here

# Check usage
GET /api/v1/usage
```

**Response:**
```json
{
  "tier": "pro",
  "total_scans": 450,
  "daily_scans": 45,
  "daily_limit": 1000,
  "hourly_scans": 8,
  "hourly_limit": 100,
  "batch_size_limit": 50,
  "available_features": ["basic_scan", "pdf_report", "history", "trends", "ml_predictions", "webhooks", "custom_rules"]
}
```

### 3. Webhook Support
**Location:** `backend/services/webhook.py`

**Features:**
- Real-time notifications
- Multiple event types
- Webhook registration and management
- Delivery logging
- Secret authentication support

**Event Types:**
- `scan.complete` - When scan finishes
- `scan.high_risk` - When high risk detected
- `contract.changed` - When contract changes detected

**API Endpoints:**
- `POST /api/v1/webhooks` - Register webhook
- `GET /api/v1/webhooks` - List webhooks
- `DELETE /api/v1/webhooks/{id}` - Delete webhook

**Usage:**
```bash
# Register webhook
POST /api/v1/webhooks
{
  "url": "https://your-app.com/webhook",
  "events": ["scan.complete", "scan.high_risk"],
  "secret": "optional_secret"
}

# Webhook payload example
{
  "event_type": "scan.complete",
  "timestamp": "2025-01-15T10:30:00",
  "data": {
    "contract_address": "0x...",
    "safety_score": 75,
    "risk_level": "Moderate Risk",
    ...
  }
}
```

### 4. Custom Rule Engine
**Location:** `backend/services/rule_engine.py`

**Features:**
- User-defined security rules
- Multiple rule types
- Pattern matching
- Function/storage counting
- Score thresholds
- Vulnerability/rug-pull detection

**Rule Types:**
- `contains_pattern` - Check if code contains pattern
- `function_count` - Limit function count
- `has_modifier` - Check for specific modifier
- `storage_count` - Limit storage variables
- `external_call_count` - Limit external calls
- `score_threshold` - Minimum safety score
- `vulnerability_type` - Detect specific vulnerability
- `rug_indicator_type` - Detect specific rug-pull indicator

**API Endpoints:**
- `POST /api/v1/rules` - Create custom rule
- `GET /api/v1/rules` - List rules
- `DELETE /api/v1/rules/{id}` - Delete rule

**Usage:**
```bash
# Create custom rule
POST /api/v1/rules
{
  "name": "No delegatecall",
  "rule_type": "contains_pattern",
  "config": {
    "pattern": "delegatecall"
  },
  "severity": "high"
}

# Enable in scan
{
  "contract_address": "0x...",
  "enable_custom_rules": true
}
```

**Response:**
```json
{
  "custom_rule_violations": [
    {
      "rule_id": "abc123",
      "rule_name": "No delegatecall",
      "severity": "high",
      "message": "Pattern 'delegatecall' found in code",
      "details": {
        "matches": 2,
        "pattern": "delegatecall"
      }
    }
  ]
}
```

## 🔧 Technical Implementation

### Dependencies Added
- `numpy>=1.24.0` - For ML calculations
- `aiohttp>=3.9.0` - For async webhook HTTP requests

### Storage
- ML patterns: `backend/data/models/`
- Webhooks: `backend/data/webhooks/`
- Custom rules: `backend/data/rules/`

### API Key Authentication
All Phase 2 features require API key authentication via header:
```
X-API-Key: your_api_key_here
```

Tier detection is based on API key prefix:
- `pro_*` → Pro tier
- `basic_*` → Basic tier
- `enterprise_*` → Enterprise tier
- Default → Free tier

## 📊 Integration with Existing Features

### Enhanced Scan Endpoint
The main scan endpoint now supports:
- ML predictions (`enable_ml: true`)
- Custom rules (`enable_custom_rules: true`)
- Automatic rate limiting
- Webhook notifications
- Usage tracking

### Response Format
```json
{
  "contract_address": "0x...",
  "safety_score": 75,
  "risk_level": "Moderate Risk",
  "vulnerabilities": [...],
  "rug_pull_indicators": [...],
  "gas_optimizations": [...],
  "ml_predictions": {
    "risk_score": 0.75,
    "confidence": 0.85,
    "predicted_vulnerabilities": [...]
  },
  "custom_rule_violations": [...],
  "ai_explanation": "...",
  "scan_id": "..."
}
```

## 🚀 Usage Examples

### 1. Scan with ML Predictions
```bash
curl -X POST http://localhost:8000/api/v1/scan \
  -H "Content-Type: application/json" \
  -H "X-API-Key: pro_your_key" \
  -d '{
    "contract_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "chain": "ethereum",
    "enable_ml": true
  }'
```

### 2. Register Webhook
```bash
curl -X POST http://localhost:8000/api/v1/webhooks \
  -H "Content-Type: application/json" \
  -H "X-API-Key: pro_your_key" \
  -d '{
    "url": "https://your-app.com/webhook",
    "events": ["scan.complete", "scan.high_risk"],
    "secret": "webhook_secret_123"
  }'
```

### 3. Create Custom Rule
```bash
curl -X POST http://localhost:8000/api/v1/rules \
  -H "Content-Type: application/json" \
  -H "X-API-Key: pro_your_key" \
  -d '{
    "name": "Max 20 functions",
    "rule_type": "function_count",
    "config": {
      "max_count": 20
    },
    "severity": "medium"
  }'
```

### 4. Check Usage
```bash
curl -X GET http://localhost:8000/api/v1/usage \
  -H "X-API-Key: pro_your_key"
```

## 📈 Benefits

1. **ML Predictions**: Learn from historical data to predict risks
2. **Rate Limiting**: Prevent abuse and manage resources
3. **Webhooks**: Real-time integration with external systems
4. **Custom Rules**: Tailor security checks to your needs

## 🔒 Security Notes

- API keys are required for Phase 2 features
- Webhook secrets should be used in production
- Rate limits prevent abuse
- Custom rules are scoped to API key

## 📝 Next Steps

- Frontend UI for custom rules
- Webhook management dashboard
- Usage analytics dashboard
- ML model training interface

---

**Version:** 2.0.0
**Last Updated:** January 2025


