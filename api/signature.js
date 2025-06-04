import crypto from "crypto";

export default function handler(req, res) {
  const { method, path, timestamp, accessKey, secretKey } = req.query;

  const message = `${timestamp}${method}${path}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");

  res.status(200).json({ signature });
}
