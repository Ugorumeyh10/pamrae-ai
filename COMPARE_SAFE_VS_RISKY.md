# 📊 Compare Safe vs Risky Contracts

Use this guide to compare how your scanner handles safe vs risky contracts.

---

## 🟢 Safe Contracts (High Safety Score Expected)

### 1. USDC - Stablecoin
```
0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
```
**Expected Results:**
- Safety Score: 80-95
- Risk Level: Low
- Vulnerabilities: 0-1 (minor)
- Rug Pull Indicators: 0-1

---

### 2. WETH - Wrapped Ethereum
```
0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
```
**Expected Results:**
- Safety Score: 75-90
- Risk Level: Low to Medium
- Vulnerabilities: Few
- Well-audited contract

---

## 🟡 Medium Risk Contracts

### 1. DAI - Has Owner Controls
```
0x6B175474E89094C44Da98b954EedeAC495271d0F
```
**Expected Results:**
- Safety Score: 60-75
- Risk Level: Medium
- Vulnerabilities: Centralized Control
- Rug Pull Indicators: Owner Not Renounced

**Why it's risky:**
- Owner can pause trading
- Owner has significant control
- Not fully decentralized

---

### 2. Uniswap V2 Router - Proxy Pattern
```
0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
```
**Expected Results:**
- Safety Score: 70-85
- Risk Level: Medium
- Vulnerabilities: Upgradeable Contract Risk
- External Call Dependencies

**Why it's risky:**
- Uses proxy pattern
- Can be upgraded
- Complex external calls

---

## 🔴 High Risk / Historical Exploits

### 1. The DAO (2016) - Reentrancy Exploit
```
0xbb9bc244d798123fde783fcc1c72d3bb8c189413
```
**Expected Results:**
- Safety Score: 30-50
- Risk Level: High
- Vulnerabilities: Reentrancy patterns
- Historical exploit example

**What happened:**
- Reentrancy attack
- $60M lost
- Led to Ethereum hard fork

---

### 2. Parity Multisig Wallet (2017)
```
0x863df6bfa4469f3ead0be8f9f2aae51c91a907b4
```
**Expected Results:**
- Safety Score: 40-60
- Risk Level: High
- Vulnerabilities: Multiple
- Historical exploit example

**What happened:**
- Unprotected self-destruct
- $150M frozen
- Critical vulnerability

---

## 📊 Comparison Table

| Contract | Type | Expected Score | Risk Level | Key Issues |
|----------|------|----------------|------------|------------|
| USDC | Safe | 80-95 | Low | None/minor |
| WETH | Safe | 75-90 | Low | None/minor |
| DAI | Medium | 60-75 | Medium | Centralized Control |
| Uniswap V2 | Medium | 70-85 | Medium | Proxy/Upgradeable |
| The DAO | High | 30-50 | High | Reentrancy |
| Parity | High | 40-60 | High | Multiple |

---

## 🧪 Testing Steps

### Step 1: Scan Safe Contract
1. Use USDC address
2. Note the safety score (should be high)
3. Review vulnerabilities (should be minimal)

### Step 2: Scan Medium Risk Contract
1. Use DAI address
2. Compare safety score (should be lower)
3. Check for centralized control warnings

### Step 3: Scan High Risk Contract
1. Use The DAO address
2. Compare safety score (should be much lower)
3. Look for reentrancy warnings

### Step 4: Compare Results
- Safety scores should decrease: USDC > DAI > The DAO
- Risk levels should increase: Low < Medium < High
- Number of vulnerabilities should increase

---

## ✅ What Your Scanner Should Detect

### For Safe Contracts:
- ✅ High safety score (80+)
- ✅ Low risk level
- ✅ Few or no vulnerabilities
- ✅ No rug-pull indicators

### For Medium Risk Contracts:
- ✅ Medium safety score (60-80)
- ✅ Medium risk level
- ✅ Centralization warnings
- ✅ Upgradeable contract risks

### For High Risk Contracts:
- ✅ Low safety score (<60)
- ✅ High risk level
- ✅ Multiple vulnerabilities
- ✅ Reentrancy patterns
- ✅ Critical warnings

---

## 💡 Testing Checklist

- [ ] Scan USDC (safe) - verify high score
- [ ] Scan DAI (medium) - verify lower score
- [ ] Scan The DAO (high) - verify low score
- [ ] Compare vulnerability counts
- [ ] Check risk level classifications
- [ ] Review recommendations
- [ ] Verify rug-pull indicators

---

**Use this comparison to validate your scanner is correctly identifying risk levels!**

