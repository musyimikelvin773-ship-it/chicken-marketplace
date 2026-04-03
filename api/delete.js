// Serverless function to delete a Vercel Blob by id or url
// Accepts POST { id?: string, url?: string }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN is not configured in environment' });
  }

  const { id, url } = req.body || {};
  let blobId = id;

  if (!blobId && url) {
    // Try to parse id from URL if Vercel returned a URL with an ID at the end
    // Example formats vary; this is a best-effort extraction of the last path segment
    try {
      const parts = new URL(url).pathname.split('/').filter(Boolean);
      blobId = parts[parts.length - 1];
    } catch (e) {
      // ignore
    }
  }

  if (!blobId) {
    return res.status(400).json({ error: 'Missing blob id or url' });
  }

  try {
    const r = await fetch(`https://api.vercel.com/v1/blob/${encodeURIComponent(blobId)}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const json = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status || 502).json({ error: 'Failed to delete blob', detail: json });

    return res.status(200).json({ ok: true, detail: json });
  } catch (err) {
    console.error('Error deleting blob', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
