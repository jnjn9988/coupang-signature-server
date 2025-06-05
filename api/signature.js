import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { method, path, accessKey, secretKey } = req.body;

  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const timestamp = now.getUTCFullYear().toString()
    + pad(now.getUTCMonth() + 1)
    + pad(now.getUTCDate())
    + 'T'
    + pad(now.getUTCHours())
    + pad(now.getUTCMinutes())
    + pad(now.getUTCSeconds())
    + 'Z';

  const cleanPath = path.split('?')[0];
  const message = timestamp + method.toUpperCase() + cleanPath;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('base64');

  const authorization = `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${timestamp}, signature=${signature}`;

  res.status(200).json({ timestamp, signature, authorization });
}
