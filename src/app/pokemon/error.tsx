"use client";

import Link from "next/link";
import { IoWarningOutline } from "react-icons/io5";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-purple-900 text-white p-8">
      <IoWarningOutline size={100} className="text-yellow-400 mb-6" />
      <h1 className="text-5xl font-bold mb-4">Ocurrió un error</h1>
      <p className="text-xl text-center mb-8">
        Hubo un problema al cargar los pokémons.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg"
        >
          Reintentar
        </button>
        <Link
          href="/pokemon"
          className="bg-white text-black font-bold px-6 py-3 rounded-lg"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}
