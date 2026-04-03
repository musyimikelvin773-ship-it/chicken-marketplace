// Simple serverless simulator for M-Pesa STK Push
// POST body: { phone: string, amount: number, item?: string }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, amount, item } = req.body || {};
  if (!phone || !amount) return res.status(400).json({ error: 'Missing phone or amount' });

  // Simulate processing delay
  await new Promise(r => setTimeout(r, 1500));

  // Simulate success with a fake transaction id
  const transactionId = 'MPESA-' + Date.now();
  return res.status(200).json({ ok: true, transactionId, phone, amount, item });
}
