import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import crypto from 'crypto';
import { prisma } from './prisma.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.APP_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS blocked'));
    },
    credentials: true,
  })
);

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/products', async (req, res) => {
  const { category, q } = req.query;
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(category ? { category: { name: String(category) } } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: String(q), mode: 'insensitive' } },
                { category: { name: { contains: String(q), mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(
      products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        image: product.image,
        badge: product.badge,
        stock: product.stock,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load products', detail: String(error) });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });

  if (!product || !product.active) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.json({
    id: product.id,
    name: product.name,
    category: product.category.name,
    price: product.price,
    image: product.image,
    badge: product.badge,
    stock: product.stock,
  });
});

app.get('/api/blog', async (_req, res) => {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(posts);
});

app.get('/api/blog/:id', async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: req.params.id },
  });

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.json(post);
});

app.get('/api/courts', async (_req, res) => {
  const courts = await prisma.court.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(courts);
});

app.post('/api/orders', async (req, res) => {
  const { items, customer, shippingAddress } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Items are required' });
    return;
  }

  if (!customer?.name || !customer?.email || !customer?.phone || !shippingAddress) {
    res.status(400).json({ error: 'Customer and shipping data are required' });
    return;
  }

  const ids = items.map((item: { productId: string }) => item.productId);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: ids }, active: true },
      });

      if (products.length !== ids.length) {
        throw new Error('invalid_products');
      }

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error('invalid_products');
        }
        if (item.quantity <= 0) {
          throw new Error('invalid_quantity');
        }
        if (product.stock < item.quantity) {
          throw new Error(`out_of_stock:${product.id}`);
        }
      }

      const total = items.reduce((sum: number, item: { productId: string; quantity: number }) => {
        const product = products.find((p) => p.id === item.productId)!;
        return sum + product.price * item.quantity;
      }, 0);

      const createdOrder = await tx.order.create({
        data: {
          total,
          customerName: String(customer.name),
          customerEmail: String(customer.email),
          customerPhone: String(customer.phone),
          shippingAddress: String(shippingAddress),
          items: {
            create: items.map((item: { productId: string; quantity: number }) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
        include: { items: true },
      });

      return createdOrder;
    });

    res.status(201).json({ orderId: order.id, total: order.total, currency: order.currency });
  } catch (error) {
    const message = String(error);
    if (message.includes('out_of_stock')) {
      res.status(409).json({ error: 'Out of stock', detail: message.split(':')[1] });
      return;
    }
    if (message.includes('invalid_products')) {
      res.status(400).json({ error: 'Invalid products' });
      return;
    }
    if (message.includes('invalid_quantity')) {
      res.status(400).json({ error: 'Invalid quantity' });
      return;
    }
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/payments/mercadopago', async (req, res) => {
  const { orderId } = req.body || {};
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!token) {
    res.status(500).json({ error: 'Missing Mercado Pago credentials' });
    return;
  }

  if (!orderId) {
    res.status(400).json({ error: 'orderId is required' });
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const baseUrl = process.env.APP_URL || 'http://localhost:3000';

  const payload = {
    items: order.items.map((item) => ({
      title: item.product.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: order.currency,
    })),
    back_urls: {
      success: `${baseUrl}/pago-exitoso?orderId=${order.id}`,
      failure: `${baseUrl}/pago-fallido?orderId=${order.id}`,
      pending: `${baseUrl}/pago-pendiente?orderId=${order.id}`,
    },
    auto_return: 'approved',
    external_reference: order.id,
  };

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    res.status(502).json({ error: 'Failed to create Mercado Pago preference', detail });
    return;
  }

  const data = await response.json();

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: 'mercadopago',
      providerRef: data.id,
      status: 'pending',
      amount: order.total,
    },
  });

  res.json({ initPoint: data.init_point || data.sandbox_init_point, preferenceId: data.id });
});

app.post('/api/webhooks/mercadopago', async (req: any, res) => {
  const signature = req.headers['x-signature'];
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  if (secret && typeof signature === 'string') {
    const expected = crypto.createHmac('sha256', secret).update(req.rawBody || '').digest('hex');
    if (!signature.includes(expected)) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }
  }

  const raw = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body || {});
  let payload: any = {};

  try {
    payload = JSON.parse(raw);
  } catch (_error) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }

  const paymentId = payload?.data?.id || payload?.id;

  if (!paymentId) {
    res.status(200).json({ received: true });
    return;
  }

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'Missing Mercado Pago credentials' });
    return;
  }

  const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!paymentResponse.ok) {
    res.status(502).json({ error: 'Failed to fetch payment' });
    return;
  }

  const payment = await paymentResponse.json();
  const orderId = payment.external_reference;
  const status = String(payment.status || 'pending');
  const normalizedStatus =
    status === 'approved'
      ? 'approved'
      : status === 'rejected'
        ? 'rejected'
        : status === 'cancelled'
          ? 'cancelled'
          : 'pending';

  if (!orderId) {
    res.status(200).json({ received: true });
    return;
  }

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return;
    }

    const existingPayment = await tx.payment.findFirst({
      where: { orderId, provider: 'mercadopago' },
    });

    if (existingPayment) {
      await tx.payment.update({
        where: { id: existingPayment.id },
        data: {
          providerRef: String(paymentId),
          status: normalizedStatus,
          amount: order.total,
        },
      });
    } else {
      await tx.payment.create({
        data: {
          orderId,
          provider: 'mercadopago',
          providerRef: String(paymentId),
          status: normalizedStatus,
          amount: order.total,
        },
      });
    }

    if (normalizedStatus === 'approved' && order.status !== 'paid') {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'paid' },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    if (normalizedStatus === 'rejected' || normalizedStatus === 'cancelled') {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
      });
    }
  });

  res.json({ received: true });
});

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const apiKey = req.headers['x-api-key'];
  if (!process.env.ADMIN_API_KEY) {
    res.status(500).json({ error: 'Missing admin API key' });
    return;
  }
  if (apiKey !== process.env.ADMIN_API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

app.get('/api/admin/orders', requireAdmin, async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } }, payments: true },
  });
  res.json(orders);
});

app.patch('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  const allowed = ['pending', 'paid', 'shipped', 'cancelled'];

  if (!allowed.includes(String(status))) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
  });

  res.json(order);
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
