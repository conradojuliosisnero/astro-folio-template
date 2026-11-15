import { createMemo, createSignal, For, Show } from "solid-js"
import Fuse from "fuse.js"

type Item = {
  collection: "blog" | "projects"
  slug: string
  title: string
  summary: string
  tags: string[]
  date: string
}

type Props = {
  data: Item[]
}

const label = { blog: "Artículo", projects: "Proyecto" } as const

function formatDate(iso: string) {
  return Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso))
}

export default function Search({ data }: Props) {
  const [query, setQuery] = createSignal("")

  const fuse = new Fuse(data, {
    keys: ["slug", "title", "summary", "tags"],
    minMatchCharLength: 2,
    threshold: 0.4,
  })

  const results = createMemo(() => (query().length < 2 ? [] : fuse.search(query()).map((r) => r.item)))

  return (
    <div class="search">
      <label class="search-label" for="search-input">
        ¿Qué estás buscando?
      </label>
      <div class="search-field">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="search-input"
          name="search"
          type="search"
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          autocomplete="off"
          spellcheck={false}
          placeholder="Docker, React, MoviesCon…"
        />
      </div>

      <p class="search-status" aria-live="polite">
        <Show when={query().length >= 2} fallback="Escribe al menos dos letras.">
          {results().length === 0
            ? `No encontré nada para “${query()}”. Prueba con otra palabra.`
            : `${results().length} resultado${results().length === 1 ? "" : "s"} para “${query()}”`}
        </Show>
      </p>

      <ul class="plist">
        <For each={results()}>
          {(item) => (
            <li class="plist-item search-hit">
              <a class="prow" href={`/${item.collection}/${item.slug}`}>
                <span class="prow-date">{formatDate(item.date)}</span>
                <span class="prow-main">
                  <span class="prow-title">{item.title}</span>
                  <span class="prow-summary">{item.summary}</span>
                </span>
                <span class="prow-tags">
                  <span class="tag">{label[item.collection]}</span>
                </span>
              </a>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
