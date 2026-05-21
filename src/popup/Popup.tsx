import { useState } from 'react';
import { Shield, Settings, Send, CheckCircle2, ExternalLink } from 'lucide-react';

export default function Popup() {
  const [stats] = useState({
    sentToday: 124,
    savedTime: '4.2h',
    leadsActive: 18,
    antiBanStatus: 'Ativo'
  });

  const [connected] = useState(true);

  return (
    <div style={{
      width: '360px',
      padding: '20px',
      background: 'var(--bg-primary)',
      fontFamily: 'var(--font-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      minHeight: '480px'
    }} className="animate-fade-in">
      
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--brand-gradient)',
            borderRadius: 'var(--border-radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: '#fff' }}>L</span>
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, letterSpacing: '0.5px' }}>
              LAION <span style={{ color: 'var(--brand-primary)' }}>NEX</span>
            </h1>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Extension v1.0.0</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: connected ? 'var(--status-success)' : 'var(--status-danger)',
            boxShadow: connected ? '0 0 8px var(--status-success)' : '0 0 8px var(--status-danger)'
          }}></span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {connected ? 'WhatsApp Sincronizado' : 'Desconectado'}
          </span>
        </div>
      </header>

      {/* Main Connection Status Card */}
      <div className="glass-card" style={{ padding: '14px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          width: '60px',
          height: '60px',
          background: 'var(--brand-glow)',
          borderRadius: '50%',
          filter: 'blur(20px)'
        }}></div>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '8px',
            borderRadius: 'var(--border-radius-md)',
            color: 'var(--brand-primary)'
          }}>
            <Shield size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>Modo Anti-Ban Ativo</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Atrasos randômicos ativos (+250ms a +750ms). Mapeamento de comportamento humano ativado.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="glass-card" style={{ padding: '12px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Disparos (Hoje)
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--brand-primary)' }}>
            {stats.sentToday}
          </span>
        </div>

        <div className="glass-card" style={{ padding: '12px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Tempo Economizado
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-color)' }}>
            {stats.savedTime}
          </span>
        </div>
      </div>

      {/* Mini Activity Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status da Transmissão</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-secondary)',
            padding: '8px 12px',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={12} style={{ color: 'var(--brand-primary)' }} />
              <span style={{ fontSize: '11px' }}>Fila de Recuperação /boleto</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--status-warning)' }}>Aguardando Delay...</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-secondary)',
            padding: '8px 12px',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={12} style={{ color: 'var(--status-success)' }} />
              <span style={{ fontSize: '11px' }}>Audio Bypass (FFmpeg.wasm)</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--status-success)' }}>Pronto (Local)</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => window.open('https://dashboard.laionnex.com', '_blank')}
          style={{ width: '100%' }}
        >
          Acessar Dashboard CRM <ExternalLink size={14} />
        </button>

        <button 
          className="btn btn-secondary"
          style={{ width: '100%' }}
        >
          <Settings size={14} /> Configurações Avançadas
        </button>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        fontSize: '10px',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '10px',
        marginTop: '6px'
      }}>
        Laion Nex &copy; {new Date().getFullYear()} - Ecossistema de Conversão VSL
      </footer>

    </div>
  );
}
