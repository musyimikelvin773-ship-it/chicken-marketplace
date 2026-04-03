// Serverless function to request an upload URL from Vercel Blob
// Expects a POST with JSON body: { name: string, size?: number, contentType?: string }
// Returns the JSON response from the Vercel Blob create API which includes
// the upload URL the client can PUT the file to.

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN is not configured in environment' });
  }

  const { name, size, contentType } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'Missing required field: name' });
  }

  try {
    const payload = { name };
    if (typeof size === 'number') payload.size = size;
    if (contentType) payload.contentType = contentType;

    const r = await fetch('https://api.vercel.com/v1/blob', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const json = await r.json();
    if (!r.ok) {
      return res.status(r.status || 502).json({ error: 'Vercel Blob create failed', detail: json });
    }

    // Return the blob create response to the client (contains uploadURL and id/url)
    return res.status(200).json(json);
  } catch (err) {
    console.error('Error requesting Vercel Blob upload URL', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
