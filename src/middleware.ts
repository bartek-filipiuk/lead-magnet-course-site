import { defineMiddleware } from "astro:middleware";
import { timingSafeEqual, createHmac } from "node:crypto";

const COOKIE_NAME = "course_session";

function getSecret(): string {
  const secret = process.env.COOKIE_SECRET ?? import.meta.env.COOKIE_SECRET;
  if (!secret) throw new Error("COOKIE_SECRET env var is required");
  return secret;
}

export function signToken(secret: string): string {
  const timestamp = Buffer.from(String(Date.now())).toString("base64url");
  const sig = createHmac("sha256", secret).update(timestamp).digest("base64url");
  return `${timestamp}.${sig}`;
}

function verifyToken(token: string, secret: string): boolean {
  const dot = token.indexOf(".");
  if (dot < 1) return false;

  const timestamp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(timestamp).digest("base64url");

  if (sig.length !== expected.length) return false;

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!timingSafeEqual(sigBuf, expBuf)) return false;

  const ts = Number(Buffer.from(timestamp, "base64url").toString());
  if (Number.isNaN(ts)) return false;

  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  return Date.now() - ts < maxAge;
}

export const onRequest = defineMiddleware(({ cookies, locals }, next) => {
  const token = cookies.get(COOKIE_NAME)?.value;
  locals.authenticated = !!token && verifyToken(token, getSecret());
  return next();
});
