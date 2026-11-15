import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { Flip } from "gsap/Flip"
import { setupContactForm } from "./contact"

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, Flip)

/* =====================================================================
   Utilidades
   ===================================================================== */

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector(sel) as T | null
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll(sel)) as T[]

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

const PASTELS = ["#c3cdff", "#c4edd9", "#ffd6c2", "#fff1b8", "#dccbff", "#ffc9da"]

let mm: gsap.MatchMedia | null = null
// Limpiezas que viven fuera de matchMedia (menú, filtros…)
let pageCleanups: Array<() => void> = []

function teardown() {
  mm?.revert()
  mm = null
  pageCleanups.forEach((fn) => fn())
  pageCleanups = []
}

document.addEventListener("astro:before-swap", teardown)

function listen(
  target: Window | Document | HTMLElement,
  type: string,
  fn: (e: any) => void,
  bag: Array<() => void>
) {
  target.addEventListener(type, fn, { passive: type !== "keydown" })
  bag.push(() => target.removeEventListener(type, fn))
}

/** Envuelve cada letra en un span: la intro anima la letra y el scroll anima el envoltorio */
function wrapChars(chars: Element[]) {
  return chars.map((c) => {
    const w = document.createElement("span")
    w.className = "char-wrap"
    w.style.display = "inline-block"
    c.replaceWith(w)
    w.appendChild(c)
    return w
  })
}

/** Las letras se adelgazan y ensanchan cuando el cursor se acerca */
function breathe(area: HTMLElement, chars: HTMLElement[], bag: Array<() => void>, isBusy = () => false) {
  const setters = chars.map((c) => ({
    wd: gsap.quickTo(c, "--wd", { duration: 0.6, ease: "power3.out" }),
    wg: gsap.quickTo(c, "--wg", { duration: 0.6, ease: "power3.out" }),
  }))
  const radius = 320
  listen(area, "mousemove", (e: MouseEvent) => {
    if (isBusy()) return
    chars.forEach((c, i) => {
      const r = c.getBoundingClientRect()
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
      const t = Math.max(0, 1 - d / radius)
      setters[i].wd(75 + 25 * t)
      setters[i].wg(800 - 600 * t)
    })
  }, bag)
  listen(area, "mouseleave", () => setters.forEach((s) => (s.wd(75), s.wg(800))), bag)
}

/* =====================================================================
   Transición entre páginas: una cortina pastel cubre y descubre la página
   ===================================================================== */

let transitionsReady = false
let curtainCovering = false
let curtainIndex = 0

export function setupPageTransitions() {
  if (transitionsReady) return
  transitionsReady = true

  document.addEventListener("astro:before-preparation", (event: any) => {
    const curtain = $(".curtain")
    if (!curtain || prefersReduced()) return
    const word = $(".curtain-word", curtain)
    const originalLoader = event.loader
    event.loader = async () => {
      gsap.set(curtain, { backgroundColor: PASTELS[curtainIndex++ % PASTELS.length] })
      const cover = gsap
        .timeline()
        .fromTo(curtain, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "expo.inOut" })
        .fromTo(word, { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.35, ease: "expo.out" }, "-=0.25")
      await Promise.all([cover.then(), originalLoader()])
      curtainCovering = true
    }
  })
}

function revealCurtain() {
  const curtain = $(".curtain")
  if (!curtain || !curtainCovering) return 0
  curtainCovering = false
  const word = $(".curtain-word", curtain)
  gsap
    .timeline()
    .to(word, { opacity: 0, yPercent: -60, duration: 0.3, ease: "power2.in" })
    .to(curtain, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" }, "-=0.05")
  return 0.45
}

/* =====================================================================
   Menú móvil (funciona también con movimiento reducido)
   ===================================================================== */

function setupMobileMenu(motion: boolean) {
  const btn = $<HTMLButtonElement>(".hnav-menu")
  const menu = $(".mmenu")
  if (!btn || !menu) return
  const links = $$(".mmenu-list a", menu)
  let open = false

  const setOpen = (value: boolean) => {
    open = value
    btn.setAttribute("aria-expanded", String(value))
    btn.textContent = value ? "Cerrar" : "Menú"
    document.documentElement.style.overflow = value ? "hidden" : ""
    if (value) {
      menu.hidden = false
      if (motion) {
        gsap.fromTo(menu, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: 0.8, ease: "expo.inOut" })
        gsap.fromTo(links, { yPercent: 110, rotate: 6, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.06, duration: 0.8, ease: "expo.out", delay: 0.2 })
      }
      links[0]?.focus()
    } else if (motion) {
      gsap.to(menu, { clipPath: "circle(0% at 92% 4%)", duration: 0.55, ease: "expo.inOut", onComplete: () => { menu.hidden = true } })
    } else {
      menu.hidden = true
    }
  }

  listen(btn, "click", () => setOpen(!open), pageCleanups)
  listen(document, "keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false)
      btn.focus()
    }
  }, pageCleanups)
  pageCleanups.push(() => { document.documentElement.style.overflow = "" })
}

