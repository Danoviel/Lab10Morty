import { IoList } from "react-icons/io5";
import { readFileSync } from "fs";
import { join } from "path";
import { Character } from "@/types/character";
import { CharacterCard } from "@/components/characters/CharacterCard";

// SSG: Leemos datos desde archivo JSON local.
// Esto evita timeouts en Vercel Hobby (límite de 60s para generar páginas estáticas)
// y evita rate-limit (HTTP 429) de la API de Rick and Morty.
// El archivo se genera localmente con: node scripts/generate-characters-data.js
function getAllCharacters(): Character[] {
  const filePath = join(process.cwd(), "src", "data", "characters.json");
  const jsonData = readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
}

export default async function CharactersListPage() {
  const characters = getAllCharacters();

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 inline-flex items-center gap-3">
          <IoList size={36} className="text-emerald-400" />
          Personajes (SSG)
        </h1>
        <p className="text-emerald-300/70 mb-8">
          Total: {characters.length} personajes — generados estáticamente al
          build desde archivo JSON local.
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
