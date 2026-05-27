import { IoList } from "react-icons/io5";
import { Character, CharacterListResponse } from "@/types/character";
import { CharacterCard } from "@/components/characters/CharacterCard";

async function fetchPage(page: number): Promise<Character[]> {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character?page=${page}`,
    { cache: "force-cache" },
  );
  if (!res.ok) throw new Error(`Error ${res.status} al cargar página ${page}`);
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
            <CharacterCard key={c.id} character={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
