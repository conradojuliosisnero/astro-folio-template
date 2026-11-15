import gsap from "gsap"

type Bag = Array<() => void>

/** Envía el formulario de contacto a la Edge Function de Supabase */
export function setupContactForm(motion: boolean, bag: Bag) {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]")
  if (!form) return

  const submit = form.querySelector<HTMLButtonElement>(".cform-submit")!
  const label = form.querySelector<HTMLElement>("[data-submit-label]")!
  const status = form.querySelector<HTMLElement>("[data-form-status]")!
  const done = form.querySelector<HTMLElement>("[data-form-done]")!
  const again = form.querySelector<HTMLButtonElement>("[data-form-again]")!

  const fieldNames = ["name", "email", "subject", "message"]

  const setFieldError = (name: string, msg: string) => {
    const input = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null
    const out = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`)
    if (!input || !out) return
    out.textContent = msg
    if (msg) input.setAttribute("aria-invalid", "true")
    else input.removeAttribute("aria-invalid")
  }

  // Validación en el navegador, con los mismos mensajes que el servidor
  const validate = () => {
    const data = new FormData(form)
    const v = (k: string) => String(data.get(k) ?? "").trim()
    const errors: Record<string, string> = {}
    if (v("name").length < 2) errors.name = "Escribe tu nombre (2 a 100 caracteres)."
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("email"))) errors.email = "Escribe un correo válido para poder responderte."
    if (v("message").length < 10) errors.message = "Cuéntame un poco más (10 a 5000 caracteres)."
    return errors
  }

  const showErrors = (errors: Record<string, string>) => {
    fieldNames.forEach((n) => setFieldError(n, errors[n] ?? ""))
    const first = fieldNames.find((n) => errors[n])
    if (first) {
      const el = form.elements.namedItem(first) as HTMLElement
      el.focus()
      if (motion) gsap.fromTo(el, { x: -12 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" })
    }
  }

  const setStatus = (msg: string, isError = false) => {
    status.textContent = msg
    status.classList.toggle("is-error", isError)
  }

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setStatus("")
    const errors = validate()
    if (Object.keys(errors).length) {
      showErrors(errors)
      setStatus("Revisa los campos marcados.", true)
      return
    }
    showErrors({})

    submit.disabled = true
    label.textContent = "Enviando…"
    try {
      const payload = Object.fromEntries(new FormData(form).entries())
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (body.fields) showErrors(body.fields)
        setStatus(body.error ?? "No pude enviar tu mensaje. Inténtalo en unos minutos.", true)
        return
      }
      form.reset()
      done.hidden = false
      done.focus()
      if (motion) {
        gsap
          .timeline()
          .fromTo(done, { clipPath: "circle(0% at 15% 90%)" }, { clipPath: "circle(150% at 15% 90%)", duration: 0.9, ease: "expo.inOut" })
          .from(done.children, { y: 40, opacity: 0, stagger: 0.08, duration: 0.7, ease: "expo.out" }, "-=0.4")
      }
    } catch {
      setStatus("No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.", true)
    } finally {
      submit.disabled = false
      label.textContent = "Enviar mensaje"
    }
  }

  const onAgain = () => {
    done.hidden = true
    ;(form.elements.namedItem("name") as HTMLElement).focus()
  }

  form.addEventListener("submit", onSubmit)
  again.addEventListener("click", onAgain)
  bag.push(() => {
    form.removeEventListener("submit", onSubmit)
    again.removeEventListener("click", onAgain)
  })
}
