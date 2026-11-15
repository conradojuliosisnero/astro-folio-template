import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin)

let mm: gsap.MatchMedia | null = null

function teardown() {
  mm?.revert()
  mm = null
}

document.addEventListener("astro:before-swap", teardown)

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T & Element>(sel) as T | null
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll(sel)) as T[]

export async function initHome() {
  const main = $("main.home")
  if (!main) return
  teardown()

  // Partir el texto con las fuentes ya cargadas, si no las letras se descuadran
  await document.fonts.ready

  mm = gsap.matchMedia()

  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 900px)",
      hover: "(hover: hover) and (pointer: fine)",
    },
    (context) => {
      const { motion, desktop, hover } = context.conditions as {
        motion: boolean
        desktop: boolean
        hover: boolean
      }
      const projects = $(".projects")

      if (!motion) {
        projects?.classList.add("is-static")
        return
      }

      const cleanups: Array<() => void> = []
      const on = <K extends keyof WindowEventMap>(
        target: Window | HTMLElement,
        type: K | string,
        fn: (e: any) => void
      ) => {
        target.addEventListener(type, fn, { passive: true })
        cleanups.push(() => target.removeEventListener(type, fn))
      }

      /* ---------------- HERO: entrada orquestada ---------------- */
      const hero = $(".hero")!
      const lines = $$("[data-split]", hero)
      const heroSplits = lines.map((el) => SplitText.create(el, { type: "chars", charsClass: "char" }))
      const [first, second] = heroSplits
      const hello = $("[data-scramble]", hero)!

      const intro = gsap.timeline({ defaults: { ease: "expo.out" } })
      intro
        .from(hero, { clipPath: "inset(48% 48% 48% 48% round 40px)", duration: 1.3, ease: "expo.inOut" })
        .from(first.chars, { yPercent: 120, rotate: 14, duration: 1.4, stagger: 0.05 }, "-=0.45")
        .from(second.chars, { yPercent: -120, rotate: -14, duration: 1.4, stagger: { each: 0.05, from: "end" } }, "<0.1")
        .fromTo(
          [...first.chars, ...second.chars],
          { "--wg": 200, "--wd": 100 },
          { "--wg": 800, "--wd": 75, duration: 1.2, stagger: 0.035, ease: "power3.inOut" },
          "<0.3"
        )
        .from(hello, { scrambleText: { text: " ", chars: "01<>/{}", speed: 0.4 }, duration: 1 }, "<")
        .from([".hero-role", ".hero-scroll"], { y: 40, opacity: 0, duration: 1, stagger: 0.12 }, "-=0.9")

      // Las letras "respiran" cuando el cursor se acerca
      if (hover) {
        const chars = [...first.chars, ...second.chars] as HTMLElement[]
        const setters = chars.map((c) => ({
          wd: gsap.quickTo(c, "--wd", { duration: 0.6, ease: "power3.out" }),
          wg: gsap.quickTo(c, "--wg", { duration: 0.6, ease: "power3.out" }),
        }))
        const radius = 320
        on(hero, "mousemove", (e: MouseEvent) => {
          if (intro.isActive()) return
          chars.forEach((c, i) => {
            const r = c.getBoundingClientRect()
            const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
            const t = Math.max(0, 1 - d / radius)
            setters[i].wd(75 + 25 * t)
            setters[i].wg(800 - 600 * t)
          })
        })
        on(hero, "mouseleave", () => setters.forEach((s) => (s.wd(75), s.wg(800))))
      }

      // Al bajar, el hero se encoge en una tarjeta y las letras se dispersan
      const exit = gsap.timeline({
        scrollTrigger: { trigger: hero, start: "top top", end: "+=100%", scrub: 0.8, pin: true },
      })
      exit
        .to(hero, { clipPath: "inset(10% 6% 22% 6% round 48px)", ease: "none" }, 0)
        .to(
          [...first.chars, ...second.chars],
          {
            yPercent: () => gsap.utils.random(-140, 140),
            xPercent: () => gsap.utils.random(-60, 60),
            rotate: () => gsap.utils.random(-50, 50),
            opacity: 0,
            ease: "power2.in",
            stagger: { each: 0.02, from: "random" },
          },
          0
        )
        .to([".hero-hello", ".hero-foot"], { opacity: 0, y: -60, ease: "power1.in" }, 0)

      /* ---------------- Texto que se enciende palabra por palabra ---------------- */
      $$("[data-words]").forEach((el) => {
        const split = SplitText.create(el, { type: "words" })
        gsap.fromTo(
          split.words,
          { opacity: 0.12, y: 12 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
          }
        )
      })

      /* ---------------- Stack: marquesina que reacciona a la velocidad ---------------- */
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

      /* ---------------- Títulos de sección ---------------- */
      $$(".section-title[data-split]").forEach((el) => {
        const split = SplitText.create(el, { type: "chars", charsClass: "char" })
        gsap.from(split.chars, {
          yPercent: 115,
          rotateX: -90,
          transformOrigin: "50% 100%",
          stagger: 0.04,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        })
      })

      /* ---------------- Experiencia ---------------- */
      gsap.fromTo(
        ".work-progress span",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".work-list", start: "top 75%", end: "bottom 60%", scrub: true },
        }
      )
      $$(".job").forEach((job) => {
        const company = $(".job-company", job)
        const role = $("[data-role]", job)!
        const roleText = role.textContent ?? ""
        const tl = gsap.timeline({
          scrollTrigger: { trigger: job, start: "top 88%", toggleActions: "play none none reverse" },
        })
        tl.from(company, { yPercent: 110, skewY: 8, opacity: 0, duration: 0.9, ease: "expo.out" }, 0)
          .from($(".job-dates", job), { opacity: 0, x: -30, duration: 0.6, ease: "expo.out" }, 0.1)
          .to(role, { scrambleText: { text: roleText, chars: "lowerCase", speed: 0.5 }, duration: 0.9 }, 0.15)
      })

      /* ---------------- Proyectos: scroll horizontal ---------------- */
      const pin = $(".projects-pin")
      const ptrack = $(".projects-track")
      const cards = $$(".pcard")
      if (projects && pin && ptrack && desktop) {
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
          const glyph = $(".pcard-glyph", card)
          gsap.fromTo(
            card,
            { rotate: i % 2 ? -10 : 10, yPercent: i % 2 ? 14 : -14, scale: 0.85 },
            {
              rotate: 0,
              yPercent: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontal,
                start: "left right",
                end: "center 60%",
                scrub: true,
              },
            }
          )
          if (glyph) {
            gsap.fromTo(
              glyph,
              { "--wg": 200, "--wd": 75, xPercent: 40 },
              {
                "--wg": 800,
                "--wd": 100,
                xPercent: -10,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontal,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            )
          }
        })
      } else {
        projects?.classList.add("is-static")
        cards.forEach((card) =>
          gsap.from(card, {
            y: 80,
            rotate: 4,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 90%" },
          })
        )
      }

      // Inclinación 3D de las tarjetas con el mouse
      if (hover) {
        cards.forEach((card) => {
          gsap.set(card, { transformPerspective: 900 })
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" })
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" })
          on(card, "mousemove", (e: MouseEvent) => {
            const r = card.getBoundingClientRect()
            ry(((e.clientX - r.left) / r.width - 0.5) * 18)
            rx(-((e.clientY - r.top) / r.height - 0.5) * 18)
          })
          on(card, "mouseleave", () => (rx(0), ry(0)))
        })
      }

      /* ---------------- Contacto ---------------- */
      const contactTitle = $(".contact-title [data-split]")
      if (contactTitle) {
        const split = SplitText.create(contactTitle, { type: "chars", charsClass: "char" })
        gsap.from(split.chars, {
          yPercent: 100,
          scaleY: 2.2,
          "--wd": 100,
          "--wg": 200,
          transformOrigin: "50% 100%",
          stagger: 0.05,
          duration: 1.3,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: { trigger: ".contact", start: "top 70%", toggleActions: "play none none reverse" },
        })
        if (hover) {
          ;(split.chars as HTMLElement[]).forEach((c) => {
            on(c, "mouseenter", () => {
              gsap
                .timeline()
                .to(c, { yPercent: -18, "--wg": 200, "--wd": 100, duration: 0.25, ease: "power2.out" })
                .to(c, { yPercent: 0, "--wg": 800, "--wd": 75, duration: 1.1, ease: "elastic.out(1, 0.35)" })
            })
          })
        }
      }

      /* ---------------- Botones magnéticos ---------------- */
      if (hover) {
        $$("[data-magnetic]").forEach((el) => {
          const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" })
          const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" })
          on(el, "mousemove", (e: MouseEvent) => {
            const r = el.getBoundingClientRect()
            x((e.clientX - (r.left + r.width / 2)) * 0.4)
            y((e.clientY - (r.top + r.height / 2)) * 0.4)
          })
          on(el, "mouseleave", () => {
            gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" })
          })
        })

        /* ---------------- Cursor ---------------- */
        const cursor = $(".cursor")
        const label = $(".cursor-label")
        if (cursor && label) {
          const cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" })
          const cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" })
          let shown = false
          on(window, "mousemove", (e: MouseEvent) => {
            if (!shown) {
              gsap.to(cursor, { opacity: 1, duration: 0.3 })
              shown = true
            }
            cx(e.clientX)
            cy(e.clientY)
          })
          $$("a, button").forEach((el) => {
            const text = el.getAttribute("data-cursor")
            on(el, "mouseenter", () => {
              if (text) {
                label.textContent = text
                gsap.set(cursor, { mixBlendMode: "normal", backgroundColor: "#0a1240" })
                gsap.to(cursor, { scale: 6.5, duration: 0.4, ease: "power3.out" })
                gsap.to(label, { opacity: 1, duration: 0.2 })
              } else {
                gsap.to(cursor, { scale: 3, duration: 0.4, ease: "power3.out" })
              }
            })
            on(el, "mouseleave", () => {
              gsap.set(cursor, { mixBlendMode: "difference", backgroundColor: "#ffffff" })
              gsap.to(cursor, { scale: 1, duration: 0.4, ease: "power3.out" })
              gsap.to(label, { opacity: 0, duration: 0.15 })
            })
          })
        }
      }

      return () => cleanups.forEach((fn) => fn())
    }
  )
}
