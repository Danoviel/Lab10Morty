import Link from "next/link";
import { GiPortal } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-linear-to-br from-zinc-900 via-slate-900 to-zinc-900 text-white p-8">
      <div className="max-w-4xl w-full text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Lab 10 — Next.js Routing
        </h1>
        <p className="text-zinc-300 max-w-2xl mx-auto">
          Demo guiada (Pokédex) y tarea evaluada (Rick &amp; Morty Wiki).
          Implementa páginas estáticas (SSG), revalidación incremental (ISR) y
          renderizado en cliente (CSR) con el App Router.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          <Link
            href="/pokemon"
            className="group block rounded-2xl border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/15 transition p-6 sm:p-8 text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <IoGameController
                size={36}
                className="text-purple-300 group-hover:scale-110 transition"
              />
              <h2 className="text-2xl font-semibold">Pokédex</h2>
            </div>
            <p className="text-zinc-300 text-sm mb-3">
              151 pokémon — Ejercicio guiado del laboratorio.
            </p>
            <span className="inline-block text-xs bg-purple-500/20 border border-purple-500/30 text-purple-200 px-2 py-1 rounded">
              SSG + ISR 24h
            </span>
          </Link>

          <Link
            href="/characters"
            className="group block rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 transition p-6 sm:p-8 text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <GiPortal
                size={36}
                className="text-emerald-300 group-hover:scale-110 transition"
              />
              <h2 className="text-2xl font-semibold">Rick &amp; Morty Wiki</h2>
            </div>
            <p className="text-zinc-300 text-sm mb-3">
              826 personajes — Tarea evaluada con SSG, ISR (10 días) y búsqueda
              CSR.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 px-2 py-1 rounded">
                SSG
              </span>
              <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 px-2 py-1 rounded">
                ISR 10d
              </span>
              <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 px-2 py-1 rounded">
                CSR
              </span>
            </div>
          </Link>
        </div>

        <p className="text-xs text-zinc-500 mt-10">
          David Carhuaz — 5° C, Sección C-D — Lab 10
        </p>
      </div>
    </main>
  );
}