/* =====================================================================
   Filtros con animación Flip (proyectos y blog)
   ===================================================================== */

function setupFilters(motion: boolean) {
  $$("[data-filter-group]").forEach((group) => {
    const name = group.dataset.filterGroup!
    const list = $(`[data-filter-list="${name}"]`)
    const empty = $(`[data-filter-empty="${name}"]`)
    if (!list) return
    const items = Array.from(list.children) as HTMLElement[]
    const buttons = $$<HTMLButtonElement>("[data-filter]", group)

    buttons.forEach((btn) => {
      listen(btn, "click", () => {
        const value = btn.dataset.filter!
        buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)))
        const state = motion ? Flip.getState(items) : null
        let visible = 0
        items.forEach((item) => {
          const tags = (item.dataset.tags ?? "").split("|")
          const show = value === "all" || tags.includes(value)
          item.hidden = !show
          if (show) visible++
        })
        if (empty) empty.hidden = visible > 0
        if (state) {
          Flip.from(state, {
            duration: 0.7,
            ease: "expo.inOut",
            stagger: 0.015,
            absolute: true,
            onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.6, rotate: -6 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "back.out(1.6)" }),
            onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.6, rotate: 6, duration: 0.4 }),
            onComplete: () => ScrollTrigger.refresh(),
          })
        }
      }, pageCleanups)
    })
  })
}

/* =====================================================================
   Entrada
   ===================================================================== */

export async function initMotion() {
  teardown()

  // Partir el texto con las fuentes ya cargadas, si no las letras se descuadran
  await document.fonts.ready

  const motionAllowed = !prefersReduced()
  setupMobileMenu(motionAllowed)
  setupFilters(motionAllowed)
  setupContactForm(motionAllowed, pageCleanups)
  const delay = revealCurtain()

  mm = gsap.matchMedia()
  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 900px)",
      hover: "(hover: hover) and (pointer: fine)",
    },
    (context) => {
      const { motion, desktop, hover } = context.conditions as Record<string, boolean>
      const projects = $(".projects")

      if (!motion) {
        projects?.classList.add("is-static")
        return
      }

      const bag: Array<() => void> = []

      homeHero(delay, hover, bag)
      pageHero(delay, hover, bag)
      articleExtras(delay)
      sharedReveals()
      homeSections(desktop, projects)
      waves(hover, bag)
      if (hover) pointerEffects(bag)

      return () => bag.forEach((fn) => fn())
    }
  )
}

/* =====================================================================
   HOME: hero con intro y salida al hacer scroll
   ===================================================================== */

function homeHero(delay: number, hover: boolean, bag: Array<() => void>) {
  const hero = $(".hero")
  if (!hero) return
  const lines = $$("[data-split]", hero)
  const [first, second] = lines.map((el) => SplitText.create(el, { type: "chars", charsClass: "char" }))
  const hello = $("[data-scramble]", hero)!
  const heroInner = $(".hero-inner", hero)!
  const heroChars = [...first.chars, ...second.chars] as HTMLElement[]
  const charWraps = wrapChars(heroChars)

  const intro = gsap.timeline({ defaults: { ease: "expo.out" }, delay })
  intro
    .from(heroInner, { clipPath: "inset(48% 48% 48% 48% round 40px)", duration: 1.3, ease: "expo.inOut" })
    .from(first.chars, { yPercent: 120, rotate: 14, duration: 1.4, stagger: 0.05 }, "-=0.45")
    .from(second.chars, { yPercent: -120, rotate: -14, duration: 1.4, stagger: { each: 0.05, from: "end" } }, "<0.1")
    .fromTo(heroChars, { "--wg": 200, "--wd": 100 }, { "--wg": 800, "--wd": 75, duration: 1.2, stagger: 0.035, ease: "power3.inOut" }, "<0.3")
    .from(hello, { scrambleText: { text: " ", chars: "01<>/{}", speed: 0.4 }, duration: 1 }, "<")
    .from([".hero-role", ".hero-scroll"], { y: 40, opacity: 0, duration: 1, stagger: 0.12 }, "-=0.9")

  if (hover) breathe(hero, heroChars, bag, () => intro.isActive())

  // La salida solo toca .hero y los envoltorios (la intro anima .hero-inner y las
  // letras), con estados iniciales explícitos: al volver arriba todo queda igual.
  const scatter = charWraps.map(() => ({
    y: gsap.utils.random(-140, 140),
    x: gsap.utils.random(-60, 60),
    r: gsap.utils.random(-50, 50),
  }))
  gsap
    .timeline({
      defaults: { immediateRender: false },
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "+=100%",
        scrub: 0.8,
        pin: true,
        onUpdate: (self) => {
          if (self.progress > 0 && intro.isActive()) intro.progress(1)
        },
      },
    })
    .fromTo(hero, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(10% 6% 22% 6% round 48px)", ease: "none" }, 0)
    .fromTo(
      charWraps,
      { yPercent: 0, xPercent: 0, rotate: 0, opacity: 1 },
      {
        yPercent: (i) => scatter[i].y,
        xPercent: (i) => scatter[i].x,
        rotate: (i) => scatter[i].r,
        opacity: 0,
        ease: "power2.in",
        stagger: { each: 0.02, from: "random" },
      },
      0
    )
    .fromTo([".hero-hello", ".hero-foot"], { opacity: 1, y: 0 }, { opacity: 0, y: -60, ease: "power1.in" }, 0)
}

