// Laion Nex - Chrome Extension Service Worker (Manifest V3)

// Initialize extension settings upon installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Laion Nex Extension installed.');
  chrome.storage.local.set({
    antiBan: {
      enabled: true,
      minDelay: 250, // milissegundos adicionais mínimos
      maxDelay: 750  // milissegundos adicionais máximos
    },
    shortcuts: {
      trigger: '/'
    },
    autoPauseOnReply: true,
    activeQueues: []
  });
});

// Listener for messages from Content Scripts and Popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, payload } = message;

  switch (action) {
    case 'SYNC_SCRIPTS':
      handleSyncScripts(payload, sendResponse);
      break;
    case 'REGISTER_LEAD_EVENT':
      handleLeadEvent(payload, sender, sendResponse);
      break;
    case 'TOGGLE_QUEUE':
      handleToggleQueue(payload, sendResponse);
      break;
    default:
      sendResponse({ status: 'error', message: `Unknown action: ${action}` });
  }

  return true; // Keep message channel open for asynchronous sendResponse
});

// Sync sales scripts from Dashboard to Chrome Local Storage
function handleSyncScripts(payload: any, sendResponse: (res: any) => void) {
  chrome.storage.local.set({ scripts: payload.scripts }, () => {
    sendResponse({ status: 'success', count: payload.scripts.length });
  });
}

// Register lead event in storage and forward/log
function handleLeadEvent(payload: any, sender: chrome.runtime.MessageSender, sendResponse: (res: any) => void) {
  const tabId = sender.tab?.id;
  console.log(`Lead event from tab ${tabId}:`, payload);
  
  // Forward to popup or save in local history
  chrome.storage.local.get(['leadsHistory'], (result) => {
    const history = result.leadsHistory || [];
    history.push({
      ...payload,
      timestamp: Date.now(),
      tabId
    });
    chrome.storage.local.set({ leadsHistory: history.slice(-100) }, () => {
      sendResponse({ status: 'success' });
    });
  });
}

// Control and track active funnels
function handleToggleQueue(payload: { funnelId: string; status: 'active' | 'paused' }, sendResponse: (res: any) => void) {
  chrome.storage.local.get(['activeQueues'], (result) => {
    let queues: string[] = result.activeQueues || [];
    if (payload.status === 'active') {
      if (!queues.includes(payload.funnelId)) queues.push(payload.funnelId);
    } else {
      queues = queues.filter(id => id !== payload.funnelId);
    }
    chrome.storage.local.set({ activeQueues: queues }, () => {
      sendResponse({ status: 'success', activeQueues: queues });
    });
  });
}

// Listener for external webhooks or push notifications (e.g. from Dashboard CRM)
// This can be triggered via a WebSockets connection or push notifications.
console.log('Laion Nex Service Worker running in background.');
