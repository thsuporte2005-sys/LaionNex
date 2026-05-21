import { NextResponse } from 'next/server';

// Mock DB for scripts
let mockScripts = [
  {
    id: 'funnel-1',
    name: 'Recuperação de Boleto Premium',
    trigger: '/boleto',
    steps: [
      { type: 'text', content: 'Olá! Notei que você gerou o boleto para o Laion Nex mas não concluiu. Posso te ajudar?', delay: 3000 },
      { type: 'audio', content: 'audio_quebra_objecoes.mp3', delay: 8000 },
      { type: 'text', content: 'Estou te enviando o PDF explicativo com a nossa garantia de 30 dias.', delay: 4000 },
      { type: 'pdf', content: 'garantia_laion_nex.pdf', delay: 2000 }
    ]
  },
  {
    id: 'funnel-2',
    name: 'Quebra de Objeção Preço',
    trigger: '/preco',
    steps: [
      { type: 'text', content: 'Entendo que o valor possa parecer alto à primeira vista. Mas pense no retorno...', delay: 2000 },
      { type: 'audio', content: 'audio_vsl_pitch.mp3', delay: 10000 }
    ]
  }
];

// GET /api/scripts - Retrieve all scripts
export async function GET() {
  return NextResponse.json({
    status: 'success',
    scripts: mockScripts
  });
}

// POST /api/scripts - Save or update a script
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.trigger || !Array.isArray(body.steps)) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing fields. Required: name, trigger, steps[]'
      }, { status: 400 });
    }

    const newScript = {
      id: `funnel-${Date.now()}`,
      name: body.name,
      trigger: body.trigger,
      steps: body.steps
    };

    mockScripts.push(newScript);

    return NextResponse.json({
      status: 'success',
      message: 'Script synced successfully',
      script: newScript
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
