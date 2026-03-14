import type { APIRoute } from "astro";
import { timingSafeEqual } from "node:crypto";
import { signToken } from "../../middleware";

export const prerender = false;

const rateLimit = new Map<string, { count: number; reset: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.reset) {
    rateLimit.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Zbyt wiele prób. Spróbuj za minutę." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Nieprawidłowe żądanie." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const password = body.password ?? "";
  const expected =
    process.env.COURSE_PASSWORD ?? import.meta.env.COURSE_PASSWORD ?? "";

  if (!expected) {
    return new Response(
      JSON.stringify({ error: "Serwer nie skonfigurowany." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!safeCompare(password, expected)) {
    return new Response(
      JSON.stringify({ error: "Nieprawidłowe hasło." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const secret =
    process.env.COOKIE_SECRET ?? import.meta.env.COOKIE_SECRET ?? "";
  const token = signToken(secret);

  cookies.set("course_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
