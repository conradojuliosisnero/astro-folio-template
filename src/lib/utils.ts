import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function readingTime(text: string) {
  const textOnly = text.replace(/<[^>]+>/g, "")
  const wordCount = textOnly.split(/\s+/).length
  const minutes = Math.max(1, Math.round(wordCount / 200))
  return `${minutes} min de lectura`
}

/** Texto plano de una frase: sin markdown ni comillas envolventes */
export function phraseText(body: string) {
  return body
    .replace(/[#>*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^["“”«]+|["“”»]+$/g, "")
}
