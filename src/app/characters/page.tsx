import Link from "next/link";
import Image from "next/image";
import { IoList } from "react-icons/io5";
import { Character, CharacterListResponse } from "@/types/character";

async function fetchPage(page: number): Promise<Character[]> {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character?page=${page}`,
    { cache: "force-cache" },
  );
  if (!res.ok) return [];
  const data: CharacterListResponse = await res.json();
  return data.results;
}

// SSG: cache forzado en la petición — el listado completo se prerenderiza al build.
async function getAllCharacters(): Promise<Character[]> {
  // Primero pido la página 1 para saber cuántas hay en total.
  const firstRes = await fetch(
    "https://rickandmortyapi.com/api/character?page=1",
    { cache: "force-cache" },
  );
  if (!firstRes.ok) throw new Error("Error al cargar personajes");
  const firstData: CharacterListResponse = await firstRes.json();

  // Resto en lotes para no saturar la API.
  const totalPages = firstData.info.pages;
  const batchSize = 5;
  const collected: Character[] = [...firstData.results];

  for (let start = 2; start <= totalPages; start += batchSize) {
    const end = Math.min(start + batchSize - 1, totalPages);
    const batch = await Promise.all(
      Array.from({ length: end - start + 1 }, (_, i) => fetchPage(start + i)),
    );
    collected.push(...batch.flat());
  }

  return collected;
}

const statusColor: Record<string, string> = {
  Alive: "bg-emerald-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-500",
};

export default async function CharactersListPage() {
  const characters = await getAllCharacters();

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 inline-flex items-center gap-3">
          <IoList size={36} className="text-emerald-400" />
          Personajes (SSG)
        </h1>
        <p className="text-emerald-300/70 mb-8">
          Total: {characters.length} personajes — generados estáticamente al
          build con <code className="bg-black/40 px-1 rounded">cache: &quot;force-cache&quot;</code>.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {characters.map((c) => (
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
      </div>
    </div>
  );
}
