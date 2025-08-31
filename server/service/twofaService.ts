import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function generate2FASecret(userEmail: string) {
  const secret = speakeasy.generateSecret({
    name: `AnonFeedback (${userEmail})`,
  });

  const qr = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    secret: secret.base32,
    qr, // QR בקידוד base64 (data:image/png;base64,...)
  };
}

export function verify2FA(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
}