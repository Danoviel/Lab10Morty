"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import {
  Character,
  CharacterFilters,
  CharacterListResponse,
} from "@/types/character";

const statusColor: Record<string, string> = {
  Alive: "bg-emerald-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-500",
};

export default function CharacterSearchPage() {
  const [filters, setFilters] = useState<CharacterFilters>({
    name: "",
    status: "",
    type: "",
    gender: "",
  });
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Construye la query string a partir de los filtros activos.
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.name?.trim()) params.set("name", filters.name.trim());
    if (filters.status) params.set("status", filters.status);
    if (filters.type?.trim()) params.set("type", filters.type.trim());
    if (filters.gender) params.set("gender", filters.gender);
    return params.toString();
  }, [filters]);

  // CSR: useEffect con debounce hace fetch al cambiar filtros — no se cachea.
  useEffect(() => {
    if (!queryString) {
      setResults([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/character/?${queryString}`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (res.status === 404) {
          setResults([]);
          setError("No se encontraron personajes con esos filtros.");
        } else if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        } else {
          const data: CharacterListResponse = await res.json();
          setResults(data.results);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [queryString]);

  const updateFilter = <K extends keyof CharacterFilters>(
    key: K,
    value: CharacterFilters[K],
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  const inputCls =
    "w-full bg-slate-900/60 border border-emerald-500/20 focus:border-emerald-400 outline-none rounded-lg px-3 py-2 text-sm";

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 inline-flex items-center gap-3">
          <IoSearch size={32} className="text-emerald-400" />
          Buscar personajes (CSR)
        </h1>
        <p className="text-emerald-300/70 mb-6">
          Búsqueda en tiempo real con <code className="bg-black/40 px-1 rounded">useState</code>{" "}
          + <code className="bg-black/40 px-1 rounded">useEffect</code>. Cada
          cambio dispara un fetch contra la API.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 bg-black/30 p-4 rounded-xl border border-emerald-500/10">
          <label className="text-sm">
            <span className="block mb-1 text-emerald-200/80">Nombre</span>
            <input
              type="text"
              placeholder="Rick, Morty..."
              className={inputCls}
              value={filters.name}
              onChange={(e) => updateFilter("name", e.target.value)}
            />
          </label>

          <label className="text-sm">
            <span className="block mb-1 text-emerald-200/80">Status</span>
            <select
              className={inputCls}
              value={filters.status}
              onChange={(e) =>
                updateFilter(
                  "status",
                  e.target.value as CharacterFilters["status"],
                )
              }
            >
              <option value="">Todos</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="block mb-1 text-emerald-200/80">Type</span>
            <input
              type="text"
              placeholder="Parasite, Robot..."
              className={inputCls}
              value={filters.type}
              onChange={(e) => updateFilter("type", e.target.value)}
            />
          </label>

          <label className="text-sm">
            <span className="block mb-1 text-emerald-200/80">Gender</span>
            <select
              className={inputCls}
              value={filters.gender}
              onChange={(e) =>
                updateFilter(
                  "gender",
                  e.target.value as CharacterFilters["gender"],
                )
              }
            >
              <option value="">Todos</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>
        </div>

        {loading && (
          <p className="text-emerald-300 text-sm mb-4">Buscando...</p>
        )}
        {error && (
          <p className="text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </p>
        )}
        {!loading && !error && !queryString && (
          <p className="text-emerald-200/60">
            Escribe en cualquier filtro para empezar a buscar.
          </p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {results.map((c) => (
              <Link
                key={c.id}
                href={`/characters/${c.id}`}
                className="group bg-slate-900/60 border border-emerald-500/10 rounded-xl overflow-hidden hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/20 transition"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-800">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h2 className="font-semibold truncate" title={c.name}>
                    {c.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-emerald-200/80">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${statusColor[c.status] ?? "bg-gray-400"}`}
                    />
                    {c.status} — {c.species}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
