import Link from "next/link";
import { IoSkullOutline } from "react-icons/io5";

export default function CharactersNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-white">
      <IoSkullOutline size={80} className="text-red-400 mb-4" />
      <h1 className="text-5xl font-bold mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-2">Personaje no encontrado</h2>
      <p className="text-emerald-200/70 mb-6 text-center max-w-md">
        Ese personaje no existe en el multiverso de Rick &amp; Morty (o al menos
        no en esta API).
      </p>
      <Link
        href="/characters"
        className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-2 rounded-md"
      >
        Volver al listado
      </Link>
    </div>
  );
}
