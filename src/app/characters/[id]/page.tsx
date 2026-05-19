import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Character, CharacterListResponse } from "@/types/character";

const TEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 10;

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

async function fetchWithRetry(
  url: string,
  init: RequestInit & { next?: { revalidate?: number } },
  retries = 4,
): Promise<Response> {
  let res = await fetch(url, init);
  for (let attempt = 1; attempt <= retries && res.status === 429; attempt++) {
    const wait = 400 * 2 ** attempt;
    await new Promise((r) => setTimeout(r, wait));
    res = await fetch(url, init);
  }
  return res;
}

async function getCharacter(id: string): Promise<Character> {
  const res = await fetchWithRetry(
    `https://rickandmortyapi.com/api/character/${id}`,
    { next: { revalidate: TEN_DAYS_IN_SECONDS } }, // ISR: revalida cada 10 días
  );

  // Activa el not-found.tsx más cercano si la API responde 404.
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Error ${res.status} al cargar el personaje`);

  return res.json();
}

// dynamicParams: true (default) — IDs no prerenderizados se generan on-demand al primer visit.
export const dynamicParams = true;

// SSG: precompila las primeras N rutas. Los demás IDs se generan bajo demanda con ISR.
// Decisión pragmática: la API de R&M tiene rate limit (429) si pides 826 detalles en paralelo
// durante el build. Pregeneramos solo los primeros 50; el resto se cachea al ser visitado.
export async function generateStaticParams() {
  const PRERENDER_LIMIT = 50;
  const res = await fetch(
    "https://rickandmortyapi.com/api/character?page=1",
    { cache: "force-cache" },
  );
  if (!res.ok) return [];
  const data: CharacterListResponse = await res.json();

  return data.results
    .slice(0, PRERENDER_LIMIT)
    .map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const character = await getCharacter(id);
    return {
      title: `${character.name} - Rick & Morty Wiki`,
      description: `Información de ${character.name} (${character.species})`,
    };
  } catch {
    return { title: "Personaje no encontrado - Rick & Morty Wiki" };
  }
}

const statusColor: Record<string, string> = {
  Alive: "bg-emerald-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-500",
};

export default async function CharacterDetailPage({
  params,
}: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  const episodeIds = character.episode.map((url) => url.split("/").pop() ?? "");

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/characters"
          className="inline-block mb-6 text-emerald-300 hover:text-emerald-200 transition"
        >
          ← Volver al listado
        </Link>

        <div className="bg-slate-900/70 border border-emerald-500/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="relative aspect-square md:aspect-auto md:h-full bg-slate-800">
              <Image
                src={character.image}
                alt={character.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="md:col-span-2 p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {character.name}
              </h1>
              <div className="flex items-center gap-2 mb-6 text-emerald-200/80">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${statusColor[character.status] ?? "bg-gray-400"}`}
                />
                <span>
                  {character.status} — {character.species}
                </span>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <Field label="ID" value={String(character.id)} />
                <Field label="Género" value={character.gender} />
                <Field
                  label="Tipo"
                  value={character.type || "—"}
                />
                <Field label="Origen" value={character.origin.name} />
                <Field
                  label="Última ubicación"
                  value={character.location.name}
                />
                <Field
                  label="Creado"
                  value={new Date(character.created).toLocaleDateString(
                    "es-PE",
                    { year: "numeric", month: "long", day: "numeric" },
                  )}
                />
                <Field
                  label="Apariciones"
                  value={`${character.episode.length} episodio${character.episode.length === 1 ? "" : "s"}`}
                />
              </dl>

              <div className="mt-6">
                <h3 className="font-semibold text-emerald-200/90 mb-2">
                  Episodios
                </h3>
                <div className="flex flex-wrap gap-2">
                  {episodeIds.map((ep) => (
                    <span
                      key={ep}
                      className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 px-2 py-1 rounded-md text-xs"
                    >
                      Ep #{ep}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-emerald-300/60">
        {label}
      </dt>
      <dd className="text-base">{value}</dd>
    </div>
  );
}
