import { IoList } from "react-icons/io5";
import { Character, CharacterListResponse } from "@/types/character";
import { CharacterCard } from "@/components/characters/CharacterCard";

async function fetchWithRetry(
  url: string,
  retries = 5,
  baseDelay = 2000,
): Promise<Response> {
  let res = await fetch(url, { cache: "force-cache" });
  for (let attempt = 1; attempt <= retries && res.status === 429; attempt++) {
    const wait = baseDelay * attempt;
    console.log(`[Build] 429 en ${url}, reintentando en ${wait}ms (intento ${attempt}/${retries})`);
    await new Promise((r) => setTimeout(r, wait));
    res = await fetch(url, { cache: "force-cache" });
  }
  return res;
}

async function fetchPage(page: number): Promise<Character[]> {
  const res = await fetchWithRetry(
    `https://rickandmortyapi.com/api/character?page=${page}`,
  );
  if (!res.ok) throw new Error(`Error ${res.status} al cargar página ${page}`);
  const data: CharacterListResponse = await res.json();
  return data.results;
}

// SSG: cache forzado en la petición — el listado completo se prerenderiza al build.
// En Vercel usamos secuencial + delay para evitar rate-limit (429) de la API.
async function getAllCharacters(): Promise<Character[]> {
  const firstRes = await fetchWithRetry(
    "https://rickandmortyapi.com/api/character?page=1",
  );
  if (!firstRes.ok) throw new Error("Error al cargar personajes");
  const firstData: CharacterListResponse = await firstRes.json();

  const totalPages = firstData.info.pages;
  const collected: Character[] = [...firstData.results];

  // Secuencial con delay para evitar 429 en Vercel build
  for (let page = 2; page <= totalPages; page++) {
    const pageData = await fetchPage(page);
    collected.push(...pageData);
    if (page < totalPages) {
      await new Promise((r) => setTimeout(r, 1500));
    }
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
