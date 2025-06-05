import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { method, path, accessKey, secretKey, timestamp } = req.body;

  // 🚨 path는 반드시 쿼리스트링 제거해야 함
  const cleanPath = path.split('?')[0];
  const message = timestamp + method.toUpperCase() + cleanPath;

  // ✅ HMAC SHA256 + Base64 인코딩
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('base64');

  const authorization = `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${timestamp}, signature=${signature}`;

  res.status(200).json({ signature, authorization });
}