/* =====================================================================
   PÁGINAS: hero con título cinético
   ===================================================================== */

function pageHero(delay: number, hover: boolean, bag: Array<() => void>) {
  const title = $("[data-hero-title]")
  if (!title || $(".hero")) return
  const section = title.closest("section") as HTMLElement
  const isArticle = title.classList.contains("ahero-title")
  const intros = $$("[data-hero-intro]")
  const chips = $$(".phero .chip")

  if (isArticle) {
    // Títulos largos: palabra por palabra
    const split = SplitText.create(title, { type: "words", wordsClass: "word" })
    gsap
      .timeline({ delay, defaults: { ease: "expo.out" } })
      .from(".back-link", { x: -40, opacity: 0, duration: 0.8 })
      .from(split.words, { yPercent: 110, rotate: 8, opacity: 0, duration: 1.1, stagger: 0.06 }, "-=0.5")
      .from(intros, { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.8")
    return
  }

  const split = SplitText.create(title, { type: "chars", charsClass: "char" })
  const chars = split.chars as HTMLElement[]
  const wraps = wrapChars(chars)

  const intro = gsap
    .timeline({ delay, defaults: { ease: "expo.out" } })
    .from(section, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" })
    .from(chars, { yPercent: 120, rotate: 10, duration: 1.3, stagger: 0.05 }, "-=0.4")
    .fromTo(chars, { "--wg": 200, "--wd": 100 }, { "--wg": 800, "--wd": 75, duration: 1.1, stagger: 0.04, ease: "power3.inOut" }, "<0.25")
    .from(intros, { y: 30, opacity: 0, duration: 0.9 }, "-=0.9")
    .from(chips, { y: 24, opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.03, ease: "back.out(2)" }, "-=0.7")

  if (hover) breathe(section, chars, bag, () => intro.isActive())

  // Al bajar, las letras se separan un poco y se inclinan
  gsap.timeline({
    defaults: { immediateRender: false, ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        if (self.progress > 0 && intro.isActive()) intro.progress(1)
      },
    },
  }).fromTo(
    wraps,
    { yPercent: 0, rotate: 0 },
    { yPercent: (i) => (i % 2 ? -40 : 40), rotate: (i) => (i % 2 ? -8 : 8) }
  )
}

/* =====================================================================
   ARTÍCULOS: barra de lectura y subtítulos
   ===================================================================== */

function articleExtras(delay: number) {
  const bar = $(".reading-progress span")
  const article = $("[data-article]")
  if (bar && article) {
    gsap.fromTo(bar, { scaleX: 0 }, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: article, start: "top 60%", end: "bottom bottom", scrub: true },
    })
  }
  if (article) {
    $$("h2, h3", article).forEach((h) =>
      gsap.from(h, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: { trigger: h, start: "top 88%" },
      })
    )
  }
  // Página de una frase: palabra por palabra
  const quote = $(".abody--quote article")
  if (quote) {
    const split = SplitText.create(quote, { type: "words" })
    gsap.from(split.words, { yPercent: 60, opacity: 0, rotate: 4, duration: 0.9, stagger: 0.05, ease: "expo.out", delay: delay + 0.6 })
  }
}

/* =====================================================================
   Revelado de listas, tarjetas y textos (todo el sitio)
   ===================================================================== */

