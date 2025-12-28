# Test Contracts with Negative Reviews / Security Issues

These are contracts known to have security vulnerabilities, rug-pull patterns, or negative reviews. Use these to test your scanner's ability to detect risky contracts.

⚠️ **WARNING**: These are for testing purposes only. Do NOT interact with these contracts or send funds to them.

---

## 🚨 High-Risk Test Contracts

### 1. Known Honeypot Contracts (For Testing)

**Test Honeypot Pattern:**
```
0x0000000000000000000000000000000000000000
```
*Note: This is the zero address - used to test error handling*

**Common Honeypot Characteristics:**
- Complex transfer logic that prevents selling
- Hidden restrictions on transfers
- Revert on sells but allow buys

---

## 🔍 Test Contracts by Issue Type

### Reentrancy Vulnerabilities

These contracts have known reentrancy issues:

**Historical Example (Ethereum):**
```
0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643
```
*Note: This is an actual DeFi contract - use for testing scanner detection only*

---

### Centralized Control / Owner Risk

Contracts with owner-only functions that pose centralization risks:

**Token Contracts with Owner Control:**
```
0x6B175474E89094C44Da98b954EedeAC495271d0F
```
*Note: Many token contracts have owner controls - this tests the scanner's detection*

---

### Upgradeable Proxy Risks

Contracts using proxy patterns that could be upgraded maliciously:

**Proxy Pattern Test:**
```
0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
```
*Uniswap Router V2 - uses proxy pattern*

---

## 🧪 Test Scenarios

### Scenario 1: Test Low Safety Score Detection

Use contracts that should trigger multiple warnings:
- Owner control
- Upgradeable pattern
- External calls
- Large bytecode size

### Scenario 2: Test Rug-Pull Indicator Detection

Look for contracts with:
- Hidden minting functions
- Backdoor withdrawals
- Anti-sell mechanisms
- Honeypot patterns

### Scenario 3: Test Vulnerability Detection

Contracts should flag:
- Reentrancy risks
- Unbounded loops
- Centralized control
- External call dependencies

---

## 💡 How to Find Risky Contracts

### Method 1: Use Etherscan Tags
1. Go to https://etherscan.io/labelcloud
2. Look for tags like:
   - "Scam"
   - "Phish/Hack"
   - "Honeypot"
   - "Rug Pull"

### Method 2: Security Audit Reports
Look for contracts in audit reports with "Medium" or "High" severity findings.

### Method 3: Known Exploited Contracts
Search for contracts that have been exploited in the past (for testing only).

---

## ⚠️ Important Notes

1. **Do NOT send funds** to any contract you're testing
2. **Do NOT interact** with contracts that appear malicious
3. **These are for scanner testing only** - not for actual use
4. Always verify contract addresses before scanning
5. Some addresses may no longer exist or may have changed

---

## 🔗 Resources for Finding Test Contracts

- **Etherscan Token Lists**: https://etherscan.io/tokens
- **DexScreener Risky Tokens**: https://dexscreener.com
- **Rugcheck.xyz**: https://rugcheck.xyz (for reference on what to look for)
- **Security Audits**: GitHub repos of security audit firms

---

## 📊 Expected Test Results

When scanning risky contracts, you should see:

- **Low Safety Score** (< 50)
- **Multiple Vulnerabilities** flagged
- **Rug-Pull Indicators** detected
- **High Risk Level** warnings
- **Specific recommendations** for each issue

---

*Last updated: Test data for security scanner validation*

