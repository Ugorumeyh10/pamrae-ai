# Pamrae AI - Smart Contract Security Scanner

<div align="center">
  <h1>
    <span style="color: #FFD700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);">P</span>
    <span style="color: white;">amrae</span>
    <span style="color: #999;"> AI</span>
  </h1>
  <p><em>See Through the Code, Secure Your Future</em></p>
</div>

A comprehensive web platform for analyzing smart contract security, detecting vulnerabilities, and identifying rug-pull patterns using AI-powered analysis.

**Founded in December 2025 by Ugorume Henry & Pamela Odunna**

## 🚀 Features

- **Vulnerability Detection**: Scans for reentrancy, honeypots, centralized control, and 20+ vulnerability patterns
- **Rug-Pull Detection**: Identifies hidden minting, backdoor withdrawals, anti-sell functions, and suspicious patterns
- **Safety Scoring**: AI-powered 0-100 safety score with risk level classification
- **Human-Readable Explanations**: AI converts technical findings into simple English
- **PDF Reports**: Generate professional security audit reports
- **Multi-Chain Support**: Ethereum, Base, Polygon, and Solana
- **Modern UI/UX**: Beautiful, responsive React frontend

## 📁 Project Structure

```
web3/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── services/
│       ├── scanner.py          # Contract scanning logic
│       ├── ai_explainer.py     # AI explanation generator
│       └── report_generator.py # PDF report generator
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
└── README.md
```

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### POST `/api/v1/scan`
Scan a contract by address.

**Request Body:**
```json
{
  "contract_address": "0x...",
  "chain": "ethereum",
  "contract_type": "token"
}
```

**Response:**
```json
{
  "contract_address": "0x...",
  "chain": "ethereum",
  "safety_score": 75,
  "risk_level": "Moderate Risk",
  "vulnerabilities": [...],
  "rug_pull_indicators": [...],
  "ai_explanation": "...",
  "recommendations": [...]
}
```

### POST `/api/v1/upload`
Upload and scan Solidity source code.

**Form Data:**
- `file`: Solidity file (.sol or .txt)
- `chain`: Blockchain network

### GET `/api/v1/report/{scan_id}`
Generate and download PDF security report.

## 🔍 Detected Vulnerabilities

- Reentrancy attacks
- Honeypot functions
- Centralized control
- Hidden minting
- Backdoor withdrawals
- Unbounded loops
- Upgradeable contract risks
- Owner-only functions
- External call dependencies

## 🚩 Rug-Pull Indicators

- Liquidity unlock status
- Owner not renounced
- Suspicious minting patterns
- Anti-sell functions
- Hidden withdrawal mechanisms

## 🎨 Tech Stack

**Backend:**
- FastAPI
- Web3.py
- ReportLab (PDF generation)
- Slither (static analysis)

**Frontend (Web):**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Axios

**Mobile:**
- React Native
- Expo
- React Native Paper
- React Navigation

## 🔐 Security Notes

- This is an automated analysis tool and should not replace professional security audits
- Always conduct your own research (DYOR) before investing
- Results are based on pattern detection and may have false positives/negatives

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

