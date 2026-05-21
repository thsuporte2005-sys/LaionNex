import { NextResponse } from 'next/server';

// POST /api/webhooks
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Laion Nex: Received webhook payload:', body);

    // Identify payment platform and normalize payload structure
    const eventType = body.event || body.status || 'unknown';
    let leadData = {
      name: 'Cliente Indefinido',
      email: '',
      phone: '',
      product: 'Infoproduto',
      value: 'R$ 0,00',
      status: 'Carrinho Abandonado',
      platform: 'Hotmart'
    };

    // Hotmart Webhook format normalization example
    if (body.data?.buyer) {
      leadData = {
        name: body.data.buyer.name || 'Cliente Indefinido',
        email: body.data.buyer.email || '',
        phone: body.data.buyer.checkout_phone || '',
        product: body.data.product?.name || 'Infoproduto',
        value: `R$ ${body.data.purchase?.price?.value || '0.00'}`,
        status: translateStatus(body.event),
        platform: 'Hotmart'
      };
    } 
    // Kiwify Webhook format normalization example
    else if (body.order_status) {
      leadData = {
        name: body.Customer?.name || 'Cliente Indefinido',
        email: body.Customer?.email || '',
        phone: body.Customer?.mobile || '',
        product: body.product_name || 'Infoproduto',
        value: `R$ ${(body.amount / 100).toFixed(2)}`,
        status: translateStatus(body.order_status),
        platform: 'Kiwify'
      };
    }

    // Integrate with socket.io or chrome push notifications service here.
    // For now, we will return a success response containing the parsed lead metadata.
    return NextResponse.json({
      status: 'success',
      message: 'Webhook parsed successfully',
      data: leadData
    });

  } catch (error: any) {
    console.error('Laion Nex Webhook Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message || 'Internal Server Error' 
    }, { status: 400 });
  }
}

// Convert payment platform statuses to simplified CRM states
function translateStatus(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('abandon') || s.includes('cart')) return 'Carrinho Abandonado';
  if (s.includes('billet') || s.includes('boleto') || s.includes('waiting')) return 'Boleto Gerado';
  if (s.includes('approved') || s.includes('complete') || s.includes('pay')) return 'Venda Aprovada';
  if (s.includes('refund') || s.includes('chargeback')) return 'Reembolso';
  return 'Status Indefinido';
}
