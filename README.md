# Laion Nex - Monorepo Vendas & CRM WhatsApp Web

Este repositório é um monorepo que contém o ecossistema completo da **Laion Nex**, dividida em duas frentes de desenvolvimento:
1. **Chrome Extension (React & Vite)**: Injetada diretamente no WhatsApp Web para automação de funis de VSL, envio de mídias nativas (Bypass Opus) e atalhos rápidos.
2. **Dashboard CRM (Next.js 14 App Router)**: Interface executiva para gerenciamento de scripts, acompanhamento de leads em tempo real por Webhooks e configuração de funis.

---

## 📁 Estrutura do Repositório

```text
Laion Nex/
├── package.json                   # Gerenciamento de workspaces do Monorepo
├── README.md                      # Documentação geral do ecossistema
├── imagens/                       # Logos e criativos originais da marca
│   └── laion.png                  # Logo principal
│
├── extension/                     # Workspace da Extensão Chrome (React.js)
│   ├── package.json               # Dependências da Extensão (React, Vite, FFmpeg)
│   ├── tsconfig.json              # Configurações TypeScript da Extensão
│   ├── vite.config.ts             # Configuração de build multi-entrypoint do Vite
│   ├── index.html                 # Ponto de entrada do Popup da Extensão
│   ├── public/
│   │   ├── manifest.json          # Chrome Manifest V3 da Laion Nex
│   │   └── icons/                 # Ícones redimensionados
│   │       ├── icon16.png
│   │       ├── icon32.png
│   │       ├── icon48.png
│   │       └── icon128.png
│   └── src/
│       ├── main.tsx               # Script de montagem do React
│       ├── index.css              # Design System e variáveis CSS premium
│       ├── popup/
│       │   └── Popup.tsx          # Interface Popup (painel de controle rápido)
│       ├── background/
│       │   └── background.ts      # Service Worker (gerenciador de fila e anti-ban)
│       ├── content/
│       │   ├── content.ts         # Script de conteúdo (DOM manipulation no WhatsApp)
│       │   └── inject.ts          # Script injetado diretamente no escopo da página
│       └── utils/                 # Scripts auxiliares (FFmpeg e compressores)
│
└── dashboard/                     # Workspace do Painel CRM (Next.js 14)
    ├── package.json               # Dependências do Painel
    ├── tsconfig.json              # Configurações TypeScript do Painel
    ├── next.config.js             # Configurações de headers COOP/COEP para FFmpeg
    └── src/
        └── app/
            ├── globals.css        # Estilos globais e design system
            ├── layout.tsx         # Layout principal do Next.js
            ├── page.tsx           # Dashboard CRM com uploader de JSON e timeline preview
            └── api/
                ├── webhooks/      # API Route para capturar pagamentos (Hotmart/Kiwify)
                └── scripts/       # API Route para salvar e sincronizar funis
```

---

## ⚙️ Permissões e Detalhes do `manifest.json` (V3)
* **`storage`**: Necessário para persistir os scripts carregados localmente, históricos de disparo e configurações do modo Anti-Ban.
* **`activeTab` & `tabs`**: Permite monitorar a aba ativa do WhatsApp Web para injeção de scripts e atualização de status em tempo real.
* **`scripting`**: Permite a injeção do arquivo `inject.js` para manipulação do estado React nativo do WhatsApp.
* **`web_accessible_resources`**: Garante que o `inject.js` e os ícones corporativos da Laion Nex possam ser acessados com segurança pelo contexto da página do WhatsApp.
* **`content_security_policy`**: Configurado com `'wasm-unsafe-eval'` para permitir o funcionamento client-side do `FFmpeg.wasm`.

---

## 🛠️ Como Executar o Projeto

No diretório raiz do monorepo, você pode gerenciar ambas as workspaces:

### 1. Instalar as dependências do Monorepo
```bash
npm install
```

### 2. Rodar o Dashboard CRM em modo desenvolvimento
```bash
npm run dev:dashboard
```
O painel estará disponível em `http://localhost:3000`.

### 3. Rodar a Extensão em modo desenvolvimento (compilação automática)
```bash
npm run dev:extension
```

### 4. Compilar a Extensão para produção
```bash
npm run build:extension
```
Isso gerará a pasta `extension/dist/`. Para carregar no Chrome:
1. Acesse `chrome://extensions/`.
2. Ative o **Modo do desenvolvedor** (canto superior direito).
3. Clique em **Carregar sem compactação** e selecione a pasta `extension/dist/` (ou `extension/` caso use o manifest diretamente da pasta pública durante desenvolvimento).
