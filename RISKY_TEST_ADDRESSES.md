# 🔴 Risky Contract Test Addresses

**⚠️ WARNING: These addresses are for TESTING your scanner only. DO NOT send funds or interact with these contracts.**

---

## Quick Test Addresses (Copy & Paste)

### 1. Test Centralized Control Detection
```
0x6B175474E89094C44Da98b954EedeAC495271d0F
```
**Chain:** Ethereum  
**Type:** Token (DAI)  
**Expected Issues:**
- Owner control functions
- Centralization risks
- Should show medium risk level

---

### 2. Test Proxy/Upgradeable Pattern
```
0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
```
**Chain:** Ethereum  
**Type:** DeFi Router (Uniswap V2)  
**Expected Issues:**
- Upgradeable contract pattern
- Proxy pattern detection
- External call dependencies

---

### 3. Test Large Contract Size
```
0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
```
**Chain:** Ethereum  
**Type:** Token (WETH)  
**Expected Issues:**
- Large bytecode size
- Gas optimization suggestions
- But should still be relatively safe

---

### 4. Test Error Handling (Invalid Address)
```
0x0000000000000000000000000000000000000000
```
**Chain:** Ethereum  
**Expected:** Should return error "Contract not found"

---

### 5. Test Error Handling (EOA Address)
```
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```
**Chain:** Ethereum  
**Expected:** Should return error "Address is not a contract" (Vitalik's address - EOA)

---

## 🧪 How to Test Risky Contracts

### Step 1: Test in Your Scanner
1. Go to http://localhost:3000
2. Paste one of the addresses above
3. Select "Ethereum" chain
4. Click "Scan Contract"
5. Review the results

### Step 2: Expected Results

**For Centralized Control Contracts:**
- ✅ Should flag "Centralized Control" vulnerability
- ✅ Risk level: Medium or High
- ✅ Safety score: Lower than fully decentralized contracts

**For Proxy/Upgradeable Contracts:**
- ✅ Should flag "Upgradeable Contract Risk"
- ✅ Should detect proxy patterns
- ✅ Recommendations about upgrade mechanisms

**For Large Contracts:**
- ✅ Should suggest gas optimizations
- ✅ Flag large contract size
- ✅ Suggest splitting contracts

---

## 📊 Compare with Safe Contracts

To see the difference, compare with:

**Safe Contract (USDC):**
```
0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
```
**Expected:**
- Safety Score: 80-95
- Risk Level: Low
- Few or no vulnerabilities

**vs.**

**Centralized Contract (DAI):**
```
0x6B175474E89094C44Da98b954EedeAC495271d0F
```
**Expected:**
- Safety Score: 60-75
- Risk Level: Medium
- Centralization vulnerabilities flagged

---

## 🚨 Historical Exploited Contracts (For Reference Only)

**⚠️ These are historical examples of exploited contracts. They are listed here for educational/testing purposes only.**

### The DAO Hack (2016)
```
0xbb9bc244d798123fde783fcc1c72d3bb8c189413
```
**Vulnerability:** Reentrancy attack  
**Result:** $60M lost  
**Note:** This contract is historical - use for learning/testing only

### Parity Multisig Wallet (2017)
```
0x863df6bfa4469f3ead0be8f9f2aae51c91a907b4
```
**Vulnerability:** Unprotected self-destruct  
**Result:** $150M frozen  
**Note:** Historical example for testing

### SpankChain Payment Channel (2018)
```
0x42d6622dece394b54999fbd73d108123806f6a18
```
**Vulnerability:** Reentrancy attack  
**Result:** $38K lost  
**Note:** Educational/testing reference

---

## 🔍 What to Look For

When testing risky contracts, verify your scanner detects:

1. **Vulnerabilities:**
   - ✅ Centralized Control
   - ✅ Upgradeable Contract Risk
   - ✅ External Call Dependencies
   - ✅ Reentrancy patterns
   - ✅ Unbounded loops

2. **Rug-Pull Indicators:**
   - ✅ Hidden minting functions
   - ✅ Backdoor withdrawals
   - ✅ Anti-sell mechanisms
   - ✅ Honeypot patterns

3. **Gas Optimizations:**
   - ✅ Large contract size
   - ✅ Excessive storage operations
   - ✅ Loop optimizations

---

## 🚨 Real-World Risky Contract Indicators

Your scanner should detect contracts that:

1. **Have Owner Controls:**
   - Owner can pause trading
   - Owner can blacklist addresses
   - Owner can change fees

2. **Are Upgradeable:**
   - Use proxy patterns
   - Can be upgraded by owner
   - No timelock on upgrades

3. **Have Complex Logic:**
   - Unusual transfer restrictions
   - Hidden functions
   - Obfuscated code

---

## 💡 Testing Tips

1. **Start with known safe contracts** (like USDC) to establish baseline
2. **Test centralized contracts** to see how your scanner flags them
3. **Compare safety scores** between different contract types
4. **Verify recommendations** are actionable and specific
5. **Test error handling** with invalid addresses

---

## 📝 Test Checklist

- [ ] Test centralized control detection
- [ ] Test proxy pattern detection  
- [ ] Test large contract size warnings
- [ ] Test error handling for invalid addresses
- [ ] Compare scores with safe contracts
- [ ] Verify recommendations are shown
- [ ] Check that risk levels are accurate

---

## 🔗 Additional Resources

- **Etherscan**: https://etherscan.io (search for tokens and check security scores)
- **DexScreener**: https://dexscreener.com (shows token safety metrics)
- **Rugcheck**: https://rugcheck.xyz (reference for what risky contracts look like)
- **Security Audits**: Check audit reports for contracts with known issues

---

**Remember:** These addresses are for testing your scanner's detection capabilities. Never send funds to untrusted contracts!

