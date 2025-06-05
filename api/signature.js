import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { method, path, accessKey, secretKey, timestamp } = req.body;

  if (!method || !path || !accessKey || !secretKey || !timestamp) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // 쿠팡 요구사항: message = signedDate + method + path (query string 없이)
  const parsedPath = path.split('?')[0];
  const message = timestamp + method.toUpperCase() + parsedPath;

  // signature: Base64 인코딩된 HMAC SHA256
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('base64');

  const authorization = `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${timestamp}, signature=${signature}`;

  res.status(200).json({ signature, authorization });
}