function sharedReveals() {
  // Texto que se enciende palabra por palabra
  $$("[data-words]").forEach((el) => {
    const split = SplitText.create(el, { type: "words" })
    gsap.fromTo(split.words, { opacity: 0.12, y: 12 }, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
    })
  })

  // Tarjetas y filas que caen en su sitio por lotes
  const batchTargets = $$(".pgrid-item, .plist-item:not(.search-hit), .quotes-item, .anext-card")
  if (batchTargets.length) {
    gsap.set(batchTargets, { y: 70, rotate: 2.5, opacity: 0 })
    ScrollTrigger.batch(batchTargets, {
      start: "top 92%",
      once: true,
      onEnter: (els) =>
        gsap.to(els, { y: 0, rotate: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: "expo.out", overwrite: true }),
    })
  }

  // Línea de tiempo de Trabajo
  const line = $(".wtimeline-line span")
  if (line) {
    gsap.fromTo(line, { scaleY: 0 }, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: ".wtimeline-list", start: "top 70%", end: "bottom 70%", scrub: true },
    })
  }
  $$(".wjob").forEach((job) => {
    const role = $("[data-role]", job)
    const roleText = role?.textContent ?? ""
    const tl = gsap.timeline({ scrollTrigger: { trigger: job, start: "top 82%", toggleActions: "play none none reverse" } })
    tl.from($(".wjob-dot", job), { scale: 0, duration: 0.6, ease: "back.out(3)" })
      .from($(".wjob-card", job), { x: 120, rotate: 4, opacity: 0, duration: 1, ease: "expo.out" }, 0.05)
      .from($(".wjob-company", job), { yPercent: 60, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.2)
      .from($(".wjob-dates", job), { x: -30, opacity: 0, duration: 0.6, ease: "expo.out" }, 0.1)
    if (role) tl.to(role, { scrambleText: { text: roleText, chars: "lowerCase", speed: 0.5 }, duration: 0.9 }, 0.3)
  })

  // Títulos grandes de sección y del pie
  $$(".section-title[data-split], [data-split-scroll]").forEach((el) => {
    const split = SplitText.create(el, { type: "chars", charsClass: "char" })
    gsap.from(split.chars, {
      yPercent: 115,
      rotateX: -90,
      transformOrigin: "50% 100%",
      stagger: 0.04,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
    })
  })
}

/* =====================================================================
   HOME: marquesina, experiencia y scroll horizontal de proyectos
   ===================================================================== */

