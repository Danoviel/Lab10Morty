import { IoList } from "react-icons/io5";
import { Character, CharacterListResponse } from "@/types/character";
import { CharacterCard } from "@/components/characters/CharacterCard";

// SSG: Cargamos las primeras 3 páginas (60 personajes) para prerenderizado rápido.
// La API de Rick and Morty tiene rate-limit (HTTP 429) y Vercel Hobby tiene
// timeout de 60s por página durante el build. Con 42 páginas no es posible
// descargar todos los 826 personajes en ese tiempo.
// Los personajes restantes están disponibles en /characters/search (CSR).
async function getCharacters(): Promise<Character[]> {
  const pagesToFetch = 3;
  const collected: Character[] = [];

  for (let page = 1; page <= pagesToFetch; page++) {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character?page=${page}`,
      { cache: "force-cache" },
    );
    if (!res.ok) throw new Error(`Error ${res.status} al cargar página ${page}`);
    const data: CharacterListResponse = await res.json();
    collected.push(...data.results);
  }

  return collected;
}

export default async function CharactersListPage() {
  const characters = await getCharacters();

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 inline-flex items-center gap-3">
          <IoList size={36} className="text-emerald-400" />
          Personajes (SSG)
        </h1>
        <p className="text-emerald-300/70 mb-8">
          Mostrando {characters.length} personajes — generados estáticamente al
          build con{" "}
          <code className="bg-black/40 px-1 rounded">cache: &quot;force-cache&quot;</code>.
          Busca todos los personajes en{" "}
          <a
            href="/characters/search"
            className="underline text-emerald-400 hover:text-emerald-300"
          >
            /characters/search
          </a>
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
