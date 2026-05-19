import Link from "next/link";
import { IoSkullOutline } from "react-icons/io5";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-purple-900 text-white p-8">
      <IoSkullOutline size={100} className="text-red-400 mb-6" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Pokémon no encontrado</h2>
      <p className="text-lg text-center max-w-xl mb-8">
        El Pokémon que estás buscando no existe o fue eliminado.
      </p>
      <Link
        href="/pokemon"
        className="bg-white hover:bg-gray-200 text-black font-bold px-6 py-3 rounded-lg transition"
      >
        Volver al Pokédex
      </Link>
    </div>
  );
}
