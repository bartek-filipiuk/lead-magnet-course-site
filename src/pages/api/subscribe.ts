import type { APIRoute } from "astro";

export const prerender = false;

const rateLimit = new Map<string, { count: number; reset: number }>();
const MAX_ATTEMPTS = 5;
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
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

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Nieprawidłowe żądanie." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const email = body.email?.trim() ?? "";

  if (!email || !EMAIL_RE.test(email)) {
    return new Response(
      JSON.stringify({ error: "Podaj poprawny adres email." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiKey =
    process.env.BREVO_API_KEY ?? import.meta.env.BREVO_API_KEY ?? "";

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Serwer nie skonfigurowany." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        includeListIds: [8],
        templateId: 1,
        redirectionUrl: "https://vibe.devince.dev/thanks",
      }),
    });

    if (res.status === 201 || res.status === 204) {
      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json().catch(() => ({}));

    if (res.status === 400) {
      const msg = (data as Record<string, string>).message ?? "";
      if (msg.includes("already exist")) {
        return new Response(
          JSON.stringify({ ok: true }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Podaj poprawny adres email." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Brevo API error:", res.status, data);
    return new Response(
      JSON.stringify({ error: "Nie udało się zapisać. Spróbuj ponownie." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Brevo API connection error:", err);
    return new Response(
      JSON.stringify({ error: "Błąd połączenia z serwisem. Spróbuj ponownie." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
