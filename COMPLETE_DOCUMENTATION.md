# Pamrae AI - Complete Documentation

<div align="center">
  <h1>
    <span style="color: #FFD700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);">P</span>
    <span style="color: white;">amrae</span>
    <span style="color: #999;"> AI</span>
  </h1>
  <p><em>See Through the Code, Secure Your Future</em></p>
  <p><strong>Founded in December 2025 by Ugorume Henry & Pamela Odunna</strong></p>
</div>

---

## 📄 Abstract and In-Depth Explanation

For a comprehensive abstract and detailed technical explanation of the project, architecture, problem statement, and impact, see **[ABSTRACT_AND_EXPLANATION.md](./ABSTRACT_AND_EXPLANATION.md)**.

The abstract document includes:
- Complete project abstract
- In-depth problem statement and motivation
- Detailed solution architecture
- Technical implementation details
- Security and scalability considerations
- Impact and significance analysis

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Brand Identity](#brand-identity)
3. [Features](#features)
4. [Installation & Setup](#installation--setup)
5. [API Documentation](#api-documentation)
6. [Frontend Guide](#frontend-guide)
7. [Mobile App Guide](#mobile-app-guide)
8. [Payment System](#payment-system)
9. [Admin Account System](#admin-account-system)
10. [Phase 1 Features](#phase-1-features)
11. [Phase 2 Features](#phase-2-features)
12. [Phase 3 Features](#phase-3-features)
13. [Testing](#testing)
14. [Marketing Guide](#marketing-guide)
15. [Future Roadmap](#future-roadmap)
16. [Contributing](#contributing)

---

## 🎯 Project Overview

**Pamrae AI** is a comprehensive security analysis platform that uses AI-powered analysis to detect vulnerabilities, rug-pull patterns, and security risks in smart contracts across multiple blockchains.

### Key Value Propositions
- **Instant Security Analysis**: Get comprehensive security reports in seconds
- **AI-Powered Explanations**: Complex technical findings explained in simple English
- **Multi-Chain Support**: Analyze contracts on Ethereum, Base, Polygon, and Solana
- **Professional Reports**: Generate PDF audit reports for documentation
- **Developer-Friendly API**: Integrate security scanning into your workflow
- **Mobile & Web Access**: Scan contracts from anywhere

### Target Audience
- **Crypto Investors**: Verify contract safety before investing
- **DeFi Users**: Check protocol security before depositing funds
- **Developers**: Integrate security checks into CI/CD pipelines
- **Security Auditors**: Quick preliminary analysis tool
- **Traders**: Real-time contract risk assessment

---

## 🎨 Brand Identity

### Company Name
**Pamrae AI**
- **P** - Styled in gold (#FFD700 to #FFA500 gradient)
- **amrae** - White text
- **AI** - Gray text

### Logo
- **Symbol**: Eye icon in gold
- **Colors**: Gold gradient (#FFD700 → #FFA500 → #FFD700)
- **Style**: Modern, sleek, with glow effects
- **Meaning**: The eye represents vigilance, security, and watchfulness over smart contracts

### Founders
- **Ugorume Henry** - Co-Founder & CTO
- **Pamela Odunna** - Co-Founder & CEO

### Founded
**December 2025**

### Brand Colors
- **Gold**: #FFD700 (primary), #FFA500 (accent)
- **Black**: #000000 (background)
- **White**: #FFFFFF (text, highlights)
- **Gray**: Various shades for text hierarchy

### Brand Values
1. **Security First** - Protecting users is our top priority
2. **Accessibility** - Making security tools available to everyone
3. **Innovation** - Using cutting-edge AI technology
4. **Transparency** - Clear, honest communication
5. **Trust** - Building confidence in Web3

### Mission Statement
Pamrae AI was founded to democratize smart contract security and protect the Web3 ecosystem. We make advanced security analysis accessible to everyone—from individual investors to enterprise teams—using cutting-edge AI technology.

### Goals & Motivations
1. **Protect Users** - Prevent billions in losses from exploits and rug-pulls
2. **Democratize Security** - Make professional-grade analysis available to all
3. **Build Trust in Web3** - Create a safer DeFi ecosystem
4. **Innovate Continuously** - Stay ahead with AI and ML
5. **Empower Developers** - Help build secure contracts from day one
6. **Educate & Inform** - Translate complex findings into simple insights

### Tagline
"See Through the Code, Secure Your Future"

---

## ✨ Features

### Core Features

#### 1. Vulnerability Detection
- **Reentrancy Attacks**: Detects recursive call vulnerabilities
- **Honeypot Functions**: Identifies functions that trap users
- **Centralized Control**: Flags owner-only critical functions
- **Hidden Minting**: Detects unauthorized token creation
- **Backdoor Withdrawals**: Finds suspicious withdrawal mechanisms
- **Unbounded Loops**: Identifies gas-intensive loops
- **Upgradeable Contract Risks**: Analyzes proxy pattern security
- **External Call Dependencies**: Checks unsafe external calls
- **Integer Overflow/Underflow**: Detects arithmetic vulnerabilities
- **Access Control Issues**: Identifies missing access modifiers

#### 2. Rug-Pull Detection
- **Liquidity Lock Status**: Checks if liquidity is locked
- **Owner Not Renounced**: Flags contracts with active owners
- **Suspicious Minting Patterns**: Detects unusual token creation
- **Anti-Sell Functions**: Identifies functions that prevent selling
- **Hidden Withdrawal Mechanisms**: Finds backdoor withdrawal functions
- **Token Tax Analysis**: Analyzes buy/sell tax mechanisms
- **Whale Wallet Detection**: Identifies large holder risks

#### 3. Safety Scoring
- **0-100 Safety Score**: Comprehensive risk assessment
- **Risk Level Classification**: Low/Moderate/Severe risk categories
- **Weighted Vulnerability Scoring**: Different weights for different risks
- **Historical Comparison**: Compare scores over time

#### 4. AI-Powered Explanations
- **Human-Readable Reports**: Technical findings in simple English
- **Risk Context**: Explains why each risk matters
- **Actionable Recommendations**: Clear steps to address issues
- **Severity Explanations**: Why certain issues are more critical

#### 5. PDF Report Generation
- **Professional Format**: Audit-ready report structure
- **Comprehensive Details**: All vulnerabilities and indicators
- **Visual Charts**: Risk score visualization
- **Recommendations Section**: Actionable security improvements
- **Timestamp & Metadata**: Report tracking information

#### 6. Multi-Chain Support
- **Ethereum**: Full EVM analysis
- **Base**: Layer 2 compatibility
- **Polygon**: Sidechain support
- **Solana**: Basic Solana program analysis

#### 7. Multiple Input Methods
- **Contract Address**: Scan deployed contracts
- **Solidity Source Code**: Upload and analyze source files
- **Batch Scanning**: Scan multiple contracts at once

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.13+
- Node.js 18+
- npm or yarn
- Git

### Backend Setup

```bash
# Clone repository
git clone <repository-url>
cd web3/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file and add:
OPENAI_API_KEY=your_key_here

# Run the server
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The web app will be available at `http://localhost:3000`

### Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start

# For iOS (requires Xcode)
npx expo start --ios

# For Android (requires Android Studio)
npx expo start --android

# For physical device
# Scan QR code with Expo Go app
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# OpenAI API Key (required for AI explanations)
OPENAI_API_KEY=sk-your-key-here

# Optional: Custom RPC endpoints
ETHEREUM_RPC_URL=https://eth.llamarpc.com
BASE_RPC_URL=https://mainnet.base.org
POLYGON_RPC_URL=https://polygon-rpc.com
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication
API key authentication via header:
```
X-API-Key: your_api_key_here
```

### Core Endpoints

#### 1. Health Check
```http
GET /api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00"
}
```

#### 2. Scan Contract by Address
```http
POST /api/v1/scan
Content-Type: application/json
X-API-Key: your_api_key
```

**Request Body:**
```json
{
  "contract_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "chain": "ethereum",
  "contract_type": "token",
  "enable_ml": false,
  "enable_custom_rules": false
}
```

**Response:**
```json
{
  "contract_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "chain": "ethereum",
  "safety_score": 75,
  "risk_level": "Moderate Risk",
  "vulnerabilities": [...],
  "rug_pull_indicators": [...],
  "gas_optimizations": [...],
  "ai_explanation": "...",
  "recommendations": [...],
  "scan_id": "..."
}
```

#### 3. Upload and Scan Solidity Code
```http
POST /api/v1/upload
Content-Type: multipart/form-data
X-API-Key: your_api_key
```

**Form Data:**
- `file`: Solidity source file (.sol or .txt)
- `chain`: Blockchain network

#### 4. Generate PDF Report
```http
POST /api/v1/report
Content-Type: application/json
X-API-Key: your_api_key
```

**Request Body:** Complete scan response object

**Response:** PDF file download

#### 5. Batch Scan
```http
POST /api/v1/batch-scan
Content-Type: application/json
X-API-Key: your_api_key
```

**Request Body:**
```json
{
  "contracts": [
    {"address": "0x...", "chain": "ethereum"},
    {"address": "0x...", "chain": "base"}
  ]
}
```

### User Account Endpoints

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "user_id": "abc123",
  "api_key": "pro_xyz...",
  "session_token": "...",
  "tier": "free"
}
```

### Payment Endpoints

#### Create Payment
```http
POST /api/v1/payments/create
Content-Type: application/json
X-API-Key: your_api_key
```

**Request:**
```json
{
  "plan": "basic",
  "currency": "USD",
  "amount": null
}
```

#### Verify Payment
```http
GET /api/v1/payments/{payment_id}/verify
```

#### Payment History
```http
GET /api/v1/payments/history
X-API-Key: your_api_key
```

### Admin Endpoints

#### Create Admin Account
```http
POST /api/v1/admin/create?email=admin@pamrae.ai&password=admin123&name=Admin%20User
X-Admin-Secret: pamrae_admin_2025
```

---

## 🎨 Frontend Guide

### Web Application

The web app is built with React and features a modern black-and-white design with glass morphism effects.

#### Key Components

1. **Header**: Navigation and branding
2. **Hero Section**: Main value proposition
3. **Features Grid**: Feature highlights
4. **Scanner Form**: Contract input interface
5. **Results Display**: Comprehensive scan results
6. **Pricing**: Payment plans and subscription
7. **About Us**: Company information
8. **Login/Signup**: User authentication

#### Styling
- **Theme**: Black background with white/glass elements
- **Effects**: Glow, shimmer, pulse animations
- **Responsive**: Mobile-first design
- **Branding**: Gold accents for "P" and logo

---

## 💳 Payment System

### Payment Methods
- **Free Plan**: Instant activation, no payment required
- **NGN Payments**: Paystack/Flutterwave integration
- **USD Payments**: Stripe integration
- **Bitcoin Payments**: Bitcoin address generation

### Pricing Tiers

#### Free
- 10 scans per day
- 3 scans per hour
- Basic vulnerability detection
- PDF reports
- Community support

#### Basic ($9/month or ₦13,500/month)
- 100 scans per day
- 20 scans per hour
- All vulnerability detection
- PDF reports
- Scan history & trends
- Email support
- Batch size: 5 contracts

#### Pro ($29/month or ₦43,500/month)
- 1,000 scans per day
- 100 scans per hour
- All vulnerability detection
- ML-powered predictions
- Webhook notifications
- Custom security rules
- Team collaboration
- Priority support
- Batch size: 50 contracts
- API access

#### Enterprise (Custom)
- Unlimited scans
- Unlimited team members
- All Pro features
- Dedicated support
- Custom integrations
- SLA guarantees
- White-label options
- Advanced analytics
- Batch size: 200+ contracts
- Custom API limits

### Payment Flow
1. User clicks "Subscribe" on a plan
2. Payment modal appears with currency options
3. User selects currency (NGN/USD/BTC)
4. Payment intent is created
5. User is redirected to payment gateway (or shown Bitcoin address)
6. Payment is verified automatically
7. User tier is upgraded

---

## 👤 Admin Account System

### Create Admin Account

**Using Script:**
```bash
cd backend
python create_admin.py admin@pamrae.ai admin123 "Admin User"
```

**Using API:**
```bash
curl -X POST 'http://localhost:8000/api/v1/admin/create?email=admin@pamrae.ai&password=admin123&name=Admin%20User' \
  -H 'X-Admin-Secret: pamrae_admin_2025'
```

**Admin Features:**
- Enterprise tier automatically assigned
- Full access to all features
- Admin role flag set
- Custom API key generated

---

## 📊 Phase 1 Features

### 1. Gas Optimization Detection
- Detects large contract size issues
- Identifies excessive storage operations
- Finds loop optimization opportunities
- Analyzes storage packing opportunities
- Detects expensive operations
- Provides estimated gas savings

### 2. Historical Monitoring & Analysis
- Saves all scan results for historical tracking
- Tracks contract changes over time
- Compares different scan versions
- Generates trend analysis
- Maintains scan history per contract

**Endpoints:**
- `GET /api/v1/history/{chain}/{contract_address}` - Get scan history
- `GET /api/v1/trends/{chain}/{contract_address}?days=30` - Get trends
- `POST /api/v1/compare` - Compare two scans

### 3. Batch Scanning
- Scan multiple contracts in a single request
- Parallel processing for efficiency
- Individual error handling per contract
- Summary statistics

**Endpoint:**
- `POST /api/v1/batch-scan`

### 4. Code Similarity Detection
- Jaccard similarity calculation
- Cosine similarity for code comparison
- Function signature matching
- Code fingerprinting
- Detects code reuse patterns

**Endpoint:**
- `POST /api/v1/similarity`

---

## 🤖 Phase 2 Features

### 1. Machine Learning Model
- Risk prediction based on historical patterns
- Pattern matching from past scans
- Feature extraction from contract data
- Weighted risk scoring
- Vulnerability prediction
- Continuous learning

**Endpoints:**
- `POST /api/v1/ml/predict` - Get ML-based risk prediction
- `GET /api/v1/ml/stats` - Get model statistics

### 2. API Rate Limiting
- Tiered usage limits (Free, Basic, Pro, Enterprise)
- Daily and hourly limits
- Batch size restrictions
- Feature access control
- Usage tracking and statistics

**Endpoint:**
- `GET /api/v1/usage` - Get usage statistics

### 3. Webhook Support
- Real-time notifications
- Multiple event types
- Webhook registration and management
- Delivery logging
- Secret authentication support

**Event Types:**
- `scan.complete` - When scan finishes
- `scan.high_risk` - When high risk detected
- `contract.changed` - When contract changes detected

**Endpoints:**
- `POST /api/v1/webhooks` - Register webhook
- `GET /api/v1/webhooks` - List webhooks
- `DELETE /api/v1/webhooks/{id}` - Delete webhook

### 4. Custom Rule Engine
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

**Endpoints:**
- `POST /api/v1/rules` - Create custom rule
- `GET /api/v1/rules` - List rules
- `DELETE /api/v1/rules/{id}` - Delete rule

---

## 👥 Phase 3 Features

### 1. User Accounts & Authentication
- User registration with email/password
- User authentication and session management
- API key generation per user
- User preferences management
- Favorite contracts
- Scan history per user
- Tier management

**Endpoints:**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get session
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/preferences` - Update preferences
- `GET /api/v1/user/favorites` - Get favorite contracts
- `POST /api/v1/user/favorites` - Add favorite contract
- `GET /api/v1/user/history` - Get scan history

### 2. Team Collaboration
- Create teams
- Add/remove team members
- Share scans with team
- Team settings management
- Role-based access (owner, admin, member)

**Endpoints:**
- `POST /api/v1/teams` - Create team
- `GET /api/v1/teams` - Get user's teams
- `GET /api/v1/teams/{id}` - Get team details
- `POST /api/v1/teams/{id}/members` - Add member
- `POST /api/v1/teams/{id}/share` - Share scan
- `GET /api/v1/teams/{id}/scans` - Get shared scans

### 3. Browser Extension
- Scan contracts directly from Etherscan
- Automatic address detection
- Chain detection (Ethereum, Base, Polygon)
- Inline results display
- Settings management
- API key configuration

**Location:** `browser-extension/`

**Installation:**
1. Open Chrome/Edge
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `browser-extension/` folder

### 4. VS Code Extension
- Scan Solidity files directly in VS Code
- Command palette integration
- Results panel
- Configuration support

**Location:** `vscode-extension/`

**Installation:**
```bash
cd vscode-extension
npm install
npm run compile
```

### 5. CI/CD Integration
- Automatic scanning on PR
- Automatic scanning on push to main/develop
- GitHub Actions workflow
- PR comments with results
- Build failure on low scores

**Location:** `github-actions/.github/workflows/contract-scan.yml`

---

## 🧪 Testing

### Test Files
- `test_all_features.py` - Comprehensive service tests
- `test_api_endpoints.py` - API endpoint tests
- `test_openai.py` - OpenAI integration test
- `test_frontend_features.py` - Frontend feature tests

### Running Tests

```bash
# Install dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Run service tests
python test_all_features.py

# Run API tests (requires server)
python main.py  # In one terminal
python test_api_endpoints.py  # In another terminal

# Test frontend features
python test_frontend_features.py
```

### Test Results
**Overall Status**: ✅ ALL TESTS PASSED

All Phase 1, Phase 2, and Phase 3 features are working correctly!

---

## 📈 Marketing Guide

### Free Marketing Channels

#### 1. Social Media Marketing

**Twitter/X Strategy:**
- Daily security tips
- Case studies
- Educational content
- User testimonials
- Feature highlights
- Community engagement

**Hashtags:**
- #Web3Security
- #SmartContracts
- #DeFi
- #Crypto
- #Blockchain
- #Security
- #AI
- #RugPull

**Reddit Communities:**
- r/ethereum
- r/CryptoCurrency
- r/defi
- r/solidity
- r/ethdev

**LinkedIn:**
- Educational posts
- Case studies
- Technical deep dives
- Industry insights

#### 2. Content Marketing

**Blog Posts** (Medium, Dev.to, Hashnode):
- "How to Detect Rug-Pulls Before They Happen"
- "10 Common Smart Contract Vulnerabilities Explained"
- "Building a Security Scanner: Technical Deep Dive"
- "Case Studies: Real Rug-Pulls We Detected"

**YouTube Content:**
- Tutorial videos
- Case study walkthroughs
- Technical deep dives
- Security education

#### 3. Community Engagement

**Discord/Telegram:**
- Join DeFi and crypto security communities
- Share tool in relevant channels
- Answer questions and provide value

**GitHub:**
- Open-source core components
- Create example integrations
- Accept contributions

#### 4. Growth Hacking

1. **Viral Loop**: "Share your scan results" feature
2. **Referral Program**: Free scans for referrals
3. **Free Tier**: Limited free scans to attract users
4. **Community Challenges**: "Find the vulnerability" contests
5. **Open Source Components**: Build trust through transparency

### LinkedIn Post Template

**🚀 Introducing Pamrae AI - Your First Line of Defense in Web3**

After months of development, I'm excited to launch **Pamrae AI** - a comprehensive security analysis platform that helps investors, developers, and DeFi users identify vulnerabilities and rug-pull patterns in smart contracts.

**Why This Matters:**
The DeFi space has lost billions to smart contract exploits and rug-pulls. Traditional security audits are expensive and time-consuming. Our AI-powered scanner provides instant, comprehensive security analysis in seconds.

**Key Features:**
✅ **20+ Vulnerability Detection Patterns** - Reentrancy, honeypots, centralized control, and more
✅ **Rug-Pull Detection** - Identifies hidden minting, backdoor withdrawals, and suspicious patterns
✅ **AI-Powered Explanations** - Complex technical findings explained in simple English
✅ **Multi-Chain Support** - Ethereum, Base, Polygon, and Solana
✅ **Professional PDF Reports** - Audit-ready documentation
✅ **Developer API** - Integrate security scanning into your workflow

**Try It Free:** [Your Website URL]

#Web3Security #SmartContracts #DeFi #Blockchain #Crypto #Security #AI #TechInnovation

---

## 🗺️ Future Roadmap

### Phase 4: Enterprise Features (Q4 2025)
- [ ] **White-Label Solution**: Customizable branding
- [ ] **Advanced Analytics Dashboard**: Usage statistics and trends
- [ ] **SLA Monitoring**: Track contract health over time
- [ ] **Compliance Reporting**: Generate compliance-ready reports
- [ ] **Multi-User Workspaces**: Team management features

### Additional Feature Ideas

#### Developer Tools
- **Truffle/Hardhat Plugin**: Integrate with development frameworks
- **GitHub Bot**: Automatic scanning on pull requests
- **Slack/Discord Integration**: Notifications for critical issues

#### Analysis Enhancements
- **Formal Verification**: Mathematical proof of contract correctness
- **Fuzzing Integration**: Automated test generation
- **Symbolic Execution**: Deep code path analysis
- **Economic Analysis**: Tokenomics and incentive analysis
- **Governance Analysis**: DAO and governance mechanism review

#### User Experience
- **Dark/Light Theme Toggle**: User preference
- **Export Options**: JSON, CSV, Markdown formats
- **Comparison Tool**: Compare multiple contracts side-by-side
- **Watchlist**: Monitor favorite contracts
- **Alerts**: Email/push notifications for changes

#### Blockchain Support
- **Arbitrum**: Layer 2 support
- **Optimism**: Layer 2 support
- **Avalanche**: EVM-compatible chain
- **BNB Chain**: Binance Smart Chain
- **Fantom**: EVM-compatible chain

---

## 🤝 Contributing

We welcome contributions! Areas where help is needed:

1. **Additional Vulnerability Patterns**: Help us detect more issues
2. **Solana Support**: Enhance Solana program analysis
3. **UI/UX Improvements**: Better user experience
4. **Documentation**: Improve guides and tutorials
5. **Testing**: Write tests for better reliability
6. **Translations**: Multi-language support

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License

---

## 📞 Contact & Support

- **Website**: [Your website]
- **Email**: [Your email]
- **Twitter**: [Your Twitter]
- **GitHub**: [Your GitHub]
- **Discord**: [Your Discord]

---

## 🙏 Acknowledgments

- Slither team for the static analysis framework
- Web3.py for blockchain interaction
- OpenAI for AI explanations
- All contributors and early users

---

## 📝 Project Structure

```
web3/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── create_admin.py         # Admin account creation script
│   ├── test_*.py              # Test files
│   └── services/
│       ├── scanner.py          # Contract scanning logic
│       ├── ai_explainer.py     # AI explanation generator
│       ├── report_generator.py # PDF report generator
│       ├── monitor.py          # Historical monitoring
│       ├── similarity.py       # Code similarity detection
│       ├── ml_model.py         # ML risk prediction
│       ├── rate_limiter.py     # API rate limiting
│       ├── webhook.py          # Webhook service
│       ├── rule_engine.py      # Custom rule engine
│       ├── user_service.py     # User account management
│       ├── team_service.py     # Team collaboration
│       └── payment_service.py # Payment processing
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── components/        # React components
│   │   └── index.css          # Tailwind CSS styles
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
├── mobile/
│   ├── App.js                 # React Native app entry
│   ├── screens/               # Mobile screens
│   ├── config.js              # API configuration
│   └── package.json           # React Native dependencies
├── browser-extension/         # Chrome extension
├── vscode-extension/          # VS Code extension
└── github-actions/            # CI/CD workflows
```

---

## 🔐 Security Notes

- This is an automated analysis tool and should not replace professional security audits
- Always conduct your own research (DYOR) before investing
- Results are based on pattern detection and may have false positives/negatives
- In production, use environment variables for sensitive data
- Implement proper payment gateway webhooks
- Use HTTPS for all payment operations

---

**Last Updated**: January 2025  
**Version**: 3.0.0  
**Company**: Pamrae AI  
**Founded**: December 2025  
**Founders**: Ugorume Henry & Pamela Odunna

