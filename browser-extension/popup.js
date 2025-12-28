// Popup script for extension settings

document.addEventListener('DOMContentLoaded', async () => {
  const apiUrlInput = document.getElementById('apiUrl');
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  
  // Load saved settings
  const result = await chrome.storage.sync.get(['apiUrl', 'apiKey']);
  if (result.apiUrl) {
    apiUrlInput.value = result.apiUrl;
  }
  if (result.apiKey) {
    apiKeyInput.value = result.apiKey;
  }
  
  // Check API connection
  checkApiConnection();
  
  // Save settings
  saveBtn.addEventListener('click', async () => {
    await chrome.storage.sync.set({
      apiUrl: apiUrlInput.value,
      apiKey: apiKeyInput.value
    });
    
    statusDiv.textContent = 'Settings saved!';
    statusDiv.className = 'status connected';
    
    setTimeout(checkApiConnection, 1000);
  });
  
  async function checkApiConnection() {
    try {
      const response = await fetch(`${apiUrlInput.value}/api/v1/health`);
      if (response.ok) {
        statusDiv.textContent = 'API: Connected';
        statusDiv.className = 'status connected';
      } else {
        throw new Error('API not responding');
      }
    } catch (error) {
      statusDiv.textContent = 'API: Disconnected';
      statusDiv.className = 'status disconnected';
    }
  }
});


