import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

interface CheckoutItem {
  title: string;
  quantity: number;
  price: number;
}

const accessToken = (process.env.MP_ACCESS_TOKEN || '').trim();
const client = new MercadoPagoConfig({
  accessToken,
});

type MPPreferenceBody = {
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    currency_id: 'CLP';
    unit_price: number;
  }>;
  back_urls: { success: string; failure: string; pending: string };
  binary_mode: boolean;
  statement_descriptor: string;
  payment_methods: {
    excluded_payment_types: Array<{ id: string }>;
    installments: number;
    default_installments: number;
  };
  payer?: { email: string };
  auto_return?: 'approved' | 'all' | 'pending';
  notification_url?: string;
};

export async function POST(req: Request) {
  try {
    const { items, email }: { items: CheckoutItem[]; email?: string } = await req.json();

    // Validar que hay items
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No hay items en el carrito' }, { status: 400 });
    }

    // Validar token de MP
    if (!accessToken) {
      return NextResponse.json({ error: 'MP_ACCESS_TOKEN no está configurado' }, { status: 500 });
    }

    const preference = new Preference(client);

    const baseUrl = (
      process.env.NEXT_PUBLIC_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'http://localhost:3000'
    ).replace(/\/$/, '');

    const isHttps = baseUrl.startsWith('https://');

    const body: MPPreferenceBody = {
      items: items.map((item, index) => ({
        id: `item-${index}-${Date.now()}`,
        title: item.title,
        quantity: item.quantity,
        currency_id: 'CLP',
        unit_price: item.price,
      })),
      back_urls: {
        success: `${baseUrl}/carro?status=success`,
        failure: `${baseUrl}/carro?status=failure`,
        pending: `${baseUrl}/carro?status=pending`,
      },
      // Rechaza inmediatamente pagos no aprobados (mejora UX)
      binary_mode: true,
      // Descriptor en el extracto del cliente (máx 22 chars, sin símbolos)
      statement_descriptor: 'LUNARIA',
      // Simplificar medios en sandbox: solo tarjeta, 1 cuota
      payment_methods: {
        excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }, { id: 'bank_transfer' }],
        installments: 1,
        default_installments: 1,
      },
    };

    if (email?.trim()) body.payer = { email: email.trim() };
    if (isHttps) body.auto_return = 'approved';
    // Solo incluir notification_url con https (Mercado Pago puede rechazar localhost/http)
    if (isHttps) body.notification_url = `${baseUrl}/api/webhooks/mercadopago`;

    const response = await preference.create({ body });

    try {
      const initHost = response.init_point ? new URL(response.init_point).host : null;
      const sandboxHost = response.sandbox_init_point
        ? new URL(response.sandbox_init_point).host
        : null;
      // Debug no sensible: ayuda a detectar entorno de preferencia sin exponer secretos
      console.log('[MP pref debug]', {
        baseUrl,
        isHttps,
        hasSandbox: Boolean(response.sandbox_init_point),
        initHost,
        sandboxHost,
      });
    } catch {}

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      env: response.sandbox_init_point ? 'sandbox' : 'production',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('MercadoPago error:', msg, err);
    return NextResponse.json(
      { error: 'Error creando preferencia de pago', details: msg },
      { status: 500 },
    );
  }
}
