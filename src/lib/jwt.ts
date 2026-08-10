import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "SKOKKA_SUPER_ADMIN_JWT_SECRET_KEY_2026_SECURE_KEY_X987F";

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  permissions: string[];
  iat: number;
  exp: number;
}

/**
 * Sign a payload with HMAC SHA-256 and return a full JWT Token string
 */
export function signJwtToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 86400; // 24 Hours validity

  const fullPayload: JwtPayload = {
    ...payload,
    iat,
    exp,
  };

  const headerObj = { alg: "HS256", typ: "JWT" };

  const encodedHeader = Buffer.from(JSON.stringify(headerObj)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
}

/**
 * Verify a JWT Token string and return the decoded payload if valid and not expired
 */
export function verifyJwtToken(token: string): JwtPayload | null {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    // Verify cryptographic HMAC SHA-256 signature
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(unsignedToken)
      .digest("base64url");

    if (signature !== expectedSignature) {
      console.warn("🔒 Invalid JWT Signature detected.");
      return null;
    }

    // Decode payload
    const payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const payload: JwtPayload = JSON.parse(payloadJson);

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn("🔒 Expired JWT Token.");
      return null;
    }

    return payload;
  } catch (err) {
    console.error("🔒 JWT Verification Error:", err);
    return null;
  }
}
