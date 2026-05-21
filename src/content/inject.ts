// Laion Nex - Injected Script (Runs in page context of web.whatsapp.com)

console.log('Laion Nex Page Injector active.');

window.addEventListener('message', (event) => {
  // Validate origin and source
  if (event.data?.source !== 'laion-nex-extension') return;

  const { action, payload } = event.data;

  switch (action) {
    case 'DISPATCH_TEXT':
      simulateTextTyping(payload.text);
      break;
    default:
      break;
  }
});

/**
 * Simulates React-compatible typing inside WhatsApp Web's rich-text input field
 */
function simulateTextTyping(text: string) {
  // WhatsApp Web message composer uses div[contenteditable="true"]
  const textInput = document.querySelector('div[contenteditable="true"]') as HTMLDivElement;
  if (!textInput) {
    console.error('Laion Nex: Composer input field not found.');
    return;
  }

  // Focus the input element
  textInput.focus();

  // Clear previous text if any and load text via document execCommand (which triggers React updates)
  document.execCommand('insertText', false, text);

  // Dispatch standard keyboard/input events to satisfy WhatsApp's React DOM state
  const inputEvent = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
    inputType: 'insertText',
    data: text
  });
  textInput.dispatchEvent(inputEvent);

  console.log('Laion Nex: Successfully typed text via page context injection.');
}
