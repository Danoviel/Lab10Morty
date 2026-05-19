"use client";

import Link from "next/link";
import { IoWarningOutline } from "react-icons/io5";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CharactersError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-white">
      <IoWarningOutline size={80} className="text-yellow-400 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Algo salió mal</h1>
      <p className="text-emerald-200/70 mb-2 text-center max-w-md">
        Hubo un problema al cargar los personajes.
      </p>
      {error?.message && (
        <p className="text-xs text-white/50 mb-6">{error.message}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-2 rounded-md"
        >
          Reintentar
        </button>
        <Link
          href="/characters"
          className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-md"
        >
          Volver al listado
        </Link>
      </div>
    </div>
  );
}
