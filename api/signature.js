import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { method, path, timestamp, accessKey, secretKey } = req.body;

  if (!secretKey || typeof secretKey !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid secretKey' });
  }

  try {
    // ✅ 쿠팡 공식 메시지 포맷
    const message = `${method}\n${path}\n${timestamp}\n${accessKey}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(message)
      .digest('base64');

    return res.status(200).json({ signature });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
