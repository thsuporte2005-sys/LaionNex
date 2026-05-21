import { useState, useEffect } from 'react';
import { 
  Minimize2, Maximize2, Send, Zap, 
  MessageSquare, HelpCircle, RefreshCcw, 
  Settings, CheckCircle, ShieldAlert 
} from 'lucide-react';

interface Script {
  id: string;
  category: 'welcome' | 'objection' | 'recovery';
  title: string;
  trigger: string;
  stepsCount: number;
  textPreview: string;
}

export default function FloatingPanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'welcome' | 'objection' | 'recovery' | 'settings'>('welcome');
  const [isSending, setIsSending] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [antiBanEnabled, setAntiBanEnabled] = useState(true);
  const [pauseOnReply, setPauseOnReply] = useState(true);

  // Mock de scripts locais sincronizados
  const [scripts] = useState<Script[]>([
    { id: '1', category: 'welcome', title: 'Boas-Vindas Lead Frio', trigger: '/boasvindas', stepsCount: 2, textPreview: 'Olá! Tudo bem? Prazer em te conhecer...' },
    { id: '2', category: 'welcome', title: 'Apresentação Produto', trigger: '/apresentar', stepsCount: 3, textPreview: 'Deixa eu te explicar como a Laion Nex funciona...' },
    { id: '3', category: 'objection', title: 'Quebra Preço Alto', trigger: '/preco', stepsCount: 2, textPreview: 'Entendo perfeitamente, mas se você dividir...' },
    { id: '4', category: 'objection', title: 'Garantia de 30 Dias', trigger: '/garantia', stepsCount: 2, textPreview: 'Nós confiamos tanto no nosso método...' },
    { id: '5', category: 'recovery', title: 'Recuperação Boleto', trigger: '/boleto', stepsCount: 4, textPreview: 'Olá! Notei que você gerou o boleto...' },
    { id: '6', category: 'recovery', title: 'Pix Gerado Expirando', trigger: '/pix', stepsCount: 3, textPreview: 'O seu código Pix expira em alguns minutos...' }
  ]);

  useEffect(() => {
    // Sincronizar estados iniciais com chrome storage se disponível
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['antiBan', 'autoPauseOnReply'], (result) => {
        if (result.antiBan) setAntiBanEnabled(result.antiBan.enabled);
        if (result.autoPauseOnReply !== undefined) setPauseOnReply(result.autoPauseOnReply);
      });
    }
  }, []);

  const handleToggleAntiBan = () => {
    const newVal = !antiBanEnabled;
    setAntiBanEnabled(newVal);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['antiBan'], (res) => {
        const antiBan = res.antiBan || {};
        chrome.storage.local.set({ antiBan: { ...antiBan, enabled: newVal } });
      });
    }
  };

  const handleTogglePauseOnReply = () => {
    const newVal = !pauseOnReply;
    setPauseOnReply(newVal);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ autoPauseOnReply: newVal });
    }
  };

  // Simular o disparo do script (Quick-Fire)
  const triggerQuickFire = (script: Script) => {
    if (isSending) return;
    
    setIsSending(true);
    setCurrentStep(1);
    setTotalSteps(script.stepsCount);

    // Simula a fila de execução com delays
    let step = 1;
    const interval = setInterval(() => {
      if (step < script.stepsCount) {
        step++;
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsSending(false);
        setCurrentStep(0);
        
        // Disparar texto para a janela do WhatsApp via window postMessage
        window.postMessage({
          source: 'laion-nex-extension',
          action: 'DISPATCH_TEXT',
          payload: { text: `[Simulação] ${script.title} executado com sucesso!` }
        }, '*');
      }
    }, 2500);
  };

  const filteredScripts = scripts.filter(s => s.category === activeTab);

  if (isMinimized) {
    return (
      <div 
        className="glass-panel animate-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          width: '100%',
          borderBottom: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-sm) var(--border-radius-sm) 0 0',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: 'var(--brand-gradient)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff' }}>L</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px' }}>
            LAION NEX CONTROL <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontWeight: 400 }}>(Minimizado)</span>
          </span>
        </div>

        {isSending && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--status-warning)' }}>
            <span className="pulse-dot"></span>
            Disparando passo {currentStep}/{totalSteps}...
          </div>
        )}

        <button 
          onClick={() => setIsMinimized(false)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Maximizar painel"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="glass-panel animate-slide-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderBottom: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-md) var(--border-radius-md) 0 0',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Panel Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(17, 27, 33, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '22px',
            height: '22px',
            background: 'var(--brand-gradient)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>L</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.3px' }}>
            LAION <span style={{ color: 'var(--brand-primary)' }}>NEX</span> PANEL
          </span>
        </div>

        {/* Transmission Status */}
        {isSending ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            padding: '4px 10px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--border-radius-full)',
            color: 'var(--status-warning)'
          }}>
            <RefreshCcw size={12} style={{ animation: 'spin 2s linear infinite' }} />
            <span>Disparando: Passo {currentStep} de {totalSteps}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--status-success)' }}>
            <CheckCircle size={12} />
            <span>Pronto para Envio</span>
          </div>
        )}

        <button 
          onClick={() => setIsMinimized(true)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Minimizar painel"
        >
          <Minimize2 size={14} />
        </button>
      </div>

      {/* Tabs Menu & Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', minHeight: '120px' }}>
        
        {/* Navigation Sidebar */}
        <div style={{
          borderRight: '1px solid var(--border-color)',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'rgba(17, 27, 33, 0.2)'
        }}>
          <button 
            onClick={() => setActiveTab('welcome')}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              background: activeTab === 'welcome' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'welcome' ? 'var(--text-primary)' : 'var(--text-secondary)',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MessageSquare size={12} /> Boas-Vindas
          </button>
          
          <button 
            onClick={() => setActiveTab('objection')}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              background: activeTab === 'objection' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'objection' ? 'var(--text-primary)' : 'var(--text-secondary)',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <HelpCircle size={12} /> Objeções
          </button>
          
          <button 
            onClick={() => setActiveTab('recovery')}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              background: activeTab === 'recovery' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'recovery' ? 'var(--text-primary)' : 'var(--text-secondary)',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Zap size={12} /> Recuperação
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              background: activeTab === 'settings' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: 'auto'
            }}
          >
            <Settings size={12} /> Segurança
          </button>
        </div>

        {/* Content Pane */}
        <div style={{ padding: '10px 14px', overflowY: 'auto', maxHeight: '150px' }}>
          {activeTab !== 'settings' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {filteredScripts.map(script => (
                <div 
                  key={script.id} 
                  className="glass-card"
                  style={{
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(32, 44, 51, 0.3)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{script.title}</span>
                      <span style={{ fontSize: '9px', color: 'var(--brand-primary)', fontWeight: 600 }}>{script.trigger}</span>
                    </div>
                    <p style={{
                      fontSize: '9px',
                      color: 'var(--text-secondary)',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      marginTop: '2px'
                    }}>
                      {script.textPreview}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{script.stepsCount} passos</span>
                    <button 
                      className="btn btn-primary"
                      onClick={() => triggerQuickFire(script)}
                      disabled={isSending}
                      style={{
                        padding: '3px 8px',
                        fontSize: '9px',
                        borderRadius: '4px',
                        gap: '4px',
                        boxShadow: 'none'
                      }}
                    >
                      <Send size={8} /> Disparar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Settings Tab Content */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={14} style={{ color: 'var(--brand-primary)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Sistema Anti-Ban Ativo</div>
                    <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Atrasos aleatórios nos envios (+250ms a +750ms)</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={antiBanEnabled} 
                  onChange={handleToggleAntiBan} 
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Pausar ao Receber Resposta</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Interrompe a fila imediatamente se o lead responder</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={pauseOnReply} 
                  onChange={handleTogglePauseOnReply} 
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Embedded CSS for pulse animation */}
      <style>{`
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--status-warning);
          box-shadow: 0 0 6px var(--status-warning);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 4px rgba(245, 158, 11, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
