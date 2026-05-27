# Lab 10 — Next.js Routing (Pokédex + Rick & Morty Wiki)

> **Tema:** Enrutamiento y páginas en Next.js (App Router) — Páginas estáticas, dinámicas, SSG, ISR y CSR.
> **Alumno:** David Carhuaz · 5° C — Sección C-D
> **Docente:** Ricardo Coello Palomino

---

## 🚀 Cómo correr localmente

### Requisitos previos
- **Node.js 18+** (recomendado 20+)
- **npm** (viene con Node.js)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Danoviel/Lab10Morty.git
   cd Lab10Morty/practica
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Modo desarrollo** (recarga en caliente, sin caché real de fetch)
   ```bash
   npm run dev
   ```
   Abre: [http://localhost:3000](http://localhost:3000)

4. **Build de producción** (donde se ven SSG e ISR funcionando)
   ```bash
   npm run build
   ```

5. **Servir el build** (servidor de producción local)
   ```bash
   npm start
   ```
   Abre: [http://localhost:3000](http://localhost:3000)

---

## 🎯 Qué hace el proyecto

App Next.js con dos secciones:

- **`/pokemon`** → Pokédex guiada. 151 pokémon (PokeAPI).
- **`/characters`** → Wiki Rick & Morty. 826 personajes, búsqueda CSR y detalles dinámicos.

---

## 🛠 Stack

- **Next.js 16.2.6** + App Router + Turbopack
- **React 19.2** + TypeScript 5
- **Tailwind CSS 4**
- **react-icons 5.x**

---

## 📁 Estructura clave

```
src/app/
├── page.tsx                    ← Home
├── pokemon/
│   ├── page.tsx                ← Listado 151 (SSG + ISR 24h)
│   ├── [name]/page.tsx         ← Detalle SSG 151 paths + ISR
│   ├── error.tsx               ← Error boundary
│   └── not-found.tsx           ← 404 custom
└── characters/
    ├── page.tsx                ← Listado SSG (force-cache)
    ├── [id]/page.tsx           ← Detalle SSG 20 paths + ISR 10d
    ├── search/page.tsx         ← Búsqueda CSR
    ├── error.tsx
    └── not-found.tsx
```

---

## 🧠 Estrategias de renderizado

| Ruta | Estrategia | Justificación |
|---|---|---|
| `/pokemon` | SSG + ISR (24h) | Dataset cerrado. Carga instantánea + revalidación ocasional. |
| `/pokemon/[name]` | SSG (151 paths) + ISR (24h) | Conjunto finito conocido al build-time. |
| `/characters` | SSG con `force-cache` | Consigna pide SSG. 826 personajes se prerenderizan una vez. |
| `/characters/[id]` | SSG parcial (20) + ISR (10d) | Rate-limit de API. Build rápido + on-demand para el resto. |
| `/characters/search` | CSR | Inputs del usuario en tiempo real. Infinitas combinaciones. |

---

## 🧪 Verificaciones

- ✅ `npx tsc --noEmit` → sin errores de TypeScript.
- ✅ `npm run build` → 178 páginas prerenderizadas.
- ✅ `npm start` → todas las rutas responden 200.
- ✅ 404 custom funcionan en `/pokemon/noexiste` y `/characters/9999`.

---

## 🔗 Repositorio

https://github.com/Danoviel/Lab10Morty
