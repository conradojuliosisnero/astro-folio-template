// Plantilla del correo que llega cuando alguien escribe desde el formulario.
// Usa tablas y estilos en línea porque Gmail, Outlook y Apple Mail ignoran
// casi todo el CSS moderno. Colores tomados del sitio.

const C = {
  peri: "#c3cdff",
  lilac: "#dccbff",
  mint: "#c4edd9",
  peach: "#ffd6c2",
  blush: "#ffc9da",
  paper: "#f7f5fb",
  navy: "#232046",
  muted: "#57537a",
}

// Bricolage Grotesque donde el cliente la cargue (Apple Mail, iOS);
// en Gmail cae a una sans condensada del sistema.
const DISPLAY = "'Bricolage Grotesque', 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif"
const BODY = "'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif"

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!))
}

type Data = {
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(d)
}

export function buildEmail({ name, email, subject, message, createdAt }: Data) {
  const firstName = name.split(/\s+/)[0]
  const n = escapeHtml(name)
  const e = escapeHtml(email)
  const s = escapeHtml(subject)
  const m = escapeHtml(message)
  const when = escapeHtml(formatDate(createdAt))
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Re: " + (subject || "Tu mensaje en conradojulio.com"))}`
  const preheader = escapeHtml(message.slice(0, 110))

  const html = `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>Nuevo mensaje de ${n}</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&display=swap" rel="stylesheet">
<style>
  @media (max-width: 600px) {
    .wrap { padding: 12px !important; }
    .pad { padding-left: 24px !important; padding-right: 24px !important; }
    .hero-title { font-size: 44px !important; line-height: 44px !important; }
    .col { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
    .col + .col { padding-top: 12px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.paper};">${preheader}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};">
  <tr>
    <td class="wrap" align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

        <!-- Marca -->
        <tr>
          <td style="padding:0 0 16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:${C.navy};border-radius:999px;padding:10px 18px;font-family:${BODY};font-size:14px;font-weight:700;color:${C.paper};">Julio Conrado</td>
              <td style="padding-left:10px;font-family:${BODY};font-size:14px;color:${C.muted};">Formulario de contacto</td>
            </tr></table>
          </td>
        </tr>

        <!-- Encabezado -->
        <tr>
          <td class="pad" style="background:${C.peri};border:2px solid ${C.navy};border-radius:28px 28px 0 0;padding:40px 40px 32px;">
            <p style="margin:0 0 12px;font-family:${BODY};font-size:16px;font-weight:500;color:${C.navy};">${when}</p>
            <h1 class="hero-title" style="margin:0;font-family:${DISPLAY};font-size:56px;line-height:54px;font-weight:800;font-stretch:75%;letter-spacing:-1px;color:${C.navy};">Nuevo mensaje de ${escapeHtml(firstName)}</h1>
            ${s ? `<p style="margin:16px 0 0;font-family:${BODY};font-size:20px;line-height:28px;font-weight:600;color:${C.navy};">${s}</p>` : ""}
          </td>
        </tr>

        <!-- Datos de contacto -->
        <tr>
          <td class="pad" style="background:#ffffff;border-left:2px solid ${C.navy};border-right:2px solid ${C.navy};padding:28px 40px 8px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td class="col" width="50%" valign="top" style="padding-right:8px;">
                <p style="margin:0 0 4px;font-family:${BODY};font-size:13px;color:${C.muted};">Nombre</p>
                <p style="margin:0;font-family:${BODY};font-size:18px;font-weight:700;color:${C.navy};">${n}</p>
              </td>
              <td class="col" width="50%" valign="top" style="padding-left:8px;">
                <p style="margin:0 0 4px;font-family:${BODY};font-size:13px;color:${C.muted};">Correo</p>
                <p style="margin:0;font-family:${BODY};font-size:18px;font-weight:700;"><a href="mailto:${e}" style="color:${C.navy};text-decoration:underline;text-decoration-color:${C.peri};">${e}</a></p>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Mensaje -->
        <tr>
          <td class="pad" style="background:#ffffff;border-left:2px solid ${C.navy};border-right:2px solid ${C.navy};padding:20px 40px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:${C.mint};border:2px solid ${C.navy};border-radius:20px;padding:24px;">
                <p style="margin:0 0 8px;font-family:${BODY};font-size:13px;color:${C.muted};">Mensaje</p>
                <p style="margin:0;font-family:${BODY};font-size:18px;line-height:28px;color:${C.navy};white-space:pre-wrap;">${m}</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Botón -->
        <tr>
          <td class="pad" style="background:#ffffff;border:2px solid ${C.navy};border-top:0;border-radius:0 0 28px 28px;padding:0 40px 40px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:${C.navy};border-radius:999px;">
                <a href="${replyHref}" style="display:inline-block;padding:16px 28px;font-family:${BODY};font-size:17px;font-weight:700;color:${C.paper};text-decoration:none;">Responder a ${escapeHtml(firstName)}</a>
              </td>
            </tr></table>
            <p style="margin:14px 0 0;font-family:${BODY};font-size:14px;color:${C.muted};">También puedes darle a «Responder» en tu correo: la respuesta le llega directo a ${e}.</p>
          </td>
        </tr>

        <!-- Pie -->
        <tr>
          <td style="padding:24px 8px 0;font-family:${BODY};font-size:13px;line-height:20px;color:${C.muted};">
            Recibiste este correo porque alguien llenó el formulario de <a href="https://conradojulio.com/#contacto" style="color:${C.navy};">conradojulio.com</a>. El mensaje también quedó guardado en Supabase.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`

  const text = [
    `Nuevo mensaje de ${name}`,
    formatDate(createdAt),
    "",
    `Nombre: ${name}`,
    `Correo: ${email}`,
    subject ? `Asunto: ${subject}` : null,
    "",
    message,
    "",
    "Responde a este correo para contestarle directamente.",
    "— Formulario de conradojulio.com",
  ]
    .filter((l) => l !== null)
    .join("\n")

  return { html, text }
}
