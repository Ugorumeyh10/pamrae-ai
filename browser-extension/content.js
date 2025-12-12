/**
 * Content script for Contract Security Scanner
 * Injects scan button into Etherscan and other explorers
 */

(function() {
  'use strict';
  
  const API_BASE_URL = 'http://localhost:8000';
  
  // Detect chain from URL
  function detectChain() {
    const hostname = window.location.hostname;
    if (hostname.includes('basescan')) return 'base';
    if (hostname.includes('polygonscan')) return 'polygon';
    if (hostname.includes('solscan')) return 'solana';
    return 'ethereum'; // Default
  }
  
  // Extract contract address from URL
  function extractAddress() {
    const path = window.location.pathname;
    const match = path.match(/\/address\/(0x[a-fA-F0-9]{40})/);
    return match ? match[1] : null;
  }
  
  // Create scan button
  function createScanButton() {
    const button = document.createElement('button');
    button.id = 'contract-scanner-btn';
    button.className = 'contract-scanner-button';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
      Scan Security
    `;
    
    button.addEventListener('click', handleScanClick);
    return button;
  }
  
  // Handle scan button click
  async function handleScanClick() {
    const address = extractAddress();
    const chain = detectChain();
    
    if (!address) {
      alert('Could not extract contract address from URL');
      return;
    }
    
    const button = document.getElementById('contract-scanner-btn');
    button.disabled = true;
    button.innerHTML = 'Scanning...';
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contract_address: address,
          chain: chain
        })
      });
      
      if (!response.ok) {
        throw new Error(`Scan failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      displayResults(result, address, chain);
      
    } catch (error) {
      console.error('Scan error:', error);
      alert(`Scan failed: ${error.message}`);
    } finally {
      button.disabled = false;
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        Scan Security
      `;
    }
  }
  
  // Display scan results
  function displayResults(result, address, chain) {
    // Remove existing results
    const existing = document.getElementById('contract-scanner-results');
    if (existing) {
      existing.remove();
    }
    
    // Create results panel
    const panel = document.createElement('div');
    panel.id = 'contract-scanner-results';
    panel.className = 'contract-scanner-results';
    
    const scoreColor = result.safety_score >= 80 ? 'green' : result.safety_score >= 50 ? 'orange' : 'red';
    
    panel.innerHTML = `
      <div class="scanner-header">
        <h3>Security Scan Results</h3>
        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="scanner-content">
        <div class="score-display" style="border-color: ${scoreColor}">
          <div class="score-value">${result.safety_score}</div>
          <div class="score-label">Safety Score</div>
          <div class="risk-level">${result.risk_level}</div>
        </div>
        <div class="results-summary">
          <div class="summary-item">
            <span class="label">Vulnerabilities:</span>
            <span class="value">${result.vulnerabilities.length}</span>
          </div>
          <div class="summary-item">
            <span class="label">Rug Indicators:</span>
            <span class="value">${result.rug_pull_indicators.length}</span>
          </div>
          <div class="summary-item">
            <span class="label">Gas Optimizations:</span>
            <span class="value">${result.gas_optimizations?.length || 0}</span>
          </div>
        </div>
        ${result.vulnerabilities.length > 0 ? `
          <div class="vulnerabilities">
            <h4>Vulnerabilities</h4>
            ${result.vulnerabilities.slice(0, 3).map(v => `
              <div class="vuln-item">
                <strong>${v.type}</strong> (${v.severity})
                <p>${v.description}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="actions">
          <a href="http://localhost:3000?address=${address}&chain=${chain}" target="_blank" class="view-full-btn">
            View Full Report
          </a>
        </div>
      </div>
    `;
    
    // Insert results panel
    const targetElement = document.querySelector('#ContentPlaceHolder1_divSummary') || 
                         document.querySelector('.card') ||
                         document.body;
    targetElement.insertAdjacentElement('afterend', panel);
  }
  
  // Inject button when page loads
  function injectButton() {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectButton);
      return;
    }
    
    const address = extractAddress();
    if (!address) return;
    
    // Check if button already exists
    if (document.getElementById('contract-scanner-btn')) return;
    
    // Find insertion point (usually near contract address)
    const targetElement = document.querySelector('#ContentPlaceHolder1_divSummary') ||
                         document.querySelector('.card-body') ||
                         document.querySelector('main');
    
    if (targetElement) {
      const button = createScanButton();
      targetElement.insertAdjacentElement('afterbegin', button);
    }
  }
  
  // Run injection
  injectButton();
  
  // Re-inject on navigation (for SPAs)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(injectButton, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
})();

