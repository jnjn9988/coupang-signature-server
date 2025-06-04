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

  const { message, secretKey } = req.body;

  if (!secretKey || !message) {
    return res.status(400).json({ error: 'Missing message or secretKey' });
  }

  try {
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(message)
      .digest('base64');

    return res.status(200).json({ signature });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
