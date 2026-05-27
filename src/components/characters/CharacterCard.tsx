import Link from "next/link";
import Image from "next/image";
import { Character } from "@/types/character";
import { statusColor } from "@/lib/character-helpers";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link
      href={`/characters/${character.id}`}
      className="group bg-slate-900/60 border border-emerald-500/10 rounded-xl overflow-hidden hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/20 transition"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-800">
        <Image
          src={character.image}
          alt={character.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover group-hover:scale-105 transition"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h2 className="font-semibold truncate" title={character.name}>
          {character.name}
        </h2>
        <div className="flex items-center gap-2 mt-1 text-xs text-emerald-200/80">
          <span
            className={`inline-block w-2 h-2 rounded-full ${statusColor[character.status]}`}
          />
          {character.status} — {character.species}
        </div>
      </div>
    </Link>
  );
}
