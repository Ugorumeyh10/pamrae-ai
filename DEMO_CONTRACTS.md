# Demo Contract Addresses for Pamrae AI

This document contains real contract addresses you can use to demonstrate the scanner's functionality. All addresses are on Ethereum Mainnet unless otherwise specified.

## 🪙 Popular Token Contracts (Safe for Demo)

### Stablecoins
- **USDC (USD Coin)**
  - Address: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
  - Chain: Ethereum
  - Type: ERC-20 Token
  - Why: Most trusted stablecoin, well-audited, perfect for showing clean scan results

- **USDT (Tether)**
  - Address: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
  - Chain: Ethereum
  - Type: ERC-20 Token
  - Why: Largest stablecoin by market cap, good for comparison

- **DAI (Dai Stablecoin)**
  - Address: `0x6B175474E89094C44Da98b954EedeAC495271d0F`
  - Chain: Ethereum
  - Type: ERC-20 Token
  - Why: Decentralized stablecoin, MakerDAO protocol

### Wrapped Tokens
- **WETH (Wrapped Ethereum)**
  - Address: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
  - Chain: Ethereum
  - Type: ERC-20 Token
  - Why: Most used wrapped token, essential DeFi primitive

### Popular Tokens
- **UNI (Uniswap Token)**
  - Address: `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984`
  - Chain: Ethereum
  - Type: ERC-20 Token
  - Why: Governance token of major DEX

- **LINK (Chainlink)**
  - Address: `0x514910771AF9Ca656af840dff83E8264EcF986CA`
  - Chain: Ethereum
  - Type: ERC-20 Token
  - Why: Oracle network token, widely used

## 🏦 DeFi Protocol Contracts

### Uniswap V2
- **Uniswap V2 Router**
  - Address: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`
  - Chain: Ethereum
  - Type: DeFi Router
  - Why: Most popular DEX router, well-audited

- **Uniswap V2 Factory**
  - Address: `0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f`
  - Chain: Ethereum
  - Type: Factory Contract
  - Why: Creates Uniswap pairs

### Uniswap V3
- **Uniswap V3 Router**
  - Address: `0xE592427A0AEce92De3Edee1F18E0157C05861564`
  - Chain: Ethereum
  - Type: DeFi Router
  - Why: Latest Uniswap version, more complex

### Aave
- **Aave Lending Pool**
  - Address: `0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9`
  - Chain: Ethereum
  - Type: Lending Protocol
  - Why: Major lending protocol, complex contract

### Compound
- **Compound cETH**
  - Address: `0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5`
  - Chain: Ethereum
  - Type: Lending Token
  - Why: Compound's wrapped ETH, widely used

## 🎯 Educational Contracts (Known Issues)

### For Educational Demos
These contracts have known patterns that the scanner can detect:

- **Simple Token (Basic ERC-20)**
  - Address: `0x6B175474E89094C44Da98b954EedeAC495271d0F` (DAI - but simpler examples exist)
  - Why: Shows basic token structure

### Testnet Contracts (Safe for Testing)
- **Sepolia Testnet USDC**
  - Address: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`
  - Chain: Sepolia
  - Why: Testnet - safe to experiment

## 📊 Recommended Demo Flow

### 1. **Safe Contract Demo** (USDC)
```
Address: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
Chain: Ethereum
```
**Why:** Shows clean scan results, high safety score, professional report

### 2. **DeFi Protocol Demo** (Uniswap V2 Router)
```
Address: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
Chain: Ethereum
```
**Why:** Shows complex contract analysis, multiple features detected

### 3. **Popular Token Demo** (WETH)
```
Address: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
Chain: Ethereum
```
**Why:** Most recognized token, shows standard ERC-20 analysis

## 🔍 What to Highlight in Demos

### For Safe Contracts (USDC, WETH):
- ✅ High safety score (90-100)
- ✅ No critical vulnerabilities
- ✅ Well-audited patterns
- ✅ Professional PDF report
- ✅ AI explanation of security features

### For DeFi Protocols (Uniswap, Aave):
- ✅ Complex contract analysis
- ✅ Multiple security checks
- ✅ Gas optimization suggestions
- ✅ Historical monitoring capabilities
- ✅ Code similarity detection

## 🎬 Demo Script Suggestions

### Quick Demo (2 minutes):
1. **Scan USDC** → Show high safety score
2. **Show PDF Report** → Professional output
3. **Explain AI Findings** → Human-readable explanations

### Full Demo (5 minutes):
1. **Scan USDC** → Baseline safe contract
2. **Scan Uniswap Router** → Complex DeFi contract
3. **Show Batch Scan** → Multiple contracts at once
4. **Show Historical Trends** → If contract was scanned before
5. **Download PDF Report** → Professional documentation

### Advanced Demo (10 minutes):
1. **Single Contract Scan** → USDC
2. **Batch Scan** → Multiple tokens (USDC, USDT, DAI)
3. **Code Similarity** → Compare two contracts
4. **Historical Analysis** → Show trends over time
5. **ML Predictions** → Risk scoring
6. **Custom Rules** → Show rule engine
7. **Team Collaboration** → Share scan results

## 📝 Demo Talking Points

### Opening:
"Let me show you how Pamrae AI analyzes smart contracts. I'll scan a real contract - USDC, one of the most trusted stablecoins."

### During Scan:
"While it's scanning, notice how it's checking for:
- 20+ vulnerability patterns
- Rug-pull indicators
- Gas optimizations
- Code quality issues"

### Results:
"Here's the safety score: 95/100. The AI has identified:
- No critical vulnerabilities ✅
- Well-implemented security patterns ✅
- Professional audit history ✅

Let me show you the detailed explanation in plain English..."

### PDF Report:
"And here's the professional PDF report you can download, perfect for audits or documentation."

## 🚨 Important Notes

1. **Always verify addresses** before using in demos
2. **Use mainnet addresses** for credibility
3. **Start with safe contracts** (USDC, WETH) to build trust
4. **Have backup addresses** ready in case one fails
5. **Explain what you're scanning** - transparency builds confidence

## 🔗 Useful Resources

- **Etherscan**: https://etherscan.io (Verify addresses)
- **CoinGecko**: https://coingecko.com (Find token addresses)
- **DeFiLlama**: https://defillama.com (DeFi protocol addresses)

## 📱 Quick Reference Card

```
┌─────────────────────────────────────────┐
│  QUICK DEMO ADDRESSES                  │
├─────────────────────────────────────────┤
│  USDC:                                   │
│  0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 │
│                                         │
│  WETH:                                   │
│  0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 │
│                                         │
│  Uniswap V2 Router:                     │
│  0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D │
└─────────────────────────────────────────┘
```

## 🎯 Pro Tips for Demos

1. **Bookmark these addresses** in your browser for quick access
2. **Test scans beforehand** to ensure they work
3. **Have screenshots ready** of results for backup
4. **Practice the explanation** of AI findings
5. **Show the PDF report** - it's impressive!
6. **Highlight mobile responsiveness** if demoing on phone
7. **Mention multi-chain support** (Base, Polygon, Solana)

---

**Last Updated:** December 2025
**Verified on:** Ethereum Mainnet

