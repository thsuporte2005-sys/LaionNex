'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, Zap, 
  FileText, Clock, Play, FileJson, 
  Settings, Layers, Radio, Plus, Trash2, ArrowRight
} from 'lucide-react';

interface FunnelStep {
  type: 'text' | 'audio' | 'pdf';
  content: string;
  delay: number; // em milissegundos
}

interface Funnel {
  name: string;
  trigger: string;
  steps: FunnelStep[];
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('funnels');
  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify({
    name: "Recuperação de Boleto Premium",
    trigger: "/boleto",
    steps: [
      { type: "text", content: "Olá! Notei que você gerou o boleto para o Laion Nex mas não concluiu. Posso te ajudar?", delay: 3000 },
      { type: "audio", content: "audio_quebra_objecoes.mp3", delay: 8000 },
      { type: "text", content: "Estou te enviando o PDF explicativo com a nossa garantia de 30 dias.", delay: 4000 },
      { type: "pdf", content: "garantia_laion_nex.pdf", delay: 2000 }
    ]
  }, null, 2));

  const [parsedFunnel, setParsedFunnel] = useState<Funnel | null>(JSON.parse(jsonInput));
  const [parseError, setParseError] = useState<string | null>(null);

  // MOCK LEADS FEED
  const [leadsFeed, setLeadsFeed] = useState([
    { id: 1, name: "Roberto Silva", status: "Carrinho Abandonado", platform: "Hotmart", value: "R$ 497,00", time: "Há 2 min" },
    { id: 2, name: "Ana Beatriz", status: "Boleto Gerado", platform: "Kiwify", value: "R$ 297,00", time: "Há 12 min" },
    { id: 3, name: "Carlos Eduardo", status: "Venda Aprovada", platform: "Hotmart", value: "R$ 997,00", time: "Há 30 min" },
  ]);

  const handleJsonChange = (val: string) => {
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      if (!parsed.name || !parsed.trigger || !Array.isArray(parsed.steps)) {
        throw new Error("O JSON precisa ter as propriedades 'name', 'trigger' e a array 'steps'.");
      }
      setParsedFunnel(parsed);
      setParseError(null);
    } catch (err: any) {
      setParseError(err.message || "JSON inválido");
      setParsedFunnel(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleJsonChange(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="dashboard-grid">
      
      {/* Sidebar */}
      <aside className="glass-panel" style={{
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        borderRight: '1px solid var(--border-color)',
        zIndex: 10
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'var(--brand-gradient)',
            borderRadius: 'var(--border-radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: '#fff' }}>L</span>
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, letterSpacing: '0.5px' }}>
              LAION <span style={{ color: 'var(--brand-primary)' }}>NEX</span>
            </h1>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>CRM Dashboard</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('overview')} 
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'overview' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderColor: activeTab === 'overview' ? 'var(--border-color)' : 'transparent',
              width: '100%'
            }}
          >
            <TrendingUp size={18} /> Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('funnels')} 
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'funnels' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'funnels' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderColor: activeTab === 'funnels' ? 'var(--border-color)' : 'transparent',
              width: '100%'
            }}
          >
            <Layers size={18} /> Funis de Vendas
          </button>

          <button 
            onClick={() => setActiveTab('webhooks')} 
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'webhooks' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'webhooks' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderColor: activeTab === 'webhooks' ? 'var(--border-color)' : 'transparent',
              width: '100%'
            }}
          >
            <Radio size={18} /> Webhooks
          </button>

          <button 
            onClick={() => setActiveTab('configs')} 
            className="btn"
            style={{
              justifyContent: 'flex-start',
              background: activeTab === 'configs' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === 'configs' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderColor: activeTab === 'configs' ? 'var(--border-color)' : 'transparent',
              width: '100%'
            }}
          >
            <Settings size={18} /> Configurações
          </button>
        </nav>

        {/* Sync panel indicator */}
        <div className="glass-card" style={{ marginTop: 'auto', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-success)',
              boxShadow: '0 0 8px var(--status-success)'
            }}></span>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>API Webhook Online</span>
          </div>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            Recebendo feeds das plataformas Hotmart e Kiwify em tempo real.
          </p>
        </div>
      </aside>

      {/* Main Workspace */}
      <main style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Workspace Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700 }}>
              {activeTab === 'funnels' ? 'Scripts & Funis Inteligentes' : 'Overview Executivo'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Gerencie seus scripts de vendas em JSON e automatize o WhatsApp Web.
            </p>
          </div>
          <button className="btn btn-primary">
            <Plus size={16} /> Novo Funil
          </button>
        </header>

        {/* Dashboard Grid Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
          
          {/* Left Side: Dynamic Workspace depending on Active Tab */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* KPI Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Faturamento Recuperado</span>
                  <DollarSign size={18} style={{ color: 'var(--status-success)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>R$ 14.280,00</h3>
                <span style={{ fontSize: '11px', color: 'var(--status-success)' }}>+14.2% esta semana</span>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Leads em Funil</span>
                  <Users size={18} style={{ color: 'var(--brand-primary)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>584</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>42 ativos agora</span>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>Bypass de Conversão</span>
                  <Zap size={18} style={{ color: 'var(--status-warning)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>88.4%</h3>
                <span style={{ fontSize: '11px', color: 'var(--status-success)' }}>Excelente (Opus Native)</span>
              </div>
            </div>

            {/* Sales Script JSON Editor & Visual Timeline Preview */}
            {activeTab === 'funnels' && (
              <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileJson size={20} style={{ color: 'var(--brand-primary)' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Motor de Scripts (Configuração JSON)</h3>
                  </div>
                  <div>
                    <label className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>
                      <FileText size={14} /> Importar Arquivo
                      <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                {/* Editor & Preview Split Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
                  {/* Left Column: JSON Editor */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="form-label">Código da Matriz de Funil (JSON)</label>
                    <textarea 
                      value={jsonInput}
                      onChange={(e) => handleJsonChange(e.target.value)}
                      style={{
                        width: '100%',
                        height: '320px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '12px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#63e2b7',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                    {parseError && (
                      <div style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--status-danger)',
                        borderRadius: 'var(--border-radius-sm)',
                        color: 'var(--status-danger)',
                        fontSize: '11px'
                      }}>
                        ⚠️ Erro no JSON: {parseError}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Visual Timeline Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span className="form-label">Visual Timeline Preview (Simulação de Envio)</span>
                    
                    <div style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      padding: '16px',
                      height: '320px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      position: 'relative'
                    }}>
                      {parsedFunnel ? (
                        <>
                          {/* Funnel header tag */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '8px',
                            marginBottom: '6px'
                          }}>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {parsedFunnel.name}
                              </div>
                              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                Atalho de Gatilho: <strong style={{ color: 'var(--brand-primary)' }}>{parsedFunnel.trigger}</strong>
                              </div>
                            </div>
                            <span style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              backgroundColor: 'rgba(99, 102, 241, 0.15)',
                              borderRadius: 'var(--border-radius-full)',
                              color: 'var(--brand-primary)',
                              border: '1px solid rgba(99, 102, 241, 0.3)'
                            }}>
                              {parsedFunnel.steps.length} Passos
                            </span>
                          </div>

                          {/* Timeline steps */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '20px' }}>
                            {/* Vertical Line */}
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              left: '8px',
                              bottom: '10px',
                              width: '2px',
                              background: 'linear-gradient(to bottom, var(--brand-primary), var(--accent-color))'
                            }}></div>

                            {parsedFunnel.steps.map((step, idx) => (
                              <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {/* Timeline Dot */}
                                <div style={{
                                  position: 'absolute',
                                  left: '-16px',
                                  top: '4px',
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: step.type === 'audio' ? 'var(--status-warning)' : step.type === 'pdf' ? 'var(--status-info)' : 'var(--brand-primary)',
                                  border: '2px solid var(--bg-primary)',
                                  zIndex: 2
                                }}></div>

                                {/* Step Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                    Passo {idx + 1} - {step.type.toUpperCase()}
                                  </span>
                                  
                                  {/* Delay tag */}
                                  <span style={{
                                    fontSize: '10px',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}>
                                    <Clock size={10} /> {(step.delay / 1000).toFixed(1)}s delay
                                  </span>
                                </div>

                                {/* Step Bubble Preview */}
                                <div style={{
                                  background: 'var(--bg-secondary)',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: 'var(--border-radius-sm)',
                                  padding: '8px 12px',
                                  fontSize: '12px',
                                  color: 'var(--text-primary)',
                                  lineHeight: '1.4'
                                }}>
                                  {step.type === 'audio' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-warning)' }}>
                                      <span>🎙️ Audio Opus Bypass:</span>
                                      <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{step.content}</span>
                                    </div>
                                  )}
                                  {step.type === 'pdf' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-info)' }}>
                                      <span>📄 Documento PDF:</span>
                                      <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{step.content}</span>
                                    </div>
                                  )}
                                  {step.type === 'text' && (
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{step.content}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: 'var(--text-muted)',
                          gap: '8px'
                        }}>
                          <Clock size={32} />
                          <span style={{ fontSize: '13px' }}>Aguardando JSON válido para renderizar preview...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Save Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '16px'
                }}>
                  <button className="btn btn-secondary">Limpar</button>
                  <button 
                    className="btn btn-primary" 
                    disabled={!parsedFunnel}
                    onClick={() => {
                      if (parsedFunnel) {
                        alert('Funil salvo no banco de dados com sucesso e propagado para a Extensão!');
                      }
                    }}
                  >
                    Salvar e Sincronizar Funil
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Real-time Webhooks notifications feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '20px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <Radio size={16} style={{ color: 'var(--status-success)', animation: 'pulse 2s infinite' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Webhook Live Feed</h3>
              </div>

              {/* Feed List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                {leadsFeed.map((lead) => (
                  <div key={lead.id} style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all var(--transition-fast)'
                  }} className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{lead.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{lead.time}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: 600,
                        backgroundColor: lead.status.includes('Aprovada') ? 'rgba(16, 185, 129, 0.15)' : lead.status.includes('Boleto') ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: lead.status.includes('Aprovada') ? 'var(--status-success)' : lead.status.includes('Boleto') ? 'var(--status-warning)' : 'var(--status-danger)',
                        border: '1px solid transparent'
                      }}>
                        {lead.status}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{lead.value}</span>
                    </div>

                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                      <span>Plataforma: {lead.platform}</span>
                      <span style={{ color: 'var(--brand-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        Disparar Funil <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feed Info Footer */}
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                Conectado com Webhook da Hotmart (V3)
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