function homeSections(desktop: boolean, projects: HTMLElement | null) {
  const track = $(".stack-track")
  if (track) {
    const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 })
    const skew = gsap.quickTo(".stack-list", "skewX", { duration: 0.4, ease: "power3.out" })
    let dir = 1
    ScrollTrigger.create({
      trigger: ".stack",
      start: "top bottom",
      end: "bottom top",
      onUpdate(self) {
        const v = self.getVelocity()
        dir = self.direction
        gsap.to(loop, {
          timeScale: dir * gsap.utils.clamp(1, 8, 1 + Math.abs(v) / 250),
          duration: 0.2,
          overwrite: true,
          onComplete: () => {
            gsap.to(loop, { timeScale: dir, duration: 1.2, ease: "power2.out" })
          },
        })
        skew(gsap.utils.clamp(-18, 18, v / -120))
      },
      onLeave: () => skew(0),
      onLeaveBack: () => skew(0),
    })
  }

  const progress = $(".work-progress span")
  if (progress) {
    gsap.fromTo(progress, { scaleX: 0 }, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: ".work-list", start: "top 75%", end: "bottom 60%", scrub: true },
    })
  }
  $$(".job").forEach((job) => {
    const role = $("[data-role]", job)!
    const roleText = role.textContent ?? ""
    gsap
      .timeline({ scrollTrigger: { trigger: job, start: "top 88%", toggleActions: "play none none reverse" } })
      .from($(".job-company", job), { yPercent: 110, skewY: 8, opacity: 0, duration: 0.9, ease: "expo.out" }, 0)
      .from($(".job-dates", job), { opacity: 0, x: -30, duration: 0.6, ease: "expo.out" }, 0.1)
      .to(role, { scrambleText: { text: roleText, chars: "lowerCase", speed: 0.5 }, duration: 0.9 }, 0.15)
  })

  const pin = $(".projects-pin")
  const ptrack = $(".projects-track")
  const cards = $$(".projects .pcard")
  if (!projects || !pin || !ptrack) return

  if (desktop) {
    projects.classList.remove("is-static")
    const distance = () => ptrack.scrollWidth - window.innerWidth
    const horizontal = gsap.to(ptrack, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: projects,
        start: "top top",
        end: () => "+=" + distance(),
        scrub: 1,
        pin,
        invalidateOnRefresh: true,
      },
    })
    cards.forEach((card, i) => {
      gsap.fromTo(card, { rotate: i % 2 ? -10 : 10, yPercent: i % 2 ? 14 : -14, scale: 0.85 }, {
        rotate: 0,
        yPercent: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: card, containerAnimation: horizontal, start: "left right", end: "center 60%", scrub: true },
      })
      const glyph = $(".pcard-glyph", card)
      if (glyph) {
        gsap.fromTo(glyph, { "--wg": 200, "--wd": 75, xPercent: 40 }, {
          "--wg": 800,
          "--wd": 100,
          xPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: horizontal, start: "left right", end: "right left", scrub: true },
        })
      }
    })
  } else {
    projects.classList.add("is-static")
    cards.forEach((card) =>
      gsap.from(card, { y: 80, rotate: 4, opacity: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 90%" } })
    )
  }
}

/* =====================================================================
   Títulos que rebotan letra por letra (Hablemos, 404)
   ===================================================================== */

function waves(hover: boolean, bag: Array<() => void>) {
  $$("[data-wave]").forEach((el) => {
    const split = SplitText.create(el, { type: "chars", charsClass: "char" })
    const chars = split.chars as HTMLElement[]
    gsap.from(chars, {
      yPercent: 100,
      scaleY: 2.2,
      "--wd": 100,
      "--wg": 200,
      transformOrigin: "50% 100%",
      stagger: 0.05,
      duration: 1.3,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
    })
    if (!hover) return
    chars.forEach((c) => {
      listen(c, "mouseenter", () => {
        gsap
          .timeline()
          .to(c, { yPercent: -18, "--wg": 200, "--wd": 100, duration: 0.25, ease: "power2.out" })
          .to(c, { yPercent: 0, "--wg": 800, "--wd": 75, duration: 1.1, ease: "elastic.out(1, 0.35)" })
      }, bag)
    })
  })
}

/* =====================================================================
   Mouse: cursor, botones magnéticos e inclinación 3D
   ===================================================================== */

function pointerEffects(bag: Array<() => void>) {
  $$("[data-magnetic]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" })
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" })
    listen(el, "mousemove", (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * 0.4)
      y((e.clientY - (r.top + r.height / 2)) * 0.4)
    }, bag)
    listen(el, "mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" }), bag)
  })

  // Inclinación de tarjetas (home, proyectos, frases)
  $$(".projects .pcard, [data-tilt]").forEach((card) => {
    gsap.set(card, { transformPerspective: 900 })
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" })
    const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" })
    const glyph = $(".pcard-glyph", card)
    listen(card, "mousemove", (e: MouseEvent) => {
      const r = card.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 16)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 16)
    }, bag)
    listen(card, "mouseenter", () => {
      if (glyph) gsap.to(glyph, { "--wg": 800, "--wd": 100, scale: 1.08, duration: 0.6, ease: "expo.out" })
    }, bag)
    listen(card, "mouseleave", () => {
      rx(0)
      ry(0)
      if (glyph) gsap.to(glyph, { "--wg": 200, "--wd": 75, scale: 1, duration: 0.8, ease: "expo.out" })
    }, bag)
  })

  const cursor = $(".cursor")
  const label = $(".cursor-label")
  if (!cursor || !label) return
  const cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" })
  const cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" })
  gsap.set(cursor, { scale: 1, mixBlendMode: "difference", backgroundColor: "#ffffff" })
  label.style.opacity = "0"
  listen(window, "mousemove", (e: MouseEvent) => {
    gsap.to(cursor, { opacity: 1, duration: 0.3, overwrite: "auto" })
    cx(e.clientX)
    cy(e.clientY)
  }, bag)
  $$("a, button").forEach((el) => {
    const text = el.getAttribute("data-cursor")
    listen(el, "mouseenter", () => {
      if (text) {
        label.textContent = text
        gsap.set(cursor, { mixBlendMode: "normal", backgroundColor: "#232046" })
        gsap.to(cursor, { scale: 6.5, duration: 0.4, ease: "power3.out" })
        gsap.to(label, { opacity: 1, duration: 0.2 })
      } else {
        gsap.to(cursor, { scale: 3, duration: 0.4, ease: "power3.out" })
      }
    }, bag)
    listen(el, "mouseleave", () => {
      gsap.set(cursor, { mixBlendMode: "difference", backgroundColor: "#ffffff" })
      gsap.to(cursor, { scale: 1, duration: 0.4, ease: "power3.out" })
      gsap.to(label, { opacity: 0, duration: 0.15 })
    }, bag)
  })
}
