import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

// Formulario de contacto de conradojulio.com
// 1. Valida los datos y descarta bots (campo trampa + límite por IP)
// 2. Guarda el mensaje en public.contact_messages (solo con service role)
// 3. Envía un correo con Resend si RESEND_API_KEY está configurada
//
// Desplegada en el proyecto Supabase "portafolio" con verify_jwt = false
// (es un formulario público; la protección la hacen la validación y el límite por IP).

const ALLOWED_ORIGINS = [
  "https://conradojulio.com",
  "https://www.conradojulio.com",
  "https://conradojulioporfolio.netlify.app",
  "https://main--conradojulioporfolio.netlify.app",
  "http://localhost:4321",
]

const TO_EMAIL = Deno.env.get("CONTACT_TO_EMAIL") ?? "conradojuliosisnero@gmail.com"
const FROM_EMAIL = Deno.env.get("CONTACT_FROM_EMAIL") ?? "Portafolio <onboarding@resend.dev>"
const MAX_PER_WINDOW = 3
const WINDOW_MINUTES = 10

function cors(origin: string | null) {
  const allowed = origin && (ALLOWED_ORIGINS.includes(origin) || /^https:\/\/[a-z0-9]+--conradojulioporfolio\.netlify\.app$/.test(origin))
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Vary": "Origin",
  }
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors(origin) },
  })
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!))
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin")
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) })
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405, origin)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: "No pude leer el formulario. Inténtalo de nuevo." }, 400, origin)
  }

  // Campo trampa: las personas no lo ven, los bots lo llenan
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true }, 200, origin)
  }

  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim()
  const subject = String(body.subject ?? "").trim()
  const message = String(body.message ?? "").trim()

  const errors: Record<string, string> = {}
  if (name.length < 2 || name.length > 100) errors.name = "Escribe tu nombre (2 a 100 caracteres)."
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) errors.email = "Escribe un correo válido para poder responderte."
  if (subject.length > 150) errors.subject = "El asunto puede tener hasta 150 caracteres."
  if (message.length < 10 || message.length > 5000) errors.message = "Cuéntame un poco más (10 a 5000 caracteres)."
  if (Object.keys(errors).length) return json({ error: "Revisa los campos marcados.", fields: errors }, 422, origin)

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  })

  // Límite por IP (se guarda solo un hash, nunca la IP)
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "desconocida"
  const ipHash = await sha256(ip + "|" + Deno.env.get("SUPABASE_URL"))
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString()
  const { count } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since)
  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return json({ error: `Ya enviaste varios mensajes. Espera ${WINDOW_MINUTES} minutos e inténtalo de nuevo.` }, 429, origin)
  }

  const { data: row, error: insertError } = await supabase
    .from("contact_messages")
    .insert({ name, email, subject: subject || null, message, ip_hash: ipHash })
    .select("id, created_at")
    .single()
  if (insertError || !row) {
    console.error("insert", insertError)
    return json({ error: "No pude guardar tu mensaje. Inténtalo en unos minutos." }, 500, origin)
  }

  const resendKey = Deno.env.get("RESEND_API_KEY")
  if (resendKey) {
    const html = `
      <div style="font-family:system-ui,sans-serif;color:#232046;max-width:560px">
        <h2 style="margin:0 0 16px">Nuevo mensaje desde tu portafolio</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
        ${subject ? `<p><strong>Asunto:</strong> ${escapeHtml(subject)}</p>` : ""}
        <p style="white-space:pre-wrap;background:#f7f5fb;padding:16px;border-radius:12px">${escapeHtml(message)}</p>
        <p style="color:#57537a;font-size:13px">Responde a este correo para contestarle directamente.</p>
      </div>`
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [TO_EMAIL],
          reply_to: email,
          subject: `Contacto: ${subject || name}`.slice(0, 150),
          html,
        }),
      })
      if (res.ok) {
        await supabase.from("contact_messages").update({ email_sent: true }).eq("id", row.id)
      } else {
        console.error("resend", res.status, await res.text())
      }
    } catch (e) {
      console.error("resend", e)
    }
  } else {
    console.warn("RESEND_API_KEY no está configurada: el mensaje se guardó pero no se envió correo")
  }

  return json({ ok: true }, 200, origin)
})
