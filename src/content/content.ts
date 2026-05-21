// Laion Nex - Content Script for WhatsApp Web
import '../index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import FloatingPanel from '../components/FloatingPanel';


// Inject page-level script (inject.js) to access WhatsApp Web internal Webpack modules
function injectPageScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('inject.js');
  script.onload = () => {
    script.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

injectPageScript();

console.log('Laion Nex content script loaded.');

// Detect keydown events on WhatsApp input fields for hotkey trigger (ex: /)
document.addEventListener('keydown', (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  if (!target) return;

  const isInput = target.tagName === 'INPUT' || 
                  target.tagName === 'TEXTAREA' || 
                  target.getAttribute('contenteditable') === 'true';

  if (isInput) {
    const text = target.innerText || (target as any).value || '';
    
    // Quick-fire activation check
    if (event.key === '/' && (text === '' || text.trim() === '')) {
      console.log('Laion Nex: User triggered quick-fire scripts menu.');
      showQuickFireMenu(target);
    }
  }
}, true);

// Render the Quick-Fire float menu inside WhatsApp Web DOM
function showQuickFireMenu(inputElement: HTMLElement) {
  // Check if menu already exists
  let menu = document.getElementById('laion-quickfire-menu');
  if (menu) return;

  menu = document.createElement('div');
  menu.id = 'laion-quickfire-menu';
  menu.className = 'glass-panel animate-slide-up';
  
  // Style the menu to float nicely above the input area
  Object.assign(menu.style, {
    position: 'absolute',
    bottom: '60px',
    left: '20px',
    width: '320px',
    maxHeight: '280px',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: '9999',
    overflowY: 'auto',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    border: '1px solid var(--border-color)'
  });

  // Fetch scripts from chrome.storage and render
  chrome.storage.local.get(['scripts'], (result) => {
    const scripts = result.scripts || [
      { trigger: '/boleto', title: 'Recuperação Boleto', description: 'Funil para boleto abandonado' },
      { trigger: '/vsl', title: 'Pitch VSL principal', description: 'Gatilho para script de vendas' },
      { trigger: '/boasvindas', title: 'Boas-vindas Lead', description: 'Mensagem de recepção' }
    ];

    const titleHeader = document.createElement('div');
    titleHeader.innerHTML = '<strong>Atalhos Rápidos Laion Nex</strong>';
    titleHeader.style.padding = '6px 8px';
    titleHeader.style.fontSize = '12px';
    titleHeader.style.color = 'var(--brand-primary)';
    titleHeader.style.borderBottom = '1px solid var(--border-color)';
    titleHeader.style.marginBottom = '4px';
    menu?.appendChild(titleHeader);

    scripts.forEach((scriptItem: any) => {
      const item = document.createElement('div');
      Object.assign(item.style, {
        padding: '8px',
        borderRadius: 'var(--border-radius-sm)',
        cursor: 'pointer',
        transition: 'background var(--transition-fast)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      });

      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-weight:600; font-size:12px; color:var(--text-primary);">
          <span>${scriptItem.title}</span>
          <span style="color:var(--brand-primary); font-size:11px;">${scriptItem.trigger}</span>
        </div>
        <div style="font-size:10px; color:var(--text-secondary);">${scriptItem.description}</div>
      `;

      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = 'var(--bg-accent)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'transparent';
      });
      item.addEventListener('click', () => {
        dispatchShortcut(scriptItem, inputElement);
        menu?.remove();
      });

      menu?.appendChild(item);
    });

    // Append to the closest WhatsApp composition panel
    const composePanel = inputElement.closest('footer') || document.body;
    composePanel.appendChild(menu!);
  });

  // Close menu when clicking outside
  const closeHandler = (e: MouseEvent) => {
    if (menu && !menu.contains(e.target as Node) && e.target !== inputElement) {
      menu.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 10);
}

// Fill input and execute shortcut dispatch
function dispatchShortcut(script: any, _inputElement: HTMLElement) {
  console.log(`Laion Nex: Disparando atalho: ${script.trigger}`);
  
  // Custom event to communicate with the injected script to simulate native typing
  window.postMessage({
    source: 'laion-nex-extension',
    action: 'DISPATCH_TEXT',
    payload: {
      text: script.text || `Mensagem disparada pelo gatilho ${script.trigger}`
    }
  }, '*');
}

// Watch chat messages for Auto-Pause logic (Lógica de Interrupção)
// When a sequence is active and a customer responds, stop all pending messages in that thread.
let lastIncomingMessageId = '';

const observer = new MutationObserver(() => {
  // Target message row element classes (WhatsApp Web dynamically changes classes, but certain layouts are identifiable)
  const incomingMessages = document.querySelectorAll('.message-in');
  if (incomingMessages.length === 0) return;

  const lastMessage = incomingMessages[incomingMessages.length - 1] as HTMLElement;
  const messageTextEl = lastMessage.querySelector('.copyable-text');
  if (!messageTextEl) return;

  const msgId = lastMessage.getAttribute('data-id') || '';
  if (msgId && msgId !== lastIncomingMessageId) {
    lastIncomingMessageId = msgId;
    
    // Trigger interruption logic
    chrome.storage.local.get(['autoPauseOnReply', 'activeQueues'], (res) => {
      if (res.autoPauseOnReply && res.activeQueues && res.activeQueues.length > 0) {
        console.warn('Laion Nex: Resposta do cliente detectada. Interrompendo funis ativos...');
        
        // Notify background script to pause active script streams
        chrome.runtime.sendMessage({
          action: 'TOGGLE_QUEUE',
          payload: { funnelId: 'all', status: 'paused' }
        }, (_response) => {
          // Show interruption warning UI
          showInterruptionToast();
        });
      }
    });
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Visual Alert Toast for Funnel Interruption
function showInterruptionToast() {
  let toast = document.getElementById('laion-toast-alert');
  if (toast) toast.remove();

  toast = document.createElement('div');
  toast.id = 'laion-toast-alert';
  toast.className = 'glass-panel animate-slide-up';
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 18px',
    borderRadius: 'var(--border-radius-md)',
    borderLeft: '4px solid var(--status-warning)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: '500',
    zIndex: '100000',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  });

  toast.innerHTML = `
    <span style="color:var(--status-warning);">⚠️</span>
    <div>
      <div style="font-weight:600;">Disparo Interrompido</div>
      <div style="font-size:10px; color:var(--text-secondary);">O cliente respondeu. Funis automáticos pausados.</div>
    </div>
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast?.remove(), 4000);
}

// Mount Floating UI Control Bar above WhatsApp web message composer
function mountFloatingPanel() {
  const interval = setInterval(() => {
    // Look for footer element in WhatsApp Web DOM (Composer container)
    const footer = document.querySelector('footer');
    if (footer && !document.getElementById('laion-floating-panel-root')) {
      // Create react root element
      const container = document.createElement('div');
      container.id = 'laion-floating-panel-root';
      container.style.width = '100%';
      
      // Insert container above input bar inside footer
      footer.insertBefore(container, footer.firstChild);

      // Mount React component
      const root = createRoot(container);
      root.render(React.createElement(FloatingPanel));
      
      console.log('Laion Nex: React Floating control panel successfully mounted.');
      clearInterval(interval);
    }
  }, 1000);
}

mountFloatingPanel();
