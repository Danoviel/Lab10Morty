# Lab 10 — Desarrollo de Aplicaciones Web Avanzado

**Tema:** Enrutamiento y páginas en Next.js (App Router) — Páginas estáticas, dinámicas, SSG, ISR y CSR.
**Alumno:** David Carhuaz · 5° C — Sección C-D

Proyecto único con dos rutas:

- `/pokemon` → **Ejercicio 1 guiado**: Pokédex con 151 pokémon (PokeAPI).
- `/characters` → **Tarea evaluada**: Wiki de Rick & Morty (rickandmortyapi.com).

## Stack

- Next.js **16.2.6** + App Router + Turbopack
- React 19, TypeScript, Tailwind CSS 4
- `react-icons` 5.x

## Estrategias de renderizado y justificación

| Ruta | Estrategia | Implementación | Por qué |
|---|---|---|---|
| `/pokemon` | **SSG + ISR (24 h)** | `fetch(..., { next: { revalidate: 86400 } })` | La lista de los 151 pokémon originales cambia muy raramente. Prerenderizamos al build y revalidamos cada 24 h por seguridad. Carga instantánea para el usuario, casi sin tráfico hacia PokéAPI. |
| `/pokemon/[name]` | **SSG + ISR (24 h)** | `generateStaticParams` con 151 IDs + `revalidate: 86400` | Conjunto finito y conocido de personajes. Pregenerar los 151 al build da carga inmediata y SEO estático. ISR cubre cambios futuros (por ejemplo si la API corrige tipos/stats). |
| `/characters` (listado) | **SSG forzado** | `fetch(..., { cache: "force-cache" })` | Listado completo de 826 personajes — dataset cerrado, sin paginación visible al usuario, ideal para prerender total al build. `force-cache` es lo que pide explícitamente la consigna. |
| `/characters/[id]` (detalle) | **SSG (parcial) + ISR (10 días)** | `generateStaticParams` (20 IDs) + `revalidate: 60*60*24*10` + `dynamicParams: true` | La API impone rate-limit (HTTP 429) al pedir 826 detalles en paralelo durante el build. Pregeneramos los primeros 20 y los demás se generan on-demand al ser visitados por primera vez (ISR). Una vez generados, se cachean 10 días. Resultado: build rápido + páginas estáticas para el usuario. |
| `/characters/search` | **CSR** | `"use client"` + `useState` + `useEffect` (debounce 350 ms, `AbortController`) | La búsqueda depende de inputs del usuario en tiempo real — no tiene sentido prerenderizar combinaciones de `name`/`status`/`type`/`gender`. CSR + `cache: "no-store"` garantiza resultados frescos. |

### Convenciones de archivo usadas

- `layout.tsx` (raíz, `/pokemon`, `/characters`) — UI común y navegación.
- `error.tsx` (`/pokemon`, `/characters`) — boundary `"use client"` con botón **Reintentar** (`reset()`).
- `not-found.tsx` (`/pokemon`, `/characters`) — disparado por `notFound()` cuando la API devuelve 404.
- `generateMetadata` — títulos y descripciones dinámicas por personaje/pokémon.

## Comandos

```bash
npm run dev      # http://localhost:3000  (Turbopack, sin caché de fetch)
npm run build    # build de producción con prerender
npm start        # sirve el build de producción
```

## Estructura

```
src/
├── app/
│   ├── layout.tsx              # raíz
│   ├── page.tsx                # home con cards
│   ├── pokemon/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # SSG + ISR 24h
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── [name]/page.tsx     # SSG 151 paths + ISR 24h
│   └── characters/
│       ├── layout.tsx
│       ├── page.tsx            # SSG force-cache
│       ├── error.tsx
│       ├── not-found.tsx
│       ├── search/page.tsx     # CSR (useState/useEffect)
│       └── [id]/page.tsx       # SSG 20 paths + ISR 10d + dynamicParams
└── types/
    ├── pokemon.ts
    └── character.ts
```

## Deploy

Desplegado en Vercel: <!-- pegar URL aquí cuando esté listo -->

## Conclusiones

1. _(completar)_
2. _(completar)_
3. _(completar)_
4. _(completar)_
5. _(completar)_
