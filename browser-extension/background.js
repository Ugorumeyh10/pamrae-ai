// Background service worker for extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Contract Security Scanner extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    // Handle scan request
    handleScan(request.address, request.chain)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

async function handleScan(address, chain) {
  const result = await chrome.storage.sync.get(['apiUrl', 'apiKey']);
  const apiUrl = result.apiUrl || 'http://localhost:8000';
  const apiKey = result.apiKey;
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }
  
  const response = await fetch(`${apiUrl}/api/v1/scan`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      contract_address: address,
      chain: chain
    })
  });
  
  if (!response.ok) {
    throw new Error(`Scan failed: ${response.statusText}`);
  }
  
  return await response.json();
}

